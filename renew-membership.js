// =======================================
// RR Technologies Gym Pro
// Renew Membership
// =======================================

document.addEventListener("DOMContentLoaded", function () {

    const members = JSON.parse(localStorage.getItem("members")) || [];

    const renewMemberId = localStorage.getItem("renewMemberId");

    if (!renewMemberId) {

        alert("No Member Selected.");

        window.location.href = "members-list.html";

        return;

    }

    const member = members.find(m => m.memberId === renewMemberId);

    if (!member) {

        alert("Member Not Found.");

        window.location.href = "members-list.html";

        return;

    }

    // ===========================
    // Member Details
    // ===========================

    document.getElementById("memberId").value = member.memberId;

    document.getElementById("memberName").value = member.name;

    document.getElementById("memberMobile").value = member.mobile;

    document.getElementById("currentPlan").value = member.plan;

    document.getElementById("currentExpiry").value =
        formatDate(member.expiryDate);

    document.getElementById("memberStatus").value =
        member.status || "Active";

        // ===========================
       // Renew Plan Change
      // ===========================


        const renewPlan = document.getElementById("renewPlan");

        renewPlan.addEventListener("change", calculateNewExpiry);

});

// ===========================
// Calculate New Expiry
// ===========================

function calculateNewExpiry() {

    const currentExpiry = document.getElementById("currentExpiry").value;

    const renewPlan = document.getElementById("renewPlan").value;

    if (!currentExpiry || !renewPlan) {

        document.getElementById("newExpiry").value = "";

        return;

    }

    const parts = currentExpiry.split("-");

    const expiry = new Date(
        parts[2],
        parts[1] - 1,
        parts[0]
    );

    switch (renewPlan) {

        case "1":
            expiry.setMonth(expiry.getMonth() + 1);
            break;

        case "3":
            expiry.setMonth(expiry.getMonth() + 3);
            break;

        case "6":
            expiry.setMonth(expiry.getMonth() + 6);
            break;

        case "12":
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;

    }

    const day = String(expiry.getDate()).padStart(2, "0");
    const month = String(expiry.getMonth() + 1).padStart(2, "0");
    const year = expiry.getFullYear();

    document.getElementById("newExpiry").value =
        `${day}-${month}-${year}`;

}

// ===========================
// Save Renewal
// ===========================

document.getElementById("renewBtn").addEventListener("click", saveRenewal);

function saveRenewal() {

    const renewMemberId = localStorage.getItem("renewMemberId");

    const renewPlan = document.getElementById("renewPlan").value;

    const planText =
document.getElementById("renewPlan").selectedOptions[0].text;

    const renewalFee = document.getElementById("renewFee").value.trim();

    const paymentMode = document.getElementById("paymentMode").value;

    const remarks = document.getElementById("remarks").value.trim();

    const newExpiry = document.getElementById("newExpiry").value;

    if (!renewPlan) {

        alert("Please Select Renewal Plan");

        return;

    }

    if (!renewalFee || Number(renewalFee) <= 0) {

        alert("Please Enter Renewal Fee");

        return;

    }

    if (!paymentMode) {

        alert("Please Select Payment Mode");

        return;

    }

    if (!newExpiry) {

        alert("New Expiry Date Not Generated");

        return;

    }

    // ===========================
// Update Member
// ===========================

const members = JSON.parse(localStorage.getItem("members")) || [];

const index = members.findIndex(m => m.memberId === renewMemberId);

if (index !== -1) {

    members[index].plan = planText;

    members[index].fee = Number(renewalFee);

members[index].totalFee = Number(renewalFee);

    const parts = newExpiry.split("-");

members[index].expiryDate =
`${parts[2]}-${parts[1]}-${parts[0]}`;

    members[index].status = "Active";

    members[index].paymentStatus = "Paid";

members[index].lastPaymentDate = new Date().toISOString().split("T")[0];

    localStorage.setItem("members", JSON.stringify(members));

    console.log(members[index]);

}

    alert("Renewal Saved Successfully!");

window.location.href = "members-list.html";

}