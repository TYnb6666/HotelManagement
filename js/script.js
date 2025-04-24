function loadComponent(id, file) {
    fetch(file)
        .then(response => response.text())
        .then(data => {
            document.getElementById(id).innerHTML = data;
        })
        .catch(error => console.error(`fail to load ${file}: `, error));
}

document.addEventListener("DOMContentLoaded", function () {
    // 加载 header
    fetch("header.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("header-container").innerHTML = html;
        })
        .catch(error => console.error("Error loading header:", error));
    // 加载 sidebar.html
    fetch("sidebar.html")
        .then(response => response.text())
        .then(html => {
            document.getElementById("sidebar-container").innerHTML = html;
            bindDropdownEvents(); // sidebar 加载完成后再绑定事件
        })
        .catch(error => console.error("Error loading sidebar:", error));
});

function bindDropdownEvents() {
    let dropdowns = document.querySelectorAll(".dropdown > a");

    dropdowns.forEach(dropdown => {
        dropdown.addEventListener("click", function (event) {
            event.preventDefault();
            let submenu = this.nextElementSibling;
            submenu.style.display = submenu.style.display === "block" ? "none" : "block";
        });
    });
}




