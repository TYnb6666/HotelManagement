// default goal and budget (read from local storage first)
let businessGoals = JSON.parse(localStorage.getItem('incomeGoals')) || {
  "Hotel": 30000,
  "Restaurant": 30000,
  "Entertainment": 30000
};

let expenseBudget = JSON.parse(localStorage.getItem('expenseGoals')) || {
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

// 加载数据 load data
fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        const incomeData = data.income;
        const expensesData = data.expenses;

        // 计算收入 calculate income
        incomeData.forEach(entry => {
            if (!businessCurrent[entry.category]) {
                businessCurrent[entry.category] = 0;
            }
            businessCurrent[entry.category] += entry.amount;
        });

        // 计算支出 calculate expenses
        expensesData.forEach(entry => {
            if (!expenseCurrent[entry.category]) {
                expenseCurrent[entry.category] = 0;
            }
            expenseCurrent[entry.category] += entry.amount;
        });

        renderIncomeTable();
        renderExpenseTable();
        calculateProfit();
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// 渲染收入表 render income table
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
        fill.textContent = Math.round(percentage) + '%'; // 加上百分比文字 add percentage text
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


// 渲染支出表 render expense table
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

// 修改收入 modify income
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
    localStorage.setItem('incomeGoals', JSON.stringify(businessGoals)); //save to local storage
    document.getElementById('incomeModal').style.display = 'none';
    renderIncomeTable();
    calculateProfit();
};

// 修改支出 modify expenses
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
    localStorage.setItem('expenseGoals', JSON.stringify(expenseBudget));
    document.getElementById('expenseModal').style.display = 'none';
    renderExpenseTable();
    calculateProfit();
};

let profitChartInstance = null; // To store ECharts instance for profitChart

// Helper to initialize or update ECharts instance
function initOrUpdateProfitChart(profitGoal, actualProfit) {
    const chartDom = document.getElementById('profitChart');
    if (!chartDom) {
        console.warn('Profit chart DOM element not found.');
        return;
    }

    if (!profitChartInstance) {
        profitChartInstance = echarts.init(chartDom);
        window.addEventListener('resize', function() {
            if (profitChartInstance) {
                profitChartInstance.resize();
            }
        });
    }

    const option = {
        title: {
            text: 'Profit Goal vs Actual Profit',
            left: 'center',
            textStyle: { fontSize: 16 }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Profit Goal', 'Actual Profit'],
            top: 30
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            data: ['Comparison'] // Single category for side-by-side bars
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'Profit Goal',
                type: 'bar',
                barGap: 0, // No gap between bars of the same category index
                emphasis: { focus: 'series' },
                data: [profitGoal],
                itemStyle: { color: 'GreenYellow' } // Light green
            },
            {
                name: 'Actual Profit',
                type: 'bar',
                emphasis: { focus: 'series' },
                data: [actualProfit],
                itemStyle: { color: 'DarkGreen' } // Darker green
            }
        ]
    };
    profitChartInstance.setOption(option, true);
}

function calculateProfitAndRenderChart() {
    // These variables need to be defined and populated based on your application logic
    // For example, loaded from localStorage or another data source.
    // Using placeholder values for demonstration if they are not globally available.
    const businessGoals = JSON.parse(localStorage.getItem('businessGoals')) || { Hotel: 20000, Restaurant: 15000, Entertainment: 5000 };
    const expenseBudget = JSON.parse(localStorage.getItem('expenseGoals')) || { Salaries: 8000, Utilities: 3000, Maintenance: 2000, Supplies: 1500, Marketing: 1000 };
    const businessCurrent = JSON.parse(localStorage.getItem('businessCurrent')) || { Hotel: 18000, Restaurant: 12000, Entertainment: 6000 };
    const expenseCurrent = JSON.parse(localStorage.getItem('expenseCurrent')) || { Salaries: 7500, Utilities: 2800, Maintenance: 2200, Supplies: 1300, Marketing: 900 };

    const estimatedIncomeTotal = Object.values(businessGoals).reduce((a, b) => a + b, 0);
    const estimatedExpenseTotal = Object.values(expenseBudget).reduce((a, b) => a + b, 0);
    const actualIncomeTotal = Object.values(businessCurrent).reduce((a, b) => a + b, 0);
    const actualExpenseTotal = Object.values(expenseCurrent).reduce((a, b) => a + b, 0);

    const profitGoal = estimatedIncomeTotal - estimatedExpenseTotal;
    const actualProfit = actualIncomeTotal - actualExpenseTotal;

    const profitGoalValueEl = document.getElementById('profitGoalValue');
    const actualProfitValueEl = document.getElementById('actualProfitValue');

    if (profitGoalValueEl) profitGoalValueEl.textContent = profitGoal.toFixed(2);
    if (actualProfitValueEl) actualProfitValueEl.textContent = actualProfit.toFixed(2);

    initOrUpdateProfitChart(profitGoal, actualProfit);
}

// Assuming other functions like renderIncomeTable, renderExpenseTable, etc., exist
// and that they might call calculateProfitAndRenderChart() after data modification.

// Initial call when the page and its ECharts script are ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded in budgetControl.html. Make sure to include it before budgetControl.js.');
        return;
    }
    // Initial rendering of tables and chart
    // renderIncomeTable(); // You need to call your table rendering functions
    // renderExpenseTable();
    calculateProfitAndRenderChart(); 

    // Add event listeners for modal buttons if they modify data and need chart refresh
    // Example:
    // document.getElementById('confirmIncomeBtn').onclick = () => {
    //     ... update income data ...
    //     localStorage.setItem('businessGoals', JSON.stringify(businessGoals));
    //     renderIncomeTable();
    //     calculateProfitAndRenderChart();
    // };
    // document.getElementById('confirmExpenseBtn').onclick = () => {
    //    ... update expense data ...
    //    localStorage.setItem('expenseGoals', JSON.stringify(expenseBudget));
    //    renderExpenseTable();
    //    calculateProfitAndRenderChart();
    // };
});

// Make sure your other functions like renderExpenseTable, etc. call calculateProfitAndRenderChart() after data changes.
