// ensure HTML element (e.g <tbody>) has loaded
document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/data.json") // fetch JSON data
        .then(response => response.json()) // parse to JSON format
        .then(data => {
            let incomeTableBody = document.getElementById("income-table-body");
            let incomeRecords = data.income; // only derive income data

            incomeRecords.forEach(record => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${record.date}</td>
                    <td>${record.category}</td>
                    <td>$${record.amount.toFixed(2)}</td>
                    <td>${record.description}</td>
                `;
                incomeTableBody.appendChild(row);
            });
        })
});

document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/data.json") // fetch JSON data
        .then(response => response.json()) // analyse JSON
        .then(data => {
            let incomeTableBody = document.getElementById("expense-table-body");
            let incomeRecords = data.expenses; // only derive income data

            incomeRecords.forEach(record => {
                let row = document.createElement("tr");
                row.innerHTML = `
                    <td>${record.date}</td>
                    <td>${record.category}</td>
                    <td>$${record.amount.toFixed(2)}</td>
                    <td>${record.description}</td>
                `;
                incomeTableBody.appendChild(row);
            });
        })
});

document.addEventListener("DOMContentLoaded", function () {
    const financeTable = document.querySelector("#finance-table tbody");

    fetch("../data/data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Loaded data:", data);

            const targetDate = "2025-04-05";

            // add tag，income type "income"，expense type "expense"
            //transactions: merge income and expenses to a new array 'transactions'
            const transactions = [
                ...data.income.map(item => ({...item, type: "income"})), // ...item: copy all the attributes
                ...data.expenses.map(item => ({...item, type: "expense"}))
            ];

            const filtered = transactions.filter(item => item.date === targetDate);

            filtered.forEach(item => {
                // insert a new <tr>
                const row = financeTable.insertRow();
                row.insertCell(0).textContent = item.date;
                row.insertCell(1).textContent = item.category;

                const amountCell = row.insertCell(2);
                amountCell.textContent = `${item.type === "income" ? "+" : "-"}$${item.amount.toFixed(2)}`;
                amountCell.style.color = item.type === "income" ? "green" : "red";
                amountCell.style.fontWeight = "bold";

                row.insertCell(3).textContent = item.description;
            });
        })
        .catch(error => console.error("Error loading financial data:", error));
});

document.addEventListener("DOMContentLoaded", () => {
    fetch("../data/data.json")
        .then(response => response.json())
        .then(data => {
            const today = "2025-04-05"; // modify date
            const incomeData = data.income.filter(item => item.date === today);
            const expenseData = data.expenses.filter(item => item.date === today);

            const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
            const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
            // draw pie chart using echarts
            const chartDom = document.getElementById('financePieChart');
            const myChart = echarts.init(chartDom);
            const option = {
                title: {
                    text: "Today's Financial Overview",
                    left: "center"
                },
                tooltip: {
                    trigger: 'item'
                },
                series: {
                    name:'amount',
                    type:'pie',
                    radius:'60%',
                    data:[
                        {value:totalIncome, name:'Total Income'},
                        {value:totalExpenses, name:'Total Expense'}
                    ]
                },
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            };
            myChart.setOption(option);
        })
        .catch(error => console.error("Error loading pie chart data:", error));
});


