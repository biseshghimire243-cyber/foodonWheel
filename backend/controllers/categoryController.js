const db = require("../config/db");

// =========================
// GET ALL CATEGORIES
// =========================

const getAllCategories = async (req, res) => {
    try {
        const [categories] = await db.query(`
            SELECT 
                id,
                name,
                description,
                image,
                status,
                created_at
            FROM categories
            ORDER BY id DESC
        `);

        res.json({
            success: true,
            count: categories.length,
            categories
        });

    } catch (error) {
        console.error("Get Categories Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch categories",
            error: error.message
        });
    }
};


// =========================
// GET CATEGORY BY ID
// =========================

const getCategoryById = async (req, res) => {
    try {
        const { id } = req.params;

        const [categories] = await db.query(
            "SELECT * FROM categories WHERE id = ?",
            [id]
        );

        if (categories.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        res.json({
            success: true,
            category: categories[0]
        });

    } catch (error) {
        console.error("Get Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch category",
            error: error.message
        });
    }
};


// =========================
// ADD CATEGORY
// =========================

const addCategory = async (req, res) => {
    try {
        const {
            name,
            description,
            image,
            status
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM categories WHERE name = ?",
            [name]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Category already exists"
            });
        }

        const [result] = await db.query(`
            INSERT INTO categories
            (name, description, image, status)
            VALUES (?, ?, ?, ?)
        `, [
            name,
            description || null,
            image || null,
            status || "active"
        ]);

        res.status(201).json({
            success: true,
            message: "Category added successfully",
            categoryId: result.insertId
        });

    } catch (error) {
        console.error("Add Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to add category",
            error: error.message
        });
    }
};


// =========================
// UPDATE CATEGORY
// =========================

const updateCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const {
            name,
            description,
            image,
            status
        } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Category name is required"
            });
        }

        const [existing] = await db.query(
            "SELECT id FROM categories WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const [duplicate] = await db.query(
            "SELECT id FROM categories WHERE name = ? AND id != ?",
            [name, id]
        );

        if (duplicate.length > 0) {
            return res.status(409).json({
                success: false,
                message: "Another category already has this name"
            });
        }

        await db.query(`
            UPDATE categories
            SET
                name = ?,
                description = ?,
                image = ?,
                status = ?
            WHERE id = ?
        `, [
            name,
            description || null,
            image || null,
            status || "active",
            id
        ]);

        res.json({
            success: true,
            message: "Category updated successfully"
        });

    } catch (error) {
        console.error("Update Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to update category",
            error: error.message
        });
    }
};


// =========================
// DELETE CATEGORY
// =========================

const deleteCategory = async (req, res) => {
    try {
        const { id } = req.params;

        const [existing] = await db.query(
            "SELECT id FROM categories WHERE id = ?",
            [id]
        );

        if (existing.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const [foods] = await db.query(
            "SELECT id FROM foods WHERE category_id = ? LIMIT 1",
            [id]
        );

        if (foods.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete category because foods are assigned to it"
            });
        }

        await db.query(
            "DELETE FROM categories WHERE id = ?",
            [id]
        );

        res.json({
            success: true,
            message: "Category deleted successfully"
        });

    } catch (error) {
        console.error("Delete Category Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to delete category",
            error: error.message
        });
    }
};


module.exports = {
    getAllCategories,
    getCategoryById,
    addCategory,
    updateCategory,
    deleteCategory
};