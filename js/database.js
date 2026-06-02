let sales = [];
let purchases = [];
let expenses = [];

function getNextInvoiceNo(){

    let invoiceNo =
        localStorage.getItem("invoiceNo");

    if(!invoiceNo){

        invoiceNo = 1;
    }

    localStorage.setItem(
        "invoiceNo",
        Number(invoiceNo)+1
    );

    return "INV-" +
        String(invoiceNo)
        .padStart(5,'0');
}

function saveSale(sale){

    let sales =
        JSON.parse(
            localStorage.getItem("sales")
        ) || [];

    sales.push(sale);

    localStorage.setItem(
        "sales",
        JSON.stringify(sales)
    );
}