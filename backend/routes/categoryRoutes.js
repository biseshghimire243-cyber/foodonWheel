const express = require("express");

const {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
} = require("../controllers/categoryController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// =========================
// PUBLIC ROUTES
// =========================

router.get("/", getAllCategories);

router.get("/:id", getCategoryById);


// =========================
// ADMIN ROUTES
// =========================

router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    addCategory
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateCategory
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteCategory
);

module.exports = router;