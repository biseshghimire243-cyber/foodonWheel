// frontend/js/auth.js

const API_URL = "/api";


// =========================
// SHOW MESSAGE
// =========================

function showRegisterMessage(message, type) {

    const box =
        document.getElementById(
            "registerMessage"
        );

    if (!box) {
        return;
    }

    box.textContent = message;

    box.className =
        `form-message ${type}`;
}


// =========================
// PASSWORD VISIBILITY
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        document
            .querySelectorAll(".toggle-password")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    () => {

                        const targetId =
                            button.dataset.target;

                        const input =
                            document.getElementById(
                                targetId
                            );

                        if (!input) {
                            return;
                        }

                        if (
                            input.type ===
                            "password"
                        ) {

                            input.type =
                                "text";

                            button.textContent =
                                "🙈";

                        } else {

                            input.type =
                                "password";

                            button.textContent =
                                "👁️";
                        }

                    }
                );

            });


        // =========================
        // PASSWORD STRENGTH
        // =========================

        const password =
            document.getElementById(
                "password"
            );

        const strengthBar =
            document.getElementById(
                "passwordStrengthBar"
            );


        if (password && strengthBar) {

            password.addEventListener(
                "input",
                () => {

                    const value =
                        password.value;

                    let strength = 0;

                    if (value.length >= 6) {
                        strength++;
                    }

                    if (value.length >= 10) {
                        strength++;
                    }

                    if (
                        /[A-Z]/.test(value)
                    ) {
                        strength++;
                    }

                    if (
                        /[0-9]/.test(value)
                    ) {
                        strength++;
                    }

                    if (
                        /[^A-Za-z0-9]/.test(value)
                    ) {
                        strength++;
                    }


                    const width =
                        strength * 20;

                    strengthBar.style.width =
                        `${width}%`;

                }
            );

        }

    }
);


// =========================
// REGISTER
// =========================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const form =
            document.getElementById(
                "registerForm"
            );

        if (!form) {
            return;
        }


        form.addEventListener(
            "submit",
            async (event) => {

                event.preventDefault();


                const full_name =
                    document
                        .getElementById("fullName")
                        .value
                        .trim();


                const email =
                    document
                        .getElementById("email")
                        .value
                        .trim();


                const phone =
                    document
                        .getElementById("phone")
                        .value
                        .trim();


                const password =
                    document
                        .getElementById("password")
                        .value;


                const confirmPassword =
                    document
                        .getElementById(
                            "confirmPassword"
                        )
                        .value;


                const address =
                    document
                        .getElementById("address")
                        .value
                        .trim();


                const registerBtn =
                    document.getElementById(
                        "registerBtn"
                    );


                // =========================
                // VALIDATION
                // =========================

                if (!full_name) {

                    showRegisterMessage(
                        "Please enter your full name.",
                        "error"
                    );

                    return;
                }


                if (!email) {

                    showRegisterMessage(
                        "Please enter your email address.",
                        "error"
                    );

                    return;
                }


                if (password.length < 6) {

                    showRegisterMessage(
                        "Password must contain at least 6 characters.",
                        "error"
                    );

                    return;
                }


                if (
                    password !==
                    confirmPassword
                ) {

                    showRegisterMessage(
                        "Passwords do not match.",
                        "error"
                    );

                    return;
                }


                if (
                    phone &&
                    !/^[0-9]{10}$/.test(phone)
                ) {

                    showRegisterMessage(
                        "Please enter a valid 10-digit phone number.",
                        "error"
                    );

                    return;
                }


                // =========================
                // DISABLE BUTTON
                // =========================

                registerBtn.disabled = true;

                registerBtn.textContent =
                    "Creating Account...";


                try {

                    const response =
                        await fetch(
                            `${API_URL}/auth/register`,
                            {
                                method: "POST",

                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },

                                body:
                                    JSON.stringify({
                                        full_name,
                                        email,
                                        password,
                                        phone,
                                        address
                                    })
                            }
                        );


                    const data =
                        await response.json();


                    // =========================
                    // ERROR
                    // =========================

                    if (!response.ok) {

                        showRegisterMessage(
                            data.message ||
                            "Registration failed.",
                            "error"
                        );

                        registerBtn.disabled =
                            false;

                        registerBtn.textContent =
                            "Create Account";

                        return;
                    }


                    // =========================
                    // SUCCESS
                    // =========================

                    showRegisterMessage(
                        "Registration successful! Redirecting to login...",
                        "success"
                    );


                    form.reset();


                    setTimeout(
                        () => {

                            window.location.href =
                                `/login?registered=true&email=${encodeURIComponent(email)}`;

                        },
                        1200
                    );


                } catch (error) {

                    console.error(
                        "Registration Error:",
                        error
                    );


                    showRegisterMessage(
                        "Unable to connect to the server. Please try again.",
                        "error"
                    );


                    registerBtn.disabled =
                        false;

                    registerBtn.textContent =
                        "Create Account";

                }

            }
        );

    }
);