// =======================================
// RR Technologies Gym Pro - Common JS
// =======================================

// Format Date (YYYY-MM-DD -> DD-MM-YYYY)
function formatDate(dateString) {

    if (!dateString) return "";

    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {

        const [year, month, day] = dateString.split("-");

        return `${day}-${month}-${year}`;
    }

    return dateString;
}