function openPOS() {
    window.location.href = "pos.html";
}

function openPurchases() {
    alert("Purchases Screen Coming Next");
}

function openExpenses() {
    alert("Expenses Screen Coming Next");
}

function openReports() {
    alert("Reports Screen Coming Next");
}

function openSettings() {
    alert("Settings Screen Coming Next");
}
document.getElementById("todayDate").innerHTML =
new Date().toLocaleDateString();

function loadDashboard(){

    const sales =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];

    let salesTotal = 0;
    let cashTotal = 0;
    let cardTotal = 0;

    sales.forEach(sale=>{

        salesTotal += sale.total;

        if(sale.paymentMethod === "Cash")
            cashTotal += sale.total;

        if(sale.paymentMethod === "Card")
            cardTotal += sale.total;
    });

    document.getElementById("salesAmount")
        .innerHTML =
        salesTotal.toFixed(2) +
        " SAR";

    document.getElementById("cashAmount")
        .innerHTML =
        cashTotal.toFixed(2) +
        " SAR";

    document.getElementById("cardAmount")
        .innerHTML =
        cardTotal.toFixed(2) +
        " SAR";
}

loadDashboard();