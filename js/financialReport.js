let incomeExpenseChart, profitTrendChart, compareChart;
let incomeData = [], expenseData = [];
let echartsInstances = {}; // Store ECharts instances for resize

function initChart(id, option) {
    const chartDom = document.getElementById(id);
    if (chartDom) {
        let chart = echarts.getInstanceByDom(chartDom); // Check if instance already exists
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
    // Ensure ECharts is loaded before fetching data and initializing page
    if (typeof echarts === 'undefined') {
        console.error('ECharts library is not loaded. Make sure to include it before this script.');
        return;
    }

    fetch('../data/data.json')
        .then(response => {
            return response.text();
        })
        .then(text => {
            const jsonData = JSON.parse(text.startsWith('\uFEFF') ? text.substring(1) : text);
            incomeData = jsonData.income || []; // Ensure array even if data is missing
            expenseData = jsonData.expenses || []; // Ensure array even if data is missing
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
    let profitRate = totalIncome ? (totalProfit / totalIncome * 100) : 0;

    document.getElementById('totalIncome').textContent = totalIncome.toFixed(2);
    document.getElementById('totalExpenses').textContent = totalExpenses.toFixed(2);
    document.getElementById('totalProfit').textContent = totalProfit.toFixed(2);
    document.getElementById('profitRate').textContent = profitRate.toFixed(2);

    drawIncomeExpenseTrend(monthlyIncome, monthlyExpenses);
    drawProfitTrend(); // Profit trend now uses all historical data
    drawMonthComparison(month, incomeData, expenseData); // Pass full data for prev month calculation
}

function drawIncomeExpenseTrend(monthlyIncome, monthlyExpenses) {
    const dailyAggregated = {};
    
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
    const incomeSeries = sortedDays.map(day => dailyAggregated[day].income);
    const expenseSeries = sortedDays.map(day => dailyAggregated[day].expense);

    const isMobile = window.innerWidth <= 768;

    const option = {
        title: { 
            text: 'Income vs Expenses Trend (Daily in Selected Month)', 
            left: 'center', 
            textStyle: { fontSize: isMobile ? 14 : 16 } // 手机端标题小一点
        },
        tooltip: { trigger: 'axis' },
        legend: { 
            data: ['Income', 'Expenses'], 
            top: isMobile ? 40 : 30, // 手机端图例位置可能需要调整
            left: 'center', // 图例居中
            type: isMobile ? 'scroll' : 'plain', // 手机端图例多的话可以滚动
            itemGap: isMobile ? 5 : 10, // 手机端图例项间距小一点
            textStyle: { fontSize: isMobile ? 10 : 12 } // 手机端图例文字小一点
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: isMobile ? '15%' : '3%', // 手机端底部留更多空间给图例或x轴标签
            top: isMobile ? '25%' : '20%', // 手机端顶部留更多空间给标题和图例
            containLabel: true
        },
        xAxis: { 
            type: 'category', 
            data: sortedDays, 
            boundaryGap: false,
            axisLabel: { fontSize: isMobile ? 10 : 12 } // 手机端x轴标签小一点
        },
        yAxis: { 
            type: 'value',
            axisLabel: { fontSize: isMobile ? 10 : 12 } // 手机端y轴标签小一点
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
    [...incomeData, ...expenseData].forEach(item => {
        const month = item.date.substring(0, 7);
        if (!monthlyProfits[month]) monthlyProfits[month] = { income: 0, expense: 0 };
        if (item.type === 'income' || incomeData.includes(item)) { // crude type check
            monthlyProfits[month].income += item.amount;
        } else if (item.type === 'expense' || expenseData.includes(item)) {
            monthlyProfits[month].expense += item.amount;
        }
    });

    const calculatedMonthlyProfits = {};
    for(const monthKey in monthlyProfits) {
        calculatedMonthlyProfits[monthKey] = monthlyProfits[monthKey].income - monthlyProfits[monthKey].expense;
    }
        
    const sortedMonths = Object.keys(calculatedMonthlyProfits).sort();
    const profitSeries = sortedMonths.map(month => calculatedMonthlyProfits[month]);

    const isMobile = window.innerWidth <= 768;

    const option = {
        title: { 
            text: 'Monthly Profit Trend (All Time)', 
            left: 'center', 
            textStyle: { fontSize: isMobile ? 14 : 16 } // 手机端标题小一点
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
    const currentYear = parseInt(currentMonth.substring(0, 4));
    const currentM = parseInt(currentMonth.substring(5, 7));
    
    const prevMDate = new Date(currentYear, currentM - 2, 1);
    const prevMonthStr = prevMDate.getFullYear() + '-' + ('0' + (prevMDate.getMonth() + 1)).slice(-2);

    let currentMonthProfit = 0;
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
            textStyle: { fontSize: isMobile ? 14 : 16 } // 手机端标题小一点
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
