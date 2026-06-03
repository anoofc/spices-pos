function goHome() {
    window.location.href = "index.html";
}

function addExpense(event) {
    event.preventDefault();

    const date = document.getElementById("expenseDate").value;
    const category = document.getElementById("expenseCategory").value;
    const amount = parseFloat(document.getElementById("expenseAmount").value);

    if (!date || !category || !amount) {
        alert("Please fill all fields");
        return;
    }

    const expense = {
        id: Date.now(),
        date: date,
        category: category,
        amount: amount
    };

    saveExpense(expense);
    document.getElementById("expenseForm").reset();
    document.getElementById("expenseDate").valueAsDate = new Date();
    loadExpenses();
}

function editExpense(id) {
    const expenses = getExpenses();
    const expense = expenses.find(e => e.id === id);

    if (!expense) return;

    const newDate = prompt("Enter new date (YYYY-MM-DD):", expense.date);
    if (newDate === null) return;

    const newCategory = prompt("Enter new category:", expense.category);
    if (newCategory === null) return;

    const newAmount = prompt("Enter new amount:", expense.amount);
    if (newAmount === null) return;

    const updatedExpense = {
        ...expense,
        date: newDate,
        category: newCategory,
        amount: parseFloat(newAmount)
    };

    updateExpense(id, updatedExpense);
    loadExpenses();
}

function removeExpense(id) {
    if (confirm("Are you sure you want to delete this expense?")) {
        deleteExpense(id);
        loadExpenses();
    }
}

function loadExpenses() {
    const expenses = getExpenses();
    const tableContainer = document.getElementById("expensesTable");

    let total = 0;
    expenses.forEach(e => {
        total += e.amount;
    });

    document.getElementById("totalExpenses").innerHTML = total.toFixed(2);

    if (expenses.length === 0) {
        tableContainer.innerHTML = '<div class="empty-message">No expenses yet</div>';
        return;
    }

    let html = `
    <table>
        <thead>
            <tr>
                <th>Date</th>
                <th>Category</th>
                <th>Amount (SAR)</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
    `;

    expenses.forEach(expense => {
        html += `
        <tr>
            <td>${new Date(expense.date).toLocaleDateString()}</td>
            <td>${expense.category}</td>
            <td>${expense.amount.toFixed(2)}</td>
            <td>
                <div class="action-buttons">
                    <button class="edit-btn" onclick="editExpense(${expense.id})">Edit</button>
                    <button class="delete-btn" onclick="removeExpense(${expense.id})">Delete</button>
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
    document.getElementById("expenseDate").value = today;
    loadExpenses();
});
