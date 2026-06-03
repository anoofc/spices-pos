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

let menuItems = [];

function loadStoredMenuItems() {
    const stored = JSON.parse(localStorage.getItem("menuItems"));
    if (!stored || stored.length === 0) {
        menuItems = defaultMenuItems;
        localStorage.setItem("menuItems", JSON.stringify(defaultMenuItems));
    } else {
        menuItems = stored.filter(item => item.active !== false);
    }
}

loadStoredMenuItems();