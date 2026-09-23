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

            // ===========================
// Auto Fix Payment Status
// ===========================

if ((member.balanceAmount || 0) > 0) {

    member.paymentStatus = "Partial";

} else {

    member.paymentStatus = "Paid";

}

            //console.log("Keyword:", keyword);
            //console.log(member.memberId, member.name, member.mobile);

        
            // Search lekapothe Paid members hide
if (keyword === "") {

    if (member.paymentStatus === "Paid" && (member.balanceAmount || 0) === 0) {
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

                  <td>₹${member.totalFee || member.fee || 0}</td>

                  <td>₹${member.paidAmount || 0}</td>

                  <td>₹${member.balanceAmount || 0}</td>

                    <td>

                        <select id="mode${index}">

                            <option value="Cash">Cash</option>

                            <option value="UPI">UPI</option>

                            <option value="Card">Card</option>

                        </select>

                    </td>

                    <td>

                       ${member.paymentStatus === "Paid" &&
 (member.balanceAmount || 0) === 0
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

        const remainingAmount =
    member.balanceAmount > 0
        ? member.balanceAmount
        : (member.totalFee || member.fee || 0);

    const collectAmount = Number(
    prompt(
        `Remaining Balance : ₹${remainingAmount}\n\nEnter Collect Amount`
    )
);

if (!collectAmount || collectAmount <= 0) {
    return;
}


if (collectAmount <= 0) {
    alert("Please enter fee amount.");
    return;
}

const paymentMode =
    document.getElementById("mode" + index).value;
    

    if (!paymentMode) {
    alert("Please select payment mode.");
    return;
}

const remarks =
    document.getElementById("remarks").value;

if (!collectAmount || collectAmount <= 0) {
    return;
}

if (collectAmount > remainingAmount) {
    alert("Collected amount cannot be greater than remaining balance.");
    return;
}



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

        if (alreadyPaid && (member.balanceAmount || 0) <= 0) {

    alert("Fee already collected today.");

    return;

}

        const payment = {

            receiptNo: receiptNo,

            memberId: member.memberId,

            memberName: member.name,

            amount: collectAmount,

            mode: paymentMode,

            date: date,

            time: time

        };

        feeHistory.push(payment);

        // Update Remaining Balance
member.paidAmount = (member.paidAmount || 0) + collectAmount;

member.balanceAmount = remainingAmount - collectAmount;

        saveFeeHistory(feeHistory);

        // Update Payment Status
if ((member.balanceAmount || 0) > 0) {

    member.paymentStatus = "Partial";

} else {

    member.paymentStatus = "Paid";

}

members[index] = member;

saveMembers(members);




        // Dashboard Collection

        let todayCollection =
            Number(localStorage.getItem("todayCollection")) || 0;

        todayCollection += Number(payment.amount);

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
            "\nAmount : ₹" + payment.amount +
            "\nMode : " + paymentMode
        );

        console.log(members);
        
    };

        // ===========================
    // Payment History
    // ===========================

    function loadHistory(searchValue = "") {

         feeHistory = getFeeHistory();

         const search = searchValue.trim().toLowerCase();

const filteredHistory = search
    ? feeHistory.filter(record =>
        String(record.memberId || "").toLowerCase().includes(search) ||
        String(record.memberName || "").toLowerCase().includes(search) ||
        String(record.receiptNo || "").toLowerCase().includes(search)
    )
    : feeHistory;

    const printMemberHistoryBtn =
    document.getElementById("printMemberHistoryBtn");

if (printMemberHistoryBtn) {
    printMemberHistoryBtn.style.display =
        search ? "inline-block" : "none";
}

        historyBody.innerHTML = "";

        if (filteredHistory.length === 0) {

            historyBody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align:center;">
                        No Payments Yet
                    </td>
                </tr>
            `;

            return;
        }

        const latestHistory = [...filteredHistory].reverse();

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

// ==========================================
// PRINT COMPLETE MEMBER PAYMENT HISTORY
// ==========================================

// ========================================
// PRINT COMPLETE MEMBER PAYMENT HISTORY
// ========================================

function printMemberHistory() {

    const searchValue = document
        .getElementById("searchMember")
        .value
        .trim()
        .toLowerCase();

    if (!searchValue) {
        alert("Please search a Member ID first.");
        return;
    }

    const allHistory = getFeeHistory();

    const memberHistory = allHistory.filter(record =>
        String(record.memberId || "")
            .toLowerCase() === searchValue
    );

    if (memberHistory.length === 0) {
        alert("No payment history found for this member.");
        return;
    }

    const memberId = memberHistory[0].memberId;
    const memberName = memberHistory[0].memberName || "-";

    // ----------------------------------------
    // FIND MEMBER MOBILE NUMBER
    // ----------------------------------------

    const members = JSON.parse(
        localStorage.getItem("members") || "[]"
    );

    const member = members.find(m =>
        String(m.memberId || "").toLowerCase() ===
        String(memberId || "").toLowerCase()
    );

    const memberMobile = member
        ? (member.mobile || member.mobileNumber || "")
        : "";

    // ----------------------------------------
    // TOTAL PAID
    // ----------------------------------------

    const totalPaid = memberHistory.reduce(
        (total, record) =>
            total + (Number(record.amount) || 0),
        0
    );

    // ----------------------------------------
    // TABLE ROWS
    // ----------------------------------------

    const rows = [...memberHistory]
        .reverse()
        .map(record => `
            <tr>
                <td>${record.receiptNo || "-"}</td>
                <td>${formatDate(record.date)}</td>
                <td>${record.time || "-"}</td>
                <td>${record.mode || "-"}</td>
                <td>₹${record.amount || 0}</td>
            </tr>
        `)
        .join("");

    // ----------------------------------------
    // GYM SETTINGS
    // ----------------------------------------

    const settings = JSON.parse(
        localStorage.getItem("gymSettings") || "{}"
    );

    const gymName =
        settings.gymName ||
        "RR Technologies Gym Pro";

    const logo =
        settings.logo ||
        settings.gymLogo ||
        "images/logo.png";

    // ----------------------------------------
    // WHATSAPP MESSAGE
    // ----------------------------------------

    const whatsappMessage =
        `Hello ${memberName},

Here is your payment history from ${gymName}.

Member ID: ${memberId}
Total Transactions: ${memberHistory.length}
Total Paid: ₹${totalPaid}

Thank you for being a member of ${gymName}.`;

    const whatsappUrl =
        "https://wa.me/" +
        (memberMobile
            ? memberMobile.replace(/\D/g, "")
            : "") +
        "?text=" +
        encodeURIComponent(whatsappMessage);

    // ----------------------------------------
    // OPEN PRINT WINDOW
    // ----------------------------------------

    const printWindow = window.open(
        "",
        "_blank",
        "width=900,height=700"
    );

    if (!printWindow) {
        alert("Please allow pop-ups for this website.");
        return;
    }

    // ----------------------------------------
    // PRINT PAGE
    // ----------------------------------------

    printWindow.document.write(`
        <!DOCTYPE html>

        <html>
        <head>

            <title>Member Payment History</title>

            <meta charset="UTF-8">

            <style>

                * {
                    box-sizing: border-box;
                }

                body {
                    font-family: Arial, sans-serif;
                    margin: 0;
                    padding: 30px;
                    color: #222;
                    background: white;
                }

                .header {
                    text-align: center;
                    margin-bottom: 25px;
                }

                .logo {
                    width: 95px;
                    height: 95px;
                    object-fit: contain;
                    border-radius: 12px;
                    margin-bottom: 10px;
                }

                .header h1 {
                    margin: 5px 0;
                    font-size: 28px;
                }

                .header p {
                    margin: 5px 0 20px;
                    font-size: 16px;
                }

                .line {
                    border-top: 2px solid #1976d2;
                    margin: 15px 0 25px;
                }

                .member-info {
                    border: 1px solid #ccc;
                    padding: 15px;
                    margin-bottom: 20px;
                    border-radius: 8px;
                    background: #fafafa;
                    font-size: 15px;
                    line-height: 1.6;
                }

                table {
                    width: 100%;
                    border-collapse: collapse;
                }

                th,
                td {
                    border: 1px solid #ccc;
                    padding: 10px;
                    text-align: center;
                }

                th {
                    background: #f1f1f1;
                    font-weight: bold;
                }

                .total {
                    text-align: right;
                    margin-top: 20px;
                    font-size: 18px;
                    font-weight: bold;
                }

                .footer {
                    text-align: center;
                    margin-top: 35px;
                    font-size: 14px;
                }

                /* BUTTONS */

                .buttons {
                    display: flex;
                    justify-content: center;
                    gap: 15px;
                    margin-top: 35px;
                }

                .buttons button {
                    border: none;
                    padding: 12px 22px;
                    border-radius: 7px;
                    font-size: 15px;
                    font-weight: bold;
                    cursor: pointer;
                }

                .print-btn {
                    background: #10b8d4;
                    color: white;
                }

                .share-btn {
                    background: #10b8d4;
                    color: white;
                }

                .close-btn {
                    background: #10b8d4;
                    color: white;
                }

                .buttons button:hover {
                    opacity: 0.85;
                }

                @media print {

                    body {
                        padding: 20px;
                    }

                    .buttons {
                        display: none;
                    }

                }

            </style>

        </head>

        <body>

            <div class="header">

                <img
                    src="${logo}"
                    class="logo"
                    onerror="this.style.display='none';"
                >

                <h1>${gymName}</h1>

                <p>Member Payment History</p>

                <div class="line"></div>

            </div>


            <div class="member-info">

                <strong>Member ID:</strong>
                ${memberId}
                <br>

                <strong>Member Name:</strong>
                ${memberName}
                <br>

                <strong>Mobile:</strong> 
                ${memberMobile}
                <br>

                <strong>Total Transactions:</strong>
                ${memberHistory.length}

            </div>


            <table>

                <thead>

                    <tr>
                        <th>Receipt No</th>
                        <th>Date</th>
                        <th>Time</th>
                        <th>Payment Mode</th>
                        <th>Amount</th>
                    </tr>

                </thead>

                <tbody>

                    ${rows}

                </tbody>

            </table>


            <div class="total">
                Total Paid: ₹${totalPaid}
            </div>


            <div class="footer">

                Thank you for being a member of ${gymName}.

            </div>


            <!-- THREE BUTTONS -->

            <div class="buttons">

                <button
                    class="print-btn"
                    onclick="window.print()">
                    🖨️ Print
                </button>

                <button
                    class="share-btn"
                    onclick="shareCustomer();"
                    🟢 Share to Customer
                </button>

                <button
                    class="close-btn"
                    onclick="window.close()">
                    ✖ Close
                </button>

            </div>

            <script>
function shareCustomer() {

    let mobile = '${memberMobile}'.replace(/\D/g, '');

    if (!mobile) {
        alert('Customer mobile number not found.');
        return;
    }

    if (mobile.startsWith('0')) {
        mobile = mobile.substring(1);
    }

    if (mobile.length === 10) {
        mobile = '91' + mobile;
    }

    const message =
        'Hello ${memberName},\n\n' +
        'Here is your payment history from ${gymName}.\n\n' +
        'Member ID: ${memberId}\n' +
        'Member Name: ${memberName}\n' +
        'Mobile: ${memberMobile}\n' +
        'Total Transactions: ${memberHistory.length}\n' +
        'Total Paid: ₹${totalPaid}\n\n' +
        'Thank you for being a member of ${gymName}.';

    const url =
        'https://wa.me/' +
        mobile +
        '?text=' +
        encodeURIComponent(message);

    window.location.href = url;
}
</script>

</body>

</html>

    `);

    printWindow.document.close();
}


// Make function available to HTML button
window.printMemberHistory = printMemberHistory;

window.printMemberHistory = printMemberHistory;

    loadMembers();
 loadHistory();

document.getElementById("searchBtn").addEventListener("click", function () {

    const searchValue = document
        .getElementById("searchMember")
        .value
        .trim();

    loadMembers(searchValue);
    loadHistory(searchValue);

});

document.getElementById("refreshBtn").addEventListener("click", function () {

    document.getElementById("searchMember").value = "";

    loadMembers();
    loadHistory();

});

document.getElementById("searchMember").addEventListener("keyup", function (e) {

    if (e.key === "Enter") {

        const searchValue = this.value.trim();

        loadMembers(searchValue);
        loadHistory(searchValue);

    }

});

window.printReceipt = function(receiptNo) {

    window.open(
        "receipt.html?receipt=" + receiptNo,
        "_blank"
    );

};  

// ===========================
// Commercial Renewal Mode
// ===========================

const renewMode = localStorage.getItem("renewMode");
const renewMemberId = localStorage.getItem("renewMemberId");

if (renewMode === "true" && renewMemberId) {

    document.getElementById("searchMember").value = renewMemberId;

    loadMembers(renewMemberId);

    localStorage.removeItem("renewMode");
localStorage.removeItem("renewMemberId");

}

});