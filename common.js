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

// =======================================
// WhatsApp Helper
// =======================================

function cleanMobileNumber(number) {

    if (!number) return "";

    // Remove spaces, +, -, etc.
    number = number.toString().replace(/\D/g, "");

    // Add India country code if missing
    if (number.length === 10) {
        number = "91" + number;
    }

    return number;
}

function sendWhatsApp(number, message) {

    const mobile = cleanMobileNumber(number);

    if (!mobile) {
        alert("Invalid mobile number.");
        return;
    }

    const url =
        `https://wa.me/${mobile}?text=${encodeURIComponent(message)}`;

    window.open(url, "_blank");
}