const members = JSON.parse(localStorage.getItem("members")) || [];

const table = document.getElementById("membersTable");

members.forEach((member, index) => {

    table.innerHTML += `
        <tr>
            <td>${index + 1}</td>
            <td>${member.name}</td>
            <td>${member.mobile}</td>
            <td>${member.plan}</td>
            <td>${member.fee}</td>
        </tr>
    `;

});