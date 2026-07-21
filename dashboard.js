document.addEventListener("DOMContentLoaded", function () {

  // ============================
// Load Gym Settings
// ============================

const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

// Sidebar Gym Name
const sidebarGymName = document.getElementById("sidebarGymName");
if (sidebarGymName && gymSettings.gymName) {
    sidebarGymName.textContent = gymSettings.gymName;
}

// Dashboard Hero Gym Name
const dashboardGymName = document.getElementById("dashboardGymName");
if (dashboardGymName && gymSettings.gymName) {
    dashboardGymName.textContent = gymSettings.gymName;
}

// Dashboard Hero Logo
const dashboardLogo = document.getElementById("dashboardLogo");
if (dashboardLogo) {
    dashboardLogo.src = gymSettings.logo || "images/logo.png"
}

    // Load Data
    const members = getMembers();
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const feeHistory = getFeeHistory();

    

    let activeMembers = 0;
    let expiredMembers = 0;
    let expiringSoon = 0;
    let pendingFees = 0;
    let todayCollection = 0;

    // Today's Date
    const now = new Date();

    const today =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    now.getFullYear();

    console.log("Today:", today);
console.log("Fee History:", feeHistory);

    // DD-MM-YYYY → Date Object
    function parseDate(dateString) {

    if (!dateString) return null;

    // YYYY-MM-DD format
    if (dateString.split("-")[0].length === 4) {
        return new Date(dateString + "T00:00:00");
    }

    // DD-MM-YYYY format
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day);

}

    // Active & Expired Members
    members.forEach(member => {

        if (!member.expiryDate) return;

        const expiry = parseDate(member.expiryDate);

        if (!expiry) return;

        expiry.setHours(0,0,0,0);

        const current = new Date();
        current.setHours(0,0,0,0);

        const diffDays = Math.ceil((expiry - current) / (1000 * 60 * 60 * 24));

if (diffDays < 0) {

    expiredMembers++;

} else if (diffDays <= 7) {

    expiringSoon++;
    activeMembers++;

} else {

    activeMembers++;

}

    });

    // Pending Fees
    pendingFees = expiredMembers;

    // Today's Collection
    feeHistory.forEach(record => {

       if (record.date === today) {
        todayCollection += Number(record.amount || 0);

        }

    });

    // Present Today
console.log("Today =", today);
console.log("Attendance =", attendance);
console.log("Attendance Dates =", attendance.map(x => x.date));

    const presentToday = attendance.filter(record =>
        record.date === today &&
        record.status === "Present"
    ).length;

    // Dashboard Cards
    document.getElementById("totalMembers").textContent = members.length;
    document.getElementById("presentToday").textContent = presentToday;

    if (document.getElementById("expiringSoon")) {
    document.getElementById("expiringSoon").textContent = expiringSoon;
}


// ===== Dashboard Alerts =====
    //document.getElementById("todayCollection").textContent = "₹" + todayCollection;
    //document.getElementById("pendingFees").textContent = pendingFees;

    // Summary Table
   // document.getElementById("summaryMembers").textContent = members.length;
    //document.getElementById("summaryAttendance").textContent = presentToday;
    //document.getElementById("summaryCollection").textContent = "₹" + todayCollection;
    //document.getElementById("summaryPending").textContent = pendingFees;

    // Future Cards (Optional)
    if (document.getElementById("activeMembers")) {
        document.getElementById("activeMembers").textContent = activeMembers;
    }

    if (document.getElementById("expiredMembers")) {
        document.getElementById("expiredMembers").textContent = expiredMembers;
    }

    // =====================================
    // Expiring in Next 7 Days
    // =====================================

    const expiryTable = document.getElementById("expiryAlertTable");

    if (expiryTable) {

        expiryTable.innerHTML = "";

        const todayDate = new Date();
        todayDate.setHours(0,0,0,0);

        const next7 = new Date(todayDate);
        next7.setDate(next7.getDate() + 7);

        let found = false;

        members.forEach(member => {

        console.log(member.name, member.expiryDate, parseDate(member.expiryDate));

            if (!member.expiryDate) return;

            const expiry = parseDate(member.expiryDate);

            if (!expiry) return;

            expiry.setHours(0,0,0,0);

            if (expiry >= todayDate && expiry <= next7) {

                found = true;

                expiryTable.innerHTML += `
                    <tr>
                        <td>${member.memberId}</td>
                        <td>${member.name}</td>
                        <td>${member.expiryDate}</td>
                    </tr>
                `;

            }

        });

        if (!found) {

            expiryTable.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center;color:green;">
                        ✅ No members expiring in the next 7 days
                    </td>
                </tr>
            `;

        }

    }
// ===============================
// Recent Fee Collections
// ===============================

const recentBody = document.getElementById("recentCollectionBody");

if (recentBody) {

    recentBody.innerHTML = "";

    if (feeHistory.length === 0) {

        recentBody.innerHTML = `
            <tr>
                <td colspan="3">No Collections</td>
            </tr>
        `;

    } else {

        const recent = [...feeHistory].slice(-5).reverse();

        recent.forEach(record => {

            recentBody.innerHTML += `
                <tr>
                    <td>${record.receiptNo}</td>
                    <td>${record.memberName}</td>
                    <td>₹${record.amount}</td>
                    <td>${record.time}</td>
                </tr>
            `;

        });

    }

}

});

// ===============================
// Recent Member Registrations
// ===============================

const recentMembersBody = document.getElementById("recentMembersBody");

if (recentMembersBody) {

    recentMembersBody.innerHTML = "";

    if (members.length === 0) {

        recentMembersBody.innerHTML = `
        <tr>
            <td colspan="4">No Members</td>
        </tr>
        `;

    } else {

        const recentMembers = [...members].slice(-5).reverse();

        recentMembers.forEach(member => {

            recentMembersBody.innerHTML += `
            <tr>
                <td>${member.memberId}</td>
                <td>${member.name}</td>
                <td>${member.plan}</td>
                <td>${member.joiningDate}</td>
            </tr>
            `;

        });

    }

}

// ==========================
// Greeting & Live Date Time
// ==========================

function updateGreeting() {

    const now = new Date();
    const hour = now.getHours();

    let greeting = "";
    let emoji = "";

    if (hour >= 5 && hour < 12) {
        greeting = "Good Morning";
        emoji = "🌅";
    }
    else if (hour >= 12 && hour < 17) {
        greeting = "Good Afternoon";
        emoji = "☀️";
    }
    else if (hour >= 17 && hour < 21) {
        greeting = "Good Evening";
        emoji = "🌇";
    }
    else {
        greeting = "Good Night";
        emoji = "🌙";
    }

    document.getElementById("greetingText").textContent =
        `${emoji} ${greeting}`;

    const options = {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    };

    document.getElementById("dateTimeText").textContent =
        now.toLocaleString("en-IN", options).replace(",", " •");
}

updateGreeting();

// Update every second
setInterval(updateGreeting, 1000);