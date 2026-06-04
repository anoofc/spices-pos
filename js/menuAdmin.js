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
    let stored = localStorage.getItem("menuItems");

    if (!stored) {
        localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
        return JSON.parse(JSON.stringify(defaultMenuItems));
    }

    try {
        const items = JSON.parse(stored);
        if (!Array.isArray(items) || items.length === 0) {
            localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
            return JSON.parse(JSON.stringify(defaultMenuItems));
        }
        return items;
    } catch (e) {
        console.error("Error parsing menu items:", e);
        localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
        return JSON.parse(JSON.stringify(defaultMenuItems));
    }
}

function saveMenuItems(items) {
    localStorage.setItem("menuItems", JSON.stringify(items));
}

function handleImageUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const imageData = e.target.result;
        document.getElementById("itemImage").dataset.imageData = imageData;

        const preview = document.getElementById("imagePreview");
        preview.innerHTML = `<img src="${imageData}" style="width: 100%; height: auto; border-radius: 5px;">`;
    };
    reader.readAsDataURL(file);
}

function saveMenuItem(event) {
    event.preventDefault();

    const id = document.getElementById("menuItemId").value;
    const name = document.getElementById("itemName").value.trim();
    const category = document.getElementById("itemCategory").value.trim();
    const price = parseFloat(document.getElementById("itemPrice").value);
    const imageInput = document.getElementById("itemImage");
    const imageData = imageInput.dataset.imageData;

    if (!name || !category || !price) {
        alert("Please fill all required fields");
        return;
    }

    if (!imageData) {
        alert("Please select an image");
        return;
    }

    const items = getStoredMenuItems();

    if (id) {
        const index = items.findIndex(item => item.id == id);
        if (index !== -1) {
            items[index] = {
                id: parseInt(id),
                name,
                category,
                price,
                image: imageData,
                active: items[index].active
            };
            alert("Menu item updated successfully!");
        }
    } else {
        const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
        items.push({
            id: newId,
            name,
            category,
            price,
            image: imageData,
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

    if (!item) {
        alert("Item not found");
        return;
    }

    document.getElementById("menuItemId").value = item.id;
    document.getElementById("itemName").value = item.name;
    document.getElementById("itemCategory").value = item.category;
    document.getElementById("itemPrice").value = item.price;

    const preview = document.getElementById("imagePreview");
    preview.innerHTML = `<img src="${item.image}" style="width: 100%; height: auto; border-radius: 5px;">`;
    document.getElementById("itemImage").dataset.imageData = item.image;

    document.getElementById("formTitle").textContent = "Edit Menu Item";
    document.getElementById("submitBtn").textContent = "Update Item";

    window.scrollTo(0, 0);
}

function deleteMenuItem(id) {
    if (confirm("Are you sure you want to delete this item?")) {
        let items = getStoredMenuItems();
        items = items.filter(i => i.id != id);
        saveMenuItems(items);
        alert("Menu item deleted successfully!");
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
        alert(`Item ${items[index].active ? 'activated' : 'deactivated'}`);
    }
}

function loadMenuItems() {
    const items = getStoredMenuItems();
    const container = document.getElementById("menuContainer");

    if (!items || items.length === 0) {
        container.innerHTML = '<div class="empty-message">No menu items. Add your first item above.</div>';
        return;
    }

    let html = '<div class="menu-grid">';

    items.forEach(item => {
        const statusClass = item.active ? 'active' : 'inactive';
        const statusText = item.active ? 'Active' : 'Inactive';

        html += `
        <div class="menu-item-card">
            <img src="${item.image}" alt="${item.name}" onerror="this.src='images/menu/placeholder.png'">
            <h3>${item.name}</h3>
            <p>${item.category}</p>
            <div class="price">${parseFloat(item.price).toFixed(2)} SAR</div>
            <span class="status ${statusClass}">${statusText}</span>
            <div class="item-actions">
                <button class="edit-btn" onclick="editMenuItem(${item.id})">Edit</button>
                <button class="delete-btn" onclick="deleteMenuItem(${item.id})">Delete</button>
                <button class="toggle-btn" onclick="toggleItemActive(${item.id})">${item.active ? 'Deactivate' : 'Activate'}</button>
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
    document.getElementById("itemImage").dataset.imageData = "";
    document.getElementById("imagePreview").innerHTML = "";
    document.getElementById("formTitle").textContent = "Add New Menu Item";
    document.getElementById("submitBtn").textContent = "Add Item";
}

function updatePOSMenu() {
    const items = getStoredMenuItems();
    window.menuItems = items.filter(item => item.active);
}

function initializePage() {
    try {
        const items = getStoredMenuItems();
        console.log("Loaded menu items:", items);
        loadMenuItems();
        updatePOSMenu();

        const imageInput = document.getElementById("itemImage");
        if (imageInput) {
            imageInput.addEventListener("change", handleImageUpload);
        }
    } catch (e) {
        console.error("Error initializing page:", e);
        alert("Error loading menu. Please refresh the page.");
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializePage);
} else {
    initializePage();
}
