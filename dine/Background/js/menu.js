// Global variable to store the current editing row
let currentEditingRow = null;

// Open edit modal
function editDish(button) {
    const row = button.parentNode.parentNode;
    currentEditingRow = row;
    const name = row.cells[0].textContent;
    const price = row.cells[1].textContent.replace('$', '');

    const modal = document.getElementById('editModal');
    const nameInput = document.getElementById('dishName');
    const priceInput = document.getElementById('dishPrice');

    nameInput.value = name;
    priceInput.value = price;
    modal.style.display = 'block';
}

// Close modal
function closeModal() {
    const modal = document.getElementById('editModal');
    modal.style.display = 'none';
    currentEditingRow = null;
}

// Delete dish
function deleteDish(button) {
    if (confirm('Are you sure you want to delete this dish?')) {
        const row = button.parentNode.parentNode;
        row.parentNode.removeChild(row);
    }
}

// Add new dish
function addDish(category) {
    currentEditingRow = null;
    const modal = document.getElementById('editModal');
    const nameInput = document.getElementById('dishName');
    const priceInput = document.getElementById('dishPrice');

    nameInput.value = '';
    priceInput.value = '';
    modal.style.display = 'block';

    // Store current category to determine which table to add to
    modal.dataset.category = category;
}

// Form submission handler
document.getElementById('editForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('dishName').value;
    const price = document.getElementById('dishPrice').value;
    
    if (currentEditingRow) {
        // Edit existing dish
        currentEditingRow.cells[0].textContent = name;
        currentEditingRow.cells[1].textContent = `¥${price}`;
    } else {
        // Add new dish
        const modal = document.getElementById('editModal');
        const category = modal.dataset.category;
        
        // Find the corresponding table
        const tables = document.querySelectorAll('.menu-table');
        let table;
        
        switch(category) {
            case 'setmeal':
                table = tables[0];
                break;
            case 'single':
                table = tables[1];
                break;
            case 'special':
                table = tables[2];
                break;
        }
        
        if (table) {
            const newRow = table.insertRow(-1);
            newRow.innerHTML = `
                <td>${name}</td>
                <td>$${price}</td>
                <td>
                    <button onclick="editDish(this)" class="edit-btn">Edit</button>
                    <button onclick="deleteDish(this)" class="delete-btn">Delete</button>
                </td>
            `;
        }
    }
    
    closeModal();
});

// Close modal when clicking outside
window.addEventListener('click', function(e) {
    const modal = document.getElementById('editModal');
    if (e.target === modal) {
        closeModal();
    }
});