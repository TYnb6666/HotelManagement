// Register button click event
document.getElementById('registerBtn').addEventListener('click', function() {
  document.getElementById('registerModal').style.display = 'block';
});

// Close register modal
document.getElementById('closeRegister').addEventListener('click', function() {
  document.getElementById('registerModal').style.display = 'none';
});

// Submit register form
document.getElementById('submitRegister').addEventListener('click', function() {
  var username = document.getElementById('regUsername').value.trim();
  var password = document.getElementById('regPassword').value.trim();

  if (!username || !password) {
    document.getElementById('registerMsg').innerText = 'Please fill in all fields.';
    return;
  }

  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const userExists = users.some(u => u.username === username);

  if (userExists) {
    document.getElementById('registerMsg').innerText = 'Username already exists.';
    return;
  }

  users.push({ role: 'user', username, password });
  localStorage.setItem('users', JSON.stringify(users));

  document.getElementById('registerMsg').innerText = 'Registration successful!';

  // Clear the form fields
  document.getElementById('regUsername').value = '';
  document.getElementById('regPassword').value = '';
});
