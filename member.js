document.addEventListener("DOMContentLoaded", function () {

    const memberForm = document.getElementById("memberForm");

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
    function calculateExpiryDate(joiningDate, plan) {

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

        const expiryDate =
            calculateExpiryDate(joiningDate, membershipPlan);

        const member = {

            memberId: document.getElementById("memberId").value,

            name: document.getElementById("fullName").value,

            mobile: document.getElementById("mobile").value,

            age: document.getElementById("age").value,

            gender: document.getElementById("gender").value,

            plan: membershipPlan,

            joiningDate: joiningDate,

            expiryDate: expiryDate,

            fee: document.getElementById("fee").value,

            paymentStatus: "Paid",

            address: document.getElementById("address").value

        };

        if (currentEditIndex !== null) {

            members[Number(currentEditIndex)] = member;

            localStorage.removeItem("editMemberIndex");

            alert("✅ Member Updated Successfully!");

        } else {

            members.push(member);

            const currentId =
                parseInt(member.memberId.replace("RR", ""));

            localStorage.setItem("lastMemberId", currentId);

            alert("✅ Member Registered Successfully!");

        }

        localStorage.setItem("members", JSON.stringify(members));

        window.location.href = "members-list.html";

    });

});