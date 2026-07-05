document.addEventListener("DOMContentLoaded", function () {

    const members = JSON.parse(localStorage.getItem("members")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];

    let activeMembers = 0;
    let expiredMembers = 0;
    let pendingFees = 0;
    let todayCollection = 0;

    const today = new Date().toISOString().split("T")[0];

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

        if (record.date === today) {
            todayCollection += Number(record.amount);
        }

    });

    // Present Today
    const presentToday = attendance.filter(record => {
        return record.date === today;
    }).length;

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