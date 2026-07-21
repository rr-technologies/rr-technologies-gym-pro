// =============================================
// RR Technologies Gym Pro
// Settings Module (Clean Version)
// Part 1
// =============================================

document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // DOM Elements
    // ==========================

    const form = document.getElementById("settingsForm");

    const gymName = document.getElementById("gymName");
    const ownerName = document.getElementById("ownerName");
    const mobile = document.getElementById("mobile");
    const email = document.getElementById("email");
    const address = document.getElementById("address");
    const receiptPrefix = document.getElementById("receiptPrefix");
    const currency = document.getElementById("currency");

    const logoInput = document.getElementById("gymLogo");
    const logoPreview = document.getElementById("logoPreview");



    // ==========================
    // Default Settings
    // ==========================

    const defaultSettings = {

        gymName: "RR Technologies Gym Pro",

        ownerName: "",

        mobile: "",

        email: "",

        address: "",

        receiptPrefix: "RCPT",

        currency: "₹",

        logo: "images/logo.png"

    };

    let settings = {
        ...defaultSettings,
        ...(JSON.parse(localStorage.getItem("gymSettings")) || {})
    };

    // ==========================
    // Apply Branding
    // ==========================

    function updateBranding(data) {

    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebarGymName = document.getElementById("sidebarGymName");

    if (logoPreview) {
        logoPreview.src = data.logo || "logo.png";
    }

    if (sidebarLogo) {
        sidebarLogo.src = data.logo || "logo.png";
    }
    

    if (sidebarGymName) {

        sidebarGymName.innerHTML =
            (data.gymName || "RR Technologies Gym Pro")
                .replace(" Gym Pro", "<br>Gym Pro");
    }

}


        // ==========================
    // Load Settings
    // ==========================

    function loadSettings() {

        gymName.value = settings.gymName;
        ownerName.value = settings.ownerName;
        mobile.value = settings.mobile;
        email.value = settings.email;
        address.value = settings.address;
        receiptPrefix.value = settings.receiptPrefix;
        currency.value = settings.currency;

        updateBranding(settings);

        if (window.refreshSidebarBranding) {
    window.refreshSidebarBranding();
}

    }

    loadSettings();

    // ==========================
    // Logo Preview
    // ==========================

    logoInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            settings.logo = e.target.result;

            logoPreview.src = settings.logo;

        };

        reader.readAsDataURL(file);

    });

    // ==========================
    // Save Settings
    // ==========================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        settings.gymName = gymName.value.trim();
        settings.ownerName = ownerName.value.trim();
        settings.mobile = mobile.value.trim();
        settings.email = email.value.trim();
        settings.address = address.value.trim();
        settings.receiptPrefix = receiptPrefix.value.trim();
        settings.currency = currency.value;

        localStorage.setItem(
            "gymSettings",
            JSON.stringify(settings)
        );

        updateBranding(settings);

    

// Sidebar load complete ayina tarvata malli update cheyyi
setTimeout(() => {
    updateBranding(settings);
}, 200);

alert("✅ Settings Saved Successfully!");

    });

        // ==========================
    // Reset Form
    // ==========================

    form.addEventListener("reset", function () {

        setTimeout(() => {

            settings = { ...defaultSettings };

            loadSettings();

        }, 0);

    });

}); // DOMContentLoaded End


// ==========================
// Backup Data
// ==========================

document.getElementById("backupBtn").addEventListener("click", function () {

    const backupData = {

        version: "1.0",

        backupDate: new Date().toLocaleString(),

        members: JSON.parse(localStorage.getItem("members")) || [],

        feeHistory: JSON.parse(localStorage.getItem("feeHistory")) || [],

        attendance: JSON.parse(localStorage.getItem("attendance")) || [],

        gymSettings: JSON.parse(localStorage.getItem("gymSettings")) || {},

        todayCollection: JSON.parse(localStorage.getItem("todayCollection")) || 0,

        lastMemberId: localStorage.getItem("lastMemberId") || "1000"

    };

    const blob = new Blob(
        [JSON.stringify(backupData, null, 2)],
        {
            type: "application/json"
        }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    const now = new Date();

    const fileName =
        "RR Technologies Gym Pro Backup " +
        now.getDate().toString().padStart(2, "0") + "-" +
        (now.getMonth() + 1).toString().padStart(2, "0") + "-" +
        now.getFullYear() + " " +
        now.getHours().toString().padStart(2, "0") + "-" +
        now.getMinutes().toString().padStart(2, "0") +
        ".json";

    a.href = url;
    a.download = fileName;

    a.click();

    URL.revokeObjectURL(url);

    alert("✅ Backup Downloaded Successfully!");


});

// ==========================
// Restore Data
// ==========================

document.getElementById("restoreBtn").addEventListener("click", function () {

    const file = document.getElementById("restoreFile").files[0];

    if (!file) {
        alert("⚠ Please select a backup file.");
        return;
    }

    if (!confirm("Restore backup?\n\nCurrent data will be replaced.")) {
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const backup = JSON.parse(e.target.result);

            if (!backup.version) {
                alert("❌ Invalid Gym Pro Backup File!");
                return;
            }

            localStorage.setItem(
                "members",
                JSON.stringify(backup.members || [])
            );

            localStorage.setItem(
                "feeHistory",
                JSON.stringify(backup.feeHistory || [])
            );

            localStorage.setItem(
                "attendance",
                JSON.stringify(backup.attendance || [])
            );

            localStorage.setItem(
                "gymSettings",
                JSON.stringify(backup.gymSettings || {})
            );

            localStorage.setItem(
                "todayCollection",
                JSON.stringify(backup.todayCollection || 0)
            );

            localStorage.setItem(
                "lastMemberId",
                backup.lastMemberId || "1000"
            );

            alert("✅ Backup Restored Successfully!\n\nApplication will reload now.");

            location.reload();

        } catch (error) {

            console.error(error);

            alert("❌ Invalid or Corrupted Backup File!");

        }

    };

    reader.readAsText(file);

});