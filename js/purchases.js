function goHome() {
    window.location.href = "index.html";
}

function addPurchase(event) {
    event.preventDefault();

    const date = document.getElementById("purchaseDate").value;
    const description = document.getElementById("purchaseDescription").value;
    const amount = parseFloat(document.getElementById("purchaseAmount").value);

    if (!date || !description || !amount) {
        alert("Please fill all fields");
        return;
    }

    const purchase = {
        id: Date.now(),
        date: date,
        description: description,
        amount: amount
    };

    savePurchase(purchase);
    document.getElementById("purchaseForm").reset();
    document.getElementById("purchaseDate").valueAsDate = new Date();
    loadPurchases();
}

function editPurchase(id) {
    const purchases = getPurchases();
    const purchase = purchases.find(p => p.id === id);

    if (!purchase) return;

    const newDate = prompt("Enter new date (YYYY-MM-DD):", purchase.date);
    if (newDate === null) return;

    const newDescription = prompt("Enter new description:", purchase.description);
    if (newDescription === null) return;

    const newAmount = prompt("Enter new amount:", purchase.amount);
    if (newAmount === null) return;

    const updatedPurchase = {
        ...purchase,
        date: newDate,
        description: newDescription,
        amount: parseFloat(newAmount)
    };

    updatePurchase(id, updatedPurchase);
    loadPurchases();
}

function removePurchase(id) {
    if (confirm("Are you sure you want to delete this purchase?")) {
        deletePurchase(id);
        loadPurchases();
    }
}

function loadPurchases() {
    const purchases = getPurchases();
    const tableContainer = document.getElementById("purchasesTable");

    let total = 0;
    purchases.forEach(p => {
        total += p.amount;
    });

    document.getElementById("totalPurchases").innerHTML = total.toFixed(2);

    if (purchases.length === 0) {
        tableContainer.innerHTML = '<div class="empty-message">No purchases yet</div>';
        return;
    }

    let html = `
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount (SAR)</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    `;

    purchases.forEach(purchase => {
        html += `
        <tr>
            <td>${new Date(purchase.date).toLocaleDateString()}</td>
            <td>${purchase.description}</td>
            <td>${purchase.amount.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editPurchase(${purchase.id})">Edit</button>
                    <button class="delete-btn" onclick="removePurchase(${purchase.id})">Delete</button>
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

document.addEventListener("DOMContentLoaded", function() {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById("purchaseDate").value = today;
    loadPurchases();
});
