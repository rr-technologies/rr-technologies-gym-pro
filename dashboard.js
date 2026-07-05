document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    const members = JSON.parse(localStorage.getItem("members")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];

    let activeMembers = 0;
    let expiredMembers = 0;
    let pendingFees = 0;
    let todayCollection = 0;

    const now = new Date();

    const today =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    now.getFullYear();

    // Active & Expired Members
    members.forEach(member => {

        if (member.expiryDate) {

            const expiry = new Date(member.expiryDate);
            const current = new Date();

            expiry.setHours(0, 0, 0, 0);
            current.setHours(0, 0, 0, 0);

            if (expiry >= current) {
                activeMembers++;
            } else {
                expiredMembers++;
            }
        }

    });

    // Pending Fees = Expired Members
    pendingFees = members.filter(member => {

        if (!member.expiryDate) return false;

        const expiry = new Date(member.expiryDate);
        const current = new Date();

        expiry.setHours(0, 0, 0, 0);
        current.setHours(0, 0, 0, 0);

        return expiry < current;

    }).length;

    // Today's Collection
    feeHistory.forEach(record => {

    let recordDate = record.date;

    // Old format (YYYY-MM-DD) -> New format (DD-MM-YYYY)
    if (recordDate.split("-")[0].length === 4) {
        recordDate = recordDate.split("-").reverse().join("-");
    }

    if (recordDate === today) {
        todayCollection += Number(record.amount);
    }

});

    // Present Today
    const presentToday = attendance.filter(record => 
        record.date === today &&
        record.status === "Present"
    ).length;

    // Dashboard Cards
    document.getElementById("totalMembers").textContent = members.length;
    document.getElementById("presentToday").textContent = presentToday;
    document.getElementById("todayCollection").textContent = "₹" + todayCollection;
    document.getElementById("pendingFees").textContent = pendingFees;

    // Summary Table
    document.getElementById("summaryMembers").textContent = members.length;
    document.getElementById("summaryAttendance").textContent = presentToday;
    document.getElementById("summaryCollection").textContent = "₹" + todayCollection;
    document.getElementById("summaryPending").textContent = pendingFees;

    // Optional (Future Cards)
    if (document.getElementById("activeMembers")) {
        document.getElementById("activeMembers").textContent = activeMembers;
    }

    if (document.getElementById("expiredMembers")) {
        document.getElementById("expiredMembers").textContent = expiredMembers;
    }

});