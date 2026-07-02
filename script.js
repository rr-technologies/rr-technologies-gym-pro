const button = document.querySelector("button");

button.addEventListener("click", function () {

    const username = document.querySelector('input[type="text"]').value;
    const password = document.querySelector('input[type="password"]').value;

    if (username === "admin" && password === "1234") {
        window.location.href = "dashboard.html";
    } else {
        alert("Invalid Username or Password");
    }

});