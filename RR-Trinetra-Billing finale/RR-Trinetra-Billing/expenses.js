/* =========================================================
   RR TRINETRA BILLING
   EXPENSES JS
========================================================= */

const EXPENSE_KEY = "rrTrinetraExpenses";

let expenses = [];
let editingExpenseId = null;


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadExpenses();

    setTodayDate();

    renderExpenses();

    updateSummary();

    setupEvents();

});


/* =========================================================
   LOAD EXPENSES
========================================================= */

function loadExpenses() {

    try {

        const saved =
            localStorage.getItem(EXPENSE_KEY);

        expenses = saved
            ? JSON.parse(saved)
            : [];

        if (!Array.isArray(expenses)) {
            expenses = [];
        }

    } catch (error) {

        console.error(
            "Unable to load expenses:",
            error
        );

        expenses = [];
    }
}


/* =========================================================
   SAVE EXPENSES
========================================================= */

function saveExpenses() {

    localStorage.setItem(
        EXPENSE_KEY,
        JSON.stringify(expenses)
    );
}


/* =========================================================
   TODAY DATE
========================================================= */

function setTodayDate() {

    const dateInput =
        document.getElementById("expenseDate");

    if (!dateInput) return;

    if (!dateInput.value) {

        const today =
            new Date()
                .toISOString()
                .split("T")[0];

        dateInput.value = today;
    }
}


/* =========================================================
   EVENT SETUP
========================================================= */

function setupEvents() {

    const form =
        document.getElementById("expenseForm");

    if (form) {

        form.addEventListener(
            "submit",
            function (event) {

                event.preventDefault();

                saveExpense();

            }
        );
    }


    const search =
        document.getElementById("expenseSearch");

    if (search) {

        search.addEventListener(
            "input",
            function () {

                renderExpenses(
                    this.value.trim()
                );

            }
        );
    }


    const refresh =
        document.getElementById("refreshExpenses");

    if (refresh) {

        refresh.addEventListener(
            "click",
            function () {

                loadExpenses();

                renderExpenses();

                updateSummary();

            }
        );
    }


    const addButton =
        document.getElementById("addExpenseBtn");

    if (addButton) {

        addButton.addEventListener(
            "click",
            function () {

                openExpenseModal();

            }
        );
    }


    const closeButton =
        document.getElementById("closeExpenseModal");

    if (closeButton) {

        closeButton.addEventListener(
            "click",
            closeExpenseModal
        );
    }


    const cancelButton =
        document.getElementById("cancelExpense");

    if (cancelButton) {

        cancelButton.addEventListener(
            "click",
            closeExpenseModal
        );
    }


    const modal =
        document.getElementById("expenseModal");

    if (modal) {

        modal.addEventListener(
            "click",
            function (event) {

                if (event.target === modal) {
                    closeExpenseModal();
                }

            }
        );
    }

}


/* =========================================================
   OPEN MODAL
========================================================= */

function openExpenseModal(expense = null) {

    const modal =
        document.getElementById("expenseModal");

    const form =
        document.getElementById("expenseForm");

    if (!modal) return;


    editingExpenseId =
        expense ? expense.id : null;


    if (form) {
        form.reset();
    }


    setTodayDate();


    if (expense) {

        setValue(
            "expenseDate",
            expense.date
        );

        setValue(
            "expenseCategory",
            expense.category
        );

        setValue(
            "expenseAmount",
            expense.amount
        );

        setValue(
            "expensePayment",
            expense.payment
        );

        setValue(
            "expenseNote",
            expense.note
        );

    }


    modal.classList.add("show");

}


/* =========================================================
   CLOSE MODAL
========================================================= */

function closeExpenseModal() {

    const modal =
        document.getElementById("expenseModal");

    if (modal) {
        modal.classList.remove("show");
    }

    editingExpenseId = null;

}


/* =========================================================
   SAVE EXPENSE
========================================================= */

function saveExpense() {

    const date =
        getValue("expenseDate");

    const category =
        getValue("expenseCategory");

    const amount =
        parseFloat(
            getValue("expenseAmount")
        ) || 0;

    const payment =
        getValue("expensePayment");

    const note =
        getValue("expenseNote");


    if (!date) {

        alert("Please select expense date.");

        return;
    }


    if (!category) {

        alert("Please select expense category.");

        return;
    }


    if (amount <= 0) {

        alert("Please enter a valid expense amount.");

        return;
    }


    if (!payment) {

        alert("Please select payment mode.");

        return;
    }


    /* EDIT */

    if (editingExpenseId) {

        const index =
            expenses.findIndex(
                function (item) {

                    return item.id ===
                        editingExpenseId;

                }
            );


        if (index !== -1) {

            expenses[index] = {

                ...expenses[index],

                date: date,

                category: category,

                amount: amount,

                payment: payment,

                note: note

            };

        }

    }


    /* NEW EXPENSE */

    else {

        expenses.unshift({

            id:
                "EXP-" +
                Date.now(),

            date: date,

            category: category,

            amount: amount,

            payment: payment,

            note: note,

            createdAt:
                new Date().toISOString()

        });

    }


    saveExpenses();

    renderExpenses();

    updateSummary();

    closeExpenseModal();

}


