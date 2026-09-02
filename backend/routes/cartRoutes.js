const express = require("express");

const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Get user's cart
router.get("/", getCart);

// Add food
router.post("/", addToCart);

// Update quantity
router.put("/:cartId", updateCartItem);

// Remove item
router.delete("/:cartId", removeFromCart);

// Clear entire cart
router.delete("/", clearCart);

module.exports = router;