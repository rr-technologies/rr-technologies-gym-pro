// ==========================================
// RR TRINETRA BILLING
// REPORTS JAVASCRIPT
// ==========================================


// ==========================================
// MONEY FORMAT
// ==========================================

const money = (number) => {

    return "₹" + Number(number || 0).toLocaleString(
        "en-IN",
        {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }
    );

};


// ==========================================
// LOCAL STORAGE GETTER
// ==========================================

const getData = (key) => {

    try {

        return JSON.parse(
            localStorage.getItem(key) || "[]"
        );

    } catch (error) {

        console.error(
            "Unable to read localStorage:",
            key,
            error
        );

        return [];

    }

};


// ==========================================
// LOAD DATA
// ==========================================

const sales = getData("rrSales");

const payments = getData("rrTrinetraPayments");

const expenses = getData("rrExpenses");


// ==========================================
// TOTAL SALES
// ==========================================

const totalSales = sales.reduce(
    (total, sale) => {

        return total + Number(
            sale.total || 0
        );

    },
    0
);


// ==========================================
// TOTAL PAYMENTS
// ==========================================

const totalPayments = payments.reduce(
    (total, payment) => {

        return total + Number(
            payment.amount ||
            payment.total ||
            0
        );

    },
    0
);


// ==========================================
// TOTAL EXPENSES
// ==========================================

const totalExpenses = expenses.reduce(
    (total, expense) => {

        return total + Number(
            expense.amount || 0
        );

    },
    0
);


// ==========================================
// UPDATE SUMMARY CARDS
// ==========================================

document.getElementById("sales").textContent =
    money(totalSales);

document.getElementById("bills").textContent =
    sales.length;

document.getElementById("payments").textContent =
    money(totalPayments);

document.getElementById("expenses").textContent =
    money(totalExpenses);


// ==========================================
// SALES TABLE
// ==========================================

const salesBody =
    document.getElementById("salesBody");


if (!sales.length) {

    salesBody.innerHTML = `
        <tr>
            <td colspan="4" class="empty">
                No sales found
            </td>
        </tr>
    `;

} else {

    salesBody.innerHTML = sales
        .slice()
        .reverse()
        .map((sale) => {

            const date = sale.date
                ? new Date(
                    sale.date
                  ).toLocaleDateString("en-IN")
                : "-";


            return `
                <tr>

                    <td>
                        ${sale.billNo || "-"}
                    </td>

                    <td>
                        ${date}
                    </td>

                    <td>
                        ${sale.paymentMode || "-"}
                    </td>

                    <td>
                        ${money(sale.total)}
                    </td>

                </tr>
            `;

        })
        .join("");

}