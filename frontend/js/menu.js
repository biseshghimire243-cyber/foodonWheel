const API_URL = "/api";

let allFoods = [];
let selectedCategory = "all";


// =========================
// AUTH
// =========================

function checkLogin() {

    const token = localStorage.getItem("token");

    const loginBtn =
        document.getElementById("loginBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");

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


function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
}


// =========================
// LOAD FOODS
// =========================

async function loadFoods() {

    const container =
        document.getElementById("menuFoodContainer");

    try {

        const response =
            await fetch(`${API_URL}/foods`);

        const data =
            await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        allFoods = data.foods;

        renderFoods();

    } catch (error) {

        console.error(error);

        container.innerHTML = `
            <div class="no-foods">

                <div class="no-foods-icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load menu
                </h3>

                <p>
                    Please check your server connection.
                </p>

            </div>
        `;
    }
}


// =========================
// LOAD CATEGORIES
// =========================

async function loadCategories() {

    const container =
        document.getElementById("menuCategories");

    try {

        const response =
            await fetch(`${API_URL}/categories`);

        const data =
            await response.json();

        if (!data.success) {
            throw new Error(data.message);
        }

        data.categories.forEach(category => {

            const button =
                document.createElement("button");

            button.className =
                "category-filter";

            button.dataset.category =
                category.id;

            button.textContent =
                category.name;

            button.addEventListener(
                "click",
                () => {

                    selectedCategory =
                        String(category.id);

                    document
                        .querySelectorAll(".category-filter")
                        .forEach(btn =>
                            btn.classList.remove("active")
                        );

                    button.classList.add("active");

                    renderFoods();
                }
            );

            container.appendChild(button);

        });

        // Check URL category
        const params =
            new URLSearchParams(
                window.location.search
            );

        const urlCategory =
            params.get("category");

        if (urlCategory) {

            selectedCategory =
                urlCategory;

            document
                .querySelectorAll(".category-filter")
                .forEach(button => {

                    button.classList.remove("active");

                    if (
                        button.dataset.category ===
                        urlCategory
                    ) {
                        button.classList.add("active");
                    }

                });

            renderFoods();
        }

    } catch (error) {

        console.error(
            "Category Error:",
            error
        );
    }
}


// =========================
// RENDER FOODS
// =========================

function renderFoods() {

    const container =
        document.getElementById(
            "menuFoodContainer"
        );

    const search =
        document
            .getElementById("searchInput")
            .value
            .toLowerCase()
            .trim();

    const sort =
        document
            .getElementById("sortSelect")
            .value;

    let foods =
        [...allFoods];


    // Category filter

    if (selectedCategory !== "all") {

        foods = foods.filter(
            food =>
                String(food.category_id) ===
                selectedCategory
        );
    }


    // Search

    if (search) {

        foods = foods.filter(food => {

            const name =
                food.name?.toLowerCase() || "";

            const description =
                food.description?.toLowerCase() || "";

            const category =
                food.category_name?.toLowerCase() || "";

            return (
                name.includes(search) ||
                description.includes(search) ||
                category.includes(search)
            );

        });

    }


    // Sort

    if (sort === "low") {

        foods.sort(
            (a, b) =>
                Number(a.price) -
                Number(b.price)
        );

    }

    if (sort === "high") {

        foods.sort(
            (a, b) =>
                Number(b.price) -
                Number(a.price)
        );

    }

    if (sort === "name") {

        foods.sort(
            (a, b) =>
                a.name.localeCompare(b.name)
        );

    }


    if (foods.length === 0) {

        container.innerHTML = `
            <div class="no-foods">

                <div class="no-foods-icon">
                    🍽️
                </div>

                <h3>
                    No food found
                </h3>

                <p>
                    Try another search or category.
                </p>

            </div>
        `;

        return;
    }


    container.innerHTML =
        foods.map(food =>
            createFoodCard(food)
        ).join("");
}


// =========================
// FOOD CARD
// =========================

function createFoodCard(food) {

    let image;

    if (food.image) {

        image = `
            <img
                src="${food.image}"
                alt="${food.name}"
            >
        `;

    } else {

        image = `
            <div class="food-placeholder">
                🍽️
            </div>
        `;
    }


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

                    ${
                        food.is_available
                        ? `
                            <button
                                class="add-btn"
                                onclick="addToCart(${food.id})"
                            >
                                + Add
                            </button>
                        `
                        : `
                            <button
                                class="add-btn"
                                disabled
                                style="opacity:.5;cursor:not-allowed;"
                            >
                                Unavailable
                            </button>
                        `
                    }

                </div>

            </div>

        </div>
    `;
}


// =========================
// ADD CART
// =========================

async function addToCart(foodId) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        alert(
            "Please login to add items to your cart."
        );

        window.location.href = "/login";

        return;
    }


    try {

        const response =
            await fetch(
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


        if (!response.ok) {

            alert(
                data.message ||
                "Unable to add item"
            );

            return;
        }


        alert(
            "Food added to cart!"
        );

        updateCartCount();

    } catch (error) {

        console.error(error);

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

        const response =
            await fetch(
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
                data.cart.itemCount;
        }

    } catch (error) {

        console.error(error);
    }
}


// =========================
// EVENTS
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        checkLogin();

        loadFoods();

        loadCategories();

        updateCartCount();


        document
            .getElementById("searchInput")
            .addEventListener(
                "input",
                renderFoods
            );


        document
            .getElementById("sortSelect")
            .addEventListener(
                "change",
                renderFoods
            );


        document
            .querySelector(
                '[data-category="all"]'
            )
            .addEventListener(
                "click",
                function () {

                    selectedCategory = "all";

                    document
                        .querySelectorAll(
                            ".category-filter"
                        )
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );

                    this.classList.add("active");

                    renderFoods();
                }
            );


        document
            .getElementById("logoutBtn")
            .addEventListener(
                "click",
                logout
            );

    }
);