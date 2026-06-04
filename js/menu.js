const defaultMenuItems = [
    {
        id: 1,
        name: "Chicken Biriyani",
        category: "Biriyani",
        price: 12,
        image: "images/menu/chicken_biriyani.png"
    },
    {
        id: 2,
        name: "Mutton Biriyani",
        category: "Biriyani",
        price: 15,
        image: "images/menu/placeholder.png"
    },
    {
        id: 3,
        name: "Tea",
        category: "Beverage",
        price: 1.5,
        image: "images/menu/placeholder.png"
    },
    {
        id: 4,
        name: "Fish Fry",
        category: "Fish",
        price: 8,
        image: "images/menu/placeholder.png"
    }
];

function loadStoredMenuItems() {
    try {
        const stored = localStorage.getItem("menuItems");
        if (!stored) {
            menuItems = JSON.parse(JSON.stringify(defaultMenuItems));
            localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
        } else {
            const items = JSON.parse(stored);
            if (Array.isArray(items) && items.length > 0) {
                menuItems = items.filter(item => item.active !== false);
            } else {
                menuItems = JSON.parse(JSON.stringify(defaultMenuItems));
                localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
            }
        }
    } catch (e) {
        console.error("Error loading menu items:", e);
        menuItems = JSON.parse(JSON.stringify(defaultMenuItems));
        localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
    }
}

loadStoredMenuItems();