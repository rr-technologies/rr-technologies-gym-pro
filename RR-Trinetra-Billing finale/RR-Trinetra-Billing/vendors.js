let vendors = [];

let editingVendorId = null;


/* =========================
   INITIALIZE
========================= */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadVendors();

        const search =
            document.getElementById(
                "vendorSearch"
            );

        if (search) {

            search.addEventListener(
                "input",
                function () {

                    renderVendors(
                        this.value
                    );

                }
            );

        }

    }
);


/* =========================
   LOAD VENDORS
========================= */

function loadVendors() {

    vendors =
        JSON.parse(
            localStorage.getItem(
                "rrVendors"
            )
        ) || [];

    updateSummary();

    renderVendors();

}


/* =========================
   SAVE VENDOR
========================= */

function saveVendor(event) {

    event.preventDefault();


    const name =
        document.getElementById(
            "vendorName"
        ).value.trim();


    const mobile =
        document.getElementById(
            "vendorMobile"
        ).value.trim();


    const gstin =
        document.getElementById(
            "vendorGSTIN"
        ).value.trim()
        .toUpperCase();


    const email =
        document.getElementById(
            "vendorEmail"
        ).value.trim();


    const city =
        document.getElementById(
            "vendorCity"
        ).value.trim();


    const address =
        document.getElementById(
            "vendorAddress"
        ).value.trim();


    if (!name || !mobile) {

        alert(
            "Please enter vendor name and mobile number."
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


    /* EDIT EXISTING */

    if (editingVendorId) {

        const index =
            vendors.findIndex(
                function (vendor) {

                    return (
                        vendor.id ===
                        editingVendorId
                    );

                }
            );


        if (index !== -1) {

            vendors[index] = {

                ...vendors[index],

                name,
                mobile,
                gstin,
                email,
                city,
                address

            };

        }

    }


    /* ADD NEW */

    else {

        const vendor = {

            id:
                "VEN-" +
                Date.now(),

            name,

            mobile,

            gstin,

            email,

            city,

            address,

            purchases: 0,

            purchaseValue: 0,

            status: "Active",

            createdAt:
                new Date().toISOString()

        };


        vendors.push(
            vendor
        );

    }


    localStorage.setItem(
        "rrVendors",
        JSON.stringify(
            vendors
        )
    );


    closeVendorModal();

    loadVendors();

}


/* =========================
   RENDER VENDORS
========================= */

function renderVendors(
    searchText = ""
) {

    const table =
        document.getElementById(
            "vendorTable"
        );


    if (!table) return;


    const search =
        searchText
            .toLowerCase()
            .trim();


    const filtered =
        vendors.filter(
            function (vendor) {

                return (

                    vendor.name
                        .toLowerCase()
                        .includes(search)

                    ||

                    vendor.mobile
                        .includes(search)

                    ||

                    (vendor.gstin || "")
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
                            ? "No vendors found"
                            : "No vendors added yet"
                    }

                </td>

            </tr>

        `;

        return;

    }


    filtered.forEach(
        function (vendor) {

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>

                    <div
                        class="vendor-name"
                    >
                        ${escapeHtml(
                            vendor.name
                        )}
                    </div>

                    ${
                        vendor.email
                            ? `
                            <span
                                class="vendor-email"
                            >
                                ${escapeHtml(
                                    vendor.email
                                )}
                            </span>
                            `
                            : ""
                    }

                </td>


                <td>

                    <span
                        class="vendor-mobile"
                    >
                        ${escapeHtml(
                            vendor.mobile
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="gstin"
                    >
                        ${
                            vendor.gstin
                                ? escapeHtml(
                                    vendor.gstin
                                )
                                : "—"
                        }
                    </span>

                </td>


                <td>
                    ${Number(
                        vendor.purchases || 0
                    )}
                </td>


                <td>

                    <span
                        class="purchase-amount"
                    >
                        ${formatCurrency(
                            vendor.purchaseValue
                        )}
                    </span>

                </td>


                <td>

                    <span
                        class="status-badge"
                    >
                        ${escapeHtml(
                            vendor.status ||
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
                            onclick="editVendor('${vendor.id}')"
                        >
                            ✏️
                        </button>


                        <button
                            class="action-btn delete-btn"
                            title="Delete"
                            onclick="deleteVendor('${vendor.id}')"
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


/* =========================
   SUMMARY
========================= */

function updateSummary() {

    const total =
        vendors.length;


    const active =
        vendors.filter(
            function (vendor) {

                return (
                    vendor.status !==
                    "Inactive"
                );

            }
        ).length;


    let purchases = 0;

    let purchaseValue = 0;


    vendors.forEach(
        function (vendor) {

            purchases +=
                Number(
                    vendor.purchases || 0
                );

            purchaseValue +=
                Number(
                    vendor.purchaseValue || 0
                );

        }
    );


    document.getElementById(
        "totalVendors"
    ).innerText =
        total;


    document.getElementById(
        "activeVendors"
    ).innerText =
        active;


    document.getElementById(
        "totalPurchases"
    ).innerText =
        purchases;


    document.getElementById(
        "purchaseValue"
    ).innerText =
        formatCurrency(
            purchaseValue
        );

}


/* =========================
   OPEN MODAL
========================= */

function openVendorModal() {

    editingVendorId =
        null;


    document.getElementById(
        "modalTitle"
    ).innerText =
        "Add Vendor";


    document.getElementById(
        "vendorForm"
    ).reset();


    document.getElementById(
        "vendorId"
    ).value = "";


    document.getElementById(
        "vendorModal"
    ).classList.add(
        "show"
    );


    setTimeout(
        function () {

            document.getElementById(
                "vendorName"
            ).focus();

        },
        100
    );

}


/* =========================
   CLOSE MODAL
========================= */

function closeVendorModal() {

    document.getElementById(
        "vendorModal"
    ).classList.remove(
        "show"
    );

    editingVendorId =
        null;

}


/* =========================
   EDIT VENDOR
========================= */

function editVendor(
    id
) {

    const vendor =
        vendors.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!vendor) return;


    editingVendorId =
        id;


    document.getElementById(
        "modalTitle"
    ).innerText =
        "Edit Vendor";


    document.getElementById(
        "vendorId"
    ).value =
        vendor.id;


    document.getElementById(
        "vendorName"
    ).value =
        vendor.name || "";


    document.getElementById(
        "vendorMobile"
    ).value =
        vendor.mobile || "";


    document.getElementById(
        "vendorGSTIN"
    ).value =
        vendor.gstin || "";


    document.getElementById(
        "vendorEmail"
    ).value =
        vendor.email || "";


    document.getElementById(
        "vendorCity"
    ).value =
        vendor.city || "";


    document.getElementById(
        "vendorAddress"
    ).value =
        vendor.address || "";


    document.getElementById(
        "vendorModal"
    ).classList.add(
        "show"
    );

}


/* =========================
   DELETE VENDOR
========================= */

function deleteVendor(
    id
) {

    const vendor =
        vendors.find(
            function (item) {

                return (
                    item.id === id
                );

            }
        );


    if (!vendor) return;


    const confirmDelete =
        confirm(
            `Delete vendor "${vendor.name}"?`
        );


    if (!confirmDelete) return;


    vendors =
        vendors.filter(
            function (item) {

                return (
                    item.id !== id
                );

            }
        );


    localStorage.setItem(
        "rrVendors",
        JSON.stringify(
            vendors
        )
    );


    loadVendors();

}


/* =========================
   CURRENCY
========================= */

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


/* =========================
   ESCAPE HTML
========================= */

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


/* =========================
   CLOSE ON OUTSIDE CLICK
========================= */

document.addEventListener(
    "click",
    function (event) {

        const modal =
            document.getElementById(
                "vendorModal"
            );


        if (
            event.target === modal
        ) {

            closeVendorModal();

        }

    }
);