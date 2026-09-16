const API_URL = "/api";

// =========================
// SHOW MESSAGE
// =========================

function showMessage(message, type = "error") {
    const messageBox = document.getElementById("authMessage");

    if (!messageBox) return;

    messageBox.textContent = message;
    messageBox.className = `auth-message ${type}`;
}


// =========================
// LOGIN
// =========================

async function login(event) {
    event.preventDefault();

    const emailInput = document.getElementById("email");
    const passwordInput = document.getElementById("password");
    const loginBtn = document.getElementById("loginBtn");

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    if (!email || !password) {
        showMessage(
            "Please enter your email and password.",
            "error"
        );
        return;
    }

    loginBtn.disabled = true;
    loginBtn.textContent = "Logging in...";

    try {
        console.log("Sending login request...");

        const response = await fetch(
            `${API_URL}/auth/login`,
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },

                body: JSON.stringify({
                    email: email,
                    password: password
                })
            }
        );

        console.log("Login status:", response.status);

        const contentType =
            response.headers.get("content-type") || "";

        let data;

        if (contentType.includes("application/json")) {
            data = await response.json();
        } else {
            const text = await response.text();

            console.error(
                "Server returned non-JSON:",
                text
            );

            throw new Error(
                "Server returned an invalid response."
            );
        }

        console.log("Login response:", data);

        // =========================
        // LOGIN FAILED
        // =========================

        if (!response.ok || !data.success) {
            throw new Error(
                data.message ||
                "Invalid email or password."
            );
        }

        // =========================
        // CHECK TOKEN
        // =========================

        if (!data.token) {
            throw new Error(
                "Login succeeded but server did not return a token."
            );
        }

        // =========================
        // SAVE LOGIN
        // =========================

        localStorage.setItem(
            "token",
            data.token
        );

        if (data.user) {
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );
        }

        console.log("Login successful");
        console.log("Token saved");


        // =========================
        // SUCCESS MESSAGE
        // =========================

        showMessage(
            "Login successful! Redirecting...",
            "success"
        );


        // =========================
        // REDIRECT
        // =========================

        const redirect =
            localStorage.getItem(
                "redirectAfterLogin"
            );

        localStorage.removeItem(
            "redirectAfterLogin"
        );

        setTimeout(() => {

            if (redirect) {
                window.location.href = redirect;
            } else {
                window.location.href = "/";
            }

        }, 700);

    } catch (error) {

        console.error(
            "Login Error:",
            error
        );

        showMessage(
            error.message ||
            "Unable to login. Please try again.",
            "error"
        );

        loginBtn.disabled = false;
        loginBtn.textContent = "Login";
    }
}


// =========================
// CHECK IF ALREADY LOGGED IN
// =========================

function checkAlreadyLoggedIn() {

    const token =
        localStorage.getItem("token");

    if (!token) {
        return;
    }

    console.log(
        "User is already logged in."
    );
}


// =========================
// START
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById("loginForm");

        if (form) {
            form.addEventListener(
                "submit",
                login
            );
        }

        checkAlreadyLoggedIn();
    }
);