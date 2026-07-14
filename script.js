/* ==========================================
   RR Technologies Gym Pro
   Premium Login Script
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("loginForm");
    const username = document.getElementById("username");
    const password = document.getElementById("password");

    const togglePassword = document.getElementById("togglePassword");

    /* =========================
       Show / Hide Password
    ========================== */

    togglePassword.addEventListener("click", () => {

        if (password.type === "password") {

            password.type = "text";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye-slash"></i>';

        } else {

            password.type = "password";

            togglePassword.innerHTML =
                '<i class="fa-solid fa-eye"></i>';
        }

    });

    /* =========================
       Remember Username
    ========================== */

    const savedUser = localStorage.getItem("rememberUser");

    if (savedUser) {

        username.value = savedUser;

        document.querySelector(".remember-row input").checked = true;

    }

    /* =========================
       Login
    ========================== */

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const user = username.value.trim();

        const pass = password.value.trim();

        if (user === "") {

            alert("Please enter Username");

            username.focus();

            return;
        }

        if (pass === "") {

            alert("Please enter Password");

            password.focus();

            return;
        }

        /* Demo Login */

        if (user === "admin" && pass === "admin123") {

            const remember =
                document.querySelector(".remember-row input");

            if (remember.checked) {

                localStorage.setItem("rememberUser", user);

            } else {

                localStorage.removeItem("rememberUser");

            }

            const btn = document.querySelector(".login-btn");

            btn.innerHTML =
                '<i class="fa-solid fa-spinner fa-spin"></i> Logging in...';

            btn.disabled = true;

            setTimeout(() => {

                window.location.href = "dashboard.html";

            }, 1200);

        }

        else {

            alert("Invalid Username or Password");

            password.value = "";

            password.focus();

        }

    });

});