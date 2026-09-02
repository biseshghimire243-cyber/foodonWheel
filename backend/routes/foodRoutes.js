const express = require("express");

const {
    getAllFoods,
    getFoodById,
    searchFoods,
    getFoodsByCategory,
    addFood,
    updateFood,
    deleteFood
} = require("../controllers/foodController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const router = express.Router();

// Public routes
router.get("/", getAllFoods);

router.get("/search", searchFoods);

router.get("/category/:categoryId", getFoodsByCategory);

router.get("/:id", getFoodById);


// Admin routes
router.post(
    "/",
    authMiddleware,
    adminMiddleware,
    addFood
);

router.put(
    "/:id",
    authMiddleware,
    adminMiddleware,
    updateFood
);

router.delete(
    "/:id",
    authMiddleware,
    adminMiddleware,
    deleteFood
);

module.exports = router;