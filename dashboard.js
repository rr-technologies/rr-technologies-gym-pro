function openPage(page) {
    window.location.href = page;
}

document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // Load Members
    // ==========================
    let members = JSON.parse(localStorage.getItem("members")) || [];

    // Total Members
    document.getElementById("totalMembers").innerText = members.length;

    // ==========================
    // Today's Collection
    // ==========================
    let totalCollection = 0;

    members.forEach(member => {
        totalCollection += Number(member.fee || 0);
    });

    document.getElementById("todayCollection").innerText =
        "₹" + totalCollection.toLocaleString();

    // ==========================
    // Expiring Members (Next 7 Days)
    // ==========================
    let expiring = 0;
    let today = new Date();

    members.forEach(member => {

        if (!member.joiningDate) return;

        let joinDate = new Date(member.joiningDate);

        let months = 1;

        if (member.plan === "3 Months") {
            months = 3;
        } else if (member.plan === "6 Months") {
            months = 6;
        } else if (member.plan === "12 Months") {
            months = 12;
        }

        let expiry = new Date(joinDate);
        expiry.setMonth(expiry.getMonth() + months);

        let diff = (expiry - today) / (1000 * 60 * 60 * 24);

        if (diff >= 0 && diff <= 7) {
            expiring++;
        }

    });

    document.getElementById("expiringMembers").innerText = expiring;

    // ==========================
    // Today's Attendance
    // ==========================
    let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

    let todayDate = new Date().toLocaleDateString("en-GB");

    let todayPresent = attendance.filter(item =>
        item.date === todayDate &&
        item.status === "Present"
    ).length;

    document.getElementById("attendanceCount").innerText = todayPresent;

});