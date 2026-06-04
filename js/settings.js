function goHome() {
    window.location.href = "index.html";
}

function getAdminPassword() {
    const settings = JSON.parse(localStorage.getItem("settings")) || {};
    return settings.adminPassword || "12345";
}

function saveSettings() {
    const restaurantName = document.getElementById("restaurantName").value;
    const vatRate = document.getElementById("vatRate").value;
    const currency = document.getElementById("currency").value;
    const newPassword = document.getElementById("adminPassword").value;

    if (!restaurantName || !vatRate || !currency || !newPassword) {
        alert("❌ All fields are required!");
        return;
    }

    const oldPassword = prompt("🔐 Enter your CURRENT admin password to verify:");
    if (oldPassword === null) {
        return;
    }

    const correctPassword = getAdminPassword();
    if (oldPassword !== correctPassword) {
        alert("❌ Incorrect current password! Settings not saved.");
        return;
    }

    if (newPassword !== correctPassword) {
        const confirmNewPassword = prompt("Confirm your NEW admin password:");
        if (confirmNewPassword !== newPassword) {
            alert("❌ Passwords do not match! Settings not saved.");
            return;
        }
    }

    const settings = {
        restaurantName,
        vatRate: parseFloat(vatRate),
        currency,
        adminPassword: newPassword
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
    showSuccessMessage("✅ Data exported successfully!");
}

function exportSalesData() {
    const sales = JSON.parse(localStorage.getItem("sales")) || [];
    const csv = convertToCSV(sales, ["invoiceNo", "date", "paymentMethod", "total"]);
    downloadFile(csv, "sales-export.csv");
    showSuccessMessage("✅ Sales data exported!");
}

function exportPurchasesData() {
    const purchases = getPurchases();
    const csv = convertToCSV(purchases, ["date", "description", "amount"]);
    downloadFile(csv, "purchases-export.csv");
    showSuccessMessage("✅ Purchases data exported!");
}

function exportExpensesData() {
    const expenses = getExpenses();
    const csv = convertToCSV(expenses, ["date", "category", "amount"]);
    downloadFile(csv, "expenses-export.csv");
    showSuccessMessage("✅ Expenses data exported!");
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

            if (!confirm("⚠️ This will replace all current data. Are you sure?")) {
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

            showSuccessMessage("✅ Data imported successfully!");
            fileInput.value = "";
        } catch (error) {
            alert("❌ Error importing file: " + error.message);
        }
    };
    reader.readAsText(file);
}

function resetAllData() {
    const password = prompt("🔐 Enter admin password to clear all data:");

    if (password === null) {
        return;
    }

    const correctPassword = getAdminPassword();
    if (password !== correctPassword) {
        alert("❌ Incorrect admin password! Data not cleared.");
        return;
    }

    if (confirm("⚠️ Are you absolutely sure? This will delete ALL data including sales, purchases, expenses, and menu items.")) {
        if (confirm("🚨 Click OK again to confirm. This is your LAST WARNING! This action CANNOT be undone!")) {
            const currentSettings = JSON.parse(localStorage.getItem("settings")) || {};
            const adminPassword = currentSettings.adminPassword || "12345";

            localStorage.removeItem("sales");
            localStorage.removeItem("purchases");
            localStorage.removeItem("expenses");
            localStorage.removeItem("menuItems");
            localStorage.removeItem("invoiceNo");
            localStorage.removeItem("settings");

            const preservedSettings = {
                ...currentSettings,
                adminPassword: adminPassword
            };
            localStorage.setItem("settings", JSON.stringify(preservedSettings));

            showSuccessMessage("✅ All data has been cleared! (Admin password preserved)");
            setTimeout(() => {
                alert("✅ System reset complete. Redirecting to dashboard...");
                window.location.href = "index.html";
            }, 1500);
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
