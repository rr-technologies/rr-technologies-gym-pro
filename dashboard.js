document.addEventListener("DOMContentLoaded", function () {

    // ==============================
    // Load Data
    // ==============================

    const members = JSON.parse(localStorage.getItem("members")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];

    // ==============================
    // Total Members
    // ==============================

    const totalMembers = members.length;

    // ==============================
    // Today's Date
    // ==============================

    const today = new Date().toLocaleDateString();

    // ==============================
    // Present Today
    // ==============================

    let presentToday = 0;

    attendance.forEach(record => {

        if (
            record.date === today &&
            record.status === "Present"
        ) {
            presentToday++;
        }

    });

    // ==============================
    // Today's Collection
    // ==============================

    const todayCollection =
        Number(localStorage.getItem("todayCollection")) || 0;

    // ==============================
    // Pending Fees
    // ==============================

    let pendingFees = 0;

    members.forEach(member => {

        if (
            member.paymentStatus &&
            member.paymentStatus.toLowerCase() === "pending"
        ) {
            pendingFees++;
        }

    });

    // ==============================
    // Dashboard Cards
    // ==============================

    document.getElementById("totalMembers").textContent =
        totalMembers;

    document.getElementById("presentToday").textContent =
        presentToday;

    document.getElementById("todayCollection").textContent =
        "₹" + todayCollection;

    document.getElementById("pendingFees").textContent =
        pendingFees;

    // ==============================
    // Summary Table
    // ==============================

    document.getElementById("summaryMembers").textContent =
        totalMembers;

    document.getElementById("summaryAttendance").textContent =
        presentToday;

    document.getElementById("summaryCollection").textContent =
        "₹" + todayCollection;

    document.getElementById("summaryPending").textContent =
        pendingFees;

    // ==============================
    // Console Log
    // ==============================

    console.log("Dashboard Loaded Successfully");

    console.log("Total Members :", totalMembers);
    console.log("Present Today :", presentToday);
    console.log("Today's Collection :", todayCollection);
    console.log("Pending Fees :", pendingFees);

});