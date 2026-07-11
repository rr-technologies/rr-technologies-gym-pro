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

    // ===========================
// Load Logo Preview
// ===========================

const logoInput = document.getElementById("gymLogo");
const logoPreview = document.getElementById("logoPreview");

if (settings.logo) {
    logoPreview.src = settings.logo;
}

logoInput.addEventListener("change", function () {

    const file = this.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function (e) {
        logoPreview.src = e.target.result;
    };

    reader.readAsDataURL(file);

});

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
    currency: document.getElementById("currency").value,

    // Old logo ni preserve cheyyi
    logo: settings.logo || ""

};

        const file = logoInput.files[0];

if (file) {

    const reader = new FileReader();

    reader.onload = function (e) {

        gymSettings.logo = e.target.result;

        localStorage.setItem("gymSettings", JSON.stringify(gymSettings));

        document.getElementById("sidebarGymName").textContent = gymSettings.gymName;

        const sidebarLogo = document.getElementById("sidebarLogo");
        if (sidebarLogo) {
            sidebarLogo.src = gymSettings.logo;
        }

        alert("✅ Settings Saved Successfully!");

    };

    reader.readAsDataURL(file);

} else {

    localStorage.setItem("gymSettings", JSON.stringify(gymSettings));

    document.getElementById("sidebarGymName").textContent = gymSettings.gymName;

    const sidebarLogo = document.getElementById("sidebarLogo");
    if (sidebarLogo) {
        sidebarLogo.src = gymSettings.logo || "logo.png";
    }

    
}

      
    });

});

// ===========================
// Backup Data
// ===========================

document.getElementById("backupBtn").addEventListener("click", function () {

    const backupData = {

        members: JSON.parse(localStorage.getItem("members")) || [],

        feeHistory: JSON.parse(localStorage.getItem("feeHistory")) || [],

        attendance: JSON.parse(localStorage.getItem("attendance")) || [],

        gymSettings: JSON.parse(localStorage.getItem("gymSettings")) || {},

        lastMemberId: localStorage.getItem("lastMemberId") || "1000"

    };

    const dataStr = JSON.stringify(backupData, null, 2);

    const blob = new Blob([dataStr], {
        type: "application/json"
    });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    const today = new Date();

    const fileName =
        "RR_Gym_Backup_" +
        today.getDate().toString().padStart(2, "0") + "-" +
        (today.getMonth() + 1).toString().padStart(2, "0") + "-" +
        today.getFullYear() +
        ".json";

    a.href = url;

    a.download = fileName;

    a.click();

    URL.revokeObjectURL(url);

    alert("Backup Downloaded Successfully!");

});

// ===========================
// Restore Data
// ===========================

document.getElementById("restoreBtn").addEventListener("click", function () {

    const file = document.getElementById("restoreFile").files[0];

    if (!file) {
        alert("Please select a backup file.");
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        try {

            const backup = JSON.parse(e.target.result);

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
                "lastMemberId",
                backup.lastMemberId || "1000"
            );

            alert("Data Restored Successfully!");

            location.reload();

        } catch (err) {

            alert("Invalid Backup File!");

        }

    };

    reader.readAsText(file);

});