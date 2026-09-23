/*
==================================================
RR TRINETRA BILLING
PAYMENTS JS
==================================================
*/

const PAYMENT_KEY = "rrTrinetraPayments";

let payments = [];


/* ==================================================
   INITIALIZE
================================================== */

document.addEventListener("DOMContentLoaded", function () {

    loadPayments();

    renderPayments();

    updateSummary();

    setupEvents();

});


/* ==================================================
   LOAD PAYMENTS
================================================== */

function loadPayments() {

    try {

        const saved =
            localStorage.getItem(PAYMENT_KEY);

        payments = saved
            ? JSON.parse(saved)
            : [];

        if (!Array.isArray(payments)) {
            payments = [];
        }

    } catch (error) {

        console.error(
            "Unable to load payments:",
            error
        );

        payments = [];
    }
}


/* ==================================================
   SAVE PAYMENTS
================================================== */

function savePayments() {

    localStorage.setItem(
        PAYMENT_KEY,
        JSON.stringify(payments)
    );

}


/* ==================================================
   SETUP EVENTS
================================================== */

function setupEvents() {

    /* SEARCH */

    const search =
        document.getElementById(
            "paymentSearch"
        );

    if (search) {

        search.addEventListener(
            "input",
            function () {

                renderPayments(
                    this.value
                );

            }
        );

    }


    /* PAYMENT MODE FILTER */

    const modeFilter =
        document.getElementById(
            "paymentModeFilter"
        );

    if (modeFilter) {

        modeFilter.addEventListener(
            "change",
            function () {

                renderPayments();

            }
        );

    }


    /* FROM DATE */

    const fromDate =
        document.getElementById(
            "fromDate"
        );

    if (fromDate) {

        fromDate.addEventListener(
            "change",
            function () {

                renderPayments();

            }
        );

    }


    /* TO DATE */

    const toDate =
        document.getElementById(
            "toDate"
        );

    if (toDate) {

        toDate.addEventListener(
            "change",
            function () {

                renderPayments();

            }
        );

    }


    /* CLEAR FILTERS */

    const clearFilters =
        document.getElementById(
            "clearFilters"
        );

    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            function () {

                clearFiltersAndSearch();

            }
        );

    }


    /* REFRESH */

    const refresh =
        document.getElementById(
            "refreshPayments"
        );

    if (refresh) {

        refresh.addEventListener(
            "click",
            function () {

                refreshPayments();

            }
        );

    }


    const refresh2 =
        document.getElementById(
            "refreshPayments2"
        );

    if (refresh2) {

        refresh2.addEventListener(
            "click",
            function () {

                refreshPayments();

            }
        );

    }

}


/* ==================================================
   REFRESH
================================================== */

function refreshPayments() {

    loadPayments();

    renderPayments();

    updateSummary();

}


/* ==================================================
   RENDER PAYMENTS
================================================== */

