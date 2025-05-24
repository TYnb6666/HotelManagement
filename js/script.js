function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`fail to load ${file}: `, error));
}

document.addEventListener('DOMContentLoaded', function() {
    // 加载 header
    fetch("header.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("header-container").innerHTML = html;
            initializeSidebar(); // 在header加载后初始化sidebar
        })
        .catch(error => console.error("Error loading header:", error));

    // 加载 sidebar
    fetch("sidebar.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("sidebar-container").innerHTML = html;
            initializeDropdowns(); // 在sidebar加载后初始化下拉菜单
        })
        .catch(error => console.error("Error loading sidebar:", error));
});

// 初始化侧边栏功能
function initializeSidebar() {
    const sidebar = document.querySelector('.sidebar');
    const toggleBtn = document.getElementById('sidebar-toggle-btn');
    const content = document.querySelector('.content');
    
    if (toggleBtn && sidebar) {
        toggleBtn.addEventListener('click', function() {
            sidebar.classList.toggle('hidden');
            if (content) {
                content.classList.toggle('full');
            }
        });
    }

    // 移动端响应
    function checkMobile() {
        // 手机端不自动展开/收起，交给用户手动控制
        // 但如果sidebar隐藏，内容区应全宽
        if (content && sidebar) {
            if (sidebar.classList.contains('hidden')) {
                content.classList.add('full');
            } else {
                content.classList.remove('full');
            }
        }
    }

    window.addEventListener('resize', checkMobile);
    checkMobile();
}

// 初始化下拉菜单功能
function initializeDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown');
    dropdowns.forEach(dropdown => {
        const dropdownLink = dropdown.querySelector('a');
        const submenu = dropdown.querySelector('.submenu');
        
        if (submenu && dropdownLink) {
            // 确保子菜单初始状态为隐藏
            submenu.style.display = 'none';
            
            dropdownLink.addEventListener('click', function(e) {
                e.preventDefault(); // 阻止链接默认行为
                
                // 切换子菜单显示状态
                submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
                
                // 关闭其他子菜单
                dropdowns.forEach(otherDropdown => {
                    if (otherDropdown !== dropdown) {
                        const otherSubmenu = otherDropdown.querySelector('.submenu');
                        if (otherSubmenu) {
                            otherSubmenu.style.display = 'none';
                        }
                    }
                });
            });
        }
    });
}




