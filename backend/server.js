const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;

// =========================
// MIDDLEWARE
// =========================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoutes);
app.use("/api/foods", foodRoutes);

// =========================
// DATABASE
// =========================

const db = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const foodRoutes = require("./routes/foodRoutes");

// =========================
// FRONTEND
// =========================

app.use(express.static(path.join(__dirname, "../frontend")));

// =========================
// TEST ROUTE
// =========================

app.get("/api", (req, res) => {
    res.json({
        success: true,
        message: "FoodShala API is running!"
    });
});

// =========================
// DATABASE TEST
// =========================

app.get("/api/db-test", async (req, res) => {
    try {
        const [result] = await db.query("SELECT 1 AS test");

        res.json({
            success: true,
            message: "Database connection is working!",
            result
        });
    } catch (error) {
        console.error("Database Test Error:", error);

        res.status(500).json({
            success: false,
            message: "Database connection failed",
            error: error.message
        });
    }
});

// =========================
// FRONTEND ROUTES
// =========================

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

app.get("/menu", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/menu.html"));
});

app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/login.html"));
});

app.get("/register", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/register.html"));
});

app.get("/cart", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/cart.html"));
});

app.get("/checkout", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/checkout.html"));
});

app.get("/orders", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/orders.html"));
});

app.get("/profile", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/profile.html"));
});

// =========================
// ADMIN ROUTES
// =========================

app.get("/admin", (req, res) => {
    res.sendFile(
        path.join(__dirname, "../frontend/admin/dashboard.html")
    );
});

// =========================
// 404 API
// =========================

app.use("/api", (req, res) => {
    res.status(404).json({
        success: false,
        message: "API endpoint not found"
    });
});

// =========================
// START SERVER
// =========================

app.listen(PORT, () => {
    console.log("=================================");
    console.log("🍔 FoodShala Server Started");
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`🗄️ Database: ${process.env.DB_NAME}`);
    console.log("=================================");
});