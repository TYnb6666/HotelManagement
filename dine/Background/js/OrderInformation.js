// Order data structure
let orders = [
  {
    id: 1,
    items: [
      { name: 'Deluxe Set for Two', price: 128 },
      { name: 'Honey Roasted Chicken (Special)', price: 18 }
    ],
    discount: 10,
    total: 136,
    priority: 2
  },
  {
    id: 2,
    items: [
      { name: 'Family Set for Four', price: 258 },
      { name: 'Vegetarian Bento', price: 25 },
      { name: 'Grilled Salmon Bowl (Special)', price: 22 }
    ],
    discount: 8,
    total: 297,
    priority: 1
  },
  {
    id: 3,
    items: [
      { name: 'Kung Pao Chicken', price: 28 },
      { name: 'Beef Noodles', price: 32 },
      { name: "Chef's Special (Special)", price: 20 }
    ],
    discount: 5,
    total: 75,
    priority: 3
  }
];

// Render orders to the DOM
function renderOrders() {
  const orderList = document.querySelector('.order-list');
  orderList.innerHTML = '';
  orders.forEach((order, idx) => {
    const orderBox = document.createElement('div');
    orderBox.className = 'order-box';
    orderBox.innerHTML = `
      <h2>Order ${order.id}</h2>
      <ul class="order-items">
        ${order.items.map(item => `<li><span>${item.name}</span><span>$${item.price}</span></li>`).join('')}
      </ul>
      <div class="order-discount">Special Offer Discount: -$${order.discount}</div>
      <div class="order-total">Total: $${order.total}</div>
      <div class="order-priority">Priority: <span class="priority-value">${order.priority}</span>
        <button onclick="editPriority(${order.id})">Edit</button>
      </div>
      <button onclick="editOrder(${order.id})">Modify</button>
      <button onclick="cancelOrder(${order.id})">Cancel</button>
    `;
    orderList.appendChild(orderBox);
  });
}

// Sort orders by priority (lower number = higher priority)
function sortOrdersByPriority() {
  orders.sort((a, b) => a.priority - b.priority);
  renderOrders();
}

// Edit order priority
function editPriority(orderId) {
  const order = orders.find(o => o.id === orderId);
  const newPriority = prompt('Enter new priority (1, 2, or 3; lower = higher priority):', order.priority);
  if (newPriority !== null && !isNaN(newPriority)) {
    const parsedPriority = parseInt(newPriority);
    if ([1, 2, 3].includes(parsedPriority) && parsedPriority !== order.priority) {
      // Ensure only one order has the new priority
      orders.forEach(o => {
        if (o.priority === parsedPriority) {
          o.priority = order.priority; // Swap priorities
        }
      });
      order.priority = parsedPriority;
      sortOrdersByPriority();
    } else {
      alert('Invalid priority. Please enter 1, 2, or 3.');
    }
  }
}

// Functions to show/close the edit order modal
function showEditOrderModal(order) {
  const modal = document.getElementById('editOrderModal');
  const itemsDiv = document.getElementById('editOrderItems');
  itemsDiv.innerHTML = order.items.map((item, idx) => `
    <div style="margin-bottom:8px;">
      <input type="text" name="name${idx}" value="${item.name}" style="width:140px;" required />
      <input type="number" name="price${idx}" value="${item.price}" min="0" step="0.01" style="width:80px;" required />
    </div>
  `).join('');
  modal.style.display = 'flex';
}

function closeEditOrderModal() {
  document.getElementById('editOrderModal').style.display = 'none';
}

// Edit order: show modal to edit item names and prices, recalculate total, and allow adding/removing items
function editOrder(orderId) {
  const order = orders.find(o => o.id === orderId);
  showEditOrderModal(order);

  const form = document.getElementById('editOrderForm');
  const itemsDiv = document.getElementById('editOrderItems');

  // Render existing items with remove functionality
  itemsDiv.innerHTML = order.items.map((item, idx) => `
    <div style="margin-bottom:8px;" data-index="${idx}">
      <input type="text" name="name${idx}" value="${item.name}" style="width:140px;" required />
      <input type="number" name="price${idx}" value="${item.price}" min="0" step="0.01" style="width:80px;" required />
      <button type="button" onclick="removeItemFromForm(${orderId}, ${idx})">Remove</button>
    </div>
  `).join('');

  // Add functionality for adding new items
  const addItemButton = document.createElement('button');
  addItemButton.textContent = 'Add Item';
  addItemButton.style.marginTop = '10px';
  addItemButton.onclick = function() {
    const newItemDiv = document.createElement('div');
    newItemDiv.style.marginBottom = '8px';
    const newIndex = itemsDiv.children.length; // Ensure unique index for new items
    newItemDiv.innerHTML = `
      <input type="text" name="name${newIndex}" placeholder="Item Name" style="width:140px;" required />
      <input type="number" name="price${newIndex}" placeholder="Price" min="0" step="0.01" style="width:80px;" required />
      <button type="button" onclick="this.parentElement.remove()">Remove</button>
    `;
    itemsDiv.appendChild(newItemDiv);
  };
  itemsDiv.appendChild(addItemButton);

  form.onsubmit = function(e) {
    e.preventDefault();
    // Get form data
    const newItems = [];
    const itemInputs = itemsDiv.querySelectorAll('div');
    itemInputs.forEach((itemDiv, idx) => {
      const nameInput = itemDiv.querySelector(`input[name^="name"]`);
      const priceInput = itemDiv.querySelector(`input[name^="price"]`);
      const name = nameInput ? nameInput.value : '';
      const price = priceInput ? parseFloat(priceInput.value) : NaN;
      if (!name || isNaN(price) || price < 0) {
        alert('Invalid item name or price. Please check your input.');
        return;
      }
      newItems.push({ name, price });
    });
    order.items = newItems;
    // Recalculate total
    const itemsTotal = newItems.reduce((sum, item) => sum + item.price, 0);
    order.total = itemsTotal - order.discount;
    if (order.total < 0) order.total = 0;
    closeEditOrderModal();
    renderOrders(); // Update the UI
  };
}

// Remove an item from the form and update order.items
function removeItemFromForm(orderId, itemIndex) {
  const order = orders.find(o => o.id === orderId);
  if (order) {
    order.items.splice(itemIndex, 1); // Remove from data structure
    editOrder(orderId); // Re-render the form
  }
}

// Cancel order
function cancelOrder(orderId) {
  if (confirm('Are you sure you want to cancel this order?')) {
    orders = orders.filter(o => o.id !== orderId);
    renderOrders();
  }
}

// Initial render and sort
window.onload = function() {
  sortOrdersByPriority();
};

// Expose functions for HTML inline event handlers
window.editPriority = editPriority;
window.editOrder = editOrder;
window.cancelOrder = cancelOrder;
window.closeEditOrderModal = closeEditOrderModal;
