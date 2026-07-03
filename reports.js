document.addEventListener("DOMContentLoaded", function () {

    // Load Members
    let members = JSON.parse(localStorage.getItem("members")) || [];

    // Load Attendance
    let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

    // Total Members
    document.getElementById("totalMembers").textContent = members.length;

    // Present Members
    let present = attendance.filter(member => member.status === "Present").length;
    document.getElementById("presentMembers").textContent = present;

    // Absent Members
    let absent = members.length - present;
    document.getElementById("absentMembers").textContent = absent;

    // Total Fees
    let totalFees = 0;

    members.forEach(member => {
        totalFees += Number(member.fee) || 0;
    });

    document.getElementById("totalFees").textContent = "₹" + totalFees;

});