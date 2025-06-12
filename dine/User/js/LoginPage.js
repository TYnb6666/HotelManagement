// Login page script

// Initialize localStorage with data from userdata.json
async function initializeLocalStorage() {
    const usersFromLocalStorage = localStorage.getItem('users');
    if (!usersFromLocalStorage) {
        try {
            console.log('Initializing localStorage...');
            const response = await fetch('./User/json/userdata.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch userdata.json: ${response.statusText}`);
            }
            const usersFromJson = await response.json();
            console.log('Users fetched from JSON:', usersFromJson);
            localStorage.setItem('users', JSON.stringify(usersFromJson));
        } catch (error) {
            console.error('Error initializing localStorage:', error);
        }
    } else {
        console.log('localStorage already initialized:', JSON.parse(usersFromLocalStorage));
    }
}

initializeLocalStorage();

function fetchUserData() {
    // Fetch user data from localStorage
    return JSON.parse(localStorage.getItem('users') || '[]');
}

function showMessage(msg) {
    alert(msg);
}

function handleLogin(isUserLogin) {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.username === username && u.password === password);

    if (!user) {
        alert('Invalid username or password');
        return;
    }

    if (isUserLogin && user.role === 'user') {
        // Redirect to user page
        window.location.href = 'User/index.html';
    } else if (!isUserLogin && user.role === 'admin') {
        // Redirect to admin page
        window.location.href = 'Background/index.html';
    } else {
        alert('Invalid role');
    }
}

document.getElementById('user-login-btn').addEventListener('click', function() {
    handleLogin(true);
});
document.getElementById('admin-entrance-btn').addEventListener('click', function() {
    handleLogin(false);
});

// Prevent form default submit to use JS login
document.querySelector('form').addEventListener('submit', function(e) {
  e.preventDefault();
});
