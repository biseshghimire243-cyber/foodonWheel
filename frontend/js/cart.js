const API_URL = "/api";

const token = localStorage.getItem("token");


// =========================
// AUTH CHECK
// =========================

if (!token) {
    window.location.href = "/login";
}


// =========================
// LOAD CART
// =========================

async function loadCart() {

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

        if (!response.ok) {

            if (response.status === 401) {

                localStorage.removeItem("token");
                localStorage.removeItem("user");

                window.location.href = "/login";

                return;
            }

            throw new Error(
                data.message || "Unable to load cart"
            );
        }

        renderCart(data.cart);

    } catch (error) {

        console.error("Cart Error:", error);

        showMessage(
            error.message || "Unable to load cart.",
            "error"
        );

    }

}


// =========================
// RENDER CART
// =========================

function renderCart(cart) {

    const cartItems =
        document.getElementById("cartItems");

    const emptyCart =
        document.getElementById("emptyCart");

    const cartSection =
        document.querySelector(".cart-section");

    const checkoutBtn =
        document.getElementById("checkoutBtn");


    if (
        !cart ||
        !cart.items ||
        cart.items.length === 0
    ) {

        cartSection.style.display = "none";

        emptyCart.style.display = "block";

        updateCartCount(0);

        return;
    }


    cartSection.style.display = "block";

    emptyCart.style.display = "none";


    cartItems.innerHTML = cart.items
        .map(item => createCartItem(item))
        .join("");


    document.getElementById("itemCount")
        .textContent =
        `${cart.items.length} ${
            cart.items.length === 1
                ? "item"
                : "items"
        }`;


    calculateSummary(cart.items);

    updateCartCount(
        cart.itemCount || getTotalQuantity(cart.items)
    );


    checkoutBtn.disabled = false;

}


// =========================
// CREATE CART ITEM
// =========================

function createCartItem(item) {

    const image =
        item.image ||
        "https://via.placeholder.com/100?text=Food";


    const foodName =
        item.food_name ||
        item.name ||
        "Food";


    const category =
        item.category_name ||
        item.category ||
        "Food";


    const price =
        Number(
            item.price || 0
        );


    const quantity =
        Number(
            item.quantity || 1
        );


    const itemTotal =
        price * quantity;


    return `

        <div
            class="cart-item"
            data-id="${item.id}"
        >

            <img
                src="${image}"
                alt="${foodName}"
                class="cart-item-image"
                onerror="
                    this.src='https://via.placeholder.com/100?text=Food'
                "
            >


            <div class="cart-item-details">

                <h3>
                    ${escapeHTML(foodName)}
                </h3>

                <div class="cart-item-category">
                    ${escapeHTML(category)}
                </div>

                <div class="cart-item-price">
                    Rs. ${price.toFixed(2)}
                </div>

                <strong>
                    Total: Rs. ${itemTotal.toFixed(2)}
                </strong>

            </div>


            <div class="cart-item-actions">

                <div class="quantity-control">

                    <button
                        class="quantity-btn"
                        onclick="
                            updateQuantity(
                                ${item.id},
                                ${quantity - 1}
                            )
                        "
                    >
                        −
                    </button>

                    <span class="quantity-value">
                        ${quantity}
                    </span>

                    <button
                        class="quantity-btn"
                        onclick="
                            updateQuantity(
                                ${item.id},
                                ${quantity + 1}
                            )
                        "
                    >
                        +
                    </button>

                </div>


                <button
                    class="remove-btn"
                    onclick="
                        removeItem(${item.id})
                    "
                >
                    Remove
                </button>

            </div>

        </div>

    `;
}


// =========================
// UPDATE QUANTITY
// =========================

async function updateQuantity(
    cartId,
    quantity
) {

    if (quantity <= 0) {

        await removeItem(cartId);

        return;
    }


    try {

        const response = await fetch(
            `${API_URL}/cart/${cartId}`,
            {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",

                    "Authorization":
                        `Bearer ${token}`
                },

                body: JSON.stringify({
                    quantity: quantity
                })
            }
        );


        const data = await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update quantity"
            );

        }


        loadCart();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

}


// =========================
// REMOVE ITEM
// =========================

async function removeItem(cartId) {

    try {

        const response = await fetch(
            `${API_URL}/cart/${cartId}`,
            {
                method: "DELETE",

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
                "Unable to remove item"
            );

        }


        showMessage(
            "Item removed from cart.",
            "success"
        );


        loadCart();


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );

    }

}


// =========================
// CALCULATE SUMMARY
// =========================

function calculateSummary(items) {

    let subtotal = 0;


    items.forEach(item => {

        const price =
            Number(item.price || 0);

        const quantity =
            Number(item.quantity || 1);

        subtotal +=
            price * quantity;

    });


    // Delivery fee
    // Free delivery above Rs. 1000

    const deliveryFee =
        subtotal >= 1000
            ? 0
            : 50;


    const discount = 0;


    const total =
        subtotal +
        deliveryFee -
        discount;


    document.getElementById(
        "subtotal"
    ).textContent =
        `Rs. ${subtotal.toFixed(2)}`;


    document.getElementById(
        "deliveryFee"
    ).textContent =
        deliveryFee === 0
            ? "FREE"
            : `Rs. ${deliveryFee.toFixed(2)}`;


    document.getElementById(
        "discount"
    ).textContent =
        `Rs. ${discount.toFixed(2)}`;


    document.getElementById(
        "total"
    ).textContent =
        `Rs. ${total.toFixed(2)}`;

}


// =========================
// TOTAL QUANTITY
// =========================

function getTotalQuantity(items) {

    return items.reduce(
        (total, item) => {

            return total +
                Number(item.quantity || 0);

        },
        0
    );

}


// =========================
// CART COUNT
// =========================

function updateCartCount(count) {

    const cartCount =
        document.getElementById("cartCount");

    if (cartCount) {

        cartCount.textContent =
            count || 0;

    }

}


// =========================
// CHECKOUT
// =========================

function goToCheckout() {

    window.location.href =
        "/checkout";

}


// =========================
// MESSAGE
// =========================

function showMessage(
    message,
    type
) {

    const box =
        document.getElementById(
            "cartMessage"
        );


    box.innerHTML = `

        <div class="cart-message ${type}">
            ${escapeHTML(message)}
        </div>

    `;


    setTimeout(() => {

        box.innerHTML = "";

    }, 4000);

}


// =========================
// ESCAPE HTML
// =========================

function escapeHTML(value) {

    const div =
        document.createElement("div");

    div.textContent =
        value ?? "";

    return div.innerHTML;

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
// INITIALIZE
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadCart();


        const checkoutBtn =
            document.getElementById(
                "checkoutBtn"
            );


        checkoutBtn.addEventListener(
            "click",
            goToCheckout
        );


        const logoutLink =
            document.getElementById(
                "logoutLink"
            );


        if (logoutLink) {

            logoutLink.style.display =
                "inline-block";

            logoutLink.addEventListener(
                "click",
                (event) => {

                    event.preventDefault();

                    logout();

                }
            );

        }

    }
);