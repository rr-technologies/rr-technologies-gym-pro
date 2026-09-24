// ==========================================
// RR TRINETRA BILLING
// DIRECT POS BILLING
// ==========================================

let cart = [];
let selectedPaymentMode = "Cash";


// ==========================================
// PAGE LOAD
// ==========================================

document.addEventListener("DOMContentLoaded", function () {

    loadData();
    setupEvents();

});


// ==========================================
// LOAD ALL DATA
// ==========================================

function loadData() {

    setBillDate();
    loadBillNumber();
    loadCustomers();
    loadProducts();
    updateTotals();

}


// ==========================================
// BILL DATE
// ==========================================

function setBillDate() {

    const billDate =
        document.getElementById("billDate");

    if (!billDate) return;

    const now = new Date();

    billDate.textContent =
        now.toLocaleDateString("en-IN");

}


// ==========================================
// BILL NUMBER
// ==========================================

function loadBillNumber() {

    const billNumber =
        document.getElementById("billNumber");

    if (!billNumber) return;

    const lastBillNumber =
        parseInt(
            localStorage.getItem(
                "rrLastBillNumber"
            )
        ) || 1000;

    billNumber.textContent =
        "BILL-" + (lastBillNumber + 1);

}


// ==========================================
// LOAD CUSTOMERS
// ==========================================

