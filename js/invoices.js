function goHome() {
    window.location.href = "index.html";
}

let filteredSales = [];

function loadInvoices() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    filteredSales = [...sales].sort((a, b) => new Date(b.date) - new Date(a.date));
    displayInvoices(filteredSales);
}

function displayInvoices(invoices) {
    const tableContainer = document.getElementById("invoicesTable");

    if (invoices.length === 0) {
        tableContainer.innerHTML = '<div class="empty-message">No invoices found</div>';
        return;
    }

    let html = `
    <table>
        <thead>
            <tr>
                <th>Invoice No</th>
                <th>Date</th>
                <th>Time</th>
                <th>Payment</th>
                <th>Amount</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    `;

    invoices.forEach(sale => {
        const date = new Date(sale.date);
        const dateStr = date.toLocaleDateString();
        const timeStr = date.toLocaleTimeString();

        html += `
        <tr>
            <td>${sale.invoiceNo}</td>
            <td>${dateStr}</td>
            <td>${timeStr}</td>
            <td>${sale.paymentMethod}</td>
            <td>${sale.total.toFixed(2)} SAR</td>
            <td>
                <div class="action-buttons">
                    <button class="view-btn" onclick="viewInvoice('${sale.invoiceNo}')">View</button>
                    <button class="print-btn" onclick="printInvoice('${sale.invoiceNo}')">Print</button>
                </div>
            </td>
        </tr>
        `;
    });

    html += `
        </tbody>
    </table>
    `;

    tableContainer.innerHTML = html;
}

function searchInvoices() {
    const searchText = document.getElementById("searchInvoice").value.toLowerCase();
    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    filteredSales = sales.filter(sale =>
        sale.invoiceNo.toLowerCase().includes(searchText)
    ).sort((a, b) => new Date(b.date) - new Date(a.date));

    displayInvoices(filteredSales);
}

function filterByDateRange() {
    const fromDate = document.getElementById("fromDate").value;
    const toDate = document.getElementById("toDate").value;
    const sales = JSON.parse(localStorage.getItem("sales")) || [];

    filteredSales = sales.filter(sale => {
        const saleDate = new Date(sale.date).toISOString().split('T')[0];

        if (fromDate && saleDate < fromDate) return false;
        if (toDate && saleDate > toDate) return false;

        return true;
    }).sort((a, b) => new Date(b.date) - new Date(a.date));

    displayInvoices(filteredSales);
}

function resetSearch() {
    document.getElementById("searchInvoice").value = "";
    loadInvoices();
}

function resetDateFilter() {
    document.getElementById("fromDate").value = "";
    document.getElementById("toDate").value = "";
    loadInvoices();
}

function viewInvoice(invoiceNo) {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const sale = sales.find(s => s.invoiceNo === invoiceNo);

    if (!sale) return;

    const invoicesList = document.getElementById("invoicesList");
    const invoiceDetail = document.getElementById("invoiceDetailView");

    invoicesList.style.display = "none";

    const date = new Date(sale.date);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();

    let itemsHtml = "";
    let itemsTotal = 0;

    sale.items.forEach(item => {
        const itemTotal = item.price * item.qty;
        itemsTotal += itemTotal;

        itemsHtml += `
        <tr>
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>${item.price.toFixed(2)} SAR</td>
            <td>${itemTotal.toFixed(2)} SAR</td>
        </tr>
        `;
    });

    const vat = sale.total * (15 / 115);
    const netAmount = sale.total - vat;

    const html = `
    <div class="invoice-detail">
        <div class="invoice-header">
            <h1>SPICES FAST FOOD</h1>
            <p>KERALA RESTAURANT</p>
            <p>Saudi Arabia</p>
        </div>

        <div class="invoice-info">
            <div class="invoice-info-col">
                <strong>Invoice Number:</strong>
                ${sale.invoiceNo}
                <br><strong>Date:</strong>
                ${dateStr}
                <br><strong>Time:</strong>
                ${timeStr}
            </div>
            <div class="invoice-info-col" style="text-align: right;">
                <strong>Payment Method:</strong>
                ${sale.paymentMethod}
            </div>
        </div>

        <div class="invoice-items">
            <table>
                <thead>
                    <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHtml}
                </tbody>
            </table>
        </div>

        <div class="invoice-summary">
            <div style="margin-bottom: 10px;">
                Net Amount: <strong>${netAmount.toFixed(2)} SAR</strong>
            </div>
            <div style="margin-bottom: 10px;">
                VAT (15%): <strong>${vat.toFixed(2)} SAR</strong>
            </div>
            <div class="total-row">
                Total: ${sale.total.toFixed(2)} SAR
            </div>
        </div>

        <div class="print-buttons">
            <button class="print-btn" onclick="window.print()">Print</button>
            <button class="view-btn" onclick="goBackToInvoices()">Back to List</button>
        </div>
    </div>
    `;

    invoiceDetail.innerHTML = html;
    invoiceDetail.style.display = "block";
}

function printInvoice(invoiceNo) {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const sale = sales.find(s => s.invoiceNo === invoiceNo);

    if (!sale) return;

    viewInvoice(invoiceNo);
    setTimeout(() => {
        window.print();
    }, 500);
}

function goBackToInvoices() {
    document.getElementById("invoicesList").style.display = "block";
    document.getElementById("invoiceDetailView").style.display = "none";
}

document.addEventListener("DOMContentLoaded", function() {
    loadInvoices();
});
