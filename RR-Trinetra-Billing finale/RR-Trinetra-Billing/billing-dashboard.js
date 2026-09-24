document.addEventListener("DOMContentLoaded", function () {

    loadDashboard();

    setInterval(loadDashboard, 30000);

});



function loadDashboard() {

    const sales =
        JSON.parse(
            localStorage.getItem("rrSales")
        ) || [];


    const products =
        JSON.parse(
            localStorage.getItem("rrProducts")
        ) || [];


    updateDate();

    updateWelcome();

    updateSummary(
        sales,
        products
    );

    loadRecentBills(
        sales
    );

    loadLowStock(
        products
    );

    updateOverview(
        sales,
        products
    );

}



/* DATE */

function updateDate() {

    const dateElement =
        document.getElementById(
            "todayDate"
        );

    if (!dateElement) return;


    const today =
        new Date();


    dateElement.innerText =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric"
            }
        );

}



/* WELCOME */

function updateWelcome() {

    const element =
        document.getElementById(
            "welcomeText"
        );

    if (!element) return;


    const hour =
        new Date().getHours();


    let greeting =
        "Welcome back";


    if (hour < 12) {

        greeting =
            "Good Morning";

    } else if (hour < 17) {

        greeting =
            "Good Afternoon";

    } else {

        greeting =
            "Good Evening";

    }


    element.innerText =
        greeting +
        " • Here's your business overview";

}



/* SUMMARY */

function updateSummary(
    sales,
    products
) {

    const today =
        new Date();


    const todayKey =
        today.toLocaleDateString(
            "en-IN"
        );


    let todaySales = 0;

    let todayBills = 0;


    sales.forEach(
        function (sale) {

            if (!sale.date) return;


            const saleDate =
                new Date(
                    sale.date
                );


            const saleKey =
                saleDate.toLocaleDateString(
                    "en-IN"
                );


            if (
                saleKey ===
                todayKey
            ) {

                todaySales +=
                    Number(
                        sale.total || 0
                    );

                todayBills++;

            }

        }
    );


    const lowStockProducts =
        products.filter(
            function (product) {

                const stock =
                    Number(
                        product.stock || 0
                    );


                const minimum =
                    Number(
                        product.lowStockLimit ||
                        product.minStock ||
                        5
                    );


                return (
                    stock > 0 &&
                    stock <= minimum
                );

            }
        );


    document.getElementById(
        "todaySales"
    ).innerText =
        formatCurrency(
            todaySales
        );


    document.getElementById(
        "todayBills"
    ).innerText =
        todayBills;


    document.getElementById(
        "totalProducts"
    ).innerText =
        products.length;


    document.getElementById(
        "lowStock"
    ).innerText =
        lowStockProducts.length;

}



/* RECENT BILLS */

function loadRecentBills(
    sales
) {

    const container =
        document.getElementById(
            "recentBills"
        );


    if (!container) return;


    container.innerHTML = "";


    if (
        sales.length === 0
    ) {

        container.innerHTML = `
            <tr>
                <td
                    colspan="4"
                    class="empty-row"
                >
                    No sales yet
                </td>
            </tr>
        `;

        return;

    }


    const recent =
        [...sales]
            .sort(
                function (a, b) {

                    return (
                        new Date(b.date) -
                        new Date(a.date)
                    );

                }
            )
            .slice(0, 6);


    recent.forEach(
        function (sale) {

            const row =
                document.createElement(
                    "tr"
                );


            const date =
                sale.date
                    ? new Date(
                        sale.date
                    ).toLocaleDateString(
                        "en-IN"
                    )
                    : "-";


            row.innerHTML = `

                <td>
                    ${escapeHtml(
                        sale.billNo || "-"
                    
                    )}
                </td>

                <td>

                    <span
                        class="payment-badge"
                    >
                        ${escapeHtml(
                            sale.paymentMode ||
                            "-"
                        )}
                    </span>

                </td>

                <td
                    class="amount-cell"
                >
                    ${formatCurrency(
                        Number(
                            sale.total || 0
                        )
                    )}
                </td>

                <td>
                    ${date}
                </td>

            `;


            container.appendChild(
                row
            );

        }
    );

}



/* LOW STOCK */

function loadLowStock(
    products
) {

    const container =
        document.getElementById(
            "lowStockList"
        );


    if (!container) return;


    container.innerHTML = "";


    const lowStock =
        products
            .filter(
                function (product) {

                    const stock =
                        Number(
                            product.stock || 0
                        );


                    const minimum =
                        Number(
                            product.lowStockLimit ||
                            product.minStock ||
                            5
                        );


                    return (
                        stock > 0 &&
                        stock <= minimum
                    );

                }
            )
            .sort(
                function (a, b) {

                    return (
                        Number(a.stock || 0) -
                        Number(b.stock || 0)
                    );

                }
            )
            .slice(0, 6);


    if (
        lowStock.length === 0
    ) {

        container.innerHTML = `

            <div class="empty-stock">

                <div class="empty-icon">
                    ✓
                </div>

                <strong>
                    Stock looks good
                </strong>

                <span>
                    No low-stock products
                </span>

            </div>

        `;

        return;

    }


    lowStock.forEach(
        function (product) {

            const stock =
                Number(
                    product.stock || 0
                );


            const minimum =
                Number(
                    product.lowStockLimit ||
                    product.minStock ||
                    5
                );


            const percentage =
                Math.min(
                    100,
                    Math.max(
                        5,
                        (stock /
                            Math.max(
                                minimum,
                                1
                            )) * 100
                    )
                );


            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "stock-item";


            item.innerHTML = `

                <div>

                    <div
                        class="stock-name"
                    >
                        ${escapeHtml(
                            product.name ||
                            "Unnamed Product"
                        )}
                    </div>

                    <div
                        class="stock-bar"
                    >

                        <div
                            class="stock-progress"
                            style="width:${percentage}%"
                        ></div>

                    </div>

                </div>


                <div
                    class="stock-number"
                >
                    ${stock} left
                </div>

            `;


            container.appendChild(
                item
            );

        }
    );

}



/* OVERVIEW */

function updateOverview(
    sales,
    products
) {

    let totalSales = 0;

    let stockValue = 0;

    let inventoryUnits = 0;


    sales.forEach(
        function (sale) {

            totalSales +=
                Number(
                    sale.total || 0
                );

        }
    );


    products.forEach(
        function (product) {

            const stock =
                Number(
                    product.stock || 0
                );


            const purchaseRate =
                Number(
                    product.purchasePrice ||
                    product.purchaseRate ||
                    0
                );


            inventoryUnits +=
                stock;


            stockValue +=
                stock *
                purchaseRate;

        }
    );


    document.getElementById(
        "totalSales"
    ).innerText =
        formatCurrency(
            totalSales
        );


    document.getElementById(
        "totalBills"
    ).innerText =
        sales.length;


    document.getElementById(
        "stockValue"
    ).innerText =
        formatCurrency(
            stockValue
        );


    document.getElementById(
        "inventoryUnits"
    ).innerText =
        inventoryUnits;

}



/* NAVIGATION */

function openBilling() {

    window.location.href =
        "billing.html";

}


function openInventory() {

    window.location.href =
        "inventory.html";

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



/* SECURITY */

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