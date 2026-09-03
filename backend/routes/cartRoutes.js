const express = require("express");

const router = express.Router();

const {
    getCart,
    addToCart,
    updateCart,
    removeFromCart
} = require("../controllers/cartController");

const authMiddleware =
    require("../middleware/authMiddleware");


// =========================
// CART ROUTES
// =========================

router.get(
    "/",
    authMiddleware,
    getCart
);


router.post(
    "/",
    authMiddleware,
    addToCart
);


router.put(
    "/:id",
    authMiddleware,
    updateCart
);


router.delete(
    "/:id",
    authMiddleware,
    removeFromCart
);


module.exports = router;