let customers = [];

let editingCustomerId = null;


document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCustomers();

        const search =
            document.getElementById(
                "customerSearch"
            );

        if (search) {

            search.addEventListener(
                "input",
                function () {

                    renderCustomers(
                        this.value
                    );

                }
            );

        }

    }
);


/* LOAD */

function loadCustomers() {

    customers =
        JSON.parse(
            localStorage.getItem(
                "rrCustomers"
            )
        ) || [];

    updateSummary();

    renderCustomers();

}


/* SAVE */

function saveCustomer(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "customerName"
        ).value.trim();


    const mobile =
        document.getElementById(
            "customerMobile"
        ).value.trim();


    const gstin =
        document.getElementById(
            "customerGSTIN"
        ).value.trim()
        .toUpperCase();


    const email =
        document.getElementById(
            "customerEmail"
        ).value.trim();


    const city =
        document.getElementById(
            "customerCity"
        ).value.trim();


    const address =
        document.getElementById(
            "customerAddress"
        ).value.trim();


    if (!name || !mobile) {

        alert(
            "Please enter customer name and mobile number."
        );

        return;

    }


    if (
        !/^[0-9]{10}$/.test(
            mobile
        )
    ) {

        alert(
            "Please enter a valid 10 digit mobile number."
        );

        return;

    }


    if (editingCustomerId) {

        const index =
            customers.findIndex(
                function (customer) {

                    return (
                        customer.id ===
                        editingCustomerId
                    );

                }
            );


        if (index !== -1) {

            customers[index] = {

                ...customers[index],

                name,
                mobile,
                gstin,
                email,
                city,
                address

            };

        }

    } else {

        const customer = {

            id:
                "CUS-" +
                Date.now(),

            name,

            mobile,

            gstin,

            email,

            city,

            address,

            bills: 0,

            totalBusiness: 0,

            status: "Active",

            createdAt:
                new Date().toISOString()

        };


        customers.push(
            customer
        );

    }


    localStorage.setItem(
        "rrCustomers",
        JSON.stringify(
            customers
        )
    );


    closeCustomerModal();

    loadCustomers();

}


/* RENDER */

function renderCustomers(
    searchText = ""
) {

    const table =
        document.getElementById(
            "customerTable"
        );


    if (!table) return;


    const search =
        searchText
            .toLowerCase()
            .trim();


    const filtered =
        customers.filter(
            function (customer) {

                return (

                    customer.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    customer.mobile
                        .includes(search)

                    ||

                    (customer.gstin || "")
                        .toLowerCase()
                        .includes(search)

                );

            }
        );


    table.innerHTML = "";


    if (
        filtered.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="7"
                    class="empty-row"
                >

                    ${
                        search
                            ? "No customers found"
                            : "No customers added yet"
                    }

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(
        function (customer) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div
                        class="customer-name"
                    >
                        ${escapeHtml(
                            customer.name
                        )}
                    </div>

                    ${
                        customer.email
                            ? `
                            <span
                                class="customer-email"
                            >
                                ${escapeHtml(
                                    customer.email
                                )}
                            </span>
                            `
                            : ""
                    }

                </td>


                <td>

                    <span
                        class="customer-mobile"
                    >
                        ${escapeHtml(
                            customer.mobile
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="gstin"
                    >
                        ${
                            customer.gstin
                                ? escapeHtml(
                                    customer.gstin
                                )
                                : "—"
                        }
                    </span>

                </td>


                <td>
                    ${Number(
                        customer.bills || 0
                    )}
                </td>


                <td>

                    <span
                        class="business-amount"
                    >
                        ${formatCurrency(
                            customer.totalBusiness
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="status-badge"
                    >
                        ${escapeHtml(
                            customer.status ||
                            "Active"
                        )}
                    </span>

                </td>


                <td>

                    <div
                        class="action-buttons"
                    >

                        <button
                            class="action-btn"
                            title="Edit"
                            onclick="editCustomer('${customer.id}')"
                        >
                            ✏️
                        </button>

                        <button
                            class="action-btn delete-btn"
                            title="Delete"
                            onclick="deleteCustomer('${customer.id}')"
                        >
                            🗑️
                        </button>

                    </div>

                </td>

            `;


            table.appendChild(
                row
            );

        }
    );

}


/* SUMMARY */

function updateSummary() {

    const total =
        customers.length;


    const active =
        customers.filter(
            function (customer) {

                return (
                    customer.status !==
                    "Inactive"
                );

            }
        ).length;


    let bills = 0;

    let business = 0;


    customers.forEach(
        function (customer) {

            bills +=
                Number(
                    customer.bills || 0
                );

            business +=
                Number(
                    customer.totalBusiness || 0
                );

        }
    );


    document.getElementById(
        "totalCustomers"
    ).innerText =
        total;


    document.getElementById(
        "activeCustomers"
    ).innerText =
        active;


    document.getElementById(
        "totalBills"
    ).innerText =
        bills;


    document.getElementById(
        "totalBusiness"
    ).innerText =
        formatCurrency(
            business
        );

}


/* MODAL */

function openCustomerModal() {

    editingCustomerId =
        null;


    document.getElementById(
        "modalTitle"
    ).innerText =
        "Add Customer";


    document.getElementById(
        "customerForm"
    ).reset();


    document.getElementById(
        "customerId"
    ).value = "";


    document.getElementById(
        "customerModal"
    ).classList.add(
        "show"
    );


    setTimeout(
        function () {

            document.getElementById(
                "customerName"
            ).focus();

        },
        100
    );

}


function closeCustomerModal() {

    document.getElementById(
        "customerModal"
    ).classList.remove(
        "show"
    );

    editingCustomerId =
        null;

}


/* EDIT */

function editCustomer(
    id
) {

    const customer =
        customers.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!customer) return;


    editingCustomerId =
        id;


    document.getElementById(
        "modalTitle"
    ).innerText =
        "Edit Customer";


    document.getElementById(
        "customerId"
    ).value =
        customer.id;


    document.getElementById(
        "customerName"
    ).value =
        customer.name || "";


    document.getElementById(
        "customerMobile"
    ).value =
        customer.mobile || "";


    document.getElementById(
        "customerGSTIN"
    ).value =
        customer.gstin || "";


    document.getElementById(
        "customerEmail"
    ).value =
        customer.email || "";


    document.getElementById(
        "customerCity"
    ).value =
        customer.city || "";


    document.getElementById(
        "customerAddress"
    ).value =
        customer.address || "";


    document.getElementById(
        "customerModal"
    ).classList.add(
        "show"
    );

}


/* DELETE */

function deleteCustomer(
    id
) {

    const customer =
        customers.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!customer) return;


    const confirmDelete =
        confirm(
            `Delete customer "${customer.name}"?`
        );


    if (!confirmDelete) return;


    customers =
        customers.filter(
            function (item) {

                return (
                    item.id !== id
                );

            }
        );


    localStorage.setItem(
        "rrCustomers",
        JSON.stringify(
            customers
        )
    );


    loadCustomers();

}


/* CURRENCY */

function formatCurrency(
    amount
) {

    return Number(
        amount || 0
    ).toLocaleString(
        "en-IN",
        {
            style: "currency",
            currency: "INR",
            minimumFractionDigits: 2
        }
    );

}


/* ESCAPE */

function escapeHtml(
    value
) {

    return String(
        value ?? ""
    )
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


/* CLOSE MODAL ON OUTSIDE CLICK */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "customerModal"
            );


        if (
            event.target === modal
        ) {

            closeCustomerModal();

        }

    }
);