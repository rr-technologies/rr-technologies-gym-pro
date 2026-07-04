document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("settingsForm");

    let settings = JSON.parse(localStorage.getItem("gymSettings"));

    if (settings) {
        document.getElementById("gymName").value = settings.gymName;
        document.getElementById("ownerName").value = settings.ownerName;
        document.getElementById("mobile").value = settings.mobile;
        document.getElementById("email").value = settings.email;
        document.getElementById("address").value = settings.address;
    }

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const gymSettings = {

            gymName: document.getElementById("gymName").value,
            ownerName: document.getElementById("ownerName").value,
            mobile: document.getElementById("mobile").value,
            email: document.getElementById("email").value,
            address: document.getElementById("address").value

        };

        localStorage.setItem("gymSettings", JSON.stringify(gymSettings));

        alert("Settings Saved Successfully!");

    });

});