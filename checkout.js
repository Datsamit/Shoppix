document.addEventListener('DOMContentLoaded', function() {
    loadCheckoutItems();
    const checkoutForm = document.getElementById('checkout-form');
    checkoutForm.addEventListener('submit', placeOrder);
});

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

function loadCheckoutItems() {
    const user = getLoggedInUser();
    if (!user) {
        alert('You need to be logged in to view the checkout page.');
        window.location.href = 'login.html';
        return;
    }

    const checkoutItemsTable = document.getElementById('checkout-items');
    const checkoutTotal = document.getElementById('checkout-total');
    const specificQuantitySum = document.getElementById('specific-quantity-sum');

    if (!checkoutItemsTable || !checkoutTotal || !specificQuantitySum) {
        return;
    }

    const checkoutItemsTableBody = checkoutItemsTable.getElementsByTagName('tbody')[0];
    checkoutItemsTableBody.innerHTML = '';

    let total = 0;
    let quantitySum = 0;

    user.cart.forEach(item => {
        const row = checkoutItemsTableBody.insertRow();

        const imageCell = row.insertCell(0);
        const nameCell = row.insertCell(1);
        const priceCell = row.insertCell(2);
        const quantityCell = row.insertCell(3);
        const totalCell = row.insertCell(4);

        const img = document.createElement('img');
        img.src = item.image;
        img.alt = item.name;
        img.className = 'cart-item-image';
        imageCell.appendChild(img);

        nameCell.innerText = item.name;
        priceCell.innerText = `$${item.price.toFixed(2)}`;
        quantityCell.innerText = item.quantity;

        const itemTotal = (item.price * item.quantity).toFixed(2);
        totalCell.innerText = `$${itemTotal}`;

        total += parseFloat(itemTotal);
        quantitySum += item.quantity;
    });

    checkoutTotal.innerText = total.toFixed(2);
    specificQuantitySum.innerText = `(${quantitySum})`;
}

function placeOrder(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const contact = document.getElementById('contact').value;
    const email = document.getElementById('email').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const zip = document.getElementById('zip').value;
    const paymentMethod = document.querySelector('input[name="radio"]:checked');

    if (!name || !contact || !email || !address || !city || !zip || !paymentMethod) {
        alert('Please fill in all the required fields.');
        return;
    }

    const user = getLoggedInUser();
    if (!user) {
        alert('You need to be logged in to place an order.');
        window.location.href = 'login.html';
        return;
    }

    const order = {
        id: 'order-' + Date.now(),
        userId: user.id,
        items: user.cart,
        total: parseFloat(document.getElementById('checkout-total').innerText),
        customerDetails: {
            name,
            contact,
            email,
            address,
            city,
            zip,
            paymentMethod: paymentMethod.value
        },
        date: new Date().toISOString()
    };

    // Save the order to localStorage or send it to the server
    saveOrder(order);

    // Clear the cart
    user.cart = [];
    localStorage.setItem('loggedInUser', JSON.stringify(user));

    alert('Order placed successfully!');
    window.location.href = 'ordersuccess.html'; // Redirect to order confirmation page
}

function saveOrder(order) {
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    orders.push(order);
    localStorage.setItem('orders', JSON.stringify(orders));
}
