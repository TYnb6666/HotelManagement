// Handle message submission
document.addEventListener('DOMContentLoaded', function() {
    const messageForm = document.getElementById('messageForm');
    
    messageForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const message = document.getElementById('messageInput').value.trim();
        
        if (!message) {
            alert('Please enter your message!');
            return;
        }
        
        // Save message to localStorage for display in DataOverview page
        const messages = JSON.parse(localStorage.getItem('userMessages') || '[]');
        messages.unshift({
            text: message,
            timestamp: new Date().toLocaleString('en-US')
        });
        localStorage.setItem('userMessages', JSON.stringify(messages));
        
        // Log storage status to console
        console.log('Message stored:', {
            message: message,
            allMessages: JSON.parse(localStorage.getItem('userMessages'))
        });
        
        // Clear input after successful submission
        document.getElementById('messageInput').value = '';
        alert('Message submitted successfully!\n\nYou can view this message in the admin dashboard.');
    });
    
    // Add functionality for 'Today's Recommendation' button
    const recommendationButton = document.getElementById('todayRecommendationButton');

    // Ensure the 'Today's Recommendation' button does not trigger form submission
    recommendationButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission behavior
        event.stopPropagation(); // Stop event propagation to avoid conflicts

        const recommendations = [
            "Try our Chef's Special today!",
            "Don't miss the Honey Roasted Chicken!",
            "Enjoy a discount on Grilled Salmon Bowl!",
            "Seafood Set is highly recommended!",
            "Family Set for Four is perfect for sharing!"
        ];

        const randomIndex = Math.floor(Math.random() * recommendations.length);
        const recommendationMessage = recommendations[randomIndex];

        alert(`Today's Recommendation: ${recommendationMessage}`);
    });
});