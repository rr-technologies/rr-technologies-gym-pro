document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    let members = JSON.parse(localStorage.getItem("members")) || [];

    const table = document.getElementById("membersTable");
    const searchInput = document.getElementById("searchMember");

    // ============================
    // Get Member Status
    // ============================
    function getMemberStatus(expiryDate) {

        if (!expiryDate) {
            return "<span style='color:gray;font-weight:bold;'>No Date</span>";
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const expiry = new Date(expiryDate);
        expiry.setHours(0, 0, 0, 0);

        const diffDays = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

        if (diffDays < 0) {
            return "<span style='color:red;font-weight:bold;'>🔴 Expired</span>";
        } else if (diffDays <= 5) {
            return "<span style='color:orange;font-weight:bold;'>🟡 Expiring Soon</span>";
        } else {
            return "<span style='color:green;font-weight:bold;'>🟢 Active</span>";
        }
    }

    // ============================
    // Display Members
    // ============================
    function displayMembers(search = "") {

        members = JSON.parse(localStorage.getItem("members")) || [];

        table.innerHTML = "";

        const filteredMembers = members.filter(member => {

            return (
                (member.memberId || "").toLowerCase().includes(search) ||
                (member.name || "").toLowerCase().includes(search) ||
                (member.mobile || "").toLowerCase().includes(search)
            );

        });

        if (filteredMembers.length === 0) {

            table.innerHTML = `
                <tr>
                    <td colspan="11" style="text-align:center;">
                        No Members Found
                    </td>
                </tr>
            `;

            return;
        }

        filteredMembers.forEach((member) => {

            const originalIndex = members.indexOf(member);

            table.innerHTML += `
                <tr>

                    <td>${originalIndex + 1}</td>

                    <td>${member.memberId}</td>

                    <td>${member.name}</td>

                    <td>${member.mobile}</td>

                    <td>${member.plan}</td>

                    <td>₹${member.fee}</td>

                    <td>${formatDate(member.joiningDate)}</td>

                    <td>${member.expiryDate ? formatDate(member.expiryDate) : "-"}</td>

                    <td>${member.paymentStatus || "unpaid"}</td>

                    <td>${getMemberStatus(member.expiryDate)}</td>

                    <td>

                        <button onclick="editMember(${originalIndex})">
                            ✏️ Edit
                        </button>

                        <button onclick="deleteMember(${originalIndex})">
                            🗑 Delete
                        </button>

                    </td>

                </tr>
            `;

        });

    }

    // ============================
    // Search Members
    // ============================
    if (searchInput) {

        searchInput.addEventListener("keyup", function () {

            displayMembers(this.value.toLowerCase());

        });

    }

    // ============================
    // Edit Member
    // ============================
    window.editMember = function(index) {

        localStorage.setItem("editMemberIndex", index);

        window.location.href = "member-registration.html";

    };

    // ============================
    // Delete Member
    // ============================
    window.deleteMember = function(index) {

        if (confirm("Are you sure you want to delete this member?")) {

            members.splice(index, 1);

            localStorage.setItem("members", JSON.stringify(members));

            displayMembers(searchInput ? searchInput.value.toLowerCase() : "");

        }

    };

    // ============================
    // Load Members
    // ============================
    displayMembers();

});