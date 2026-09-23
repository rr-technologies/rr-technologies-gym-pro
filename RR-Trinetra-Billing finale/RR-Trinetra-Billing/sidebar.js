(function () {
    const links = [
        ["billing-dashboard.html", "🏠", "Dashboard"],
        ["billing.html", "🧾", "POS Billing"],
        ["products.html", "📦", "Products"],
        ["purchase.html", "🛒", "Purchase"],
        ["inventory.html", "📊", "Inventory"],
        ["__divider__", "", ""],
        ["customers.html", "👥", "Customers"],
        ["vendors.html", "🏢", "Vendors"],
        ["expenses.html", "💰", "Expenses"],
        ["payments.html", "💳", "Payments"],
        ["reports.html", "📈", "Reports"]
    ];

    function currentPage() {
        const path = window.location.pathname.split("/").pop().toLowerCase();
        return path || "billing-dashboard.html";
    }

    function createSidebar() {
        if (document.querySelector(".rr-common-sidebar") || document.querySelector(".sidebar")) {
            return;
        }

        const sidebar = document.createElement("aside");
        sidebar.className = "rr-common-sidebar";

        sidebar.innerHTML = `
            <div class="rr-sidebar-brand">
                <div class="rr-brand-logo">RR</div>
                <div>
                    <h2>RR Trinetra</h2>
                    <span>Billing System</span>
                </div>
            </div>

            <nav class="rr-sidebar-nav"></nav>

            <div class="rr-sidebar-bottom">
                <a href="settings.html" class="rr-nav-item" data-page="settings.html">
                    <span>⚙️</span>
                    <span>Settings</span>
                </a>
                <div class="rr-version">RR Trinetra Billing v1.1</div>
            </div>
        `;

        const nav = sidebar.querySelector(".rr-sidebar-nav");
        const page = currentPage();

        links.forEach(([href, icon, label]) => {
            if (href === "__divider__") {
                const divider = document.createElement("div");
                divider.className = "rr-nav-divider";
                nav.appendChild(divider);
                return;
            }

            const a = document.createElement("a");
            a.href = href;
            a.className = "rr-nav-item";
            a.dataset.page = href;
            a.innerHTML = `<span>${icon}</span><span>${label}</span>`;

            if (href === page) {
                a.classList.add("active");
            }

            nav.appendChild(a);
        });

        document.body.insertBefore(sidebar, document.body.firstChild);
    }

    function wrapPage() {
        if (document.querySelector(".rr-app-main")) return;

        const main = document.createElement("main");
        main.className = "rr-app-main";

        const nodes = Array.from(document.body.children);

        nodes.forEach(node => {
            if (node.classList.contains("rr-common-sidebar")) return;
            if (node.tagName === "SCRIPT") return;
            main.appendChild(node);
        });

        document.body.appendChild(main);
    }

    function init() {
        createSidebar();
        wrapPage();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})();
