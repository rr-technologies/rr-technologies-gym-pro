const saveBtn = document.getElementById("saveBtn");

saveBtn.addEventListener("click", function () {

    const member = {
        name: document.getElementById("name").value,
        mobile: document.getElementById("mobile").value,
        age: document.getElementById("age").value,
        gender: document.getElementById("gender").value,
        plan: document.getElementById("plan").value,
        joiningDate: document.getElementById("joiningDate").value,
        fee: document.getElementById("fee").value,
        address: document.getElementById("address").value
    };

    let members = JSON.parse(localStorage.getItem("members")) || [];

    members.push(member);

    localStorage.setItem("members", JSON.stringify(members));

    alert("Member Saved Successfully!");

});