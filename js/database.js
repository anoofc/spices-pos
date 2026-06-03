let sales = [];
let purchases = [];
let expenses = [];

function getNextInvoiceNo() {
    let invoiceNo = localStorage.getItem("invoiceNo");
    if (!invoiceNo) {
        invoiceNo = 1;
    }
    localStorage.setItem("invoiceNo", Number(invoiceNo) + 1);
    return "INV-" + String(invoiceNo).padStart(5, '0');
}

function saveSale(sale) {
    let sales = JSON.parse(localStorage.getItem("sales")) || [];
    sales.push(sale);
    localStorage.setItem("sales", JSON.stringify(sales));
}

function getPurchases() {
    return JSON.parse(localStorage.getItem("purchases")) || [];
}

function savePurchase(purchase) {
    let purchases = JSON.parse(localStorage.getItem("purchases")) || [];
    purchases.push(purchase);
    localStorage.setItem("purchases", JSON.stringify(purchases));
}

function updatePurchase(id, updatedPurchase) {
    let purchases = JSON.parse(localStorage.getItem("purchases")) || [];
    purchases = purchases.map(p => p.id === id ? updatedPurchase : p);
    localStorage.setItem("purchases", JSON.stringify(purchases));
}

function deletePurchase(id) {
    let purchases = JSON.parse(localStorage.getItem("purchases")) || [];
    purchases = purchases.filter(p => p.id !== id);
    localStorage.setItem("purchases", JSON.stringify(purchases));
}

function getExpenses() {
    return JSON.parse(localStorage.getItem("expenses")) || [];
}

function saveExpense(expense) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses.push(expense);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function updateExpense(id, updatedExpense) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.map(e => e.id === id ? updatedExpense : e);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}

function deleteExpense(id) {
    let expenses = JSON.parse(localStorage.getItem("expenses")) || [];
    expenses = expenses.filter(e => e.id !== id);
    localStorage.setItem("expenses", JSON.stringify(expenses));
}