
  document.addEventListener('DOMContentLoaded', function() {
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userInfo = document.getElementById('userInfo');
    const authButton = document.getElementById('authButton');

    // Check if user is logged in
    if (loggedInUser) {
        // Display username and role
        userInfo.textContent = `${loggedInUser.username} (${loggedInUser.role})`;
        authButton.textContent = 'Logout';
        authButton.href = '#'; // Prevent default action
        authButton.onclick = function() {
            localStorage.removeItem('loggedInUser');
            window.location.href = 'login.html'; // Redirect to login page
        };

        // Redirect logged-in users to homepage
        if (window.location.pathname.endsWith('login.html') || window.location.pathname.endsWith('register.html')) {
            window.location.href = 'index.html'; // Redirect to homepage
        }
    } else {
        userInfo.textContent = 'guest';
        authButton.textContent = 'Login';
        authButton.href = 'login.html'; // Redirect to login page
    }
});
