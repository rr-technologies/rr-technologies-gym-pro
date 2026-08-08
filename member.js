document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    const memberForm = document.getElementById("memberForm");

    // ===============================
// Membership Plan Change
// ===============================

const membership = document.getElementById("membership");
const customDaysContainer = document.getElementById("customDaysContainer");

membership.addEventListener("change", function () {

    if (this.value === "Custom Days") {

        customDaysContainer.style.display = "block";

    } else {

        customDaysContainer.style.display = "none";
        document.getElementById("customDays").value = "";

    }

     updateExpiryDate();

});

// ================================
// Auto Expiry Date
// ================================

const joiningDateInput = document.getElementById("joiningDate");
const expiryDateInput = document.getElementById("expiryDate");

function updateExpiryDate() {

    if (!joiningDateInput.value || !membership.value) {
        expiryDateInput.value = "";
        return;
    }

    let expiry = new Date(joiningDateInput.value);

    switch (membership.value) {

        case "1 Month":
            expiry.setMonth(expiry.getMonth() + 1);
            break;

        case "3 Months":
            expiry.setMonth(expiry.getMonth() + 3);
            break;

        case "6 Months":
            expiry.setMonth(expiry.getMonth() + 6);
            break;

        case "12 Months":
            expiry.setFullYear(expiry.getFullYear() + 1);
            break;

        default:

    if (membership.value === "Custom Days") {

        const customDays = Number(document.getElementById("customDays").value) || 0;

        expiry.setDate(expiry.getDate() + customDays);

    }

    break;

    }

    const day = String(expiry.getDate()).padStart(2, "0");
    const month = String(expiry.getMonth() + 1).padStart(2, "0");
    const year = expiry.getFullYear();

    expiryDateInput.value = `${day}-${month}-${year}`;
}

joiningDateInput.addEventListener("change", updateExpiryDate);

membership.addEventListener("change", updateExpiryDate);

document.getElementById("customDays")
    .addEventListener("input", updateExpiryDate);

// ===============================
// Payment Calculation
// ===============================

const totalFeeInput = document.getElementById("totalFee");
const advancePaidInput = document.getElementById("advancePaid");
const balanceAmountInput = document.getElementById("balanceAmount");
const balanceDueDateContainer = document.getElementById("balanceDueDateContainer");
const balanceDueDateInput = document.getElementById("balanceDueDate");

function calculateBalance() {

    const total = Number(totalFeeInput.value) || 0;
    const paid = Number(advancePaidInput.value) || 0;

    if (paid > total) {

        alert("Advance Paid cannot be greater than Total Fee.");
        advancePaidInput.value = total;

    }

    const finalPaid = Number(advancePaidInput.value) || 0;

    const balance = total - finalPaid;

    balanceAmountInput.value = balance;

    if (balance > 0) {

        balanceDueDateContainer.style.display = "block";
        balanceDueDateInput.required = true;

    } else {

        balanceDueDateContainer.style.display = "none";
        balanceDueDateInput.required = false;
        balanceDueDateInput.value = "";

    }

}

totalFeeInput.addEventListener("input", calculateBalance);
advancePaidInput.addEventListener("input", calculateBalance);

    // Generate Member ID on page load
    generateMemberId();

    // ============================
    // Generate Member ID
    // ============================
    function generateMemberId() {
        let lastId = localStorage.getItem("lastMemberId") || 1000;
        lastId = parseInt(lastId) + 1;
        document.getElementById("memberId").value = "RR" + lastId;
    }

    // ============================
    // Calculate Expiry Date
    // ============================
    function calculateExpiryDate(joiningDate, plan, customDays = 0) {

        let expiry;

const parts = joiningDate.split("-");

if (parts[0].length === 4) {
    // YYYY-MM-DD
    expiry = new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    );
    
} else {
    // DD-MM-YYYY
    expiry = new Date(
        Number(parts[2]),
        Number(parts[1]) - 1,
        Number(parts[0])
    );
}

        switch (plan) {
            case "1 Month":
                expiry.setMonth(expiry.getMonth() + 1);
                break;

            case "3 Months":
                expiry.setMonth(expiry.getMonth() + 3);
                break;

            case "6 Months":
                expiry.setMonth(expiry.getMonth() + 6);
                break;

            case "12 Months":
                expiry.setFullYear(expiry.getFullYear() + 1);
                break;

            case "Custom Days":

    expiry.setDate(expiry.getDate() + Number(customDays));
    break;

        }

        const day = String(expiry.getDate()).padStart(2, "0");
