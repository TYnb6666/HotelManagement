let incomeExpenseChart, profitTrendChart, compareChart;
let incomeData = [], expenseData = [];

fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        incomeData = data.income;
        expenseData = data.expenses;
        initializePage();
    });

function initializePage() {
    document.getElementById('applyMonth').addEventListener('click', () => {
        const selectedMonth = document.getElementById('monthPicker').value;
        updateOverview(selectedMonth);
    });
    // load current selected month as default
    const defaultMonth = document.getElementById('monthPicker').value;
    updateOverview(defaultMonth);
}

function updateOverview(month) {
    const selectedIncome = incomeData.filter(item => item.date.startsWith(month));
    const selectedExpenses = expenseData.filter(item => item.date.startsWith(month));

    let totalIncome = selectedIncome.reduce((sum, item) => sum + item.amount, 0);
    let totalExpenses = selectedExpenses.reduce((sum, item) => sum + item.amount, 0);
    let totalProfit = totalIncome - totalExpenses;
    let profitRate = totalProfit / totalIncome *100


    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('totalProfit').textContent = totalProfit.toFixed(2);
    document.getElementById('profitRate').textContent = profitRate.toFixed(2);

    drawIncomeExpenseTrend();
    drawProfitTrend();
    drawMonthComparison(month);
}

function drawIncomeExpenseTrend() {
    if (incomeExpenseChart) incomeExpenseChart.destroy();

    const months = getUniqueMonths();
    const incomeSums = months.map(m => sumByMonth(incomeData, m));
    const expenseSums = months.map(m => sumByMonth(expenseData, m));
    const ctx = document.getElementById('incomeExpenseChart').getContext('2d');
    incomeExpenseChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {label: 'Income', data: incomeSums, borderColor: 'blue', fill: false},
                {label: 'Expenses', data: expenseSums, borderColor: 'red', fill: false}
            ]
        },
        options: {responsive: true}
    });
}

function drawProfitTrend() {
    if (profitTrendChart) profitTrendChart.destroy();

    const months = getUniqueMonths();
    const profitSums = months.map(m => sumByMonth(incomeData, m) - sumByMonth(expenseData, m));

    const ctx = document.getElementById('profitTrendChart').getContext('2d');
    profitTrendChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: months,
            datasets: [
                {label: 'Profit', data: profitSums, borderColor: 'green', fill: false}
            ]
        },
        options: {responsive: true}
    });
}

function drawMonthComparison(selectedMonth) {
    if (compareChart) compareChart.destroy();

    const prevMonth = getPreviousMonth(selectedMonth);

    const currentIncome = sumByMonth(incomeData, selectedMonth);
    const currentExpenses = sumByMonth(expenseData, selectedMonth);
    const currentProfit = currentIncome - currentExpenses;

    const prevIncome = sumByMonth(incomeData, prevMonth);
    const prevExpenses = sumByMonth(expenseData, prevMonth);
    const prevProfit = prevIncome - prevExpenses;

    const ctx = document.getElementById('compareChart').getContext('2d');
    compareChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Income', 'Expenses', 'Profit'],
            datasets: [
                {
                    label: 'Current Month',
                    data: [currentIncome, currentExpenses, currentProfit],
                    backgroundColor: 'rgba(75,192,192,0.6)'
                },
                {
                    label: 'Previous Month',
                    data: [prevIncome, prevExpenses, prevProfit],
                    backgroundColor: 'rgba(192,75,75,0.6)'
                }
            ]
        },
        options: {responsive: true}
    });
}

function getUniqueMonths() {
    const months = new Set();
    [...incomeData, ...expenseData].forEach(item => {
        months.add(item.date.slice(0, 7));
    });
    return Array.from(months).sort();
}

function sumByMonth(data, month) {
    return data.filter(item => item.date.startsWith(month))
        .reduce((sum, item) => sum + item.amount, 0);
}

function getPreviousMonth(month) {
    const [year, m] = month.split('-').map(Number);
    let prevYear = year, prevMonth = m - 1;
    if (prevMonth === 0) {
        prevYear -= 1;
        prevMonth = 12;
    }
    return `${prevYear}-${String(prevMonth).padStart(2, '0')}`;
}
