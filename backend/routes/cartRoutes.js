const express = require("express");

const router = express.Router();

const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

// Get logged-in user's cart
router.get(
    "/",
    authMiddleware,
    getCart
);

// Add food to logged-in user's cart
router.post(
    "/",
    authMiddleware,
    addToCart
);

// Update cart item quantity
router.put(
    "/:id",
    authMiddleware,
    updateCart
);

// Remove item from cart
router.delete(
    "/:id",
    authMiddleware,
    removeFromCart
);

module.exports = router;