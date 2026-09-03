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


// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem("token");
    localStorage.removeItem("user");

    window.location.href = "/";
}


// =========================
// FOOD IMAGES
// =========================

function getFoodImage(food) {

    const name =
        (food.name || "").toLowerCase().trim();

    if (name.includes("veg thakali")) {
        return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("mutton thakali")) {
        return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("chicken thakali")) {
        return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("momo")) {
        return "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("pizza")) {
        return "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("burger")) {
        return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("chowmein") || name.includes("chow mein")) {
        return "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("noodle")) {
        return "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("biryani")) {
        return "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("gulab jamun")) {
        return "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("brownie")) {
        return "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("chocolate cake") || name.includes("cake")) {
        return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("ice cream")) {
        return "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("mango lassi")) {
        return "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("lemonade")) {
        return "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f5b?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("coca")) {
        return "https://images.unsplash.com/photo-1554866585-cd94860890b7?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("fanta")) {
        return "https://images.unsplash.com/photo-1629203849820-fdd70d49c38e?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("sprite")) {
        return "https://images.unsplash.com/photo-1629203851122-3726ecdf080e?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("chicken")) {
        return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("mutton")) {
        return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=900&q=85";
    }

    if (name.includes("veg")) {
        return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=900&q=85";
    }

    return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85";
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


    // =========================
    // CATEGORY FILTER
    // =========================

    if (selectedCategory !== "all") {

        foods = foods.filter(
            food =>
                String(food.category_id) ===
                selectedCategory
        );
    }


    // =========================
    // SEARCH
    // =========================

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


    // =========================
    // SORT
    // =========================

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


    // =========================
    // NO FOOD
    // =========================

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


    // =========================
    // DISPLAY FOODS
    // =========================

    container.innerHTML =
        foods.map(food =>
            createFoodCard(food)
        ).join("");
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
                    alt="${food.name}"
                    loading="lazy"
                    onerror="this.src='https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85'"
                >

            </div>

            <div class="food-info">

                <span class="food-category">
                    ${food.category_name || "Food"}
                </span>

                <h3>
                    ${food.name}
                </h3>

                <p>
                    ${
                        food.description ||
                        "Delicious food prepared fresh for you."
                    }
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
// ADD TO CART
// =========================

async function addToCart(foodId) {

    const token =
        localStorage.getItem("token");

    if (!token) {

        localStorage.setItem(
            "redirectAfterLogin",
            "/menu"
        );

        alert(
            "Please login to add items to your cart."
        );

        window.location.href =
            "/login";

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


        const searchInput =
            document.getElementById("searchInput");

        if (searchInput) {

            searchInput.addEventListener(
                "input",
                renderFoods
            );
        }


        const sortSelect =
            document.getElementById("sortSelect");

        if (sortSelect) {

            sortSelect.addEventListener(
                "change",
                renderFoods
            );
        }


        const allCategory =
            document.querySelector(
                '[data-category="all"]'
            );

        if (allCategory) {

            allCategory.addEventListener(
                "click",
                function () {

                    selectedCategory =
                        "all";

                    document
                        .querySelectorAll(".category-filter")
                        .forEach(btn =>
                            btn.classList.remove(
                                "active"
                            )
                        );

                    this.classList.add("active");

                    renderFoods();
                }
            );
        }


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