// Display user messages
document.addEventListener('DOMContentLoaded', function() {
    const messagesList = document.getElementById('messagesList');
    
    // Get and display messages from localStorage
    function displayMessages() {
        const messages = JSON.parse(localStorage.getItem('userMessages') || '[]');
        
        console.log('Reading messages:', {
            storedMessages: messages,
            messagesList: messagesList ? 'Message list element exists' : 'Message list element not found'
        });
        
        if (messages.length === 0) {
            if (messagesList) {
                messagesList.innerHTML = '<p style="color: #666; text-align: center;">No messages yet</p>';
            } else {
                console.error('Message list element not found!');
            }
            return;
        }
        
        messagesList.innerHTML = messages.map(message => `
            <li><b>${message.timestamp}</b> - ${message.text}</li>
        `).join('');
    }
    
    // Initial display
    displayMessages();
    
    // Refresh every 30 seconds
    setInterval(displayMessages, 30000);
});