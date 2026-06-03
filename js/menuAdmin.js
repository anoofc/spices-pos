function goHome() {
    window.location.href = "index.html";
}

const defaultMenuItems = [
    {
        id: 1,
        name: "Chicken Biriyani",
        category: "Biriyani",
        price: 12,
        image: "images/menu/chicken_biriyani.png",
        active: true
    },
    {
        id: 2,
        name: "Mutton Biriyani",
        category: "Biriyani",
        price: 15,
        image: "images/menu/placeholder.png",
        active: true
    },
    {
        id: 3,
        name: "Tea",
        category: "Beverage",
        price: 1.5,
        image: "images/menu/placeholder.png",
        active: true
    },
    {
        id: 4,
        name: "Fish Fry",
        category: "Fish",
        price: 8,
        image: "images/menu/placeholder.png",
        active: true
    }
];

function getStoredMenuItems() {
    const stored = JSON.parse(localStorage.getItem("menuItems"));
    if (!stored || stored.length === 0) {
        localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
        return defaultMenuItems;
    }
    return stored;
}

function saveMenuItems(items) {
    localStorage.setItem("menuItems", JSON.stringify(items));
}

function saveMenuItem(event) {
    event.preventDefault();

    const id = document.getElementById("menuItemId").value;
    const name = document.getElementById("itemName").value;
    const category = document.getElementById("itemCategory").value;
    const price = parseFloat(document.getElementById("itemPrice").value);
    const image = document.getElementById("itemImage").value;

    if (!name || !category || !price || !image) {
        alert("Please fill all fields");
        return;
    }

    const items = getStoredMenuItems();

    if (id) {
        const index = items.findIndex(item => item.id == id);
        if (index !== -1) {
            items[index] = {
                ...items[index],
                name,
                category,
                price,
                image
            };
            alert("Menu item updated successfully!");
        }
    } else {
        const newId = Math.max(...items.map(i => i.id), 0) + 1;
        items.push({
            id: newId,
            name,
            category,
            price,
            image,
            active: true
        });
        alert("Menu item added successfully!");
    }

    saveMenuItems(items);
    resetForm();
    loadMenuItems();
    updatePOSMenu();
}

function editMenuItem(id) {
    const items = getStoredMenuItems();
    const item = items.find(i => i.id == id);

    if (!item) return;

    document.getElementById("menuItemId").value = item.id;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemCategory").value = item.category;
    document.getElementById("itemPrice").value = item.price;
    document.getElementById("itemImage").value = item.image;
    document.getElementById("formTitle").textContent = "Edit Menu Item";
    document.getElementById("submitBtn").textContent = "Update Item";

    window.scrollTo(0, 0);
}

function deleteMenuItem(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        let items = getStoredMenuItems();
        items = items.filter(i => i.id != id);
        saveMenuItems(items);
        loadMenuItems();
        updatePOSMenu();
    }
}

function toggleItemActive(id) {
    const items = getStoredMenuItems();
    const index = items.findIndex(i => i.id == id);
    if (index !== -1) {
        items[index].active = !items[index].active;
        saveMenuItems(items);
        loadMenuItems();
        updatePOSMenu();
    }
}

function loadMenuItems() {
    const items = getStoredMenuItems();
    const container = document.getElementById("menuContainer");

    if (items.length === 0) {
        container.innerHTML = '<div class="empty-message">No menu items yet</div>';
        return;
    }

    let html = '<div class="menu-grid">';

    items.forEach(item => {
        const statusClass = item.active ? 'active' : 'inactive';
        const statusText = item.active ? 'Active' : 'Inactive';

        html += `
        <div class="menu-item-card">
            <img src="${item.image}" alt="${item.name}">
            <h3>${item.name}</h3>
            <p>${item.category}</p>
            <div class="price">${item.price.toFixed(2)} SAR</div>
            <span class="status ${statusClass}">${statusText}</span>
            <div class="item-actions">
                <button class="edit-btn" onclick="editMenuItem(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMenuItem(${item.id})">Delete</button>
                <button class="toggle-btn" onclick="toggleItemActive(${item.id})">Toggle</button>
            </div>
        </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

function resetForm() {
    document.getElementById("menuForm").reset();
    document.getElementById("menuItemId").value = "";
    document.getElementById("formTitle").textContent = "Add New Menu Item";
    document.getElementById("submitBtn").textContent = "Add Item";
}

function updatePOSMenu() {
    window.menuItems = getStoredMenuItems().filter(item => item.active);
}

document.addEventListener("DOMContentLoaded", function() {
    loadMenuItems();
    updatePOSMenu();
});