function renderPayments(
    searchText = ""
) {

    const tbody =
        document.getElementById(
            "paymentTableBody"
        );

    if (!tbody) return;


    const search =
        String(searchText)
            .toLowerCase()
            .trim();


    const modeFilter =
        document.getElementById(
            "paymentModeFilter"
        );


    const selectedMode =
        modeFilter
            ? modeFilter.value
            : "all";


    const fromDate =
        document.getElementById(
            "fromDate"
        );


    const toDate =
        document.getElementById(
            "toDate"
        );


    const fromValue =
        fromDate
            ? fromDate.value
            : "";


    const toValue =
        toDate
            ? toDate.value
            : "";


    let filtered =
        payments.filter(
            function (payment) {

                const customer =
                    String(
                        payment.customer ||
                        payment.customerName ||
                        ""
                    )
                    .toLowerCase();


                const billNo =
                    String(
                        payment.billNo ||
                        payment.billNumber ||
                        payment.invoiceNo ||
                        ""
                    )
                    .toLowerCase();


                const mode =
                    String(
                        payment.paymentMode ||
                        payment.mode ||
                        ""
                    );


                const date =
                    String(
                        payment.date ||
                        payment.paymentDate ||
                        ""
                    );


                /* SEARCH */

                if (
                    search &&
                    !customer.includes(search) &&
                    !billNo.includes(search)
                ) {

                    return false;

                }


                /* MODE */

                if (
                    selectedMode !== "all" &&
                    mode.toLowerCase() !==
                    selectedMode.toLowerCase()
                ) {

                    return false;

                }


                /* FROM DATE */

                if (
                    fromValue &&
                    date &&
                    date < fromValue
                ) {

                    return false;

                }


                /* TO DATE */

                if (
                    toValue &&
                    date &&
                    date > toValue
                ) {

                    return false;

                }


                return true;

            }
        );


    /* EMPTY */

    if (filtered.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-row"
                >
                    No payments found
                </td>
            </tr>
        `;

        return;

    }


    /* TABLE */

    tbody.innerHTML =
        filtered
            .map(
                function (payment, index) {

                    const amount =
                        Number(
                            payment.amount ||
                            payment.total ||
                            0
                        );


                    const customer =
                        payment.customer ||
                        payment.customerName ||
                        "-";


                    const billNo =
                        payment.billNo ||
                        payment.billNumber ||
                        payment.invoiceNo ||
                        "-";


                    const mode =
                        payment.paymentMode ||
                        payment.mode ||
                        "-";


                    const date =
                        payment.date ||
                        payment.paymentDate ||
                        payment.createdAt ||
                        "";


                    return `

                        <tr>

                            <td>
                                ${index + 1}
                            </td>

                            <td>
                                <strong>
                                    ${escapeHtml(billNo)}
                                </strong>
                            </td>

                            <td>
                                ${escapeHtml(customer)}
                            </td>

                            <td>
                                ${formatDate(date)}
                            </td>

                            <td>
                                <span
                                    class="payment-badge ${getPaymentClass(mode)}"
                                >
                                    ${escapeHtml(mode)}
                                </span>
                            </td>

                            <td>
                                <strong>
                                    ${formatMoney(amount)}
                                </strong>
                            </td>

                            <td>

                                <button
                                    type="button"
                                    class="view-btn"
                                    onclick="viewPayment('${escapeJs(payment.id || "")}')"
                                    title="View"
                                >
                                    👁️
                                </button>

                            </td>

                        </tr>

                    `;

                }
            )
            .join("");

}


/* ==================================================
   UPDATE SUMMARY
================================================== */

function updateSummary() {

    let total = 0;
    let cash = 0;
    let upi = 0;
    let card = 0;


    payments.forEach(
        function (payment) {

            const amount =
                Number(
                    payment.amount ||
                    payment.total ||
                    0
                );


            const mode =
                String(
                    payment.paymentMode ||
                    payment.mode ||
                    ""
                )
                .toLowerCase();


            total += amount;


            if (mode === "cash") {

                cash += amount;

            }
            else if (mode === "upi") {

                upi += amount;

            }
            else if (
                mode === "card" ||
                mode === "credit card" ||
                mode === "debit card"
            ) {

                card += amount;

            }

        }
    );


    setText(
        "totalPayments",
        formatMoney(total)
    );


    setText(
        "cashPayments",
        formatMoney(cash)
    );


    setText(
        "upiPayments",
        formatMoney(upi)
    );


    setText(
        "cardPayments",
        formatMoney(card)
    );

}


/* ==================================================
   VIEW PAYMENT
================================================== */

function viewPayment(id) {

    const payment =
        payments.find(
            function (item) {

                return String(item.id) ===
                       String(id);

            }
        );


    if (!payment) {

        alert(
            "Payment details not found."
        );

        return;

    }


    const amount =
        Number(
            payment.amount ||
            payment.total ||
            0
        );


    const customer =
        payment.customer ||
        payment.customerName ||
        "-";


    const billNo =
        payment.billNo ||
        payment.billNumber ||
        payment.invoiceNo ||
        "-";


    const mode =
        payment.paymentMode ||
        payment.mode ||
        "-";


    alert(
        "Payment Details\n\n" +
        "Bill No: " + billNo + "\n" +
        "Customer: " + customer + "\n" +
        "Payment Mode: " + mode + "\n" +
        "Amount: " + formatMoney(amount)
    );

}


/* ==================================================
   CLEAR FILTERS
================================================== */

function clearFiltersAndSearch() {

    const search =
        document.getElementById(
            "paymentSearch"
        );


    const mode =
        document.getElementById(
            "paymentModeFilter"
        );


    const from =
        document.getElementById(
            "fromDate"
        );


    const to =
        document.getElementById(
            "toDate"
        );


    if (search) {

        search.value = "";

    }


    if (mode) {

        mode.value = "all";

    }


    if (from) {

        from.value = "";

    }


    if (to) {

        to.value = "";

    }


    renderPayments();

}


/* ==================================================
   HELPERS
================================================== */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


function formatMoney(
    amount
) {

    return (
        "₹" +
        Number(amount || 0)
            .toLocaleString(
                "en-IN",
                {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }
            )
    );

}


function formatDate(
    value
) {

    if (!value) {

        return "-";

    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return value;

    }


    return date.toLocaleDateString(
        "en-GB"
    );

}


function getPaymentClass(
    mode
) {

    const value =
        String(mode)
            .toLowerCase();


    if (value === "cash") {

        return "cash";

    }


    if (value === "upi") {

        return "upi";

    }


    if (value.includes("card")) {

        return "card";

    }


    return "";

}


function escapeHtml(
    value
) {

    return String(value ?? "")
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}


function escapeJs(
    value
) {

    return String(value ?? "")
        .replace(
            /\\/g,
            "\\\\"
        )
        .replace(
            /'/g,
            "\\'"
        );

}