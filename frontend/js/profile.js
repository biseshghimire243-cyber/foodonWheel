const API_URL = "/api";


// =========================
// CHECK LOGIN
// =========================

const token =
    localStorage.getItem("token");

if (!token) {
    window.location.href = "/login";
}


// =========================
// LOAD PROFILE
// =========================

async function loadProfile() {

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

            localStorage.removeItem("token");
            localStorage.removeItem("user");

            window.location.href =
                "/login";

            return;
        }


        const user =
            data.user;


        document.getElementById(
            "fullName"
        ).value =
            user.full_name || "";


        document.getElementById(
            "email"
        ).value =
            user.email || "";


        document.getElementById(
            "phone"
        ).value =
            user.phone || "";


        document.getElementById(
            "address"
        ).value =
            user.address || "";


        document.getElementById(
            "role"
        ).value =
            user.role || "customer";


        document.getElementById(
            "sidebarName"
        ).textContent =
            user.full_name;


        document.getElementById(
            "sidebarEmail"
        ).textContent =
            user.email;


        document.getElementById(
            "sidebarRole"
        ).textContent =
            user.role;


        if (user.created_at) {

            document.getElementById(
                "createdAt"
            ).value =
                new Date(
                    user.created_at
                ).toLocaleDateString();

        }


    } catch (error) {

        console.error(error);

        showMessage(
            "Unable to load profile.",
            "error"
        );
    }
}


// =========================
// SAVE PROFILE
// =========================

async function saveProfile() {

    const full_name =
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


    if (!full_name) {

        showMessage(
            "Full name is required.",
            "error"
        );

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/users/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        "Authorization":
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        full_name,
                        phone,
                        address
                    })
                }
            );


        const data =
            await response.json();


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to update profile"
            );
        }


        showMessage(
            "Profile updated successfully!",
            "success"
        );


        document.getElementById(
            "sidebarName"
        ).textContent =
            full_name;


        const storedUser =
            JSON.parse(
                localStorage.getItem("user") ||
                "{}"
            );


        localStorage.setItem(
            "user",
            JSON.stringify({
                ...storedUser,
                full_name,
                phone,
                address
            })
        );


    } catch (error) {

        console.error(error);

        showMessage(
            error.message,
            "error"
        );
    }
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
            "profileMessage"
        );

    box.textContent =
        message;

    box.className =
        `profile-message ${type}`;

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
// CART COUNT
// =========================

async function updateCartCount() {

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
// EVENTS
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        loadProfile();

        updateCartCount();


        document
            .getElementById("saveBtn")
            .addEventListener(
                "click",
                saveProfile
            );


        document
            .getElementById("logoutBtn")
            .addEventListener(
                "click",
                logout
            );


        document
            .getElementById("logoutTop")
            .addEventListener(
                "click",
                logout
            );

    }
);