document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    const members = JSON.parse(localStorage.getItem("members")) || [];
    const feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];

    const reportBody = document.getElementById("reportBody");

    let totalMembers = members.length;
    let totalCollection = 0;
    let todayCollection = 0;
    let activeMembers = 0;

    const today = new Date().toISOString().split("T")[0];

    reportBody.innerHTML = "";

    feeHistory.forEach(record => {

        totalCollection += Number(record.amount);

        if (record.date === today) {
            todayCollection += Number(record.amount);
        }

        reportBody.innerHTML += `
            <tr>
                <td>${record.receiptNo}</td>
                <td>${record.memberId}</td>
                <td>${record.memberName}</td>
                <td>₹${record.amount}</td>
                <td>${record.mode}</td>
                <td>${record.date.split("-").reverse().join("-")}</td>
            </tr>
        `;
    });

    members.forEach(member => {
        if (member.status === "Active") {
            activeMembers++;
        }
    });

    document.getElementById("totalMembers").textContent = totalMembers;
    document.getElementById("totalCollection").textContent = "₹" + totalCollection;
    document.getElementById("todayCollection").textContent = "₹" + todayCollection;
    document.getElementById("activeMembers").textContent = activeMembers;

});