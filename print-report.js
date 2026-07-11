document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // Gym Settings
    // ==========================
    const gymSettings =
        JSON.parse(localStorage.getItem("gymSettings")) || {};

    // Gym Name
    if (gymSettings.gymName) {
        document.getElementById("gymName").textContent =
            gymSettings.gymName;
    }

    // Gym Logo
    const logo = document.getElementById("gymLogo");

    if (gymSettings.logo) {
        logo.src = gymSettings.logo;
    } else {
        logo.src = "logo.png";
    }

    // ==========================
    // Print Date
    // ==========================
    const now = new Date();

    const date =
        now.toLocaleDateString("en-GB").replace(/\//g, "-");

    const time =
        now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
        });

    document.getElementById("reportDate").textContent =
        `Printed : ${date} ${time}`;

    // ==========================
    // Load Report Data
    // ==========================
    const records =
        JSON.parse(localStorage.getItem("printReportData")) || [];

    const tbody =
        document.getElementById("printBody");

    let totalCollection = 0;

    tbody.innerHTML = "";

    records.forEach(record => {

        totalCollection += Number(record.amount);

        tbody.innerHTML += `
            <tr>
                <td>${record.receiptNo}</td>
                <td>${record.memberId}</td>
                <td>${record.memberName}</td>
                <td><b>₹${Number(record.amount).toLocaleString("en-IN")}</b></td>
                <td>${record.mode}</td>
                <td>${record.date}</td>
            </tr>
        `;

    });

    // ==========================
    // Summary
    // ==========================
    document.getElementById("totalRecords").textContent =
        records.length;

    document.getElementById("totalAmount").textContent =
        totalCollection.toLocaleString("en-IN");

    // ==========================
    // Print
    // ==========================
    function startPrint() {

        setTimeout(() => {

            window.print();

        }, 400);

    }

    if (logo.complete) {

        startPrint();

    } else {

        logo.onload = startPrint;
        logo.onerror = startPrint;

    }

});