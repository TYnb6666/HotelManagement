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
            // 'hidden' True=>append full;'hidden' False=>remove full
            content.classList.toggle('full', sidebar.classList.contains('hidden'));
        }
    });

    // Drop-down menu function
    const dropdowns = document.querySelectorAll('.sidebar .dropdown'); // Search limited to within the sidebar
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        // find submenu needed to be collapsed
        const submenu = dropdown.querySelector('.submenu');

        if (submenu && dropdownLink) {
            submenu.style.display = 'none'; // hiding in initialization

            dropdownLink.addEventListener('click', function () {
                //block => visible
                const isVisible = submenu.style.display === 'block';

                // click submenu，collapse or expend
                submenu.style.display = isVisible ? 'none' : 'block';
            });
        }
    });

    // Mobile responsive adjustment
    function checkMobile() {
        // ensure for mobile, default collapse the sidebar
        if (sidebar.classList.contains('hidden')) {
            content.classList.add('full');
        } else {
            if (window.innerWidth > 768) { // for PC, remove 'full' class
                content.classList.remove('full');
            } else {
                //no matter whether sidebar is expanded for mobile, content would not shrink
                content.classList.add('full');
            }
        }
    }

    window.addEventListener('resize', checkMobile); //adjust layout when window size changes
    checkMobile();
}




