// ======================================
// RR Technologies Gym Pro - Receipt
// ======================================

// Get Receipt Number from URL
const params = new URLSearchParams(window.location.search);
const receiptNo = params.get("receipt");

const feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];
const members = JSON.parse(localStorage.getItem("members")) || [];
const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

// Gym Details
document.getElementById("gymName").textContent =
    gymSettings.gymName || "RR Technologies Gym";

document.getElementById("gymAddress").textContent =
    gymSettings.address || "";

document.getElementById("gymMobile").textContent =
    gymSettings.mobile || "";

// Find Receipt
const payment = feeHistory.find(item => item.receiptNo === receiptNo);

if (!payment) {

    alert("Receipt Not Found!");

} else {

    const member = members.find(m => m.memberId === payment.memberId);

    document.getElementById("receiptNo").textContent = payment.receiptNo;
    document.getElementById("date").textContent = payment.date;
    document.getElementById("time").textContent = payment.time;

    document.getElementById("memberId").textContent = payment.memberId;
    document.getElementById("memberName").textContent = payment.memberName;

    document.getElementById("plan").textContent =
        member ? member.plan : "-";

    document.getElementById("amount").textContent =
        "₹" + payment.amount;

    document.getElementById("mode").textContent =
        payment.mode;

    document.getElementById("joiningDate").textContent =
        member ? member.joiningDate : "-";

    document.getElementById("expiryDate").textContent =
        member ? member.expiryDate : "-";
}