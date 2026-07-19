document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    const tableBody = document.querySelector("#feeTable tbody");
    const historyBody = document.getElementById("historyBody");

    let members = getMembers();
    let feeHistory = getFeeHistory();

    // ===========================
    // Load Members
    // ===========================

    function loadMembers(search = "") {

         members = JSON.parse(localStorage.getItem("members")) || [];

        tableBody.innerHTML = "";

        if (members.length === 0) {

            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" style="text-align:center;">
                        No Members Found
                    </td>
                </tr>
            `;

            return;
        }

        const keyword = search.toLowerCase().trim();

        members.forEach((member, index) => {    

            //console.log("Keyword:", keyword);
            //console.log(member.memberId, member.name, member.mobile);

        
            // Search lekapothe Paid members hide
if (keyword === "") {

    if (member.paymentStatus === "Paid") {
        return;
    }

} else {

    // Search unte Paid + Unpaid rendu search cheyyi
    if (
        !member.memberId.toLowerCase().includes(keyword) &&
        !member.name.toLowerCase().includes(keyword) &&
        !(member.mobile || "").toLowerCase().includes(keyword)
    ) {
        return;
    }

}

            tableBody.innerHTML += `
                <tr>

                    <td>${member.memberId}</td>

                    <td>${member.name}</td>

                    <td>${member.plan}</td>

                    <td>₹${member.fee}</td>

                    <td>

                        <select id="mode${index}">

                            <option value="Cash">Cash</option>

                            <option value="UPI">UPI</option>

                            <option value="Card">Card</option>

                        </select>

                    </td>

                    <td>

                       ${member.paymentStatus === "Paid"

? `

<div class="paid-action">

<span style="color:green;font-weight:bold;">✅ Paid</span>

<button class="receipt-btn"

 onclick="printLatestReceipt('${member.memberId}')">
🧾 Receipt
</button>

</div>
`
: `
<button onclick="collectFee(${index})">
💰 Collect
</button>
`
}

</td>

                    </td>

                </tr>
            `;

        });

    }

// ===========================
// Member Status
// ===========================
function getMemberStatus(expiryDate) {

    const today = new Date();
    const expiry = new Date(expiryDate);

    const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
        return "Expired";
    } else if (diffDays <= 5) {
        return "Expiring Soon";
    } else {
        return "Active";
    }
}

    // ===========================
    // Collect Fee
    // ===========================

    window.collectFee = function(index) {

         const members = getMembers();

         feeHistory = getFeeHistory();

        const member = members[index];

        const paymentMode =
            document.getElementById("mode" + index).value;

        const now = new Date();

        const date =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    String(now.getFullYear());
    
        const time = now.toLocaleTimeString([], {

            hour: "2-digit",
            minute: "2-digit"

        });

        const receiptNo =
            "RCPT" + Date.now();

        // Prevent duplicate payment today

        const alreadyPaid = feeHistory.find(record =>

            record.memberId === member.memberId &&
            record.date === date

        );

        if (alreadyPaid) {

            alert("Fee already collected today.");

            return;

        }

        const payment = {

            receiptNo: receiptNo,

            memberId: member.memberId,

            memberName: member.name,

            amount: Number(member.fee),

            mode: paymentMode,

            date: date,

            time: time

        };

        feeHistory.push(payment);

        saveFeeHistory(feeHistory);

        // Update Payment Status
member.paymentStatus = "Paid";

members[index] = member;

saveMembers(members);


        // ===========================
// Renew Membership
// ===========================

let expiry = new Date(member.expiryDate);

switch (member.plan) {

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
}

member.expiryDate = expiry.toISOString().split("T")[0];
member.status = getMemberStatus(member.expiryDate);

members[index] = member;

localStorage.setItem("members", JSON.stringify(members));

        // Dashboard Collection

        let todayCollection =
            Number(localStorage.getItem("todayCollection")) || 0;

        todayCollection += Number(member.fee);

        localStorage.setItem(
            "todayCollection",
            todayCollection
        );

        loadMembers();
        loadHistory();

        alert(
            "Fee Collected Successfully!\n\n" +
            "Receipt : " + receiptNo +
            "\nMember : " + member.name +
            "\nAmount : ₹" + member.fee +
            "\nMode : " + paymentMode
        );

        console.log(members);
        
    };

        // ===========================
    // Payment History
    // ===========================

    function loadHistory() {

         feeHistory = getFeeHistory();

        historyBody.innerHTML = "";

        if (feeHistory.length === 0) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        No Payments Yet
                    </td>
                </tr>
            `;

            return;
        }

        const latestHistory = [...feeHistory].reverse();

        latestHistory.forEach(record => {

            historyBody.innerHTML += `

                <tr>

                    <td>${record.receiptNo}</td>

                    <td>${record.memberId}</td>

                    <td>${record.memberName}</td>

                    <td>₹${record.amount}</td>

                    <td>${record.mode}</td>

                    <td>${formatDate(record.date)}</td>

                    <td>${record.time}</td>
           
             <td>
    <button class="print-btn" onclick="printReceipt('${record.receiptNo}')">
       🖨️ Print
    </button>

  </td>

</tr>

            `;

        });

    }

    window.printLatestReceipt = function(memberId) {

    const feeHistory = getFeeHistory();

    const payments = feeHistory.filter(p => p.memberId === memberId);

    if (payments.length === 0) {
        alert("Receipt Not Found");
        return;
    }

    const latest = payments[payments.length - 1];

    window.open(
    "receipt.html?receipt=" + latest.receiptNo,
    "_blank"
);

 document.getElementById("searchMember").value = "";

 loadMembers();

};

    loadMembers();
 loadHistory();

document.getElementById("searchBtn").addEventListener("click", function () {



    loadMembers(document.getElementById("searchMember").value);

    
});

document.getElementById("refreshBtn").addEventListener("click", function () {

    document.getElementById("searchMember").value = "";

    loadMembers();
    loadHistory();

});

document.getElementById("searchMember").addEventListener("keyup", function (e) {
    if (e.key === "Enter") {
        loadMembers(this.value);
    }
});

window.printReceipt = function(receiptNo) {

    window.open(
        "receipt.html?receipt=" + receiptNo,
        "_blank"
    );

};  

});