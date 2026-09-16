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
            throw new Error(
                data.message || "Unable to load categories"
            );
        }

        if (!data.categories ||
            data.categories.length === 0) {

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
                            ${category.description ||
                            "Delicious food"}
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
// FOOD IMAGE
// =========================

function getFoodImage(food) {

    const name =
        (food.name || "").toLowerCase();


    // Chicken Thakali
    if (
        name.includes("chicken") &&
        name.includes("thakali")
    ) {
        return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80";
    }


    // Mutton Thakali
    if (
        name.includes("mutton") &&
        name.includes("thakali")
    ) {
        return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
    }


    // Momo
    if (name.includes("momo")) {
        return "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80";
    }


    // Pizza
    if (name.includes("pizza")) {
        return "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80";
    }


    // Burger
    if (name.includes("burger")) {
        return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80";
    }


    // Chowmein
    if (
        name.includes("chowmein") ||
        name.includes("chow mein")
    ) {
        return "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=80";
    }


    // Fried Rice
    if (name.includes("fried rice")) {
        return "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80";
    }


    // Ice Cream
    if (name.includes("ice cream")) {
        return "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=900&q=80";
    }


    // Drinks
    if (
        name.includes("drink") ||
        name.includes("juice") ||
        name.includes("coke") ||
        name.includes("pepsi")
    ) {
        return "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=80";
    }


    // Salad
    if (name.includes("salad")) {
        return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=80";
    }


    // Pasta
    if (name.includes("pasta")) {
        return "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=900&q=80";
    }


    // If database contains a real URL
    if (
        food.image &&
        (
            food.image.startsWith("http://") ||
            food.image.startsWith("https://")
        )
    ) {
        return food.image;
    }


    // Default food image
    return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
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
            throw new Error(
                data.message || "Unable to load foods"
            );
        }


        if (
            !data.foods ||
            data.foods.length === 0
        ) {

            container.innerHTML = `
                <div class="loading">
                    No foods available.
                </div>
            `;

            return;
        }


        const availableFoods =
            data.foods
                .filter(food =>
                    food.is_available
                )
                .slice(0, 8);


        if (availableFoods.length === 0) {

            container.innerHTML = `
                <div class="loading">
                    No foods available right now.
                </div>
            `;

            return;
        }


        container.innerHTML =
            availableFoods
                .map(food =>
                    createFoodCard(food)
                )
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

    const image =
        getFoodImage(food);


    return `
        <div class="food-card">

            <div class="food-image">

                <img
                    src="${image}"
                    alt="${escapeHTML(food.name)}"
                    loading="lazy"
                    onerror="this.onerror=null; this.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80';"
                >

            </div>


            <div class="food-info">

                <span class="food-category">
                    ${escapeHTML(
                        food.category_name || "Food"
                    )}
                </span>


                <h3>
                    ${escapeHTML(food.name)}
                </h3>


                <p>
                    ${escapeHTML(
                        food.description ||
                        "Delicious food prepared fresh for you."
                    )}
                </p>


                <div class="food-bottom">

                    <span class="food-price">
                        Rs. ${Number(
                            food.price || 0
                        ).toFixed(0)}
                    </span>


                    <button
                        class="add-btn"
                        onclick="addToCart(${food.id})"
                    >
                        + Add
                    </button>

                </div>


                <button
                    class="details-btn"
                    onclick="openFoodDetails(${food.id})"
                >
                    View Details
                </button>

            </div>

        </div>
    `;
}


// =========================
// OPEN FOOD DETAILS
// =========================

function openFoodDetails(foodId) {

    window.location.href =
        `/food-details.html?id=${foodId}`;
}


// =========================
// ADD TO CART
// =========================

async function addToCart(foodId) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        localStorage.setItem(
            "redirectAfterLogin",
            window.location.pathname
        );

        alert(
            "Please login to add food to cart."
        );

        window.location.href =
            "/login";

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/cart`,
            {
                method: "POST",

                headers: {
                    "Content-Type":
                        "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    food_id: foodId,
                    quantity: 1
                })
            }
        );


        const data =
            await response.json();


        if (response.status === 401) {

            localStorage.removeItem("token");

            localStorage.setItem(
                "redirectAfterLogin",
                window.location.pathname
            );

            window.location.href =
                "/login";

            return;
        }


        if (!response.ok || !data.success) {

            alert(
                data.message ||
                "Unable to add to cart"
            );

            return;
        }


        alert(
            "Food added to cart!"
        );


        updateCartCount();


    } catch (error) {

        console.error(
            "Cart Error:",
            error
        );

        alert(
            "Unable to connect to server."
        );
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
                    "Authorization":
                        `Bearer ${token}`
                }
            }
        );


        const data =
            await response.json();


        if (data.success) {

            cartCount.textContent =
                data.cart.itemCount || 0;
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
// ESCAPE HTML
// =========================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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
            document.getElementById(
                "logoutBtn"
            );


        if (logoutBtn) {

            logoutBtn.addEventListener(
                "click",
                logout
            );
        }

    }
);