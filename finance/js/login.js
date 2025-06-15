document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const inputUsername = document.getElementById('username').value;
    const inputPassword = document.getElementById('password').value;

    fetch('../data/account.json').then(response => response.json()).then(accounts => {
        const accountDict = {};
        for (const account of accounts) {
            accountDict[account.username] = account.password;
        }

        if (accountDict[inputUsername] && accountDict[inputUsername] === inputPassword) {
            // verification succeed
            document.getElementById('optionsModal').classList.add('show');
        } else {
            alert('Incorrect username or password.');
        }
    })
});

function selectOption(role) {
    // jump to different services according to choice
    console.log('Selected role:', role);
    switch (role) {
        case 'dining':
            window.location.href = '../../dine/Background/index.html';
            break;
        case 'residence':
            window.location.href = '#accommodation stage';
            break;
        case 'finance':
            window.location.href = 'dashboard.html';
            break;
        case 'entertainment':
            window.location.href = '#entertainment backstage';
            break;
    }
}