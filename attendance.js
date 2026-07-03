// Load Members from localStorage
let members = JSON.parse(localStorage.getItem("members")) || [];
let attendance = JSON.parse(localStorage.getItem("attendance")) || [];

// Load Members into Dropdown
function loadMembers() {
    const memberSelect = document.getElementById("memberSelect");
    memberSelect.innerHTML = '<option value="">-- Select Member --</option>';

    members.forEach(member => {
        memberSelect.innerHTML += `
            <option value="${member.name}">
                ${member.name}
            </option>
        `;
    });
}

// Load Attendance Table
function loadAttendance(searchText = "") {

    const table = document.getElementById("attendanceTable");
    table.innerHTML = "";

    attendance.forEach((item, index) => {

        if (
            item.memberName.toLowerCase().includes(searchText.toLowerCase())
        ) {

            table.innerHTML += `
            <tr>
                <td>${index + 1}</td>
                <td>${item.memberName}</td>
                <td>${item.date}</td>
                <td>${item.time}</td>
                <td>${item.status}</td>
            </tr>
            `;
        }

    });

}

// Save Attendance
function markAttendance(status) {

    const memberName = document.getElementById("memberSelect").value;

    if (memberName === "") {
        alert("Please select a member.");
        return;
    }

    const today = new Date();

    const date = today.toLocaleDateString("en-GB");

    const time = today.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit"
    });

    // Prevent duplicate attendance for same day
    const alreadyMarked = attendance.find(item =>
        item.memberName === memberName &&
        item.date === date
    );

    if (alreadyMarked) {
        alert("Attendance already marked today.");
        return;
    }

    attendance.push({
        memberName,
        date,
        time,
        status
    });

    localStorage.setItem("attendance", JSON.stringify(attendance));

    loadAttendance();

    alert("Attendance marked successfully!");
}

// Buttons
document.getElementById("presentBtn").addEventListener("click", () => {
    markAttendance("Present");
});

document.getElementById("absentBtn").addEventListener("click", () => {
    markAttendance("Absent");
});

// Search
document.getElementById("search").addEventListener("keyup", function () {
    loadAttendance(this.value);
});

// Initial Load
loadMembers();
loadAttendance();