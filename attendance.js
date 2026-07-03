// Sample Members Data
let members = [
    {
        id: 1,
        name: "Ravi",
        time: "",
        status: "Absent"
    },
    {
        id: 2,
        name: "Suresh",
        time: "",
        status: "Absent"
    },
    {
        id: 3,
        name: "Mahesh",
        time: "",
        status: "Absent"
    }
];

// Load Attendance Table
function loadTable() {
    const table = document.getElementById("attendanceTable");
    table.innerHTML = "";

    members.forEach((member, index) => {
        table.innerHTML += `
            <tr>
                <td>${member.id}</td>
                <td>${member.name}</td>
                <td>${member.time || "--"}</td>
                <td>${member.status}</td>
                <td>
                    <button onclick="markAttendance(${index})">
                        Mark
                    </button>
                </td>
            </tr>
        `;
    });
}

// Mark Attendance
function markAttendance(index) {
    const now = new Date();

    members[index].time = now.toLocaleTimeString();
    members[index].status = "Present";

    loadTable();
}

// Load table when page opens
loadTable();