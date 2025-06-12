// Wait for the DOM to be fully loaded before executing the script
document.addEventListener('DOMContentLoaded', function() {
    // Function to calculate the total price after applying discounts and coupons
    function calculateTotal(order) {
        let total = 0;
        order.items.forEach(item => {
            total += item.price;
        });

        // Apply discount
        if (order.discount) {
            total -= order.discount;
        }

        // Apply coupon
        if (order.coupon) {
            total -= order.coupon;
        }

        // Ensure total is not negative
        return total > 0 ? total : 0;
    }

    // Function to update the displayed total price
    function updateDisplayedTotal(orderId, newTotal) {
        const orderTotalElement = document.querySelector(`#order-${orderId} .order-total`);
        if (orderTotalElement) {
            orderTotalElement.textContent = `Total: $${newTotal}`;
            console.log(`Order ${orderId} total updated to: $${newTotal}`);
        } else {
            console.error(`Order total element for order ${orderId} not found.`);
        }
    }

    // Initialize orders data
    const orders = [
        {
            id: 1,
            items: [
                { name: 'Deluxe Set for Two', price: 128 },
                { name: 'Honey Roasted Chicken (Special)', price: 18 }
            ],
            discount: 10,
            coupon: 0
        },
        {
            id: 2,
            items: [
                { name: 'Family Set for Four', price: 258 },
                { name: 'Vegetarian Bento', price: 25 },
                { name: 'Grilled Salmon Bowl (Special)', price: 22 }
            ],
            discount: 8,
            coupon: 0
        },
        {
            id: 3,
            items: [
                { name: 'Kung Pao Chicken', price: 28 },
                { name: 'Beef Noodles', price: 32 },
                { name: 'Chef\'s Special', price: 20 }
            ],
            discount: 5,
            coupon: 0
        }
    ];

    // Add event listeners to coupon buttons
    document.querySelectorAll('.coupon-btn').forEach(button => {
        button.addEventListener('click', (event) => {
            const couponValue = parseInt(event.target.dataset.coupon, 10);
            const orderId = parseInt(event.target.dataset.order, 10);
            console.log(`Coupon button clicked: Order ID = ${orderId}, Coupon Value = $${couponValue}`);
            
            const order = orders.find(o => o.id === orderId);
            if (order) {
                // Remove active class from all coupon buttons in this order
                const orderBox = document.querySelector(`#order-${orderId}`);
                orderBox.querySelectorAll('.coupon-btn').forEach(btn => {
                    btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                event.target.classList.add('active');
                
                // Update coupon and total
                order.coupon = couponValue;
                const newTotal = calculateTotal(order);
                updateDisplayedTotal(orderId, newTotal);
            } else {
                console.error(`Order with ID ${orderId} not found.`);
            }
        });
    });

    // Calculate and display initial totals
    orders.forEach(order => {
        const total = calculateTotal(order);
        updateDisplayedTotal(order.id, total);
    });
});