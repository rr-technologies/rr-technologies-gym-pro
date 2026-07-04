document.addEventListener("DOMContentLoaded", function () {

    let members = JSON.parse(localStorage.getItem("members")) || [];

    const table = document.getElementById("membersTable");

    function getMemberStatus(expiryDate) {

        const today = new Date();

        today.setHours(0, 0, 0, 0);

        const expiry = new Date(expiryDate);

        expiry.setHours(0, 0, 0, 0);

        if (expiry < today) {
            return "<span style='color:red;font-weight:bold;'>Expired</span>";
        }

        return "<span style='color:green;font-weight:bold;'>Active</span>";
    }

    function displayMembers() {

        table.innerHTML = "";

        if (members.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="10" style="text-align:center;">
                        No Members Found
                    </td>
                </tr>
            `;

            return;
        }

        members.forEach((member, index) => {

            table.innerHTML += `
                <tr>

                    <td>${index + 1}</td>

                    <td>${member.memberId}</td>

                    <td>${member.name}</td>

                    <td>${member.mobile}</td>

                    <td>${member.plan}</td>

                    <td>₹${member.fee}</td>

                    <td>${member.joiningDate}</td>

                    <td>${member.expiryDate || "-"}</td>

                    <td>${member.paymentStatus || "Paid"}</td>

                    <td>${getMemberStatus(member.expiryDate)}</td>

                    <td>
                        <button onclick="editMember(${index})">
                            Edit
                        </button>

                        <button onclick="deleteMember(${index})">
                            Delete
                        </button>
                    </td>

                </tr>
            `;

        });

    }

    window.editMember = function(index) {

        localStorage.setItem("editMemberIndex", index);

        window.location.href = "member-registration.html";

    };

    window.deleteMember = function(index) {

        if (confirm("Are you sure you want to delete this member?")) {

            members.splice(index, 1);

            localStorage.setItem("members", JSON.stringify(members));

            displayMembers();

        }

    };

    displayMembers();

});