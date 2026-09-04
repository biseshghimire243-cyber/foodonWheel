// frontend/js/checkout.js

const API_URL = "/api";

let cartData = null;


// =========================
// AUTH CHECK
// =========================

function checkLogin() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        localStorage.setItem(
            "redirectAfterLogin",
            "/checkout"
        );

        window.location.href =
            "/login";

        return false;
    }

    return true;
}


// =========================
// MESSAGE
// =========================

function showMessage(message, type) {

    const box =
        document.getElementById(
            "checkoutMessage"
        );

    if (!box) {
        return;
    }

    box.textContent = message;

    box.className =
        `checkout-message ${type}`;
}


// =========================
// GET FOOD IMAGE
// =========================

function getFoodImage(food) {

    const name =
        (food.food_name || "")
            .toLowerCase()
            .trim();


    if (name.includes("momo")) {

        return "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("pizza")) {

        return "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("burger")) {

        return "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=500&q=80";
    }


    if (
        name.includes("chowmein") ||
        name.includes("chow mein")
    ) {

        return "https://images.unsplash.com/photo-1552611052-33e04de081de?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("noodle")) {

        return "https://images.unsplash.com/photo-1585032226651-759b368d7246?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("biryani")) {

        return "https://images.unsplash.com/photo-1563379091339-03246963d96c?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("cake")) {

        return "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("brownie")) {

        return "https://images.unsplash.com/photo-1564355808539-22fda35bed7e?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("ice cream")) {

        return "https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("lassi")) {

        return "https://images.unsplash.com/photo-1546173159-315724a31696?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("lemonade")) {

        return "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f5b?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("chicken")) {

        return "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("mutton")) {

        return "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=500&q=80";
    }


    if (name.includes("veg")) {

        return "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=500&q=80";
    }


    return "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=500&q=80";
}


// =========================
// LOAD CART
// =========================

async function loadCart() {

    const token =
        localStorage.getItem("token");

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


        if (
            response.status === 401
        ) {

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            localStorage.setItem(
                "redirectAfterLogin",
                "/checkout"
            );

            window.location.href =
                "/login";

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load cart"
            );
        }


        cartData =
            data.cart;


        renderOrderItems();

        updateSummary();

        updateCartCount();


        if (
            !cartData.items ||
            cartData.items.length === 0
        ) {

            document.getElementById(
                "placeOrderBtn"
            ).disabled = true;
        }


    } catch (error) {

        console.error(
            "Cart Error:",
            error
        );

        document.getElementById(
            "orderItems"
        ).innerHTML = `
            <div class="empty-checkout">

                <div class="icon">
                    ⚠️
                </div>

                <h3>
                    Unable to load cart
                </h3>

                <p>
                    Please try again.
                </p>

                <a
                    href="/cart"
                    class="back-cart"
                >
                    Back to Cart
                </a>

            </div>
        `;
    }
}


// =========================
// RENDER ITEMS
// =========================

function renderOrderItems() {

    const container =
        document.getElementById(
            "orderItems"
        );


    if (
        !cartData ||
        !cartData.items ||
        cartData.items.length === 0
    ) {

        container.innerHTML = `
            <div class="empty-checkout">

                <div class="icon">
                    🛒
                </div>

                <h3>
                    Your cart is empty
                </h3>

                <p>
                    Add some delicious food first.
                </p>

                <a
                    href="/menu"
                    class="back-cart"
                >
                    Browse Menu
                </a>

            </div>
        `;

        return;
    }


    container.innerHTML =
        cartData.items.map(item => {

            const image =
                getFoodImage(item);

            const price =
                Number(item.price);

            const quantity =
                Number(item.quantity);

            const itemTotal =
                price * quantity;


            return `
                <div class="order-item">

                    <div class="order-item-image">

                        <img
                            src="${image}"
                            alt="${item.food_name}"
                        >

                    </div>


                    <div class="order-item-info">

                        <h4>
                            ${item.food_name}
                        </h4>

                        <span>
                            Rs. ${price.toFixed(0)}
                            × ${quantity}
                        </span>

                    </div>


                    <div class="order-item-price">

                        Rs. ${itemTotal.toFixed(0)}

                    </div>

                </div>
            `;

        }).join("");
}


// =========================
// UPDATE SUMMARY
// =========================

