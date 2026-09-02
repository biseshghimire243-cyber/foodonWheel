const db = require("../config/db");

// =========================
// GET ALL FOODS
// =========================

const getAllFoods = async (req, res) => {
    try {
        const [foods] = await db.query(`
            SELECT 
                f.id,
                f.name,
                f.description,
                f.price,
                f.image,
                f.is_available,
                f.created_at,
                c.id AS category_id,
                c.name AS category_name
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            ORDER BY f.id DESC
        `);

        res.json({
            success: true,
            count: foods.length,
            foods
        });

    } catch (error) {
        console.error("Get Foods Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch foods",
            error: error.message
        });
    }
};


// =========================
// GET FOOD BY ID
// =========================

const getFoodById = async (req, res) => {
    try {
        const { id } = req.params;

        const [foods] = await db.query(`
            SELECT 
                f.id,
                f.name,
                f.description,
                f.price,
                f.image,
                f.is_available,
                f.created_at,
                c.id AS category_id,
                c.name AS category_name
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            WHERE f.id = ?
        `, [id]);

        if (foods.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        res.json({
            success: true,
            food: foods[0]
        });

    } catch (error) {
        console.error("Get Food Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch food",
            error: error.message
        });
    }
};


// =========================
// SEARCH FOODS
// =========================

const searchFoods = async (req, res) => {
    try {
        const { search } = req.query;

        if (!search) {
            return res.status(400).json({
                success: false,
                message: "Search keyword is required"
            });
        }

        const keyword = `%${search}%`;

        const [foods] = await db.query(`
            SELECT 
                f.id,
                f.name,
                f.description,
                f.price,
                f.image,
                f.is_available,
                c.name AS category_name
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            WHERE 
                f.name LIKE ?
                OR f.description LIKE ?
                OR c.name LIKE ?
            ORDER BY f.id DESC
        `, [keyword, keyword, keyword]);

        res.json({
            success: true,
            count: foods.length,
            foods
        });

    } catch (error) {
        console.error("Search Food Error:", error);

        res.status(500).json({
            success: false,
            message: "Food search failed",
            error: error.message
        });
    }
};


// =========================
// GET FOODS BY CATEGORY
// =========================

const getFoodsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;

        const [foods] = await db.query(`
            SELECT 
                f.id,
                f.name,
                f.description,
                f.price,
                f.image,
                f.is_available,
                c.name AS category_name
            FROM foods f
            LEFT JOIN categories c ON f.category_id = c.id
            WHERE f.category_id = ?
            ORDER BY f.id DESC
        `, [categoryId]);

        res.json({
            success: true,
            count: foods.length,
            foods
        });

    } catch (error) {
        console.error("Category Food Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch category foods",
            error: error.message
        });
    }
};


// =========================
// ADD FOOD
// =========================

const addFood = async (req, res) => {
    try {
        const {
            category_id,
            name,
            description,
            price,
            image,
            is_available
        } = req.body;

        if (!category_id || !name || price === undefined) {
            return res.status(400).json({
                success: false,
                message: "Category, name and price are required"
            });
        }

        const [category] = await db.query(
            "SELECT id FROM categories WHERE id = ?",
            [category_id]
        );

        if (category.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Category does not exist"
            });
        }

        const [result] = await db.query(`
            INSERT INTO foods
            (category_id, name, description, price, image, is_available)
            VALUES (?, ?, ?, ?, ?, ?)
        `, [
            category_id,
            name,
            description || null,
            price,
            image || null,
            is_available !== undefined ? is_available : 1
        ]);

        res.status(201).json({
            success: true,
            message: "Food added successfully",
            foodId: result.insertId
        });

    } catch (error) {
        console.error("Add Food Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add food",
            error: error.message
        });
    }
};


// =========================
// UPDATE FOOD
// =========================

const updateFood = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            category_id,
            name,
            description,
            price,
            image,
            is_available
        } = req.body;

        const [existing] = await db.query(
            "SELECT id FROM foods WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        await db.query(`
            UPDATE foods
            SET
                category_id = ?,
                name = ?,
                description = ?,
                price = ?,
                image = ?,
                is_available = ?
            WHERE id = ?
        `, [
            category_id,
            name,
            description || null,
            price,
            image || null,
            is_available !== undefined ? is_available : 1,
            id
        ]);

        res.json({
            success: true,
            message: "Food updated successfully"
        });

    } catch (error) {
        console.error("Update Food Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update food",
            error: error.message
        });
    }
};


// =========================
// DELETE FOOD
// =========================

const deleteFood = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT id FROM foods WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Food not found"
            });
        }

        await db.query(
            "DELETE FROM foods WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Food deleted successfully"
        });

    } catch (error) {
        console.error("Delete Food Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete food",
            error: error.message
        });
    }
};


module.exports = {
    getAllFoods,
    getFoodById,
    searchFoods,
    getFoodsByCategory,
    addFood,
    updateFood,
    deleteFood
};