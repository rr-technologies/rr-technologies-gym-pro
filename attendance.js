document.addEventListener("DOMContentLoaded", function () {

     // Load Gym Settings
    const gymSettings = JSON.parse(localStorage.getItem("gymSettings")) || {};

    const gymTitle = document.getElementById("sidebarGymName");

    if (gymTitle && gymSettings.gymName) {
        gymTitle.textContent = gymSettings.gymName;
    }

    // ==========================
    // Load Data
    // ==========================

    let members = JSON.parse(localStorage.getItem("members")) || [];
    let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

    const memberSelect = document.getElementById("memberSelect");
    const memberIdInput = document.getElementById("memberIdInput");
    const attendanceTable = document.getElementById("attendanceTable");

    // ==========================
    // Load Members
    // ==========================

    function loadMembers() {

        memberSelect.innerHTML =
            '<option value="">-- Select Member --</option>';

        members.forEach(member => {

            memberSelect.innerHTML += `
                <option value="${member.memberId}">
                    ${member.memberId} - ${member.name}
                </option>
            `;

        });

    }

    // ==========================
    // Auto Search While Typing
    // ==========================

    memberIdInput.addEventListener("input", function () {

        const id = this.value.trim().toUpperCase();

        const member = members.find(m => m.memberId === id);

        if (member) {

            memberSelect.value = member.memberId;

        } else {

            memberSelect.value = "";

        }

    });

    // ==========================
    // Dropdown -> Member ID
    // ==========================

    memberSelect.addEventListener("change", function () {

        memberIdInput.value = this.value;

    });

    // ==========================
    // Load Attendance Table
    // ==========================

    function loadAttendance() {

        attendanceTable.innerHTML = "";

        const sortedAttendance = [...attendance].reverse();

        sortedAttendance.forEach(item => {

            attendanceTable.innerHTML += `
                <tr>

                    <td>${item.memberId}</td>

                    <td>${item.memberName}</td>

                    <td>${item.date}</td>

                    <td>${item.time}</td>

                    <td style="
                        color:${item.status === "Present" ? "green" : "red"};
                        font-weight:bold;
                    ">
                        ${item.status}
                    </td>

                </tr>
            `;

        });

    }

    // ==========================
    // Mark Attendance
    // ==========================

    function markAttendance(status) {

        const memberId = memberSelect.value;

        if (memberId === "") {

            alert("Please select a member.");

            return;

        }

        const member = members.find(m => m.memberId === memberId);

        const now = new Date();

        // IMPORTANT: Same format as dashboard.js
        const date =
    String(now.getDate()).padStart(2, "0") + "-" +
    String(now.getMonth() + 1).padStart(2, "0") + "-" +
    now.getFullYear();

        const time = now.toLocaleTimeString([], {

            hour: "2-digit",

            minute: "2-digit"

        });

        const alreadyMarked = attendance.find(record =>

            record.memberId === memberId &&
            record.date === date

        );

        if (alreadyMarked) {

            alert("Attendance already marked for today.");

            return;

        }

        attendance.push({

            memberId: member.memberId,

            memberName: member.name,

            date: date,

            time: time,

            status: status

        });

        localStorage.setItem(

            "attendance",

            JSON.stringify(attendance)

        );

        loadAttendance();

        memberSelect.value = "";

        memberIdInput.value = "";

        memberIdInput.focus();

        alert("Attendance marked successfully!");

    }

    // ==========================
    // Buttons
    // ==========================

    document.getElementById("presentBtn")
        .addEventListener("click", function () {

            markAttendance("Present");

        });

    document.getElementById("absentBtn")
        .addEventListener("click", function () {

            markAttendance("Absent");

        });

    // ==========================
    // Initial Load
    // ==========================

    loadMembers();

    loadAttendance();

    memberIdInput.focus();

});