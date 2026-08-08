function formatDate(dateString) {

    if (!dateString) return "";

    // Already DD-MM-YYYY
    if (dateString.includes("-") && dateString.split("-")[0].length === 2) {
        return dateString;
    }

    // YYYY-MM-DD
    if (dateString.includes("-") && dateString.split("-")[0].length === 4) {

        const [year, month, day] = dateString.split("-");

        return `${day}-${month}-${year}`;
    }

    const date = new Date(dateString);

    if (isNaN(date.getTime())) return dateString;

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}-${month}-${year}`;
}

