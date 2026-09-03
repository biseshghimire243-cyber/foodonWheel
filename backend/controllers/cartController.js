const db = require("../config/db");

// ===============================
// GET USER CART
// ===============================

const getCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const [items] = await db.query(
            `
            SELECT
                cart.id,
                cart.food_id,
                cart.quantity,
                foods.name AS food_name,
                foods.price,
                foods.image,
                foods.is_available,
                categories.name AS category_name
            FROM cart
            INNER JOIN foods
                ON cart.food_id = foods.id
            LEFT JOIN categories
                ON foods.category_id = categories.id
            WHERE cart.user_id = ?
            ORDER BY cart.id DESC
            `,
            [userId]
        );

        const itemCount = items.reduce(
            (total, item) => total + Number(item.quantity),
            0
        );

        const subtotal = items.reduce(
            (total, item) =>
                total +
                Number(item.price) * Number(item.quantity),
            0
        );

        res.json({
            success: true,
            cart: {
                items,
                itemCount,
                subtotal
            }
        });

    } catch (error) {
        console.error("Get Cart Error:", error);

        res.status(500).json({
            success: false,
            message: "Unable to load cart",
            error: error.message
        });
    }
};


// ===============================
// ADD FOOD TO CART
// ===============================

const addToCart = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            food_id,
            quantity
        } = req.body;

        if (!food_id) {
            return res.status(400).json({
                success: false,
                message: "Food ID is required"
            });
        }

        const addQuantity = Number(quantity) || 1;

        if (addQuantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        // Check whether food exists
        const [foods] = await db.query(
            `
            SELECT id, is_available
            FROM foods
            WHERE id = ?
            `,
            [food_id]
        );

        if (foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food item not found"
            });
        }

        // Check whether food is available
        if (!foods[0].is_available) {
            return res.status(400).json({
                success: false,
                message: "This food is currently unavailable"
            });
        }

        // Check whether item already exists in cart
        const [existing] = await db.query(
            `
            SELECT id, quantity
            FROM cart
            WHERE user_id = ?
            AND food_id = ?
            `,
            [
                userId,
                food_id
            ]
        );

        // If already exists, increase quantity
        if (existing.length > 0) {

            const newQuantity =
                Number(existing[0].quantity) +
                addQuantity;

            await db.query(
                `
                UPDATE cart
                SET quantity = ?
                WHERE id = ?
                `,
                [
                    newQuantity,
                    existing[0].id
                ]
            );

            return res.json({
                success: true,
                message: "Cart quantity updated"
            });
        }

        // Otherwise create new cart item
        await db.query(
            `
            INSERT INTO cart
            (
                user_id,
                food_id,
                quantity
            )
            VALUES (?, ?, ?)
            `,
            [
                userId,
                food_id,
                addQuantity
            ]
        );

        res.status(201).json({
            success: true,
            message: "Food added to cart"
        });

    } catch (error) {

        console.error(
            "Add Cart Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to add item to cart",
            error: error.message
        });
    }
};


// ===============================
// UPDATE CART QUANTITY
// ===============================

const updateCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;

        const quantity =
            Number(req.body.quantity);

        if (!quantity || quantity < 1) {
            return res.status(400).json({
                success: false,
                message: "Quantity must be at least 1"
            });
        }

        const [result] = await db.query(
            `
            UPDATE cart
            SET quantity = ?
            WHERE id = ?
            AND user_id = ?
            `,
            [
                quantity,
                cartId,
                userId
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Cart item not found"
            });
        }

        res.json({
            success: true,
            message: "Cart updated successfully"
        });

    } catch (error) {

        console.error(
            "Update Cart Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to update cart",
            error: error.message
        });
    }
};


// ===============================
// REMOVE ITEM FROM CART
// ===============================

const removeFromCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.params.id;

        const [result] = await db.query(
            `
            DELETE FROM cart
            WHERE id = ?
            AND user_id = ?
            `,
            [
                cartId,
                userId
            ]
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

        console.error(
            "Remove Cart Error:",
            error
        );

        res.status(500).json({
            success: false,
            message: "Unable to remove item",
            error: error.message
        });
    }
};


// ===============================
// EXPORT
// ===============================

module.exports = {
    getCart,
    addToCart,
    updateCart,
    removeFromCart
};