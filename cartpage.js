const users = {
    user1: {
        id: '001',
        username: 'John Doe',
        email: "john@gmail.com",
        password: "123456",
        role: 'user',
        cart: []
    },
    user2: {
        id: '002',
        username: 'Jane Smith',
        email: "jane@gmail.com",
        password: "123456",
        role: 'admin',
        cart: []
    },
    user3: {
        id: '003',
        username: 'Adam Kirk',
        email: "adam@gmail.com",
        password: "123456",
        role: 'user',
        cart: []
    }
};

document.addEventListener('DOMContentLoaded', function() {
    loadCart();

    const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            addProductToCart(button);
        });
    });
});

function getLoggedInUser() {
    return JSON.parse(localStorage.getItem('loggedInUser'));
}

function addProductToCart(button) {
    const user = getLoggedInUser();
    if (!user) {
        alert('You need to be logged in to add items to the cart.');
        window.location.href = 'login.html';
        return;
    }

    const productId = button.getAttribute('data-id');
    const productNameElement = document.getElementById('product-name-' + productId);
    const productPriceElement = document.getElementById('product-price-' + productId);
    const productImageElement = document.getElementById('ProductImg-' + productId);
    const quantityInputElement = document.getElementById('quantity-' + productId); // Ensure this ID is unique per product

    if (!productNameElement || !productPriceElement || !productImageElement || !quantityInputElement) {
        console.error('Product elements not found for ID:', productId);
        return;
    }

    const productName = productNameElement.innerText;
    const productPriceText = productPriceElement.innerText.replace('$', ''); // Assuming price includes $
    const productImage = productImageElement.src;
    const quantity = parseInt(quantityInputElement.value, 10);

    if (isNaN(quantity) || quantity <= 0) {
        alert('Please enter a valid quantity.');
        return;
    }

    const product = {
        id: productId,
        name: productName,
        price: parseFloat(productPriceText),
        image: productImage,
        quantity: quantity
    };

    addToCart(product);
}

function addToCart(product) {
    const user = getLoggedInUser();
    if (user) {
        const existingItemIndex = user.cart.findIndex(item => item.id === product.id);

        if (existingItemIndex > -1) {
            user.cart[existingItemIndex].quantity += product.quantity;
        } else {
            user.cart.push(product);
        }

        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Product added to cart successfully!');
        window.location.href = 'cart.html';
    }
}

function loadCart() {
    const user = getLoggedInUser();

    const cartItemsTable = document.getElementById('cart-items');
    const emptyCartMessage = document.getElementById('empty-cart-message');
    const cartTotal = document.getElementById('cart-total');
    const totalPriceDiv = document.querySelector('.total-price');

    if (!cartItemsTable || !emptyCartMessage || !cartTotal || !totalPriceDiv) {
        console.error('One or more required elements are missing from the DOM.');
        return;
    }

    if (user && user.cart.length > 0) {
        cartItemsTable.style.display = 'table';
        emptyCartMessage.style.display = 'none';
        cartTotal.style.display = 'block';
        totalPriceDiv.style.display = 'block';

        const cartItemsTableBody = cartItemsTable.getElementsByTagName('tbody')[0];
        cartItemsTableBody.innerHTML = '';

        let total = 0;

        user.cart.forEach((item, index) => {
            const row = cartItemsTableBody.insertRow();

            const imageCell = row.insertCell(0);
            const nameCell = row.insertCell(1);
            const priceCell = row.insertCell(2);
            const quantityCell = row.insertCell(3);
            const totalCell = row.insertCell(4);
            const removeCell = row.insertCell(5);

            const img = document.createElement('img');
            img.src = item.image;
            img.alt = item.name;
            img.className = 'cart-item-image';
            imageCell.appendChild(img);

            nameCell.innerText = item.name;
            priceCell.innerText = `$${item.price.toFixed(2)}`;
            quantityCell.innerHTML = `<input type="number" value="${item.quantity}" min="1" data-index="${index}">`;

            const itemTotal = (item.price * item.quantity).toFixed(2);
            totalCell.innerText = `$${itemTotal}`;

            total += parseFloat(itemTotal);

            const removeButton = document.createElement('button');
            removeButton.innerText = 'Remove';
            removeButton.setAttribute('data-index', index);
            removeButton.addEventListener('click', removeItem);
            removeButton.classList.add('remove-button');
            removeCell.appendChild(removeButton);
        });

        cartTotal.innerText = `Total: $${total.toFixed(2)}`;
        totalPriceDiv.style.display = 'block';
        updateQuantityListeners();
    } else {
        cartItemsTable.style.display = 'none';
        emptyCartMessage.style.display = 'block';
        cartTotal.style.display = 'none';
        totalPriceDiv.style.display = 'none';
    }
}

function updateQuantityListeners() {
    document.querySelectorAll('input[type="number"]').forEach(input => {
        input.addEventListener('change', updateQuantity);
    });
}

function updateQuantity(event) {
    const index = event.target.getAttribute('data-index');
    const newQuantity = parseInt(event.target.value, 10);

    if (newQuantity > 0) {
        const user = getLoggedInUser();
        if (user) {
            user.cart[index].quantity = newQuantity;
            localStorage.setItem('loggedInUser', JSON.stringify(user));
            loadCart();
        }
    }
}

function removeItem(event) {
    const index = event.target.getAttribute('data-index');

    const user = getLoggedInUser();
    if (user) {
        user.cart.splice(index, 1);
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        loadCart();
    }
}
