// Existing users object (for reference)
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

// Generate a unique ID
function generateUniqueId() {
    return 'user-' + Math.random().toString(36).substr(2, 9);
}

// Add new user to the existing users object in localStorage
function addUserToUsers(newUser) {
    let currentUsers = JSON.parse(localStorage.getItem('users')) || {};
    currentUsers[newUser.id] = newUser;
    localStorage.setItem('users', JSON.stringify(currentUsers));
}

// Initialize users in localStorage
function initializeUsers() {
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify(users));
    }
}

// Handle login
const loginForm = document.getElementById('LoginForm');
loginForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('usernameLogin').value;
    const password = document.getElementById('passwordLogin').value;

    // Retrieve users from localStorage
    const currentUsers = JSON.parse(localStorage.getItem('users')) || {};
    
    // Find user by email
    const user = Object.values(currentUsers).find(user => user.email === email);

    if (user && user.password === password) {
        // Store user info in localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        alert('Login successful! Redirecting...');
        window.location.href = 'index.html'; // Redirect to homepage or dashboard
    } else {
        alert('Invalid email or password.');
    }
});

// Handle registration
const regForm = document.getElementById('RegForm');
regForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('usernameRegister').value;
    const email = document.getElementById('emailRegister').value;
    const password = document.getElementById('passwordRegister').value;

    // Generate a new unique ID for registration
    const newId = generateUniqueId();
    const newUser = {
        id: newId,
        username: username,
        email: email,
        password: password,
        role: 'user',
        cart: []
    };

    // Add new user to existing users
    addUserToUsers(newUser);

    // Log the new user as logged in
    localStorage.setItem('loggedInUser', JSON.stringify(newUser));
    alert('Registration successful! Redirecting...');
    window.location.href = 'index.html'; // Redirect to homepage or dashboard
});

// Initialize users on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeUsers();
});
