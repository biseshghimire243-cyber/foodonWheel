const API_URL = "/api";


// =========================
// SHOW MESSAGE
// =========================

function showMessage(message, type = "error") {

    const messageBox =
        document.getElementById("authMessage");

    if (!messageBox) return;

    messageBox.textContent = message;

    messageBox.className =
        `auth-message ${type}`;
}


// =========================
// LOGIN
// =========================

async function login(event) {

    event.preventDefault();

    const email =
        document.getElementById("email")
            .value
            .trim();

    const password =
        document.getElementById("password")
            .value;

    const loginBtn =
        document.getElementById("loginBtn");

    if (!email || !password) {

        showMessage(
            "Email and password are required.",
            "error"
        );

        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {

        const response =
            await fetch(
                `${API_URL}/auth/login`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        password
                    })
                }
            );

        const data =
            await response.json();

        if (!response.ok) {

            throw new Error(
                data.message ||
                "Invalid email or password"
            );
        }

        localStorage.setItem(
            "token",
            data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(data.user)
        );

        showMessage(
            "Login successful! Redirecting...",
            "success"
        );

        const redirect =
            localStorage.getItem(
                "redirectAfterLogin"
            );

        localStorage.removeItem(
            "redirectAfterLogin"
        );

        setTimeout(() => {

            window.location.href =
                redirect || "/";

        }, 500);

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to login.",
            "error"
        );

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
}


// =========================
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "loginForm"
            );

        if (form) {

            form.addEventListener(
                "submit",
                login
            );
        }

    }
);