const db = require("../config/db");

// =========================
// GET CART
// =========================

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const [items] = await db.query(`
            SELECT
                c.id AS cart_id,
                c.food_id,
                c.quantity,
                f.name,
                f.description,
                f.price,
                f.image,
                f.is_available,
                cat.name AS category_name,
                (f.price * c.quantity) AS subtotal
            FROM cart c
            INNER JOIN foods f ON c.food_id = f.id
            LEFT JOIN categories cat ON f.category_id = cat.id
            WHERE c.user_id = ?
            ORDER BY c.id DESC
        `, [userId]);

        const subtotal = items.reduce(
            (total, item) => total + Number(item.subtotal),
            0
        );

        const deliveryFee = subtotal > 0 ? 100 : 0;
        const total = subtotal + deliveryFee;

        res.json({
            success: true,
            cart: {
                items,
                itemCount: items.reduce(
                    (count, item) => count + item.quantity,
                    0
                ),
                subtotal,
                deliveryFee,
                total
            }
        });

    } catch (error) {
        console.error("Get Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch cart",
            error: error.message
        });
    }
};


// =========================
// ADD TO CART
// =========================

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            food_id,
            quantity
        } = req.body;

        const qty = Number(quantity) || 1;

        if (!food_id) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required"
            });
        }

        if (qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const [foods] = await db.query(
            "SELECT id, name, price, is_available FROM foods WHERE id = ?",
            [food_id]
        );

        if (foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        if (!foods[0].is_available) {
            return res.status(400).json({
                success: false,
                message: "This food is currently unavailable"
            });
        }

        const [existing] = await db.query(
            "SELECT id, quantity FROM cart WHERE user_id = ? AND food_id = ?",
            [userId, food_id]
        );

        if (existing.length > 0) {
            const newQuantity = existing[0].quantity + qty;

            await db.query(
                "UPDATE cart SET quantity = ? WHERE id = ?",
                [newQuantity, existing[0].id]
            );

            return res.json({
                success: true,
                message: "Cart quantity updated",
                quantity: newQuantity
            });
        }

        await db.query(
            "INSERT INTO cart (user_id, food_id, quantity) VALUES (?, ?, ?)",
            [userId, food_id, qty]
        );

        res.status(201).json({
            success: true,
            message: "Food added to cart",
            quantity: qty
        });

    } catch (error) {
        console.error("Add Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add food to cart",
            error: error.message
        });
    }
};


// =========================
// UPDATE CART ITEM
// =========================

const updateCartItem = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartId } = req.params;
        const { quantity } = req.body;

        const qty = Number(quantity);

        if (!Number.isInteger(qty) || qty < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be a positive integer"
            });
        }

        const [items] = await db.query(
            "SELECT id FROM cart WHERE id = ? AND user_id = ?",
            [cartId, userId]
        );

        if (items.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        await db.query(
            "UPDATE cart SET quantity = ? WHERE id = ? AND user_id = ?",
            [qty, cartId, userId]
        );

        res.json({
            success: true,
            message: "Cart updated successfully"
        });

    } catch (error) {
        console.error("Update Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update cart",
            error: error.message
        });
    }
};


// =========================
// REMOVE CART ITEM
// =========================

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const { cartId } = req.params;

        const [result] = await db.query(
            "DELETE FROM cart WHERE id = ? AND user_id = ?",
            [cartId, userId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        res.json({
            success: true,
            message: "Item removed from cart"
        });

    } catch (error) {
        console.error("Remove Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to remove cart item",
            error: error.message
        });
    }
};


// =========================
// CLEAR CART
// =========================

const clearCart = async (req, res) => {
    try {
        const userId = req.user.id;

        await db.query(
            "DELETE FROM cart WHERE user_id = ?",
            [userId]
        );

        res.json({
            success: true,
            message: "Cart cleared successfully"
        });

    } catch (error) {
        console.error("Clear Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to clear cart",
            error: error.message
        });
    }
};


module.exports = {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
};