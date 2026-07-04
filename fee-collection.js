document.addEventListener("DOMContentLoaded", function () {

    const tableBody = document.querySelector("#feeTable tbody");
    const historyBody = document.getElementById("historyBody");

    let members = JSON.parse(localStorage.getItem("members")) || [];
    let feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];

    // ===========================
    // Load Members
    // ===========================

    function loadMembers() {

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

        members.forEach((member, index) => {

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

                        <button onclick="collectFee(${index})">
                            Collect
                        </button>

                    </td>

                </tr>
            `;

        });

    }

    // ===========================
    // Collect Fee
    // ===========================

    window.collectFee = function(index) {

        const member = members[index];

        const paymentMode =
            document.getElementById("mode" + index).value;

        const now = new Date();

        const date = now.toLocaleDateString();

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

        localStorage.setItem(
            "feeHistory",
            JSON.stringify(feeHistory)
        );

        // Dashboard Collection

        let todayCollection =
            Number(localStorage.getItem("todayCollection")) || 0;

        todayCollection += Number(member.fee);

        localStorage.setItem(
            "todayCollection",
            todayCollection
        );

        alert(
            "Fee Collected Successfully!\n\n" +
            "Receipt : " + receiptNo +
            "\nMember : " + member.name +
            "\nAmount : ₹" + member.fee +
            "\nMode : " + paymentMode
        );

        loadHistory();

    };

        // ===========================
    // Payment History
    // ===========================

    function loadHistory() {

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

                    <td>${record.date}</td>

                    <td>${record.time}</td>
           
             <td>
    <button class="print-btn" onclick="downloadReceipt('${record.receiptNo}')">
       🖨️ Print
    </button>

  </td>

</tr>

            `;

        });

    }

    loadMembers();

    window.downloadReceipt = function(receiptNo) {

    const record = feeHistory.find(r => r.receiptNo === receiptNo);

    if (!record) {
        alert("Receipt not found.");
        return;
    }

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("RR TECHNOLOGIES", 20, 20);

    doc.setFontSize(14);
    doc.text("GYM PRO SOFTWARE", 20, 30);

    doc.line(20, 35, 190, 35);

    doc.setFontSize(12);

    doc.text("Receipt No : " + record.receiptNo, 20, 50);
    doc.text("Member ID  : " + record.memberId, 20, 60);
    doc.text("Member     : " + record.memberName, 20, 70);
    doc.text("Amount     : Rs. " + record.amount, 20, 80);
    doc.text("Payment    : " + record.mode, 20, 90);
    doc.text("Date       : " + record.date, 20, 100);
    doc.text("Time       : " + record.time, 20, 110);

    doc.line(20, 120, 190, 120);

    doc.setFontSize(14);
    doc.text("Thank You! Visit Again", 20, 135);

    doc.save(record.receiptNo + ".pdf");

};

    loadHistory();

});