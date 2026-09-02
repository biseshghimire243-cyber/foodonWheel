const express = require("express");

const {
    createOrder,
    getMyOrders,
    getOrderById,
    getAllOrders,
    updateOrderStatus
} = require("../controllers/orderController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

router.use(authMiddleware);

// Customer
router.post("/", createOrder);

router.get("/", getMyOrders);

router.get("/:id", getOrderById);

// Admin
router.get(
    "/admin/all",
    adminMiddleware,
    getAllOrders
);

router.put(
    "/admin/:id/status",
    adminMiddleware,
    updateOrderStatus
);

module.exports = router;