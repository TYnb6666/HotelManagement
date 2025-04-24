let expenseBudget = {
    "Salaries": 30000,
    "Utilities": 30000,
    "Maintenance": 30000,
    "Supplies": 30000,
    "Marketing": 30000
};

let expenseCurrent = {}; // 当前值
let expenseRows = {}; // 保存每行元素引用以便更新

const tableBody = document.getElementById('expense-table');

// 加载数据
fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        const incomeData = data.expenses;

        // 分类收入累加
        incomeData.forEach(entry => {
            if (!expenseCurrent[entry.category]) {
                expenseCurrent[entry.category] = 0;
            }
            expenseCurrent[entry.category] += entry.amount;
        });

        renderTable();
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// render table function
function renderTable() {
    tableBody.innerHTML = ''; // empty previous content
    Object.keys(expenseBudget).forEach(category => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = category;
        row.appendChild(nameCell);

        const targetCell = document.createElement('td');
        targetCell.textContent = expenseBudget[category];
        row.appendChild(targetCell);

        const current = expenseCurrent[category] || 0;
        const currentCell = document.createElement('td');
        currentCell.textContent = current;
        row.appendChild(currentCell);

        const progressCell = document.createElement('td');
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const fill = document.createElement('div');
        fill.className = 'progress-fill';

        const percentage = Math.min((current / expenseBudget[category]) * 100, 100);
        fill.style.width = percentage + '%';
        fill.style.backgroundColor = percentage >= 100 ? 'red' : 'green';

        progressBar.appendChild(fill);
        progressCell.appendChild(progressBar);
        row.appendChild(progressCell);

        // save DOM reference for later update
        expenseRows[category] = {
            targetCell,
            progressFill: fill
        };

        tableBody.appendChild(row);
    });
}

// modify button
document.getElementById('modifyBudgetBtn').onclick = () => {
    document.getElementById('salaryInput').value = expenseBudget["Salaries"];
    document.getElementById('utilityInput').value = expenseBudget["Utilities"];
    document.getElementById('maintenanceInput').value = expenseBudget["Maintenance"];
    document.getElementById('supplyInput').value = expenseBudget["Supplies"];
    document.getElementById('targetModal').style.display = 'block';
    document.getElementById('marketingInput').value = expenseBudget["Marketing"];
};

// confirm modification
document.getElementById('confirmBtn').onclick = () => {
    expenseBudget["Salaries"] = parseFloat(document.getElementById('salaryInput').value);
    expenseBudget["Utilities"] = parseFloat(document.getElementById('utilityInput').value);
    expenseBudget["Maintenance"] = parseFloat(document.getElementById('maintenanceInput').value);
    expenseBudget["Supplies"] = parseFloat(document.getElementById('supplyInput').value);
    expenseBudget["Marketing"] = parseFloat(document.getElementById('marketingInput').value);
    document.getElementById('targetModal').style.display = 'none';
    renderTable();
};
