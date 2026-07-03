document.addEventListener("DOMContentLoaded", function () {

    const memberForm = document.getElementById("memberForm");

    memberForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Get form values
        const member = {
            name: document.getElementById("fullName").value,
            mobile: document.getElementById("mobile").value,
            age: document.getElementById("age").value,
            gender: document.getElementById("gender").value,
            plan: document.getElementById("membership").value,
            joiningDate: document.getElementById("joiningDate").value,
            fee: document.getElementById("fee").value,
            address: document.getElementById("address").value
        };

        // Get existing members
        let members = JSON.parse(localStorage.getItem("members")) || [];

        // Add new member
        members.push(member);

        // Save to localStorage
        localStorage.setItem("members", JSON.stringify(members));

        alert("✅ Member Registered Successfully!");

        // Clear form
        memberForm.reset();
    });

});