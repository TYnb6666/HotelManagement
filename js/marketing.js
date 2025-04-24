let businessGoals = {
    "Hotel": 30000,
    "Restaurant": 30000,
    "Entertainment": 30000
};

let businessCurrent = {}; // 当前值
let businessRows = {}; // 保存每行元素引用以便更新

const tableBody = document.getElementById('budget-table');

// 加载数据
fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        const incomeData = data.income;

        // 分类收入累加
        incomeData.forEach(entry => {
            if (!businessCurrent[entry.category]) {
                businessCurrent[entry.category] = 0;
            }
            businessCurrent[entry.category] += entry.amount;
        });

        renderTable();
    })
    .catch(error => {
        console.error('Error loading data:', error);
    });

// render table function
function renderTable() {
    tableBody.innerHTML = ''; // empty previous content
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

        progressBar.appendChild(fill);
        progressCell.appendChild(progressBar);
        row.appendChild(progressCell);

        // save DOM reference for later update
        businessRows[category] = {
            targetCell,
            progressFill: fill
        };

        tableBody.appendChild(row);
    });
}

// modify button
document.getElementById('modifyTargetBtn').onclick = () => {
    document.getElementById('hotelInput').value = businessGoals["Hotel"];
    document.getElementById('restaurantInput').value = businessGoals["Restaurant"];
    document.getElementById('entertainmentInput').value = businessGoals["Entertainment"];
    document.getElementById('targetModal').style.display = 'block';
};

// confirm modification
document.getElementById('confirmBtn').onclick = () => {
    businessGoals["Hotel"] = parseFloat(document.getElementById('hotelInput').value);
    businessGoals["Restaurant"] = parseFloat(document.getElementById('restaurantInput').value);
    businessGoals["Entertainment"] = parseFloat(document.getElementById('entertainmentInput').value);
    document.getElementById('targetModal').style.display = 'none';
    renderTable();
};
