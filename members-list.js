document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    
    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    let members = JSON.parse(localStorage.getItem("members")) || [];

    const table = document.getElementById("membersTable");
    const searchInput = document.getElementById("searchMember");

    // ============================
    // Get Member Status
    // ============================
    function getMemberStatus(expiryDate) {

        if (!expiryDate) {
            return "<span style='color:gray;font-weight:bold;'>No Date</span>";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiry = new Date(expiryDate);
        expiry.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return "<span style='color:red;font-weight:bold;'>🔴 Expired</span>";
        } else if (diffDays <= 5) {
            return "<span style='color:orange;font-weight:bold;'>🟡 Expiring Soon</span>";
        } else {
            return "<span style='color:green;font-weight:bold;'>🟢 Active</span>";
        }
    }

    // ============================
    // Display Members
    // ============================
    function displayMembers(search = "") {

        members = JSON.parse(localStorage.getItem("members")) || [];

        table.innerHTML = "";

        const filteredMembers = members.filter(member => {

            return (
                (member.memberId || "").toLowerCase().includes(search) ||
                (member.name || "").toLowerCase().includes(search) ||
                (member.mobile || "").toLowerCase().includes(search)
            );

        });

        if (filteredMembers.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align:center;">
                        No Members Found
                    </td>
                </tr>
            `;

            return;
        }

        filteredMembers.forEach((member) => {

            const originalIndex = members.indexOf(member);

            table.innerHTML += `
                <tr>

                    <td>${originalIndex + 1}</td>

                    <td>${member.memberId}</td>

                    <td>${member.name}</td>

                    <td>${member.mobile}</td>

                    <td style="white-space:nowrap;">${member.plan}</td>

                    <td>₹${String(member.fee).replace("₹","")}</td>

                    <td>${formatDate(member.joiningDate)}</td>

                    <td>${member.expiryDate ? formatDate(member.expiryDate) : "-"}</td>

                    <td>${member.paymentStatus || "unpaid"}</td>

                    <td>${getMemberStatus(member.expiryDate)}</td>

                   <td class="action-buttons">
                     <button onclick="editMember(${originalIndex})">✏️ Edit</button>

                    <button onclick="renewMember(${originalIndex})">🔄 Renew</button>

                    <button onclick="deleteMember(${originalIndex})">🗑 Delete</button>

                    <button onclick="openWhatsAppModal(${originalIndex})">💬 WhatsApp</button>

               </td>

                </tr>
            `;

        });

    }

    // ============================
    // Search Members
    // ============================
    if (searchInput) {

        searchInput.addEventListener("input", function () {
    displayMembers(this.value.trim().toLowerCase());

});

    }

    // ============================
    // Edit Member
    // ============================
    window.editMember = function(index) {

        localStorage.setItem("editMemberIndex", index);

        window.location.href = "member-registration.html";

    };

    // ============================
    // Delete Member
    // ============================
    window.deleteMember = function(index) {

        if (confirm("Are you sure you want to delete this member?")) {

            members.splice(index, 1);

            localStorage.setItem("members", JSON.stringify(members));

            displayMembers(searchBox ? searchBox.value.toLowerCase() : "");

        }

    };

    // ============================
    // Load Members
    // ============================
    const searchBox = document.getElementById("searchMember");

displayMembers(searchBox ? searchBox.value : "");

// ==============================
// Top Sticky Scroll
// ==============================

setTimeout(() => {

    const topScroll = document.querySelector(".top-scroll");
    const topScrollContent = document.querySelector(".top-scroll-content");
    const tableContainer = document.querySelector(".table-container");
    const membersTableElement = document.querySelector(".table-container table");

    topScrollContent.style.width =
        membersTableElement.scrollWidth + "px";

    topScroll.addEventListener("scroll", function () {
        tableContainer.scrollLeft = this.scrollLeft;
    });

    tableContainer.addEventListener("scroll", function () {
        topScroll.scrollLeft = this.scrollLeft;
    });

}, 100);

});

window.renewMember = function(index) {

    const members = JSON.parse(localStorage.getItem("members")) || [];
    const member = members[index];

    const plan = prompt(`Renew Membership

1 = 1 Month
3 = 3 Months
6 = 6 Months
12 = 12 Months

Enter Plan (1/3/6/12):`);

    if (plan === null) return;

    if (!["1", "3", "6", "12"].includes(plan)) {

        alert("Invalid Plan Selected!");

        return;
    }

    const fee = prompt("Enter Renewal Fee");

if (fee === null) return;

const paymentMode = prompt(`

Payment Mode

1 = Cash
2 = UPI
3 = Card

Enter (1/2/3):

`);

if (paymentMode === null) return;

if (!["1", "2", "3"].includes(paymentMode)) {
    alert("Invalid Payment Mode!");
    return;
}

let mode = "";

if (paymentMode === "1") {
    mode = "Cash";
} else if (paymentMode === "2") {
    mode = "UPI";
} else {
    mode = "Card";
}

// Update Plan
if (plan === "1") {
    member.plan = "1 Month";
} else if (plan === "3") {
    member.plan = "3 Months";
} else if (plan === "6") {
    member.plan = "6 Months";
} else {
    member.plan = "12 Months";

}

// Update Expiry Date
const today = new Date();

if (plan === "1") {
    today.setMonth(today.getMonth() + 1);
} else if (plan === "3") {
    today.setMonth(today.getMonth() + 3);
} else if (plan === "6") {
    today.setMonth(today.getMonth() + 6);
} else {
    today.setFullYear(today.getFullYear() + 1);
}

member.expiryDate =
    String(today.getDate()).padStart(2, "0") + "-" +
    String(today.getMonth() + 1).padStart(2, "0") + "-" +
    today.getFullYear();
    
    // Update Member Details
member.fee = fee;
member.paymentStatus = "Paid";
member.status = "Active";

const feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];

const now = new Date();

const receiptNo = "RCPT" + Date.now();

const date =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    now.getFullYear();

const time = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
});

const payment = {
    receiptNo: receiptNo,
    memberId: member.memberId,
    memberName: member.name,
    amount: fee,
    mode: mode,
    date: date,
    time: time
};

feeHistory.push(payment);

localStorage.setItem(
    "feeHistory",
    JSON.stringify(feeHistory)
);

member.paymentStatus = "Paid";

members[index] = member;

localStorage.setItem(
    "members",
    JSON.stringify(members)
);

window.location.reload();

alert("Membership Renewed Successfully!");

}

// ===================================
// WhatsApp Modal
// ===================================

let selectedMember = null;

window.openWhatsAppModal = function(index){

    const members = JSON.parse(localStorage.getItem("members")) || [];

    selectedMember = members[index];

    document.getElementById("whatsappModal").style.display = "flex";

}

document.getElementById("closeWhatsAppBtn").addEventListener("click", function(){

    document.getElementById("whatsappModal").style.display = "none";

});

// Show / Hide Custom Message

document.querySelectorAll('input[name="waType"]').forEach(radio => {

    radio.addEventListener("change", function () {

        document.getElementById("customMessage").style.display =
            this.value === "custom"
                ? "block"
                : "none";

    });

});

// ===================================
// Send WhatsApp
// ===================================

document.getElementById("sendWhatsAppBtn").addEventListener("click", function () {

    if (!selectedMember) return;

    const type = document.querySelector('input[name="waType"]:checked').value;

    let message = "";

    switch (type) {

        case "welcome":

            message =
`Hello ${selectedMember.name},

Welcome to RR Technologies Gym! 💪

We are excited to have you with us.

Thank you!

- RR Technologies Gym`;

            break;

        case "due":

            message =
`Hello ${selectedMember.name},

Your gym membership fee is pending.

Please visit the gym and renew your membership.

Thank you!

- RR Technologies Gym`;

            break;

        case "renew":

            message =
`Hello ${selectedMember.name},

Your gym membership has been renewed successfully. ✅

Thank you for continuing your fitness journey with us.

- RR Technologies Gym`;

            break;

        case "custom":

            message =
document.getElementById("customMessage").value.trim();

            if (!message) {
                alert("Please enter your custom message.");
                return;
            }

            break;

    }

    sendWhatsApp(selectedMember.mobile, message);

    document.getElementById("whatsappModal").style.display = "none";

});

const refreshBtn = document.getElementById("refreshBtn");

if (refreshBtn) {
    refreshBtn.addEventListener("click", function () {
        const searchInput = document.getElementById("searchMember");
searchInput.value = "";
searchInput.dispatchEvent(new Event("input"));
    });
}