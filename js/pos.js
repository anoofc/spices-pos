let cart = [];

function loadMenu() {

    const menuDiv =
        document.getElementById("menuSection");

    menuItems.forEach(item => {

        menuDiv.innerHTML += `
            <div class="menu-item"
                 onclick="addToCart(${item.id})">

                <h3>${item.name}</h3>

                <p>${item.price} SAR</p>

            </div>
        `;
    });
}

function addToCart(id){

    const existingItem =
        cart.find(item => item.id === id);

    if(existingItem){

        existingItem.qty++;

    }else{

        const menuItem =
            menuItems.find(x => x.id === id);

        cart.push({
            ...menuItem,
            qty:1
        });
    }

    updateCart();
}

function updateCart(){

    let subtotal = 0;

    const cartDiv =
        document.getElementById("cartItems");

    cartDiv.innerHTML = "";

    cart.forEach(item=>{

    subtotal += item.price * item.qty;

    cartDiv.innerHTML += `
    <div class="cart-item">

        <div>
            ${item.name}
            x${item.qty}
        </div>

        <div>

            <button onclick="decreaseQty(${item.id})">
                -
            </button>

            <button onclick="increaseQty(${item.id})">
                +
            </button>

        </div>

    </div>
    `;
});

let total = subtotal;
let vat = total * (15 / 115);
let netSale = total - vat;
    document.getElementById("subtotal")
        .innerHTML = netSale.toFixed(2);
    document.getElementById("vat")
        .innerHTML = vat.toFixed(2);
    document.getElementById("total")
        .innerHTML = total.toFixed(2);
}

function completeSale(paymentMethod){

    if(cart.length === 0){

        alert("Cart Empty");

        return;
    }

    const invoiceNo =
        getNextInvoiceNo();

    const total =
        parseFloat(
            document.getElementById("total")
            .innerHTML
        );

    const sale = {

        invoiceNo,

        date:
        new Date().toISOString(),

        paymentMethod,

        total,

        items:cart
    };

    saveSale(sale);

    alert(
        "Invoice: " +
        invoiceNo +
        "\nSaved Successfully"
    );

    cart = [];

    updateCart();
}

loadMenu();

function increaseQty(id){

    const item =
        cart.find(x => x.id === id);

    item.qty++;

    updateCart();
}

function decreaseQty(id){

    const item =
        cart.find(x => x.id === id);

    item.qty--;

    if(item.qty <= 0){

        cart =
            cart.filter(x => x.id !== id);
    }

    updateCart();
}

function goHome(){
    window.location.href = "index.html";
}

function clearCart(){

    if(confirm("Clear cart?")){

        cart = [];

        updateCart();
    }
}