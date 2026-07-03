document.addEventListener("DOMContentLoaded", function () {

    let members = JSON.parse(localStorage.getItem("members")) || [];

    const table = document.getElementById("membersTable");

    function displayMembers() {

        table.innerHTML = "";

        members.forEach((member, index) => {

            table.innerHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${member.name}</td>
                    <td>${member.mobile}</td>
                    <td>${member.plan}</td>
                    <td>₹${member.fee}</td>
                    <td>
                        <button onclick="deleteMember(${index})">Delete</button>
                    </td>
                </tr>
            `;
        });
    }

    window.deleteMember = function(index) {
        if (confirm("Delete this member?")) {
            members.splice(index, 1);
            localStorage.setItem("members", JSON.stringify(members));
            displayMembers();
        }
    };

    displayMembers();

});