function loadCustomers() {

    const customerSelect =
        document.getElementById(
            "customerSelect"
        );

    if (!customerSelect) return;


    customerSelect.innerHTML = `
        <option value="">
            Walk-in Customer
        </option>
    `;


    let customers = [];


    try {

        customers =
            JSON.parse(
                localStorage.getItem(
                    "rrCustomers"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Customer data error:",
            error
        );

        customers = [];

    }


    customers.forEach(
        function (customer, index) {

            const option =
                document.createElement(
                    "option"
                );


            option.value =
                customer.id ||
                customer.customerId ||
                index;


            const name =
                customer.name ||
                customer.customerName ||
                customer.businessName ||
                "Unnamed Customer";


            const mobile =
                customer.mobile ||
                customer.phone ||
                "";


            option.textContent =
                mobile
                    ? `${name} - ${mobile}`
                    : name;


            customerSelect.appendChild(
                option
            );

        }
    );

}


// ==========================================
// LOAD PRODUCTS
// ==========================================

function loadProducts() {

    const productGrid =
        document.getElementById(
            "productGrid"
        );

    if (!productGrid) return;


    let products = [];


    try {

        products =
            JSON.parse(
                localStorage.getItem(
                    "rrProducts"
                )
            ) || [];

    } catch (error) {

        console.error(
            "Product data error:",
            error
        );

        products = [];

    }


    renderProducts(products);

}


// ==========================================
// RENDER PRODUCTS
// IMPORTANT:
// NO STOCK
// NO SELLING PRICE
// ==========================================

function renderProducts(products) {

    const productGrid =
        document.getElementById(
            "productGrid"
        );

    if (!productGrid) return;


    productGrid.innerHTML = "";


    if (!products.length) {

        productGrid.innerHTML = `
            <div class="empty-cart">

                <div class="empty-icon">
                    📦
                </div>

                <strong>
                    No products available
                </strong>

                <span>
                    Add products from Products page.
                </span>

            </div>
        `;

        return;

    }


    products.forEach(
        function (product) {

            const name =
                product.name ||
                product.productName ||
                "Product";


            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            // IMPORTANT:
            // PRICE & STOCK ARE NOT SHOWN

            card.innerHTML = `

                <div class="product-card-name">
                    ${escapeHtml(name)}
                </div>

                <button
                    class="secondary-btn"
                    type="button"
                >
                    Add
                </button>

            `;


            const addButton =
                card.querySelector(
                    "button"
                );


            addButton.addEventListener(
                "click",
                function () {

                    addToCart(product);

                }
            );


            productGrid.appendChild(
                card
            );

        }
    );

}


// ==========================================
// ADD PRODUCT TO CART
// PRICE STARTS AT 0
// USER ENTERS PRICE MANUALLY
// ==========================================

function addToCart(product) {

    const productId =
        product.id ||
        product.productId ||
        product.sku ||
        product.name;


    const existing =
        cart.find(
            function (item) {

                return item.id === productId;

            }
        );


    if (existing) {

        existing.qty++;

    } else {

        cart.push({

            id: productId,

            name:
                product.name ||
                product.productName ||
                "Product",

            qty: 1,

            // NO AUTO PRICE
            rate: 0

        });

    }


    renderCart();
    updateTotals();

}


// ==========================================
// RENDER CART
// MANUAL QTY + MANUAL RATE
// ==========================================

function renderCart() {

    const cartItems =
        document.getElementById(
            "cartItems"
        );


    const emptyCart =
        document.getElementById(
            "emptyCart"
        );


    if (!cartItems) return;


    cartItems.innerHTML = "";


    if (!cart.length) {

        if (emptyCart) {

            emptyCart.style.display =
                "flex";

        }

        return;

    }


    if (emptyCart) {

        emptyCart.style.display =
            "none";

    }


    cart.forEach(
        function (item, index) {

            const row =
                document.createElement(
                    "div"
                );


            row.className =
                "cart-row";


            const total =
                Number(item.qty) *
                Number(item.rate);


            row.innerHTML = `

                <span class="cart-item-name">
                    ${escapeHtml(item.name)}
                </span>


                <span class="cart-qty-cell">

                    <input
                        type="number"
                        class="cart-qty-input"
                        min="1"
                        step="1"
                        value="${item.qty}"
                    >

                </span>


                <span class="cart-rate-cell">

                    <input
                        type="number"
                        class="cart-rate-input"
                        min="0"
                        step="0.01"
                        value="${item.rate || ""}"
                        placeholder="Enter rate"
                    >

                </span>


                <span class="cart-total-cell">
                    ₹${total.toFixed(2)}
                </span>


                <button
                    type="button"
                    class="remove-cart-btn"
                    title="Remove item"
                >
                    ×
                </button>

            `;


            // ==============================
            // QUANTITY
            // ==============================

            const qtyInput =
                row.querySelector(
                    ".cart-qty-input"
                );


            qtyInput.addEventListener(
                "input",
                function () {

                    let qty =
                        Number(
                            qtyInput.value
                        );


                    if (!Number.isFinite(qty)) {

                        qty = 1;

                    }


                    qty =
                        Math.max(
                            1,
                            Math.floor(qty)
                        );


                    item.qty = qty;


                    updateCartRow(
                        row,
                        item
                    );

                    updateTotals();

                }
            );


            // ==============================
            // MANUAL RATE
            // ==============================

            const rateInput =
                row.querySelector(
                    ".cart-rate-input"
                );


            rateInput.addEventListener(
                "input",
                function () {

                    let rate =
                        Number(
                            rateInput.value
                        );


                    if (
                        !Number.isFinite(
                            rate
                        )
                    ) {

                        rate = 0;

                    }


                    item.rate =
                        Math.max(
                            0,
                            rate
                        );


                    updateCartRow(
                        row,
                        item
                    );

                    updateTotals();

                }
            );


            // ==============================
            // REMOVE
            // ==============================

            const removeButton =
                row.querySelector(
                    ".remove-cart-btn"
                );


            removeButton.addEventListener(
                "click",
                function () {

                    cart.splice(
                        index,
                        1
                    );


                    renderCart();
                    updateTotals();

                }
            );


            cartItems.appendChild(
                row
            );

        }
    );

}


// ==========================================
// UPDATE SINGLE CART ROW
// ==========================================

function updateCartRow(
    row,
    item
) {

    const total =
        Number(item.qty) *
        Number(item.rate);


    const totalCell =
        row.querySelector(
            ".cart-total-cell"
        );


    if (totalCell) {

        totalCell.textContent =
            "₹" + total.toFixed(2);

    }

}


// ==========================================
// TOTALS
// ==========================================

function updateTotals() {

    let subtotal = 0;


    cart.forEach(
        function (item) {

            subtotal +=
                Number(item.qty) *
                Number(item.rate);

        }
    );


    const discountInput =
        document.getElementById(
            "discount"
        );


    const discount =
        Number(
            discountInput?.value || 0
        );


    const safeDiscount =
        Math.min(
            Math.max(
                0,
                discount
            ),
            subtotal
        );


    const taxable =
        Math.max(
            0,
            subtotal - safeDiscount
        );


    // GST currently 0%
    const gst = 0;


    const beforeRound =
        taxable + gst;


    const rounded =
        Math.round(
            beforeRound
        );


    const roundOff =
        rounded - beforeRound;


    const total =
        rounded;


    const subtotalElement =
        document.getElementById(
            "subtotal"
        );


    const gstElement =
        document.getElementById(
            "gst"
        );


    const roundOffElement =
        document.getElementById(
            "roundOff"
        );


    const totalElement =
        document.getElementById(
            "total"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            subtotal.toFixed(2);

    }


    if (gstElement) {

        gstElement.textContent =
            gst.toFixed(2);

    }


    if (roundOffElement) {

        roundOffElement.textContent =
            roundOff.toFixed(2);

    }


    if (totalElement) {

        totalElement.textContent =
            total.toFixed(2);

    }


    updateChange();

}


// ==========================================
// CHANGE / BALANCE
// ==========================================

function updateChange() {
    const total =
        Number(
            document.getElementById(
                "total"
            )?.textContent || 0
        );

    const received =
        Number(
            document.getElementById(
                "amountReceived"
            )?.value || 0
        );

    const difference = received - total;

    const changeElement =
        document.getElementById(
            "changeAmount"
        );

    if (!changeElement) return;

    if (difference < 0) {
        changeElement.textContent =
            "Balance Due ₹" +
            Math.abs(difference).toFixed(2);

        changeElement.classList.add("negative");
    } else if (difference > 0) {
        changeElement.textContent =
            "Change ₹" +
            difference.toFixed(2);

        changeElement.classList.remove("negative");
    } else {
        changeElement.textContent =
            "₹0.00";

        changeElement.classList.remove("negative");
    }
}


// ==========================================
// EVENTS
// ==========================================

function setupEvents() {


    // ==============================
    // DISCOUNT
    // ==============================

    const discount =
        document.getElementById(
            "discount"
        );


    if (discount) {

        discount.addEventListener(
            "input",
            updateTotals
        );

    }


    // ==============================
    // AMOUNT RECEIVED
    // ==============================

    const amountReceived =
        document.getElementById(
            "amountReceived"
        );


    if (amountReceived) {

        amountReceived.addEventListener(
            "input",
            updateChange
        );

    }


    // ==============================
    // CLEAR BILL
    // ==============================

    const clearCart =
        document.getElementById(
            "clearCart"
        );


    if (clearCart) {

        clearCart.addEventListener(
            "click",
            clearCurrentBill
        );

    }


    // ==============================
    // PAYMENT MODE
    // ==============================

    document
        .querySelectorAll(
            ".payment-btn"
        )
        .forEach(
            function (button) {

                button.addEventListener(
                    "click",
                    function () {

                        document
                            .querySelectorAll(
                                ".payment-btn"
                            )
                            .forEach(
                                function (btn) {

                                    btn.classList.remove(
                                        "active"
                                    );

                                }
                            );


                        button.classList.add(
                            "active"
                        );


                        selectedPaymentMode =
                            button.dataset.mode;


                        updateChange();

                    }
                );

            }
        );


    // ==============================
    // SEARCH
    // ==============================

    const searchBox =
        document.getElementById(
            "searchBox"
        );


    if (searchBox) {

        searchBox.addEventListener(
            "input",
            searchProducts
        );

    }


    // ==============================
    // CLEAR SEARCH
    // ==============================

    const clearSearch =
        document.getElementById(
            "clearSearch"
        );


    if (clearSearch) {

        clearSearch.addEventListener(
            "click",
            function () {

                if (searchBox) {

                    searchBox.value = "";

                }

                loadProducts();

            }
        );

    }


    // ==============================
    // HIDE STOCK FILTERS
    // POS DOES NOT USE STOCK
    // ==============================

    document
        .querySelectorAll(
            ".quick-filters"
        )
        .forEach(
            function (filterBox) {

                filterBox.style.display =
                    "none";

            }
        );


    // ==============================
    // COMPLETE BILL
    // ==============================

    const completeButton =
        document.getElementById(
            "completeBill"
        );


    if (completeButton) {

        completeButton.addEventListener(
            "click",
            completeBill
        );

    }

}


// ==========================================
// SEARCH PRODUCTS
// ==========================================

function searchProducts() {

    const searchBox =
        document.getElementById(
            "searchBox"
        );


    if (!searchBox) return;


    const search =
        searchBox.value
            .trim()
            .toLowerCase();


    let products = [];


    try {

        products =
            JSON.parse(
                localStorage.getItem(
                    "rrProducts"
                )
            ) || [];

    } catch (error) {

        products = [];

    }


    if (!search) {

        renderProducts(
            products
        );

        return;

    }


    const filtered =
        products.filter(
            function (product) {

                const name =
                    String(
                        product.name ||
                        product.productName ||
                        ""
                    ).toLowerCase();


                const sku =
                    String(
                        product.sku ||
                        ""
                    ).toLowerCase();


                const barcode =
                    String(
                        product.barcode ||
                        ""
                    ).toLowerCase();


                return (
                    name.includes(search) ||
                    sku.includes(search) ||
                    barcode.includes(search)
                );

            }
        );


    renderProducts(
        filtered
    );

}


// ==========================================
// CLEAR CURRENT BILL
// ==========================================

function clearCurrentBill() {

    cart = [];


    const customerSelect =
        document.getElementById(
            "customerSelect"
        );


    if (customerSelect) {

        customerSelect.value = "";

    }


    const discount =
        document.getElementById(
            "discount"
        );


    if (discount) {

        discount.value = "0";

    }


    const amountReceived =
        document.getElementById(
            "amountReceived"
        );


    if (amountReceived) {

        amountReceived.value = "0";

    }


    selectedPaymentMode =
        "Cash";


    document
        .querySelectorAll(
            ".payment-btn"
        )
        .forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.mode ===
                    "Cash"
                );

            }
        );


    renderCart();

    updateTotals();

}


