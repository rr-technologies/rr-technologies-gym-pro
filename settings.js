document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    const form = document.getElementById("settingsForm");

    // Load saved settings
    const settings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    document.getElementById("gymName").value = settings.gymName || "";
    document.getElementById("ownerName").value = settings.ownerName || "";
    document.getElementById("mobile").value = settings.mobile || "";
    document.getElementById("email").value = settings.email || "";
    document.getElementById("address").value = settings.address || "";
    document.getElementById("receiptPrefix").value = settings.receiptPrefix || "RCPT";
    document.getElementById("currency").value = settings.currency || "₹";

    // Save Settings
    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const gymSettings = {

            gymName: document.getElementById("gymName").value.trim(),
            ownerName: document.getElementById("ownerName").value.trim(),
            mobile: document.getElementById("mobile").value.trim(),
            email: document.getElementById("email").value.trim(),
            address: document.getElementById("address").value.trim(),
            receiptPrefix: document.getElementById("receiptPrefix").value.trim(),
            currency: document.getElementById("currency").value

        };

        localStorage.setItem("gymSettings", JSON.stringify(gymSettings));

        alert("✅ Settings Saved Successfully!");

    });

});