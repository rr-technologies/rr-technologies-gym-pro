// =======================================
// RR Technologies Gym Pro - Common JS
// =======================================

// ---------- Format Date ----------
function formatDate(dateString) {

    if (!dateString) return "";

    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {

        const [year, month, day] = dateString.split("-");

        return `${day}-${month}-${year}`;
    }

    return dateString;
}

// ---------- Members ----------
function getMembers() {
    return JSON.parse(localStorage.getItem("members")) || [];
}

function saveMembers(members) {
    localStorage.setItem("members", JSON.stringify(members));
}

// ---------- Fee History ----------
function getFeeHistory() {
    return JSON.parse(localStorage.getItem("feeHistory")) || [];
}

function saveFeeHistory(feeHistory) {
    localStorage.setItem("feeHistory", JSON.stringify(feeHistory));
}

// ---------- Attendance ----------
function getAttendance() {
    return JSON.parse(localStorage.getItem("attendance")) || [];
}

function saveAttendance(attendance) {
    localStorage.setItem("attendance", JSON.stringify(attendance));
}

// ---------- Gym Settings ----------
function getGymSettings() {
    return JSON.parse(localStorage.getItem("gymSettings")) || {};
}

function saveGymSettings(settings) {
    localStorage.setItem("gymSettings", JSON.stringify(settings));
}