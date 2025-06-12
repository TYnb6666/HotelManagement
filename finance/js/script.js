document.addEventListener('DOMContentLoaded', function () {
    const headerContainer = document.getElementById('header-container');
    const sidebarContainer = document.getElementById('sidebar-container');

    // Promise.all: waiting  for header and sidebar loading
    Promise.all([
        fetch('header.html').then(response => response.text()),  //derive primitive text
        fetch('sidebar.html').then(response => response.text())
    ])
        .then(([headerHtml, sidebarHtml]) => {
            // insert HTML content
            headerContainer.innerHTML = headerHtml;
            sidebarContainer.innerHTML = sidebarHtml;

            // After all the contents have been loaded, initialize the UI components uniformly
            initializeUIComponents();
        })
});

function initializeUIComponents() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const content = document.querySelector('.content'); // Main page content area

    if (!sidebar) {
        console.warn('Sidebar element not found after loading.');
        // if not sidebar, terminate function
        return;
    }

    // sidebar on the mobile phone is hidden by default
    if (window.innerWidth <= 768) {
        sidebar.classList.add('hidden');  //append 'hidden' class to sidebar
        if (content) {
            content.classList.add('full');
        }
    }

    toggleBtn.addEventListener('click', function () {
        sidebar.classList.toggle('hidden'); // if have 'hidden' then remove, if not have then append
        if (content) {
            content.classList.toggle('full', sidebar.classList.contains('hidden')); // 'hidden' True=>append full;'hidden' False=>remove full
        }
    });

    // Drop-down menu function
    const dropdowns = document.querySelectorAll('.sidebar .dropdown'); // Search limited to within the sidebar
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.submenu');

        if (submenu && dropdownLink) {
            submenu.style.display = 'none'; // Initial hiding

            dropdownLink.addEventListener('click', function () {
                const isVisible = submenu.style.display === 'block';

                // click submenu，collapse or expend
                submenu.style.display = isVisible ? 'none' : 'block';  // lay out vertically
            });
        }
    });

    // 3. Mobile responsive adjustment
    function checkMobile() {
        if (!content) return; // if content not exist，terminate

        if (sidebar.classList.contains('hidden')) {
            content.classList.add('full');
        } else {
            if (window.innerWidth > 768) { // for PC, remove 'full' class
                content.classList.remove('full');
            } else {
                content.classList.add('full'); // when mobile sidebar visible，content is full
            }
        }
    }

    window.addEventListener('resize', checkMobile); //adjust layout when window size changes
    // Initial check to ensure that the content class is correct
    // This will correctly set the content class after it is hidden by default on the mobile phone end and during the initial loading on the desktop end
    checkMobile();
}




