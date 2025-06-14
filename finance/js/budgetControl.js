// default goal and budget (read from local storage first)
// parse json string to object
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

// load data
fetch('../data/data.json')
    .then(response => response.json())// transfer response object to js object
    .then(data => {
        const incomeData = data.income;
        const expensesData = data.expenses;

        // calculate income: for each entry in incomeData
        incomeData.forEach(entry => {
            if (!businessCurrent[entry.category]) { // "category": "Hotel"
                businessCurrent[entry.category] = 0;
            }
            businessCurrent[entry.category] += entry.amount;
        });

        // calculate expenses
        expensesData.forEach(entry => {
            if (!expenseCurrent[entry.category]) {
                expenseCurrent[entry.category] = 0;
            }
            expenseCurrent[entry.category] += entry.amount;
        });

        renderIncomeTable();
        renderExpenseTable();
        calculateProfitAndRenderChart();
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// render income table
function renderIncomeTable() {
    incomeTableBody.innerHTML = ''; //clear previous table date
    Object.keys(businessGoals).forEach(category => {
        //  create a new row
        const row = document.createElement('tr');

        //  create a new cell for category
        const nameCell = document.createElement('td');
        nameCell.textContent = category;  // adding element's text content
        row.appendChild(nameCell);  //append <td> into <tr>

        // create business goal
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

        const percentage = Math.min((current / businessGoals[category]) * 100, 100); // more than 100%
        fill.style.width = percentage + '%';  // set progress length
        fill.style.backgroundColor = percentage >= 100 ? 'blue' : 'green';
        fill.textContent = Math.round(percentage) + '%'; // round to inetger
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


// render expense table
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
        fill.textContent = Math.round(percentage) + '%';
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

// modify income
// firstly copy current value to Modal
document.getElementById('modifyIncomeBtn').onclick = () => {
    document.getElementById('hotelInput').value = businessGoals["Hotel"];
    document.getElementById('restaurantInput').value = businessGoals["Restaurant"];
    document.getElementById('entertainmentInput').value = businessGoals["Entertainment"];
    document.getElementById('incomeModal').style.display = 'block';
};

// write new value to businessGoals and update localStorage
document.getElementById('confirmIncomeBtn').onclick = () => {
    businessGoals["Hotel"] = parseFloat(document.getElementById('hotelInput').value);
    businessGoals["Restaurant"] = parseFloat(document.getElementById('restaurantInput').value);
    businessGoals["Entertainment"] = parseFloat(document.getElementById('entertainmentInput').value);
    localStorage.setItem('incomeGoals', JSON.stringify(businessGoals)); //save to local storage
    document.getElementById('incomeModal').style.display = 'none';
    //update table and render chart
    renderIncomeTable();
    calculateProfitAndRenderChart();
};

// modify expenses
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
    calculateProfitAndRenderChart();
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
        // automatically adjust chart size
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
        //prompting when hover
        tooltip: {
            trigger: 'axis',
            axisPointer: { type: 'shadow' }
        },
        legend: {
            data: ['Profit Goal', 'Actual Profit'],
            top: 30
        },
        // position
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
    profitChartInstance.setOption(option, true); //true: Force all updates
}

function calculateProfitAndRenderChart() {
    const businessGoals = JSON.parse(localStorage.getItem('incomeGoals'));
    const expenseBudget = JSON.parse(localStorage.getItem('expenseGoals'));
    
    // Calculate total current income from businessCurrent
    // callback function to accumulate all income, Array.reduce(callback, initialValue)
    const currentIncome = Object.values(businessCurrent).reduce((sum, value) => sum + value, 0);
    
    // Calculate total current expenses from expenseCurrent
    const currentExpenses = Object.values(expenseCurrent).reduce((sum, value) => sum + value, 0);

    // Calculate total goals
    const totalIncomeGoal = Object.values(businessGoals).reduce((sum, value) => sum + value, 0);
    const totalExpenseGoal = Object.values(expenseBudget).reduce((sum, value) => sum + value, 0);

    const profitGoal = totalIncomeGoal - totalExpenseGoal;
    const actualProfit = currentIncome - currentExpenses;

    const profitGoalValueEl = document.getElementById('profitGoalValue');
    const actualProfitValueEl = document.getElementById('actualProfitValue');

    if (profitGoalValueEl) profitGoalValueEl.textContent = profitGoal.toFixed(2);
    if (actualProfitValueEl) actualProfitValueEl.textContent = actualProfit.toFixed(2);

    initOrUpdateProfitChart(profitGoal, actualProfit);
}


// Initial call when the page and its ECharts script are ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded in budgetControl.html. Make sure to include it before budgetControl.js.');
        return;
    }
    calculateProfitAndRenderChart(); 

});