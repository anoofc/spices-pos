function goHome() {
    window.location.href = "index.html";
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getSalesForDate(targetDate) {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    return sales.filter(sale => {
        const saleDate = new Date(sale.date).toISOString().split('T')[0];
        return saleDate === targetDate;
    });
}

function getPurchasesForDate(targetDate) {
    const purchases = getPurchases();
    return purchases.filter(p => p.date === targetDate);
}

function getExpensesForDate(targetDate) {
    const expenses = getExpenses();
    return expenses.filter(e => e.date === targetDate);
}

function calculateVAT(sales) {
    let totalVAT = 0;
    sales.forEach(sale => {
        totalVAT += sale.total * (15 / 115);
    });
    return totalVAT;
}

function calculateNetSales(sales) {
    let totalNet = 0;
    sales.forEach(sale => {
        totalNet += sale.total - (sale.total * (15 / 115));
    });
    return totalNet;
}

function loadDailyReport() {
    const selectedDate = document.getElementById("reportDate").value || getToday();
    const sales = getSalesForDate(selectedDate);
    const purchases = getPurchasesForDate(selectedDate);
    const expenses = getExpensesForDate(selectedDate);

    let salesTotal = 0;
    let cashTotal = 0;
    let cardTotal = 0;
    let vatTotal = 0;
    let netSalesTotal = 0;

    sales.forEach(sale => {
        salesTotal += sale.total;
        vatTotal += sale.total * (15 / 115);
        netSalesTotal += sale.total - (sale.total * (15 / 115));

        if (sale.paymentMethod === "Cash") cashTotal += sale.total;
        if (sale.paymentMethod === "Card") cardTotal += sale.total;
    });

    let purchasesTotal = 0;
    purchases.forEach(p => {
        purchasesTotal += p.amount;
    });

    let expensesTotal = 0;
    expenses.forEach(e => {
        expensesTotal += e.amount;
    });

    const profit = netSalesTotal - purchasesTotal - expensesTotal;

    const reportContent = document.getElementById("reportContent");
    let html = `
    <div class="report-section">
        <h2>Daily Report - ${new Date(selectedDate).toLocaleDateString()}</h2>

        <div class="report-cards">
            <div class="report-card">
                <h3>Sales (Inc. VAT)</h3>
                <div class="amount">${salesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Net Sales (Exc. VAT)</h3>
                <div class="amount">${netSalesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>VAT Collected (15%)</h3>
                <div class="amount">${vatTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Cash Collection</h3>
                <div class="amount">${cashTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Card Collection</h3>
                <div class="amount">${cardTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Total Purchases</h3>
                <div class="amount">${purchasesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Total Expenses</h3>
                <div class="amount">${expensesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Net Profit</h3>
                <div class="amount ${profit >= 0 ? 'positive' : 'negative'}">${profit.toFixed(2)} SAR</div>
            </div>
        </div>
    `;

    if (sales.length > 0) {
        html += `
        <div class="report-section">
            <h2>Sales Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Invoice</th>
                        <th>Time</th>
                        <th>Payment</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
        `;
        sales.forEach(sale => {
            const time = new Date(sale.date).toLocaleTimeString();
            html += `
                    <tr>
                        <td>${sale.invoiceNo}</td>
                        <td>${time}</td>
                        <td>${sale.paymentMethod}</td>
                        <td>${sale.total.toFixed(2)} SAR</td>
                    </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        </div>
        `;
    }

    if (purchases.length > 0) {
        html += `
        <div class="report-section">
            <h2>Purchases Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Description</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
        `;
        purchases.forEach(p => {
            html += `
                    <tr>
                        <td>${p.description}</td>
                        <td>${p.amount.toFixed(2)} SAR</td>
                    </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        </div>
        `;
    }

    if (expenses.length > 0) {
        html += `
        <div class="report-section">
            <h2>Expenses Details</h2>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
        `;
        expenses.forEach(e => {
            html += `
                    <tr>
                        <td>${e.category}</td>
                        <td>${e.amount.toFixed(2)} SAR</td>
                    </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        </div>
        `;
    }

    html += `</div>`;
    reportContent.innerHTML = html;
}

function showMonthlyReport() {
    const selectedDate = document.getElementById("reportDate").value || getToday();
    const [year, month] = selectedDate.split('-');

    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const purchases = getPurchases();
    const expenses = getExpenses();

    let monthSales = sales.filter(sale => {
        const saleDate = new Date(sale.date).toISOString().split('-').slice(0, 2).join('-');
        return saleDate === `${year}-${month}`;
    });

    let monthPurchases = purchases.filter(p => {
        return p.date.substring(0, 7) === `${year}-${month}`;
    });

    let monthExpenses = expenses.filter(e => {
        return e.date.substring(0, 7) === `${year}-${month}`;
    });

    let salesTotal = 0;
    let netSalesTotal = 0;
    let vatTotal = 0;
    const topItems = {};

    monthSales.forEach(sale => {
        salesTotal += sale.total;
        vatTotal += sale.total * (15 / 115);
        netSalesTotal += sale.total - (sale.total * (15 / 115));

        sale.items.forEach(item => {
            topItems[item.name] = (topItems[item.name] || 0) + item.qty;
        });
    });

    let purchasesTotal = 0;
    monthPurchases.forEach(p => {
        purchasesTotal += p.amount;
    });

    let expensesTotal = 0;
    monthExpenses.forEach(e => {
        expensesTotal += e.amount;
    });

    const profit = netSalesTotal - purchasesTotal - expensesTotal;

    const topItemsSorted = Object.entries(topItems)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

    const reportContent = document.getElementById("reportContent");
    let html = `
    <div class="report-section">
        <h2>Monthly Report - ${new Date(year, month - 1).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}</h2>

        <div class="report-cards">
            <div class="report-card">
                <h3>Total Sales (Inc. VAT)</h3>
                <div class="amount">${salesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Net Sales (Exc. VAT)</h3>
                <div class="amount">${netSalesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>VAT Collected (15%)</h3>
                <div class="amount">${vatTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Total Purchases</h3>
                <div class="amount">${purchasesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Total Expenses</h3>
                <div class="amount">${expensesTotal.toFixed(2)} SAR</div>
            </div>
            <div class="report-card">
                <h3>Monthly Profit</h3>
                <div class="amount ${profit >= 0 ? 'positive' : 'negative'}">${profit.toFixed(2)} SAR</div>
            </div>
        </div>

        <div class="report-section">
            <h2>Top Selling Items</h2>
            <table>
                <thead>
                    <tr>
                        <th>Item Name</th>
                        <th>Quantity Sold</th>
                    </tr>
                </thead>
                <tbody>
    `;

    topItemsSorted.forEach(([itemName, qty]) => {
        html += `
                    <tr>
                        <td>${itemName}</td>
                        <td>${qty}</td>
                    </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    </div>
    `;

    reportContent.innerHTML = html;
}

document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("reportDate").value = getToday();
    loadDailyReport();
});
