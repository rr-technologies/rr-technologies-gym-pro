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

});

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

        let expiry = new Date(joiningDate);

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

        return expiry.toISOString().split("T")[0];
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
            document.getElementById("fee").value = member.fee;
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

    fee: document.getElementById("fee").value,

    testDate: document.getElementById("testDate").value,

    paymentStatus: "Unpaid",

    address: document.getElementById("address").value

};
        if (currentEditIndex !== null) {

            members[Number(currentEditIndex)] = member;

            localStorage.removeItem("editMemberIndex");

            alert("✅ Member Updated Successfully!");

        } else {

            members.push(member);

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