function openPOS() {
    window.location.href = "pos.html";
}

function openPurchases() {
    window.location.href = "purchases.html";
}

function openExpenses() {
    window.location.href = "expenses.html";
}

function openReports() {
    window.location.href = "reports.html";
}

function openMenuManagement() {
    window.location.href = "menu.html";
}

function openInvoices() {
    window.location.href = "invoices.html";
}

function openSettings() {
    window.location.href = "settings.html";
}

document.getElementById("todayDate").innerHTML = new Date().toLocaleDateString();

function loadDashboard() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const purchases = JSON.parse(localStorage.getItem("purchases")) || [];
    const expenses = JSON.parse(localStorage.getItem("expenses")) || [];

    let salesTotal = 0;
    let cashTotal = 0;
    let cardTotal = 0;
    let purchasesTotal = 0;
    let expensesTotal = 0;

    sales.forEach(sale => {
        salesTotal += sale.total;
        if (sale.paymentMethod === "Cash") cashTotal += sale.total;
        if (sale.paymentMethod === "Card") cardTotal += sale.total;
    });

    purchases.forEach(p => {
        purchasesTotal += p.amount;
    });

    expenses.forEach(e => {
        expensesTotal += e.amount;
    });

    const profit = salesTotal - purchasesTotal - expensesTotal;

    document.getElementById("salesAmount").innerHTML = salesTotal.toFixed(2) + " SAR";
    document.getElementById("cashAmount").innerHTML = cashTotal.toFixed(2) + " SAR";
    document.getElementById("cardAmount").innerHTML = cardTotal.toFixed(2) + " SAR";
    document.getElementById("profitAmount").innerHTML = profit.toFixed(2) + " SAR";
}

loadDashboard();