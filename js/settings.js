function goHome() {
    window.location.href = "index.html";
}

function saveSettings() {
    const restaurantName = document.getElementById("restaurantName").value;
    const vatRate = document.getElementById("vatRate").value;
    const currency = document.getElementById("currency").value;
    const adminPassword = document.getElementById("adminPassword").value;

    if (!adminPassword) {
        alert("Admin password cannot be empty!");
        return;
    }

    const settings = {
        restaurantName,
        vatRate: parseFloat(vatRate),
        currency,
        adminPassword
    };

    localStorage.setItem("settings", JSON.stringify(settings));
    showSuccessMessage("✅ Settings saved successfully!");
}

function showSuccessMessage(message) {
    const msgEl = document.getElementById("successMessage");
    msgEl.textContent = message;
    msgEl.classList.add("show");
    setTimeout(() => {
        msgEl.classList.remove("show");
    }, 3000);
}

function exportAllData() {
    const allData = {
        sales: JSON.parse(localStorage.getItem("sales")) || [],
        purchases: getPurchases(),
        expenses: getExpenses(),
        settings: JSON.parse(localStorage.getItem("settings")) || {},
        menuItems: JSON.parse(localStorage.getItem("menuItems")) || [],
        exportDate: new Date().toISOString()
    };

    const dataString = JSON.stringify(allData, null, 2);
    downloadFile(dataString, "spices-pos-backup.json");
}

function exportSalesData() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const csv = convertToCSV(sales, ["invoiceNo", "date", "paymentMethod", "total"]);
    downloadFile(csv, "sales-export.csv");
}

function exportPurchasesData() {
    const purchases = getPurchases();
    const csv = convertToCSV(purchases, ["date", "description", "amount"]);
    downloadFile(csv, "purchases-export.csv");
}

function exportExpensesData() {
    const expenses = getExpenses();
    const csv = convertToCSV(expenses, ["date", "category", "amount"]);
    downloadFile(csv, "expenses-export.csv");
}

function convertToCSV(data, headers) {
    if (data.length === 0) return "No data";

    const csvHeaders = headers.join(",");
    const csvRows = data.map(row => {
        return headers.map(header => {
            const value = row[header];
            if (typeof value === 'string' && value.includes(',')) {
                return `"${value}"`;
            }
            return value;
        }).join(",");
    });

    return csvHeaders + "\n" + csvRows.join("\n");
}

function downloadFile(content, filename) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function importData() {
    const fileInput = document.getElementById("importFile");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please select a file to import");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            if (!confirm("This will replace all current data. Are you sure?")) {
                return;
            }

            if (data.sales) {
                localStorage.setItem("sales", JSON.stringify(data.sales));
            }
            if (data.purchases) {
                localStorage.setItem("purchases", JSON.stringify(data.purchases));
            }
            if (data.expenses) {
                localStorage.setItem("expenses", JSON.stringify(data.expenses));
            }
            if (data.settings) {
                localStorage.setItem("settings", JSON.stringify(data.settings));
            }
            if (data.menuItems) {
                localStorage.setItem("menuItems", JSON.stringify(data.menuItems));
            }

            showSuccessMessage("Data imported successfully!");
            fileInput.value = "";
        } catch (error) {
            alert("Error importing file: " + error.message);
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    if (confirm("Are you absolutely sure? This will delete ALL data including sales, purchases, expenses, and menu items. This cannot be undone!")) {
        if (confirm("Click OK again to confirm. This is your last warning!")) {
            localStorage.removeItem("sales");
            localStorage.removeItem("purchases");
            localStorage.removeItem("expenses");
            localStorage.removeItem("menuItems");
            localStorage.removeItem("invoiceNo");
            localStorage.removeItem("settings");

            showSuccessMessage("All data has been cleared!");
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        }
    }
}

document.addEventListener("DOMContentLoaded", function() {
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    if (settings.restaurantName) {
        document.getElementById("restaurantName").value = settings.restaurantName;
    }
    if (settings.vatRate) {
        document.getElementById("vatRate").value = settings.vatRate;
    }
    if (settings.currency) {
        document.getElementById("currency").value = settings.currency;
    }
    if (settings.adminPassword) {
        document.getElementById("adminPassword").value = settings.adminPassword;
    }
});
