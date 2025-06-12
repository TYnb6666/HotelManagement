fetch('../data/data.json')
    .then(response => response.json())
    .then(data => {
        taxData = data.income;
        renderTaxDetails();
        renderTaxChart();
    });

function renderTaxDetails() {
    const taxTable = document.getElementById('tax-table');
    taxTable.innerHTML = '';

    // tax rate setting
    const VAT_RATE = 0.13;
    const CONSUMPTION_RATE = 0.05;
    const INCOME_TAX_RATE = 0.25;

    let vatTotal = 0;
    let consumptionTotal = 0;
    let incomeTaxTotal = 0;

    taxData.forEach(item => {
        const vat = item.amount * VAT_RATE;
        const consumption = item.amount * CONSUMPTION_RATE;
        const incomeTax = item.amount * INCOME_TAX_RATE;

        vatTotal += vat;
        consumptionTotal += consumption;
        incomeTaxTotal += incomeTax;

        taxTable.innerHTML += `
      <tr>
        <td>VAT</td>
        <td>$${vat.toFixed(2)}</td>
        <td>10%</td>
        <td>${item.category}</td>
      </tr>
      <tr>
        <td>Consumption Tax</td>
        <td>$${consumption.toFixed(2)}</td>
        <td>5%</td>
        <td>${item.category}</td>
      </tr>
      <tr>
        <td>Income Tax</td>
        <td>$${incomeTax.toFixed(2)}</td>
        <td>20%</td>
        <td>${item.category}</td>
      </tr>`;
    });

    // update overview
    document.getElementById('vatTax').textContent = vatTotal.toFixed(2);
    document.getElementById('consumptionTax').textContent = consumptionTotal.toFixed(2);
    document.getElementById('incomeTax').textContent = incomeTaxTotal.toFixed(2);
    document.getElementById('totalTax').textContent = (vatTotal + consumptionTotal + incomeTaxTotal).toFixed(2);
}

function renderTaxChart() {
    const chartDom = document.getElementById('taxChart');
    const myChart = echarts.init(chartDom);
    const option = {
        title: {
            text: 'Tax Composition',
            left: 'center'
        },
        tooltip: {
            trigger: 'item'
        },
        series: [
            {
                name: 'Tax Amount',
                type: 'pie',
                radius: '60%',
                data: [
                    {value: parseFloat(document.getElementById('vatTax').textContent), name: 'VAT'},
                    {value: parseFloat(document.getElementById('consumptionTax').textContent), name: 'Consumption Tax'},
                    {value: parseFloat(document.getElementById('incomeTax').textContent), name: 'Income Tax'}
                ],
                emphasis: {
                    itemStyle: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    myChart.setOption(option);
}