/* =========================================================
   RENDER EXPENSES
========================================================= */

function renderExpenses(searchText = "") {

    const tbody =
        document.getElementById(
            "expenseTableBody"
        );

    if (!tbody) return;


    const search =
        String(searchText)
            .toLowerCase()
            .trim();


    let filtered =
        expenses.filter(
            function (expense) {

                if (!search) {
                    return true;
                }


                return (

                    String(
                        expense.category || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        expense.payment || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        expense.note || ""
                    )
                        .toLowerCase()
                        .includes(search)

                    ||

                    String(
                        expense.id || ""
                    )
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    if (filtered.length === 0) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="empty-row"
                >
                    No expenses found
                </td>
            </tr>
        `;

        return;
    }


    tbody.innerHTML =
        filtered.map(
            function (expense, index) {

                return `

                    <tr>

                        <td>
                            ${index + 1}
                        </td>

                        <td>
                            <strong>
                                ${escapeHtml(
                                    expense.category
                                )}
                            </strong>
                        </td>

                        <td>
                            ${formatDate(
                                expense.date
                            )}
                        </td>

                        <td>
                            ${escapeHtml(
                                expense.payment
                            )}
                        </td>

                        <td>
                            <strong>
                                ₹${formatMoney(
                                    expense.amount
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHtml(
                                expense.note || "-"
                            )}
                        </td>

                        <td>

                            <button
                                type="button"
                                onclick="editExpense('${expense.id}')"
                                title="Edit"
                            >
                                ✏️
                            </button>

                            <button
                                type="button"
                                onclick="deleteExpense('${expense.id}')"
                                title="Delete"
                            >
                                🗑️
                            </button>

                        </td>

                    </tr>

                `;

            }
        ).join("");

}


/* =========================================================
   EDIT EXPENSE
========================================================= */

function editExpense(id) {

    const expense =
        expenses.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!expense) return;


    openExpenseModal(expense);

}


/* =========================================================
   DELETE EXPENSE
========================================================= */

function deleteExpense(id) {

    const expense =
        expenses.find(
            function (item) {

                return item.id === id;

            }
        );


    if (!expense) return;


    const confirmed =
        confirm(
            `Delete expense "${expense.category}"?`
        );


    if (!confirmed) return;


    expenses =
        expenses.filter(
            function (item) {

                return item.id !== id;

            }
        );


    saveExpenses();

    renderExpenses();

    updateSummary();

}


/* =========================================================
   SUMMARY
========================================================= */

function updateSummary() {

    const total =
        expenses.reduce(
            function (sum, expense) {

                return sum +
                    Number(expense.amount || 0);

            },
            0
        );


    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayTotal =
        expenses
            .filter(
                function (expense) {

                    return expense.date === today;

                }
            )
            .reduce(
                function (sum, expense) {

                    return sum +
                        Number(expense.amount || 0);

                },
                0
            );


    const now =
        new Date();

    const currentMonth =
        now.getMonth();

    const currentYear =
        now.getFullYear();


    const monthTotal =
        expenses
            .filter(
                function (expense) {

                    const date =
                        new Date(
                            expense.date
                        );

                    return (
                        date.getMonth() ===
                            currentMonth

                        &&

                        date.getFullYear() ===
                            currentYear
                    );

                }
            )
            .reduce(
                function (sum, expense) {

                    return sum +
                        Number(expense.amount || 0);

                },
                0
            );


    setText(
        "totalExpenses",
        "₹" + formatMoney(total)
    );

    setText(
        "todayExpenses",
        "₹" + formatMoney(todayTotal)
    );

    setText(
        "monthExpenses",
        "₹" + formatMoney(monthTotal)
    );

    setText(
        "expenseCount",
        expenses.length
    );

}


/* =========================================================
   HELPERS
========================================================= */

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";

}


function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value =
            value ?? "";
    }

}


function setText(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.textContent =
            value;
    }

}


function formatMoney(value) {

    return Number(value || 0)
        .toLocaleString(
            "en-IN",
            {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
            }
        );

}


function formatDate(dateString) {

    if (!dateString) {
        return "-";
    }


    const parts =
        dateString.split("-");


    if (parts.length !== 3) {
        return dateString;
    }


    return (
        parts[2] +
        "/" +
        parts[1] +
        "/" +
        parts[0]
    );

}


function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.openExpenseModal =
    openExpenseModal;

window.closeExpenseModal =
    closeExpenseModal;

window.editExpense =
    editExpense;

window.deleteExpense =
    deleteExpense;