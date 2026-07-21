// ======================================
// RR Technologies Gym Pro - Receipt
// ======================================

// Get Receipt Number from URL
const params = new URLSearchParams(window.location.search);
const receiptNo = params.get("receipt");

const feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];
const members = JSON.parse(localStorage.getItem("members")) || [];
const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

// ==============================
// Gym Details
// ==============================

const receiptLogo = document.getElementById("receiptLogo");

document.getElementById("gymName").textContent =
    gymSettings.gymName || "RR Technologies Gym";

document.getElementById("gymAddress").textContent =
    gymSettings.address || "";

document.getElementById("gymMobile").textContent =
    gymSettings.mobile || "";

const gymEmail = document.getElementById("gymEmail");

if (gymEmail) {
    gymEmail.textContent = gymSettings.email || "";
}

if (receiptLogo) {
    receiptLogo.src = gymSettings.logo || "images/logo.png"
}

// Find Receipt
const payment = feeHistory.find(item => item.receiptNo === receiptNo);

if (!payment) {

    alert("Receipt Not Found!");

} else {

    const member = members.find(m => m.memberId === payment.memberId);

    document.getElementById("receiptNo").textContent = payment.receiptNo;
    let receiptDate = payment.date;

if (receiptDate.includes("-")) {

    const parts = receiptDate.split("-");

    if (parts[0].length === 4) {

        receiptDate = [
            parts[2],
            parts[1],
            parts[0]
        ].join("-");

    }

}

document.getElementById("date").textContent = receiptDate;
    document.getElementById("time").textContent = payment.time;

    document.getElementById("memberId").textContent = payment.memberId;
    document.getElementById("memberName").textContent = payment.memberName;

    document.getElementById("plan").textContent =
        member ? member.plan : "-";

    const currency = gymSettings.currency || "₹";

document.getElementById("amount").textContent =
    currency + " " +
    Number(payment.amount).toLocaleString("en-IN");

    document.getElementById("mode").textContent =
        payment.mode;

    document.getElementById("joiningDate").textContent =
    member
        ? member.joiningDate.split("-").reverse().join("-")
        : "-";
    document.getElementById("expiryDate").textContent =
    member
        ? member.expiryDate.split("-").reverse().join("-")
        : "-";
}

// Auto Print after page loads
window.onload = function () {

    setTimeout(() => {
        window.print();
    }, 500);

};

function shareWhatsApp() {

    const member = members.find(m => m.memberId === payment.memberId);


    const text =
`🏋️ ${gymSettings.gymName}

🧾 Receipt No : ${payment.receiptNo}

👤 Member : ${member ? member.name : payment.memberName}

💰 Amount : ₹${payment.amount}

💳 Payment Mode : ${payment.mode}

📅 Date : ${payment.date}

🙏 Thank You!`;

    window.open(
        "https://wa.me/?text=" + encodeURIComponent(text),
        "_blank"
    );

}