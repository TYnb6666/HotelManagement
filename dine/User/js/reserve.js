// Extended reservation logic for restaurant cards

document.addEventListener('DOMContentLoaded', function() {
  const reservedData = JSON.parse(localStorage.getItem('reservedData')) || []; // Load from local storage
  const cards = document.querySelectorAll('.restaurant-card');
  const modal = document.getElementById('reservation-modal');
  const closeButton = document.querySelector('.close-button');
  const form = document.getElementById('reservation-form');
  const viewReservationsButton = document.getElementById('view-reservations-button');
  const reservationListContainer = document.createElement('div');
  reservationListContainer.id = 'reservation-list-container';
  document.body.appendChild(reservationListContainer);

  let currentCardIndex = null;

  // Open modal when a card is clicked
  cards.forEach((card, idx) => {
    card.addEventListener('click', function() {
      currentCardIndex = idx;
      modal.style.display = 'block';
    });
  });

  // Close modal
  closeButton.addEventListener('click', function() {
    modal.style.display = 'none';
  });

  // Handle form submission
  form.addEventListener('submit', function(event) {
    event.preventDefault();

    const time = document.getElementById('reservation-time').value;
    const people = document.getElementById('reservation-people').value;
    const packageType = document.getElementById('reservation-package').value;

    if (!time || !people || !packageType) {
      alert('Please fill in all fields.');
      return;
    }

    reservedData[currentCardIndex] = { time, people, packageType };
    localStorage.setItem('reservedData', JSON.stringify(reservedData));
    alert('Reservation Saved!');
    modal.style.display = 'none';
    updateReservationListUI();
  });

  // View all reservations
  viewReservationsButton.addEventListener('click', function() {
    updateReservationListUI();
    reservationListContainer.style.display = 'block';
  });

  // Update reservation list UI
  function updateReservationListUI() {
    reservationListContainer.innerHTML = '<h2>Your Reservations</h2>';
    reservedData.forEach((reservation, idx) => {
      if (reservation) {
        const reservationItem = document.createElement('div');
        reservationItem.className = 'reservation-item';
        reservationItem.innerHTML = `
          <p>Restaurant ${idx + 1}: Time - ${reservation.time}, People - ${reservation.people}, Package - ${reservation.packageType}</p>
          <button class="edit-reservation" data-index="${idx}">Edit</button>
          <button class="delete-reservation" data-index="${idx}">Delete</button>
        `;
        reservationListContainer.appendChild(reservationItem);
      }
    });

    // Add event listeners for edit and delete buttons
    document.querySelectorAll('.edit-reservation').forEach(button => {
      button.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        const reservation = reservedData[idx];
        document.getElementById('reservation-time').value = reservation.time;
        document.getElementById('reservation-people').value = reservation.people;
        document.getElementById('reservation-package').value = reservation.packageType;
        currentCardIndex = idx;
        modal.style.display = 'block';
      });
    });

    document.querySelectorAll('.delete-reservation').forEach(button => {
      button.addEventListener('click', function() {
        const idx = this.getAttribute('data-index');
        reservedData[idx] = null;
        localStorage.setItem('reservedData', JSON.stringify(reservedData));
        updateReservationListUI();
      });
    });
  }

  // Hide reservation list container when clicking outside
  reservationListContainer.addEventListener('click', function(event) {
    if (event.target === reservationListContainer) {
      reservationListContainer.style.display = 'none';
    }
  });

  // Initialize UI on page load
  updateReservationListUI();
});
