document.addEventListener("DOMContentLoaded", function () {

    // ======================================
    // Load Gym Settings
    // ======================================
    const settings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymName = document.getElementById("gymName");
    const gymLogo = document.getElementById("gymLogo");

    if (gymName) {
        gymName.textContent = settings.gymName || "RR Technologies Gym Pro";
    }

    if (gymLogo) {
        gymLogo.src = settings.logo || "images/logo.png";
    }

    // ======================================
    // Print Date
    // ======================================
    const now = new Date();

    document.getElementById("reportDate").textContent =
        "Printed : " +
        now.toLocaleDateString("en-GB").replace(/\//g, "-") +
        " " +
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    // ======================================
    // Load Report Data
    // ======================================
    let records = [];

    try {
        records = JSON.parse(localStorage.getItem("printReportData")) || [];
    } catch (e) {
        records = [];
    }

    console.log("PRINT RECORDS :", records);

    const tbody = document.getElementById("printBody");

    tbody.innerHTML = "";

    let totalAmount = 0;

    records.forEach(record => {

        const receiptNo = record.receiptNo || "";
        const memberId = record.memberId || "";
        const memberName =
            record.memberName ||
            record.name ||
            "";

        const amount = Number(record.amount || 0);

        const mode =
            record.mode ||
            record.paymentMode ||
            "";

        const date = record.date || "";

        totalAmount += amount;

        tbody.innerHTML += `
            <tr>
                <td>${receiptNo}</td>
                <td>${memberId}</td>
                <td>${memberName}</td>
                <td><b>₹${amount.toLocaleString("en-IN")}</b></td>
                <td>${mode}</td>
                <td>${date}</td>
            </tr>
        `;
    });

    document.getElementById("totalRecords").textContent = records.length;
    document.getElementById("totalAmount").textContent =
        totalAmount.toLocaleString("en-IN");

    // ======================================
    // Auto Print
    // ======================================
    function printReport() {
        setTimeout(function () {
            window.print();
        }, 500);
    }

    if (gymLogo.complete) {
        printReport();
    } else {
        gymLogo.onload = printReport;
        gymLogo.onerror = printReport;
    }

});