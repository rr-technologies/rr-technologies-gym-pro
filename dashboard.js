document.addEventListener("DOMContentLoaded", function () {

    // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    // Load Data
    const members = JSON.parse(localStorage.getItem("members")) || [];
    const attendance = JSON.parse(localStorage.getItem("attendance")) || [];
    const feeHistory = JSON.parse(localStorage.getItem("feeHistory")) || [];

    

    let activeMembers = 0;
    let expiredMembers = 0;
    let pendingFees = 0;
    let todayCollection = 0;

    // Today's Date
    const now = new Date();

    const today =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    now.getFullYear();

    console.log("Today:", today);
console.log("Fee History:", feeHistory);

    // DD-MM-YYYY → Date Object
    function parseDate(dateString) {

    if (!dateString) return null;

    // YYYY-MM-DD format
    if (dateString.split("-")[0].length === 4) {
        return new Date(dateString + "T00:00:00");
    }

    // DD-MM-YYYY format
    const [day, month, year] = dateString.split("-");
    return new Date(year, month - 1, day);

}

    // Active & Expired Members
    members.forEach(member => {

        if (!member.expiryDate) return;

        const expiry = parseDate(member.expiryDate);

        if (!expiry) return;

        expiry.setHours(0,0,0,0);

        const current = new Date();
        current.setHours(0,0,0,0);

        if (expiry >= current) {
            activeMembers++;
        } else {
            expiredMembers++;
        }

    });

    // Pending Fees
    pendingFees = expiredMembers;

    // Today's Collection
    feeHistory.forEach(record => {

       if (record.date === today) {
        todayCollection += Number(record.amount || 0);

        }

    });

    // Present Today
console.log("Today =", today);
console.log("Attendance =", attendance);
console.log("Attendance Dates =", attendance.map(x => x.date));

    const presentToday = attendance.filter(record =>
        record.date === today &&
        record.status === "Present"
    ).length;

    // Dashboard Cards
    document.getElementById("totalMembers").textContent = members.length;
    document.getElementById("presentToday").textContent = presentToday;
    document.getElementById("todayCollection").textContent = "₹" + todayCollection;
    document.getElementById("pendingFees").textContent = pendingFees;

    // Summary Table
   // document.getElementById("summaryMembers").textContent = members.length;
    //document.getElementById("summaryAttendance").textContent = presentToday;
    //document.getElementById("summaryCollection").textContent = "₹" + todayCollection;
    //document.getElementById("summaryPending").textContent = pendingFees;

    // Future Cards (Optional)
    if (document.getElementById("activeMembers")) {
        document.getElementById("activeMembers").textContent = activeMembers;
    }

    if (document.getElementById("expiredMembers")) {
        document.getElementById("expiredMembers").textContent = expiredMembers;
    }

    // =====================================
    // Expiring in Next 7 Days
    // =====================================

    const expiryTable = document.getElementById("expiryAlertTable");

    if (expiryTable) {

        expiryTable.innerHTML = "";

        const todayDate = new Date();
        todayDate.setHours(0,0,0,0);

        const next7 = new Date(todayDate);
        next7.setDate(next7.getDate() + 7);

        let found = false;

        members.forEach(member => {

            if (!member.expiryDate) return;

            const expiry = parseDate(member.expiryDate);

            if (!expiry) return;

            expiry.setHours(0,0,0,0);

            if (expiry >= todayDate && expiry <= next7) {

                found = true;

                expiryTable.innerHTML += `
                    <tr>
                        <td>${member.memberId}</td>
                        <td>${member.name}</td>
                        <td>${member.expiryDate}</td>
                    </tr>
                `;

            }

        });

        if (!found) {

            expiryTable.innerHTML = `
                <tr>
                    <td colspan="3" style="text-align:center;color:green;">
                        ✅ No members expiring in the next 7 days
                    </td>
                </tr>
            `;

        }

    }
// ===============================
// Recent Fee Collections
// ===============================

const recentBody = document.getElementById("recentCollectionTable");

if (recentBody) {

    recentBody.innerHTML = "";

    if (feeHistory.length === 0) {

        recentBody.innerHTML = `
            <tr>
                <td colspan="3">No Collections</td>
            </tr>
        `;

    } else {

        const recent = [...feeHistory].slice(-5).reverse();

        recent.forEach(record => {

            recentBody.innerHTML += `
                <tr>
                    <td>${record.memberName}</td>
                    <td>₹${record.amount}</td>
                    <td>${record.time}</td>
                </tr>
            `;

        });

    }

}

});