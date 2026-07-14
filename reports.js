document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const logo = gymSettings.logo || "";

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    const members = getMembers();
    const feeHistory = getFeeHistory();

    let currentReport = [...feeHistory];

    const reportBody = document.getElementById("reportBody");

    let totalMembers = members.length;
    let totalCollection = 0;
    let todayCollection = 0;
    let activeMembers = 0;

    const now = new Date();

const today =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    now.getFullYear();

    function loadReport(records = feeHistory) {

         currentReport = [...records];

        console.log(records);


    reportBody.innerHTML = "";

    totalCollection = 0;
    todayCollection = 0;

    records.forEach(record => {

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
                <td>${record.date}</td>
            </tr>
        `;

         

    });

    document.getElementById("totalCollection").textContent = "₹" + totalCollection;
    document.getElementById("todayCollection").textContent = "₹" + todayCollection;
}

    members.forEach(member => {
        if (member.status === "Active") {
            activeMembers++;
        }
    });

    document.getElementById("totalMembers").textContent = totalMembers;

    document.getElementById("activeMembers").textContent = activeMembers;

    loadReport();

    // ============================
// Search Report
// ============================

document.getElementById("searchReportBtn").addEventListener("click", function () {

    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const memberId = document.getElementById("searchMemberId").value.trim().toLowerCase();
    const memberName = document.getElementById("searchMemberName").value.trim().toLowerCase();
    const paymentMode = document.getElementById("paymentModeFilter").value.toLowerCase();
    const receiptNo = document.getElementById("receiptFilter").value.trim().toLowerCase();

    const filtered = feeHistory.filter(record => {

        const recordDate = record.date.split("-").reverse().join("-");

        return (

            (fromDate === "" || recordDate >= fromDate) &&

            (toDate === "" || recordDate <= toDate) &&

            (memberId === "" ||
                record.memberId.toLowerCase().includes(memberId)) &&

            (memberName === "" ||
                record.memberName.toLowerCase().includes(memberName)) &&

            (paymentMode === "" ||
                paymentMode === "all" ||
                record.mode.toLowerCase() === paymentMode) &&

            (receiptNo === "" ||
                record.receiptNo.toLowerCase().includes(receiptNo))

        );

    });

    loadReport(filtered);

});

// ============================
// Refresh Report
// ============================

document.getElementById("refreshReportBtn").addEventListener("click", function () {

    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    document.getElementById("searchMemberId").value = "";
    document.getElementById("searchMemberName").value = "";
    document.getElementById("paymentModeFilter").value = "";
    document.getElementById("receiptFilter").value = "";

    loadReport(feeHistory);

});

// ============================
// Print Report
// ============================

    document.getElementById("printReportBtn").addEventListener("click", function () {

        localStorage.setItem(
            "printReportData",
            JSON.stringify(currentReport)
        );

        window.open("print-report.html", "_blank");

    });

        // ============================
// Excel Export
// ============================

document.getElementById("excelReportBtn").addEventListener("click", function () {

    if (currentReport.length === 0) {
        alert("No data available to export.");
        return;
    }

    let csv =
        "Receipt No,Member ID,Member Name,Amount,Payment Mode,Date\n";

    currentReport.forEach(record => {

        csv +=
            `"${record.receiptNo}",` +
            `"${record.memberId}",` +
            `"${record.memberName}",` +
            `"${record.amount}",` +
            `"${record.mode}",` +
            `"${record.date}"\n`;

    });

    const blob = new Blob([csv], {
        type: "text/csv;charset=utf-8;"
    });

    const link = document.createElement("a");

    link.href = URL.createObjectURL(blob);

    link.download = "Collection_Report.csv";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

});

});