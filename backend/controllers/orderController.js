const db = require("../config/db");

// =========================
// CREATE ORDER
// =========================

const createOrder = async (req, res) => {
    const connection = await db.getConnection();

    try {
        const userId = req.user.id;

        const {
            delivery_address,
            phone,
            payment_method
        } = req.body;

        if (!delivery_address || !phone || !payment_method) {
            connection.release();

            return res.status(400).json({
                success: false,
                message: "Delivery address, phone and payment method are required"
            });
        }

        if (!["cash_on_delivery", "online"].includes(payment_method)) {
            connection.release();

            return res.status(400).json({
                success: false,
                message: "Invalid payment method"
            });
        }

        await connection.beginTransaction();

        // Get cart
        const [cartItems] = await connection.query(`
            SELECT
                c.food_id,
                c.quantity,
                f.name,
                f.price,
                f.is_available
            FROM cart c
            INNER JOIN foods f ON c.food_id = f.id
            WHERE c.user_id = ?
        `, [userId]);

        if (cartItems.length === 0) {
            await connection.rollback();
            connection.release();

            return res.status(400).json({
                success: false,
                message: "Your cart is empty"
            });
        }

        // Check availability
        const unavailable = cartItems.find(
            item => !item.is_available
        );

        if (unavailable) {
            await connection.rollback();
            connection.release();

            return res.status(400).json({
                success: false,
                message: `${unavailable.name} is currently unavailable`
            });
        }

        // Calculate subtotal
        const subtotal = cartItems.reduce(
            (total, item) =>
                total + Number(item.price) * item.quantity,
            0
        );

        const deliveryFee = subtotal >= 1000 ? 0 : 100;

        const totalAmount = subtotal + deliveryFee;

        const paymentStatus =
            payment_method === "online"
                ? "pending"
                : "pending";

        // Create order
        const [orderResult] = await connection.query(`
            INSERT INTO orders
            (
                user_id,
                total_amount,
                delivery_fee,
                delivery_address,
                phone,
                payment_method,
                payment_status,
                order_status
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [
            userId,
            totalAmount,
            deliveryFee,
            delivery_address,
            phone,
            payment_method,
            paymentStatus,
            "pending"
        ]);

        const orderId = orderResult.insertId;

        // Insert order items
        for (const item of cartItems) {
            const subtotalItem =
                Number(item.price) * item.quantity;

            await connection.query(`
                INSERT INTO order_items
                (
                    order_id,
                    food_id,
                    quantity,
                    price,
                    subtotal
                )
                VALUES (?, ?, ?, ?, ?)
            `, [
                orderId,
                item.food_id,
                item.quantity,
                item.price,
                subtotalItem
            ]);
        }

        // Clear cart
        await connection.query(
            "DELETE FROM cart WHERE user_id = ?",
            [userId]
        );

        await connection.commit();
        connection.release();

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order: {
                id: orderId,
                subtotal,
                deliveryFee,
                totalAmount,
                paymentMethod: payment_method,
                paymentStatus,
                orderStatus: "pending"
            }
        });

    } catch (error) {
        await connection.rollback();
        connection.release();

        console.error("Create Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to place order",
            error: error.message
        });
    }
};


// =========================
// GET MY ORDERS
// =========================

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const [orders] = await db.query(`
            SELECT
                id,
                total_amount,
                delivery_fee,
                delivery_address,
                phone,
                payment_method,
                payment_status,
                order_status,
                created_at,
                updated_at
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
        `, [userId]);

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch orders",
            error: error.message
        });
    }
};


// =========================
// GET ORDER BY ID
// =========================

const getOrderById = async (req, res) => {
    try {
        const userId = req.user.id;
        const { id } = req.params;

        const [orders] = await db.query(`
            SELECT
                id,
                user_id,
                total_amount,
                delivery_fee,
                delivery_address,
                phone,
                payment_method,
                payment_status,
                order_status,
                created_at,
                updated_at
            FROM orders
            WHERE id = ? AND user_id = ?
        `, [id, userId]);

        if (orders.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        const [items] = await db.query(`
            SELECT
                oi.id,
                oi.food_id,
                oi.quantity,
                oi.price,
                oi.subtotal,
                f.name,
                f.image
            FROM order_items oi
            INNER JOIN foods f ON oi.food_id = f.id
            WHERE oi.order_id = ?
        `, [id]);

        res.json({
            success: true,
            order: {
                ...orders[0],
                items
            }
        });

    } catch (error) {
        console.error("Get Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch order",
            error: error.message
        });
    }
};


// =========================
// GET ALL ORDERS - ADMIN
// =========================

const getAllOrders = async (req, res) => {
    try {
        const [orders] = await db.query(`
            SELECT
                o.id,
                o.user_id,
                o.total_amount,
                o.delivery_fee,
                o.delivery_address,
                o.phone,
                o.payment_method,
                o.payment_status,
                o.order_status,
                o.created_at,
                o.updated_at,
                u.full_name,
                u.email
            FROM orders o
            INNER JOIN users u ON o.user_id = u.id
            ORDER BY o.created_at DESC
        `);

        res.json({
            success: true,
            count: orders.length,
            orders
        });

    } catch (error) {
        console.error("Get All Orders Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch all orders",
            error: error.message
        });
    }
};


// =========================
// UPDATE ORDER STATUS - ADMIN
// =========================

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            order_status,
            payment_status
        } = req.body;

        const validOrderStatuses = [
            "pending",
            "confirmed",
            "preparing",
            "out_for_delivery",
            "delivered",
            "cancelled"
        ];

        const validPaymentStatuses = [
            "pending",
            "paid",
            "failed",
            "refunded"
        ];

        if (
            order_status &&
            !validOrderStatuses.includes(order_status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid order status"
            });
        }

        if (
            payment_status &&
            !validPaymentStatuses.includes(payment_status)
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment status"
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM orders WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Order not found"
            });
        }

        if (order_status) {
            await db.query(
                "UPDATE orders SET order_status = ? WHERE id = ?",
                [order_status, id]
            );
        }

        if (payment_status) {
            await db.query(
                "UPDATE orders SET payment_status = ? WHERE id = ?",
                [payment_status, id]
            );
        }

        res.json({
            success: true,
            message: "Order updated successfully"
        });

    } catch (error) {
        console.error("Update Order Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update order",
            error: error.message
        });
    }
};


module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
};