const API_URL = "/api";


// =========================
// GET FOOD ID
// =========================

const params = new URLSearchParams(window.location.search);
const foodId = params.get("id");

const foodDetails = document.getElementById("foodDetails");


// =========================
// FOOD IMAGE
// =========================

function getFoodImage(food) {

    const name = (food.name || "").toLowerCase();

    const imageMap = {
        "chicken thakali":
            "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=80",

        "mutton thakali":
            "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80",

        "chicken momo":
            "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80",

        "momo":
            "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=900&q=80",

        "pizza":
            "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=900&q=80",

        "burger":
            "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=80",

        "chowmein":
            "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=900&q=80",

        "fried rice":
            "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=80",

        "ice cream":
            "https://images.unsplash.com/photo-1501443762994-82bd5dace89a?auto=format&fit=crop&w=900&q=80"
    };

    for (const key in imageMap) {
        if (name.includes(key)) {
            return imageMap[key];
        }
    }

    if (food.image && food.image.startsWith("http")) {
        return food.image;
    }

    return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=80";
}


// =========================
// SHOW MESSAGE
// =========================

function showMessage(message, type = "success") {

    const oldMessage = document.querySelector(".message");

    if (oldMessage) {
        oldMessage.remove();
    }

    const element = document.createElement("div");

    element.className = `message ${type}`;
    element.textContent = message;

    const info = document.querySelector(".food-info");

    if (info) {
        info.prepend(element);
    }
}


// =========================
// LOAD FOOD
// =========================

async function loadFood() {

    if (!foodId) {

        foodDetails.innerHTML = `
            <div class="error-state">
                <h2>Food Not Found</h2>
                <p>No food item was selected.</p>

                <a href="/menu" class="btn btn-primary">
                    Back to Menu
                </a>
            </div>
        `;

        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/foods/${foodId}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(
                data.message || "Food not found"
            );
        }

        const food = data.food;

        renderFood(food);

    } catch (error) {

        console.error("Food Details Error:", error);

        foodDetails.innerHTML = `
            <div class="error-state">

                <h2>Unable to Load Food</h2>

                <p>
                    ${error.message}
                </p>

                <a href="/menu" class="btn btn-primary">
                    Back to Menu
                </a>

            </div>
        `;
    }
}


// =========================
// RENDER FOOD
// =========================

function renderFood(food) {

    const image = getFoodImage(food);

    const category =
        food.category_name ||
        food.category ||
        "Food";

    const description =
        food.description ||
        "Delicious food freshly prepared by FoodShala.";

    const price =
        Number(food.price || 0).toFixed(2);

    foodDetails.innerHTML = `

        <div class="food-details-card">

            <!-- IMAGE -->

            <div class="food-image-container">

                <img
                    src="${image}"
                    alt="${escapeHTML(food.name)}"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='block';"
                >

                <div
                    class="food-placeholder"
                    style="display:none;"
                >
                    🍽️
                </div>

            </div>


            <!-- INFORMATION -->

            <div class="food-info">

                <span class="food-category">
                    ${escapeHTML(category)}
                </span>

                <h1 class="food-name">
                    ${escapeHTML(food.name)}
                </h1>


                <div class="food-rating">

                    <span class="stars">
                        ★★★★★
                    </span>

                    <span class="rating-text">
                        Delicious & Fresh
                    </span>

                </div>


                <div class="food-price">
                    Rs. ${price}
                </div>


                <p class="food-description">
                    ${escapeHTML(description)}
                </p>


                <!-- QUANTITY -->

                <div class="quantity-wrapper">

                    <span class="quantity-label">
                        Quantity
                    </span>

                    <div class="quantity-control">

                        <button
                            type="button"
                            class="quantity-btn"
                            id="decreaseBtn"
                        >
                            −
                        </button>

                        <input
                            type="number"
                            id="quantity"
                            value="1"
                            min="1"
                            max="20"
                            readonly
                        >

                        <button
                            type="button"
                            class="quantity-btn"
                            id="increaseBtn"
                        >
                            +
                        </button>

                    </div>

                </div>


                <!-- ACTIONS -->

                <div class="food-actions">

                    <button
                        type="button"
                        class="add-cart-btn"
                        id="addCartBtn"
                    >
                        🛒 Add to Cart
                    </button>

                    <button
                        type="button"
                        class="buy-now-btn"
                        id="buyNowBtn"
                    >
                        ⚡ Buy Now
                    </button>

                </div>

            </div>

        </div>
    `;


    setupQuantity();

    setupCartButtons(food);
}


