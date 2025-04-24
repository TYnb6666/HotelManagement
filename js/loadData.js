document.addEventListener("DOMContentLoaded", function () {
    fetch("../data/data.json") // fetch JSON data
        .then(response => response.json()) // analyse JSON
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
        .catch(error => console.error("Error loading data:", error));
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
        // .catch(error => console.error("Error loading data:", error));
});

document.addEventListener("DOMContentLoaded", function () {
    const financeTable = document.querySelector("#finance-table tbody");

    // if (!financeTable) {
    //     console.error("Table body not found! Check if #finance-table exists in dashboard.html.");
    //     return;
    // }

    fetch("../data/data.json")
        .then(response => response.json())
        .then(data => {
            console.log("Loaded data:", data);

            const targetDate = "2025-04-05";

            // 加标记，收入 type 为 "income"，支出为 "expense"
            const transactions = [
                ...data.income.map(item => ({ ...item, type: "income" })),
                ...data.expenses.map(item => ({ ...item, type: "expense" }))
            ];

            const filtered = transactions.filter(item => item.date === targetDate);

            filtered.forEach(item => {
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
            const today = "2025-04-05"; // 你可以动态获取日期也可以写死
            const incomeData = data.income.filter(item => item.date === today);
            const expenseData = data.expenses.filter(item => item.date === today);

            const totalIncome = incomeData.reduce((sum, item) => sum + item.amount, 0);
            const totalExpenses = expenseData.reduce((sum, item) => sum + item.amount, 0);
            /*绘制饼图*/
            const ctx = document.getElementById("financePieChart").getContext("2d");
            new Chart(ctx, {
                type: "pie",
                data: {
                    labels: ["Income", "Expenses"],
                    datasets: [{
                        data: [totalIncome, totalExpenses],
                        backgroundColor: ["#4CAF50", "#F44336"],
                        hoverOffset: 10
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        title: {
                            display: true,
                            text: "Today's Financial Overview"
                        }
                    }
                }
            });
        })
        .catch(error => console.error("Error loading pie chart data:", error));
});


