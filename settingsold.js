document.addEventListener("DOMContentLoaded", function () {

    // ===========================
    // DOM Elements
    // ===========================

    const saveBtn = document.getElementById("saveTopBtn");

    const logoInput = document.getElementById("gymLogo");
    const logoPreview = document.getElementById("logoPreview");

    const sidebarLogo = document.getElementById("sidebarLogo");
    const sidebarGymName = document.getElementById("sidebarGymName");

    // ===========================
    // Load Saved Settings
    // ===========================

    const settings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    document.getElementById("gymName").value = settings.gymName || "";
    document.getElementById("ownerName").value = settings.ownerName || "";
    document.getElementById("mobile").value = settings.mobile || "";
    document.getElementById("email").value = settings.email || "";
    document.getElementById("address").value = settings.address || "";
    document.getElementById("receiptPrefix").value = settings.receiptPrefix || "RCPT";
    document.getElementById("currency").value = settings.currency || "₹";

    // ===========================
    // Load Logo
    // ===========================

    if (settings.logo) {

        logoPreview.src = settings.logo;

        if (sidebarLogo) {
            sidebarLogo.src = settings.logo;
        }

    } else {

        logoPreview.src = "logo.png";

        if (sidebarLogo) {
            sidebarLogo.src = "logo.png";
        }

    }

    // ===========================
    // Load Gym Name
    // ===========================

    if (sidebarGymName) {

        sidebarGymName.innerHTML =
            (settings.gymName || "RR Technologies Gym Pro")
            .replace(" Gym Pro", "<br>Gym Pro");

    }

    // ===========================
    // Preview Selected Logo
    // ===========================

    logoInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            logoPreview.src = e.target.result;

        };

        reader.readAsDataURL(file);

    });

    // ===========================
    // Save Settings
    // ===========================

    saveBtn.addEventListener("click", function () {

       
        const gymSettings = {

            gymName: document.getElementById("gymName").value.trim(),

            ownerName: document.getElementById("ownerName").value.trim(),

            mobile: document.getElementById("mobile").value.trim(),

            email: document.getElementById("email").value.trim(),

            address: document.getElementById("address").value.trim(),

            receiptPrefix: document.getElementById("receiptPrefix").value.trim(),

            currency: document.getElementById("currency").value,

            logo: settings.logo || ""

        };

        const file = logoInput.files[0];

        if (file) {

            const reader = new FileReader();

            reader.onload = function (e) {

                gymSettings.logo = e.target.result;

                localStorage.setItem(
                    "gymSettings",
                    JSON.stringify(gymSettings)
                );

                if (sidebarLogo) {
                    sidebarLogo.src = gymSettings.logo;
                }

                if (sidebarGymName) {

                    sidebarGymName.innerHTML =
                        gymSettings.gymName.replace(
                            " Gym Pro",
                            "<br>Gym Pro"
                        );

                }

                logoPreview.src = gymSettings.logo;

                alert("✅ Settings Saved Successfully!");

            };

            reader.readAsDataURL(file);

        } else {

            localStorage.setItem(
                "gymSettings",
                JSON.stringify(gymSettings)
            );

            const heroGymName = document.getElementById("heroGymName");

if (heroGymName) {
    heroGymName.textContent = gymSettings.gymName;
}

            if (sidebarGymName) {

                sidebarGymName.innerHTML =
                    gymSettings.gymName.replace(
                        " Gym Pro",
                        "<br>Gym Pro"
                    );

            }

            if (sidebarLogo) {

                sidebarLogo.src =
                    gymSettings.logo || "logo.png";

            }

            alert("✅ Settings Saved Successfully!");

        }

    });

});

// ===========================
// Backup Data
// ===========================

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


// ===========================
// Restore Data
// ===========================

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

            alert(
                "✅ Backup Restored Successfully!\n\nApplication will reload now."
            );

            location.reload();

        }

        catch (error) {

            console.error(error);

            alert("❌ Invalid or Corrupted Backup File!");

        }

    };

    reader.readAsText(file);

});