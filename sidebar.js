document.addEventListener("DOMContentLoaded", () => {

    fetch("sidebar.html")
        .then(res => res.text())
        .then(data => {

            document.getElementById("sidebarContainer").innerHTML = data;

            loadGymSettings();

            // Active Menu
            const currentPage = window.location.pathname.split("/").pop();

            document.querySelectorAll(".sidebar a").forEach(link => {

                if (link.getAttribute("href") === currentPage) {
                    link.classList.add("active");
                }

            });

        });

});

// =========================
// Load Gym Settings
// =========================

function loadGymSettings() {

    const settings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const logo = document.getElementById("sidebarLogo");
    const name = document.getElementById("sidebarGymName");

    if (logo) {
        logo.src = settings.logo || "logo.png";
    }

    if (name) {
        name.innerHTML = (settings.gymName || "RR Technologies Gym Pro")
            .replace(" Gym Pro", "<br>Gym Pro");
    }

}

// =========================
// Global Refresh Function
// =========================

window.refreshSidebarBranding = function () {
    loadGymSettings();
};