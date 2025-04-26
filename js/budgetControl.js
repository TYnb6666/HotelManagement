let businessGoals = {
    "Hotel": 30000,
    "Restaurant": 30000,
    "Entertainment": 30000
};

let expenseBudget = {
    "Salaries": 30000,
    "Utilities": 30000,
    "Maintenance": 30000,
    "Supplies": 30000,
    "Marketing": 30000
};

let businessCurrent = {};
let expenseCurrent = {};

const incomeTableBody = document.getElementById('budget-table');
const expenseTableBody = document.getElementById('expense-table');

// 加载数据
fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        const incomeData = data.income;
        const expensesData = data.expenses;

        // 计算收入
        incomeData.forEach(entry => {
            if (!businessCurrent[entry.category]) {
                businessCurrent[entry.category] = 0;
            }
            businessCurrent[entry.category] += entry.amount;
        });

        // 计算支出
        expensesData.forEach(entry => {
            if (!expenseCurrent[entry.category]) {
                expenseCurrent[entry.category] = 0;
            }
            expenseCurrent[entry.category] += entry.amount;
        });

        renderIncomeTable();
        renderExpenseTable();
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// 渲染收入表
function renderIncomeTable() {
    incomeTableBody.innerHTML = '';
    Object.keys(businessGoals).forEach(category => {
        const row = document.createElement('tr');

        const nameCell = document.createElement('td');
        nameCell.textContent = category;
        row.appendChild(nameCell);

        const targetCell = document.createElement('td');
        targetCell.textContent = businessGoals[category];
        row.appendChild(targetCell);

        const current = businessCurrent[category] || 0;
        const currentCell = document.createElement('td');
        currentCell.textContent = current;
        row.appendChild(currentCell);

        const progressCell = document.createElement('td');
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';

        const fill = document.createElement('div');
        fill.className = 'progress-fill';

        const percentage = Math.min((current / businessGoals[category]) * 100, 100);
        fill.style.width = percentage + '%';
        fill.style.backgroundColor = percentage >= 100 ? 'blue' : 'green';
        fill.textContent = Math.round(percentage) + '%'; // ★ 在这里加上百分比文字
        fill.style.textAlign = 'center';
        fill.style.color = 'white';
        fill.style.fontSize = '12px';
        fill.style.lineHeight = '20px';

        progressBar.appendChild(fill);
        progressCell.appendChild(progressBar);
        row.appendChild(progressCell);

        incomeTableBody.appendChild(row);
    });
}


// 渲染支出表
function renderExpenseTable() {
    expenseTableBody.innerHTML = '';
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
        fill.textContent = Math.round(percentage) + '%'; // ★ 支出表也加上百分比文字
        fill.style.textAlign = 'center';
        fill.style.color = 'white';
        fill.style.fontSize = '12px';
        fill.style.lineHeight = '20px';

        progressBar.appendChild(fill);
        progressCell.appendChild(progressBar);
        row.appendChild(progressCell);

        expenseTableBody.appendChild(row);
    });
}

// 修改收入
document.getElementById('modifyIncomeBtn').onclick = () => {
    document.getElementById('hotelInput').value = businessGoals["Hotel"];
    document.getElementById('restaurantInput').value = businessGoals["Restaurant"];
    document.getElementById('entertainmentInput').value = businessGoals["Entertainment"];
    document.getElementById('incomeModal').style.display = 'block';
};

document.getElementById('confirmIncomeBtn').onclick = () => {
    businessGoals["Hotel"] = parseFloat(document.getElementById('hotelInput').value);
    businessGoals["Restaurant"] = parseFloat(document.getElementById('restaurantInput').value);
    businessGoals["Entertainment"] = parseFloat(document.getElementById('entertainmentInput').value);
    document.getElementById('incomeModal').style.display = 'none';
    renderIncomeTable();
};

// 修改支出
document.getElementById('modifyExpenseBtn').onclick = () => {
    document.getElementById('salaryInput').value = expenseBudget["Salaries"];
    document.getElementById('utilityInput').value = expenseBudget["Utilities"];
    document.getElementById('maintenanceInput').value = expenseBudget["Maintenance"];
    document.getElementById('supplyInput').value = expenseBudget["Supplies"];
    document.getElementById('marketingInput').value = expenseBudget["Marketing"];
    document.getElementById('expenseModal').style.display = 'block';
};

document.getElementById('confirmExpenseBtn').onclick = () => {
    expenseBudget["Salaries"] = parseFloat(document.getElementById('salaryInput').value);
    expenseBudget["Utilities"] = parseFloat(document.getElementById('utilityInput').value);
    expenseBudget["Maintenance"] = parseFloat(document.getElementById('maintenanceInput').value);
    expenseBudget["Supplies"] = parseFloat(document.getElementById('supplyInput').value);
    expenseBudget["Marketing"] = parseFloat(document.getElementById('marketingInput').value);
    document.getElementById('expenseModal').style.display = 'none';
    renderExpenseTable();
};