const month = String(expiry.getMonth() + 1).padStart(2, "0");
const year = expiry.getFullYear();

return `${day}-${month}-${year}`;

    }

    // ============================
    // Edit Mode
    // ============================
    const editIndex = localStorage.getItem("editMemberIndex");

    if (editIndex !== null) {

        const members = JSON.parse(localStorage.getItem("members")) || [];
        const member = members[Number(editIndex)];

        if (member) {

            document.getElementById("memberId").value = member.memberId;
            document.getElementById("fullName").value = member.name;
            document.getElementById("mobile").value = member.mobile;
            document.getElementById("age").value = member.age;
            document.getElementById("gender").value = member.gender;
            document.getElementById("membership").value = member.plan;
            document.getElementById("joiningDate").value = member.joiningDate;
            document.getElementById("totalFee").value = member.totalFee || member.fee || 0;
document.getElementById("advancePaid").value = member.paidAmount || 0;
document.getElementById("balanceAmount").value = member.balanceAmount || 0;

if ((member.balanceAmount || 0) > 0) {
    balanceDueDateContainer.style.display = "block";
    document.getElementById("balanceDueDate").value = member.balanceDueDate || "";
}
            document.getElementById("address").value = member.address;

        }

    } else {

        generateMemberId();

    }

    // ============================
    // Save Member
    // ============================
    memberForm.addEventListener("submit", function (e) {

        e.preventDefault();

        let members = JSON.parse(localStorage.getItem("members")) || [];

        const currentEditIndex =
            localStorage.getItem("editMemberIndex");

        const joiningDate =
    document.getElementById("joiningDate").value;

        const membershipPlan =
            document.getElementById("membership").value;

            const customDays =
            document.getElementById("customDays")?.value || 0;

            console.log("Plan :", membershipPlan);
            console.log("Custom Days :", customDays);

        const expiryDate =
            calculateExpiryDate(joiningDate, membershipPlan, customDays);

            console.log("Joining:", joiningDate);
console.log("Plan:", membershipPlan);
console.log("Expiry:", expiryDate);

        const member = {

    memberId: document.getElementById("memberId").value,

    name: document.getElementById("fullName").value,

    mobile: document.getElementById("mobile").value,

    age: document.getElementById("age").value,

    gender: document.getElementById("gender").value,

    plan: membershipPlan,

    customDays: customDays,

    joiningDate: joiningDate,

    expiryDate: expiryDate,

    status: getMemberStatus(expiryDate),

    totalFee: Number(document.getElementById("totalFee").value),

    fee: Number(document.getElementById("totalFee").value),

paidAmount: Number(document.getElementById("advancePaid").value),

balanceAmount: Number(document.getElementById("balanceAmount").value),

balanceDueDate: document.getElementById("balanceDueDate").value,

paymentStatus:
    Number(document.getElementById("balanceAmount").value) === 0
        ? "Paid"
        : "Partial",

    

    paymentHistory: [],


    address: document.getElementById("address").value

};
        if (currentEditIndex !== null) {

            members[Number(currentEditIndex)] = member;

            localStorage.removeItem("editMemberIndex");

            alert("✅ Member Updated Successfully!");

        } else {

            members.push(member);

            // ===============================
// Save Advance Payment History
// ===============================

if (member.paidAmount > 0) {

    let feeHistory =
        JSON.parse(localStorage.getItem("feeHistory")) || [];

    const now = new Date();

    const receiptNo = "RCPT" + Date.now();

    const payment = {

        receiptNo: receiptNo,

        memberId: member.memberId,

        memberName: member.name,

        amount: member.paidAmount,

        mode: "Cash",

        date: joiningDate,

        time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        })

    };

    member.paymentHistory.push({
    ...payment,
    type: "Registration"
});

    feeHistory.push({
    ...payment,
    type: "Registration"
});

    localStorage.setItem(
        "feeHistory",
        JSON.stringify(feeHistory)
    );

}

            localStorage.setItem("lastMemberId", document.getElementById("memberId").value.replace("RR", ""));

            const currentId =
                parseInt(member.memberId.replace("RR", ""));

            localStorage.setItem("lastMemberId", currentId);

            alert("✅ Member Registered Successfully!");

        }

        localStorage.setItem("members", JSON.stringify(members));

        window.location.href = "members-list.html";

    });

});

function getMemberStatus(expiryDate) {

    const today = new Date();
    const expiry = new Date(expiryDate);

    // Time difference in days
    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return "Expired";
    } else if (diffDays <= 5) {
        return "Expiring Soon";
    } else {
        return "Active";
    }
}