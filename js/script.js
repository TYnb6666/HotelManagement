function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`fail to load ${file}: `, error));
}

document.addEventListener('DOMContentLoaded', function() {
    const headerContainer = document.getElementById('header-container');
    const sidebarContainer = document.getElementById('sidebar-container');

    // 确保容器存在
    if (!headerContainer || !sidebarContainer) {
        console.error('Header or Sidebar container not found on this page.');
        return;
    }

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
    .catch(error => {
        console.error('Error loading header or sidebar:', error);
    });
});

function initializeUIComponents() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const content = document.querySelector('.content'); // 主页面内容区域

    // 1. 侧边栏收缩功能
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('hidden');
            if (content) {
                content.classList.toggle('full', sidebar.classList.contains('hidden'));
            }
        });
    } else {
        console.warn('Sidebar toggle button or sidebar element not found after loading.');
    }

    // 2. 下拉菜单功能
    const dropdowns = document.querySelectorAll('.sidebar .dropdown'); // 限定在sidebar内查找
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.submenu');
        
        if (submenu && dropdownLink) {
            submenu.style.display = 'none'; // 初始隐藏
            
            dropdownLink.addEventListener('click', function(e) {
                e.preventDefault();
                const isVisible = submenu.style.display === 'block';
                
                // 先关闭所有其他submenu
                document.querySelectorAll('.sidebar .submenu').forEach(sm => {
                    if (sm !== submenu) sm.style.display = 'none';
                });
                // 再切换当前点击的submenu
                submenu.style.display = isVisible ? 'none' : 'block';
            });
        }
    });

    // 3. 移动端响应式调整 (确保sidebar和content在调用时已存在)
    function checkMobile() {
        if (!sidebar) return; // 如果sidebar不存在，则不执行

        // 手机端，如果sidebar是可见的，按钮点击时依然可以切换隐藏/显示
        // 此处不再强制移除hidden类，让按钮完全控制显示/隐藏

        if (content) { // 确保content元素存在
            if (sidebar.classList.contains('hidden')) {
                content.classList.add('full');
            } else {
                 // 如果不是移动端，且sidebar可见，内容区应有margin
                if (window.innerWidth > 768) {
                    content.classList.remove('full');
                } else {
                // 移动端，sidebar可见时，内容区也应该是full (因为sidebar通常是overlay或占据全部宽度后推开内容)
                // 但根据我们当前的CSS，移动端sidebar是fixed的，不推内容区，所以内容区应该总是full
                    content.classList.add('full');
                }
            }
        }
    }

    window.addEventListener('resize', checkMobile);
    checkMobile(); // 初始检查

    // 初始状态检查：如果sidebar是hidden，确保content是full
    if (sidebar && content && sidebar.classList.contains('hidden')){
        content.classList.add('full');
    }
}




