const API_URL = "/api";


// =========================
// AUTH
// =========================

function checkLogin() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        localStorage.setItem(
    "redirectAfterLogin",
    window.location.pathname
);

        window.location.href =
            "/login";

        return false;
    }

    return true;
}


// =========================
// LOAD ORDERS
// =========================

async function loadOrders() {

    const container =
        document.getElementById(
            "ordersContainer"
        );

    const token =
        localStorage.getItem("token");


    try {

        const response =
            await fetch(
                `${API_URL}/orders`,
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
                "Unable to load orders"
            );
        }


        if (
            !data.orders ||
            data.orders.length === 0
        ) {

            container.innerHTML = `

                <div class="empty-orders">

                    <div>
                        🛍️
                    </div>

                    <h2>
                        No Orders Yet
                    </h2>

                    <p>
                        You haven't placed any orders yet.
                    </p>

                    <a
                        href="/menu"
                        class="primary-btn"
                    >
                        Explore Menu
                    </a>

                </div>

            `;

            return;
        }


        container.innerHTML =
            data.orders
                .map(order =>
                    createOrderCard(order)
                )
                .join("");


    } catch (error) {

        console.error(error);

        container.innerHTML = `

            <div class="empty-orders">

                <div>
                    ⚠️
                </div>

                <h2>
                    Unable to load orders
                </h2>

                <p>
                    ${error.message}
                </p>

            </div>

        `;
    }
}


// =========================
// ORDER CARD
// =========================

function createOrderCard(order) {

    const status =
        order.order_status || "pending";


    const date =
        new Date(
            order.created_at
        ).toLocaleString();


    return `

        <div class="order-card">

            <div class="order-top">

                <div>

                    <div class="order-number">
                        Order #${order.id}
                    </div>

                    <div class="order-date">
                        ${date}
                    </div>

                </div>


                <span
                    class="status status-${status}"
                >
                    ${status.replaceAll("_", " ")}
                </span>

            </div>


            <div class="order-body">

                <div class="order-info">

                    <div class="info-box">

                        <span>
                            Payment
                        </span>

                        <strong>
                            ${order.payment_method
                                .replaceAll("_", " ")}
                        </strong>

                    </div>


                    <div class="info-box">

                        <span>
                            Payment Status
                        </span>

                        <strong>
                            ${order.payment_status}
                        </strong>

                    </div>


                    <div class="info-box">

                        <span>
                            Delivery
                        </span>

                        <strong>
                            ${order.delivery_address}
                        </strong>

                    </div>

                </div>


                <div class="order-footer">

                    <div>

                        <span>
                            Total
                        </span>

                        <div class="order-total">
                            Rs. ${Number(
                                order.total_amount
                            ).toFixed(0)}
                        </div>

                    </div>


                    <button
                        class="view-order-btn"
                        onclick="viewOrder(${order.id})"
                    >
                        View Details →
                    </button>

                </div>

            </div>

        </div>

    `;
}


// =========================
// VIEW ORDER
// =========================

function viewOrder(id) {

    window.location.href =
        `/checkout?order=${id}`;
}


// =========================
// CART COUNT
// =========================

async function updateCartCount() {

    const token =
        localStorage.getItem("token");

    if (!token) return;


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

            document.getElementById(
                "cartCount"
            ).textContent =
                data.cart.itemCount;
        }

    } catch (error) {

        console.error(error);
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
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!checkLogin()) return;

        loadOrders();

        updateCartCount();

        const logoutBtn =
            document.getElementById(
                "logoutBtn"
            );

        logoutBtn.style.display =
            "block";

        document
            .getElementById("loginBtn")
            .style.display =
            "none";

        logoutBtn.addEventListener(
            "click",
            logout
        );

    }
);