// ==========================================
// COMPLETE BILL
// ==========================================

function completeBill() {

    // ==============================
    // CHECK ITEMS
    // ==============================

    if (!cart.length) {

        alert(
            "Please add at least one product."
        );

        return;

    }


    // ==============================
    // CHECK MANUAL RATES
    // ==============================

    const invalidRate =
        cart.find(
            function (item) {

                return (
                    !Number.isFinite(
                        Number(item.rate)
                    ) ||
                    Number(item.rate) <= 0
                );

            }
        );


    if (invalidRate) {

        alert(
            `Please enter rate for "${invalidRate.name}".`
        );

        return;

    }


    // ==============================
    // CUSTOMER
    // ==============================

    const customerSelect =
        document.getElementById(
            "customerSelect"
        );


    const customerId =
        customerSelect
            ? customerSelect.value
            : "";


    const customerName =
        customerSelect &&
        customerSelect.selectedIndex >= 0
            ? customerSelect.options[
                customerSelect.selectedIndex
            ].text
            : "Walk-in Customer";


    // ==============================
    // TOTAL
    // ==============================

    const total =
        Number(
            document.getElementById(
                "total"
            )?.textContent || 0
        );


    // ==============================
    // AMOUNT RECEIVED
    // ==============================

    const amountReceived =
        Number(
            document.getElementById(
                "amountReceived"
            )?.value || 0
        );

        // ================================
// PAYMENT SUMMARY
// ================================

const pendingAmount = Math.max(
    total - amountReceived,
    0
);

const paymentStatus =
    pendingAmount > 0
        ? "Pending"
        : "Paid";

    // ==============================
    // PAYMENT VALIDATION
    // ==============================


    // ==============================
    // LOAD SALES
    // ==============================

    let sales = [];


    try {

        sales =
            JSON.parse(
                localStorage.getItem(
                    "rrSales"
                )
            ) || [];

    } catch (error) {

        sales = [];

    }


    // ==============================
    // BILL NUMBER
    // ==============================

    let lastBillNumber =
        parseInt(
            localStorage.getItem(
                "rrLastBillNumber"
            )
        ) || 1000;


    lastBillNumber++;


    // ==============================
    // BILL DATA
    // ==============================

    const bill = {

        billNo:
            "BILL-" +
            lastBillNumber,


        date:
            new Date().toISOString(),


        customerId:
            customerId,


        customerName:
            customerName,


        items:
            cart.map(
                function (item) {

                    return {

                        id: item.id,

                        name: item.name,

                        qty:
                            Number(
                                item.qty
                            ),

                        rate:
                            Number(
                                item.rate
                            ),

                        total:
                            Number(
                                item.qty
                            ) *
                            Number(
                                item.rate
                            )

                    };

                }
            ),


        subtotal:
            Number(
                document.getElementById(
                    "subtotal"
                )?.textContent || 0
            ),


        discount:
            Number(
                document.getElementById(
                    "discount"
                )?.value || 0
            ),


        gst:
            Number(
                document.getElementById(
                    "gst"
                )?.textContent || 0
            ),


        roundOff:
            Number(
                document.getElementById(
                    "roundOff"
                )?.textContent || 0
            ),


        total:
            total,


        amountReceived:
            amountReceived,


        change:
            Math.max(
                0,
                amountReceived - total
            ),


        paymentMode:
            selectedPaymentMode

    };


    // ==============================
    // SAVE SALE
    // ==============================

    sales.push(
        bill
    );


    localStorage.setItem(
        "rrSales",
        JSON.stringify(
            sales
        )
    );


    localStorage.setItem(
        "rrLastBillNumber",
        lastBillNumber
    );


    // ==============================
    // SUCCESS
    // ==============================

    alert(
        "Bill completed successfully!"
    );


    // ==============================
    // RESET BILL
    // ==============================

    clearCurrentBill();

    loadBillNumber();

}


// ==========================================
// HTML SAFETY
// ==========================================

function escapeHtml(value) {

    return String(value)
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