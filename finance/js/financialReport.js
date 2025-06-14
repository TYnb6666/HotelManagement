let incomeExpenseChart, profitTrendChart, compareChart;
let incomeData = [], expenseData = [];
let echartsInstances = {}; // Store ECharts instances for resize

function initChart(id, option) {
    const chartDom = document.getElementById(id);
    if (chartDom) {
        // Check if instance already exists, if yes, pass the chart object to chart
        let chart = echarts.getInstanceByDom(chartDom);
        if (!chart) { // If not, init new one
            chart = echarts.init(chartDom);
        }
        chart.setOption(option, true); // true to not merge with previous option
        echartsInstances[id] = chart;
        return chart;
    }
    console.warn(`Chart DOM element with id '${id}' not found.`);
    return null;
}

window.addEventListener('resize', function() {
    for (let id in echartsInstances) {
        if (echartsInstances[id]) {
            echartsInstances[id].resize();
        }
    }
});

// Fetch data once and then initialize
document.addEventListener('DOMContentLoaded', function() {
    fetch('../data/data.json')
        .then(response => {
            return response.json();
        })
        .then(jsonData => {
            incomeData = jsonData.income;
            expenseData = jsonData.expenses;
            initializePage();
        })
        .catch(error => console.error('Error loading financial data:', error));
});

function initializePage() {
    const monthPicker = document.getElementById('monthPicker');
    const applyMonthButton = document.getElementById('applyMonth');

    if (!monthPicker || !applyMonthButton) {
        console.error('Month picker or apply button not found in financialReport.html');
        return;
    }

    applyMonthButton.addEventListener('click', () => {
        const selectedMonth = monthPicker.value;
        updateChartsAndOverview(selectedMonth);
    });
    // Load data for the default selected month on page load
    updateChartsAndOverview(monthPicker.value);
}

function updateChartsAndOverview(month) {
    if (!month) {
        console.error('Selected month is invalid.');
        return;
    }
    const monthlyIncome = incomeData.filter(item => item.date && item.date.startsWith(month));
    const monthlyExpenses = expenseData.filter(item => item.date && item.date.startsWith(month));

    let totalIncome = monthlyIncome.reduce((sum, item) => sum + item.amount, 0);
    let totalExpenses = monthlyExpenses.reduce((sum, item) => sum + item.amount, 0);
    let totalProfit = totalIncome - totalExpenses;
    let profitRate = (totalProfit / totalIncome * 100);

    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('totalProfit').textContent = totalProfit.toFixed(2);
    document.getElementById('profitRate').textContent = profitRate.toFixed(2);

    drawIncomeExpenseTrend(monthlyIncome, monthlyExpenses);
    drawProfitTrend(); // Profit trend uses all historical data
    drawMonthComparison(month, incomeData, expenseData); // Pass full data for prev month calculation
}

function drawIncomeExpenseTrend(monthlyIncome, monthlyExpenses) {
    const dailyAggregated = {};  // key (day) : value (income:100, expense:100)
    
    monthlyIncome.forEach(item => {
        const day = item.date.substring(0, 10);
        if (!dailyAggregated[day]) dailyAggregated[day] = { income: 0, expense: 0 };
        dailyAggregated[day].income += item.amount;
    });
    monthlyExpenses.forEach(item => {
        const day = item.date.substring(0, 10);
        if (!dailyAggregated[day]) dailyAggregated[day] = { income: 0, expense: 0 };
        dailyAggregated[day].expense += item.amount;
    });

    const sortedDays = Object.keys(dailyAggregated).sort();
    //income series : [100, 200, 100, 110, ...]
    const incomeSeries = sortedDays.map(day => dailyAggregated[day].income);
    //expenses series: [200, 100,...]
    const expenseSeries = sortedDays.map(day => dailyAggregated[day].expense);

    const isMobile = window.innerWidth <= 768;

    const option = {
        title: { 
            text: 'Income vs Expenses Trend (Daily in Selected Month)', 
            left: 'center', 
            textStyle: { fontSize: isMobile ? 14 : 16 } // smaller title for mobile
        },
        tooltip: { trigger: 'axis' },
        legend: { 
            data: ['Income', 'Expenses'], 
            top: isMobile ? 40 : 30,
            left: 'center', // legend in center
            type: isMobile ? 'scroll' : 'plain', // If there are many legends on the mobile phone, user can scroll
            itemGap: isMobile ? 5 : 10, // smaller gap for mobile
            textStyle: { fontSize: isMobile ? 10 : 12 } // smaller font for mobile
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: isMobile ? '15%' : '3%', // more bottom for legend/x axis label in mobile
            top: isMobile ? '25%' : '20%',
            containLabel: true
        },
        xAxis: { 
            type: 'category', 
            data: sortedDays, 
            boundaryGap: false,
            axisLabel: { fontSize: isMobile ? 10 : 12 }
        },
        yAxis: { 
            type: 'value',
            axisLabel: { fontSize: isMobile ? 10 : 12 }
         },
        series: [
            { name: 'Income', type: 'line', smooth: true, data: incomeSeries, itemStyle: { color: '#67C23A' } },
            { name: 'Expenses', type: 'line', smooth: true, data: expenseSeries, itemStyle: { color: '#F56C6C' } }
        ]
    };
    initChart('incomeExpenseChart', option);
}

