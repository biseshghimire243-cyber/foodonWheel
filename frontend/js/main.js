const API_URL = "/api";


// =========================
// CHECK LOGIN
// =========================

function checkLogin() {
    const token = localStorage.getItem("token");

    const loginBtn = document.getElementById("loginBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    if (token) {
        if (loginBtn) {
            loginBtn.style.display = "none";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "block";
        }
    } else {
        if (loginBtn) {
            loginBtn.style.display = "block";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }
    }
}


// =========================
// LOGOUT
// =========================

function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
}


// =========================
// LOAD CATEGORIES
// =========================

async function loadCategories() {
    const container =
        document.getElementById("categoryContainer");

    if (!container) return;

    try {
        const response = await fetch(
            `${API_URL}/categories`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        if (data.categories.length === 0) {
            container.innerHTML = `
                <div class="loading">
                    No categories available.
                </div>
            `;
            return;
        }

        container.innerHTML = data.categories
            .slice(0, 8)
            .map(category => {

                const icons = {
                    Pizza: "🍕",
                    Burgers: "🍔",
                    Momo: "🥟",
                    Noodles: "🍜",
                    Biryani: "🍛",
                    Drinks: "🥤",
                    Desserts: "🍰",
                    Thakali: "🍚"
                };

                const icon =
                    icons[category.name] || "🍽️";

                return `
                    <div
                        class="category-card"
                        onclick="openCategory(${category.id})"
                    >

                        <div class="category-image">
                            ${icon}
                        </div>

                        <h3>
                            ${category.name}
                        </h3>

                        <p>
                            ${category.description || "Delicious food"}
                        </p>

                    </div>
                `;
            })
            .join("");

    } catch (error) {

        console.error(
            "Category Error:",
            error
        );

        container.innerHTML = `
            <div class="loading">
                Unable to load categories.
            </div>
        `;
    }
}


// =========================
// LOAD FOODS
// =========================

async function loadFoods() {
    const container =
        document.getElementById("foodContainer");

    if (!container) return;

    try {
        const response = await fetch(
            `${API_URL}/foods`
        );

        const data = await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        if (data.foods.length === 0) {
            container.innerHTML = `
                <div class="loading">
                    No foods available.
                </div>
            `;
            return;
        }

        container.innerHTML = data.foods
            .filter(food => food.is_available)
            .slice(0, 8)
            .map(food => createFoodCard(food))
            .join("");

    } catch (error) {

        console.error(
            "Food Error:",
            error
        );

        container.innerHTML = `
            <div class="loading">
                Unable to load foods.
            </div>
        `;
    }
}


// =========================
// FOOD CARD
// =========================

function createFoodCard(food) {

    const image = food.image
        ? `<img src="${food.image}" alt="${food.name}">`
        : `<div class="food-placeholder">🍽️</div>`;

    return `
        <div class="food-card">

            <div class="food-image">
                ${image}
            </div>

            <div class="food-info">

                <span class="food-category">
                    ${food.category_name || "Food"}
                </span>

                <h3>
                    ${food.name}
                </h3>

                <p>
                    ${food.description || "Delicious food prepared fresh for you."}
                </p>

                <div class="food-bottom">

                    <span class="food-price">
                        Rs. ${Number(food.price).toFixed(0)}
                    </span>

                    <button
                        class="add-btn"
                        onclick="addToCart(${food.id})"
                    >
                        + Add
                    </button>

                </div>

            </div>

        </div>
    `;
}


// =========================
// ADD TO CART
// =========================

async function addToCart(foodId) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        alert("Please login to add food to cart.");
        window.location.href = "/login";
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/cart`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    food_id: foodId,
                    quantity: 1
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            alert(data.message || "Unable to add to cart");
            return;
        }

        alert("Food added to cart!");

        updateCartCount();

    } catch (error) {

        console.error(
            "Cart Error:",
            error
        );

        alert("Unable to connect to server.");
    }
}


// =========================
// CART COUNT
// =========================

async function updateCartCount() {

    const token =
        localStorage.getItem("token");

    const cartCount =
        document.getElementById("cartCount");

    if (!cartCount || !token) {
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/cart`,
            {
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (data.success) {
            cartCount.textContent =
                data.cart.itemCount;
        }

    } catch (error) {

        console.error(
            "Cart Count Error:",
            error
        );
    }
}


// =========================
// OPEN CATEGORY
// =========================

function openCategory(categoryId) {
    window.location.href =
        `/menu?category=${categoryId}`;
}


// =========================
// INITIALIZE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLogin();

        loadCategories();

        loadFoods();

        updateCartCount();

        const logoutBtn =
            document.getElementById("logoutBtn");

        if (logoutBtn) {
            logoutBtn.addEventListener(
                "click",
                logout
            );
        }

    }
);