function updateSummary() {

    if (!cartData) {
        return;
    }


    const subtotal =
        Number(cartData.subtotal || 0);


    const deliveryFee =
        subtotal > 0
            ? 100
            : 0;


    const discount = 0;


    const total =
        subtotal +
        deliveryFee -
        discount;


    document.getElementById(
        "subtotal"
    ).textContent =
        `Rs. ${subtotal.toFixed(0)}`;


    document.getElementById(
        "deliveryFee"
    ).textContent =
        `Rs. ${deliveryFee.toFixed(0)}`;


    document.getElementById(
        "discount"
    ).textContent =
        `Rs. ${discount.toFixed(0)}`;


    document.getElementById(
        "total"
    ).textContent =
        `Rs. ${total.toFixed(0)}`;
}


// =========================
// CART COUNT
// =========================

function updateCartCount() {

    const count =
        document.getElementById(
            "cartCount"
        );

    if (!count || !cartData) {
        return;
    }

    count.textContent =
        cartData.itemCount || 0;
}


// =========================
// LOAD USER PROFILE
// =========================

async function loadUserProfile() {

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                `${API_URL}/auth/profile`,
                {
                    headers: {
                        "Authorization":
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load profile"
            );
        }


        const user =
            data.user;


        document.getElementById(
            "fullName"
        ).value =
            user.full_name || "";


        document.getElementById(
            "phone"
        ).value =
            user.phone || "";


        document.getElementById(
            "address"
        ).value =
            user.address || "";


    } catch (error) {

        console.error(
            "Profile Error:",
            error
        );
    }
}


// =========================
// PLACE ORDER
// =========================

async function placeOrder() {

    const token =
        localStorage.getItem("token");


    const fullName =
        document.getElementById(
            "fullName"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const address =
        document.getElementById(
            "address"
        ).value.trim();


    const paymentMethod =
        document.querySelector(
            'input[name="payment_method"]:checked'
        )?.value;


    const button =
        document.getElementById(
            "placeOrderBtn"
        );


    // =========================
    // VALIDATION
    // =========================

    if (!fullName) {

        showMessage(
            "Please enter your full name.",
            "error"
        );

        return;
    }


    if (!phone) {

        showMessage(
            "Please enter your phone number.",
            "error"
        );

        return;
    }


    if (
        !/^[0-9]{10}$/.test(phone)
    ) {

        showMessage(
            "Please enter a valid 10-digit phone number.",
            "error"
        );

        return;
    }


    if (!address) {

        showMessage(
            "Please enter your delivery address.",
            "error"
        );

        return;
    }


    if (
        !cartData ||
        !cartData.items ||
        cartData.items.length === 0
    ) {

        showMessage(
            "Your cart is empty.",
            "error"
        );

        return;
    }


    // =========================
    // DISABLE BUTTON
    // =========================

    button.disabled = true;

    button.textContent =
        "Placing Order...";


    try {

        /*
         * The current backend creates the order
         * from the authenticated user's cart.
         *
         * Therefore we send the delivery
         * information along with the request.
         */

        const response =
            await fetch(
                `${API_URL}/orders`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({

                        full_name:
                            fullName,

                        phone:
                            phone,

                        address:
                            address,

                        payment_method:
                            paymentMethod

                    })
                }
            );


        const data =
            await response.json();


        if (
            response.status === 401
        ) {

            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "user"
            );

            localStorage.setItem(
                "redirectAfterLogin",
                "/checkout"
            );

            window.location.href =
                "/login";

            return;
        }


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to place order"
            );
        }


        showMessage(
            "Order placed successfully!",
            "success"
        );


        button.textContent =
            "Order Placed ✓";


        /*
         * Backend clears the cart after
         * successfully creating the order.
         */

        setTimeout(
            () => {

                if (data.order?.id) {

                    window.location.href =
                        `/orders?order=${data.order.id}`;

                } else {

                    window.location.href =
                        "/orders";
                }

            },
            1200
        );


    } catch (error) {

        console.error(
            "Place Order Error:",
            error
        );


        showMessage(
            error.message ||
            "Unable to place order.",
            "error"
        );


        button.disabled = false;

        button.textContent =
            "Place Order";
    }
}


// =========================
// LOGOUT
// =========================

function logout() {

    localStorage.removeItem(
        "token"
    );

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "/";
}


// =========================
// INITIALIZE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!checkLogin()) {
            return;
        }


        loadUserProfile();

        loadCart();


        const placeOrderBtn =
            document.getElementById(
                "placeOrderBtn"
            );


        if (placeOrderBtn) {

            placeOrderBtn.addEventListener(
                "click",
                placeOrder
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