function drawProfitTrend() {
    const monthlyProfits = {};
    // ... is spread operator, merge incomeData and expenseData to a new array
    [...incomeData, ...expenseData].forEach(item => {
        const month = item.date.substring(0, 7);
        if (!monthlyProfits[month]) monthlyProfits[month] = { income: 0, expense: 0 };
        if (item.type === 'income' || incomeData.includes(item)) { // check item belongs to income/expense
            monthlyProfits[month].income += item.amount;
        } else if (item.type === 'expense' || expenseData.includes(item)) {
            monthlyProfits[month].expense += item.amount;
        }
    });

    // calculate monthly profit
    const calculatedMonthlyProfits = {};
    for(const monthKey in monthlyProfits) {
        calculatedMonthlyProfits[monthKey] = monthlyProfits[monthKey].income - monthlyProfits[monthKey].expense;
    }
        
    const sortedMonths = Object.keys(calculatedMonthlyProfits).sort();

    //prepare data for echart drawing
    const profitSeries = sortedMonths.map(month => calculatedMonthlyProfits[month]);

    const isMobile = window.innerWidth <= 768;

    const option = {
        title: { 
            text: 'Monthly Profit Trend (All Time)', 
            left: 'center', 
            textStyle: { fontSize: isMobile ? 14 : 16 }
        },
        tooltip: { trigger: 'axis' },
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: sortedMonths },
        yAxis: { type: 'value' },
        series: [{ name: 'Profit', type: 'bar', data: profitSeries, itemStyle: { color: 'DodgerBlue' } }]
    };
    initChart('profitTrendChart', option);
}

function drawMonthComparison(currentMonth, fullIncomeData, fullExpenseData) {
    //derive year and month
    const currentYear = parseInt(currentMonth.substring(0, 4));
    const currentM = parseInt(currentMonth.substring(5, 7));

    // month in JS start from zero
    const prevMDate = new Date(currentYear, currentM - 2, 1);
    // .slice(-2) is to get the last two digit. e.g, '05' is '05', '012' is '12'
    const prevMonthStr = prevMDate.getFullYear() + '-' + ('0' + (prevMDate.getMonth() + 1)).slice(-2);

    let currentMonthProfit = 0;
    // for income, profit is +money; for expenses, profit is -money
    fullIncomeData.filter(i => i.date && i.date.startsWith(currentMonth)).forEach(i => currentMonthProfit += i.amount);
    fullExpenseData.filter(e => e.date && e.date.startsWith(currentMonth)).forEach(e => currentMonthProfit -= e.amount);

    let prevMonthProfit = 0;
    fullIncomeData.filter(i => i.date && i.date.startsWith(prevMonthStr)).forEach(i => prevMonthProfit += i.amount);
    fullExpenseData.filter(e => e.date && e.date.startsWith(prevMonthStr)).forEach(e => prevMonthProfit -= e.amount);

    const isMobile = window.innerWidth <= 768;

    const option = {
        title: { 
            text: `Profit Comparison: ${currentMonth} vs ${prevMonthStr}`, 
            left: 'center', 
            textStyle: { fontSize: isMobile ? 14 : 16 }
        },
        tooltip: { trigger: 'item' }, // trigger: 'axis' might be better for bar charts with x-axis category
        grid: { left: '3%', right: '4%', bottom: '3%', containLabel: true },
        xAxis: { type: 'category', data: [prevMonthStr, currentMonth] },
        yAxis: { type: 'value' },
        series: [{
            name: 'Profit',
            type: 'bar',
            data: [
                { value: prevMonthProfit, itemStyle: { color: 'LightSkyBlue' } },
                { value: currentMonthProfit, itemStyle: { color: 'DodgerBlue' } }
            ],
            label: { show: true, position: 'top' }
        }]
    };
    initChart('compareChart', option);
}