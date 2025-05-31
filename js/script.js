document.addEventListener('DOMContentLoaded', function () {
    const headerContainer = document.getElementById('header-container');
    const sidebarContainer = document.getElementById('sidebar-container');

    // 使用Promise.all等待header和sidebar都加载完毕
    Promise.all([
        fetch('header.html').then(response => response.text()),
        fetch('sidebar.html').then(response => response.text())
    ])
        .then(([headerHtml, sidebarHtml]) => {
            // 插入HTML内容
            headerContainer.innerHTML = headerHtml;
            sidebarContainer.innerHTML = sidebarHtml;

            // 所有内容加载完毕后，统一初始化UI组件
            initializeUIComponents();
        })
});

function initializeUIComponents() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const content = document.querySelector('.content'); // 主页面内容区域

    if (!sidebar) {
        console.warn('Sidebar element not found after loading.');
        // if not sidebar, terminate function
        return;
    }

    // 手机端侧边栏默认隐藏
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

    // 2. 下拉菜单功能
    const dropdowns = document.querySelectorAll('.sidebar .dropdown'); // 限定在sidebar内查找
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.submenu');

        if (submenu && dropdownLink) {
            submenu.style.display = 'none'; // 初始隐藏

            dropdownLink.addEventListener('click', function () {
                const isVisible = submenu.style.display === 'block';

                // 点击当前submenu，收缩or展开
                submenu.style.display = isVisible ? 'none' : 'block';  // lay out vertically
            });
        }
    });

    // 3. 移动端响应式调整 (确保sidebar和content在调用时已存在)
    function checkMobile() {
        if (!content) return; // 如果content不存在，则不执行

        if (sidebar.classList.contains('hidden')) {
            content.classList.add('full');
        } else {
            if (window.innerWidth > 768) { // for PC, remove 'full' class
                content.classList.remove('full');
            } else {
                content.classList.add('full'); // 移动端sidebar可见时，content也应是full
            }
        }
    }

    window.addEventListener('resize', checkMobile); //adjust layout when window size changes
    // 初始检查，确保 content class 正确
    // 这会在手机端默认隐藏后，以及桌面端初始加载时正确设置 content class
    checkMobile();
}