// =========================
// QUANTITY
// =========================

function setupQuantity() {

    const quantityInput =
        document.getElementById("quantity");

    const decreaseBtn =
        document.getElementById("decreaseBtn");

    const increaseBtn =
        document.getElementById("increaseBtn");


    decreaseBtn.addEventListener(
        "click",
        () => {

            let quantity =
                Number(quantityInput.value);

            if (quantity > 1) {
                quantity--;
            }

            quantityInput.value = quantity;
        }
    );


    increaseBtn.addEventListener(
        "click",
        () => {

            let quantity =
                Number(quantityInput.value);

            if (quantity < 20) {
                quantity++;
            }

            quantityInput.value = quantity;
        }
    );
}


// =========================
// LOGIN CHECK
// =========================

function requireLogin() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        localStorage.setItem(
            "redirectAfterLogin",
            window.location.pathname +
            window.location.search
        );

        window.location.href = "/login";

        return false;
    }

    return true;
}


// =========================
// CART BUTTONS
// =========================

function setupCartButtons(food) {

    const addCartBtn =
        document.getElementById("addCartBtn");

    const buyNowBtn =
        document.getElementById("buyNowBtn");


    addCartBtn.addEventListener(
        "click",
        async () => {

            if (!requireLogin()) {
                return;
            }

            const quantity =
                Number(
                    document.getElementById("quantity").value
                );

            await addToCart(
                food.id,
                quantity,
                addCartBtn
            );
        }
    );


    buyNowBtn.addEventListener(
        "click",
        async () => {

            if (!requireLogin()) {
                return;
            }

            const quantity =
                Number(
                    document.getElementById("quantity").value
                );

            const success =
                await addToCart(
                    food.id,
                    quantity,
                    buyNowBtn
                );

            if (success) {
                window.location.href = "/checkout";
            }
        }
    );
}


// =========================
// ADD TO CART
// =========================

async function addToCart(
    foodId,
    quantity,
    button
) {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return false;
    }


    const originalText =
        button.textContent;

    button.disabled = true;
    button.textContent = "Adding...";


    try {

        const response = await fetch(
            `${API_URL}/cart`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    food_id: foodId,
                    quantity: quantity
                })
            }
        );


        const data =
            await response.json();


        if (response.status === 401) {

            localStorage.removeItem("token");

            localStorage.setItem(
                "redirectAfterLogin",
                window.location.pathname +
                window.location.search
            );

            window.location.href = "/login";

            return false;
        }


        if (!response.ok || !data.success) {

            showMessage(
                data.message ||
                "Failed to add food to cart",
                "error"
            );

            return false;
        }


        showMessage(
            "Food added to cart successfully!",
            "success"
        );

        return true;

    } catch (error) {

        console.error(
            "Add Cart Error:",
            error
        );

        showMessage(
            "Unable to connect to server.",
            "error"
        );

        return false;

    } finally {

        button.disabled = false;

        button.textContent =
            originalText;
    }
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
// NAVBAR AUTH
// =========================

function updateNavbar() {

    const token =
        localStorage.getItem("token");

    const loginBtn =
        document.getElementById("loginBtn");

    const profileBtn =
        document.getElementById("profileBtn");

    const logoutBtn =
        document.getElementById("logoutBtn");


    if (token) {

        if (loginBtn) {
            loginBtn.style.display = "none";
        }

        if (profileBtn) {
            profileBtn.style.display = "inline-block";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "inline-block";
        }

    } else {

        if (loginBtn) {
            loginBtn.style.display = "inline-block";
        }

        if (profileBtn) {
            profileBtn.style.display = "none";
        }

        if (logoutBtn) {
            logoutBtn.style.display = "none";
        }
    }
}


// =========================
// LOGOUT
// =========================

const logoutBtn =
    document.getElementById("logoutBtn");

if (logoutBtn) {

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href = "/";
        }
    );
}


// =========================
// START
// =========================

updateNavbar();
loadFood();