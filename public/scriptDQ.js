const btnGA = document.querySelector('.collapsibleGA')
const btnEP = document.querySelector('.collapsibleEP')
const btnPP = document.querySelector('.collapsiblePP')
const btnU = document.querySelector('.collapsibleU')
const contentGA = document.querySelector('.contentGA')
const contentEP = document.querySelector('.contentEP')
const contentPP = document.querySelector('.contentPP')
const contentU = document.querySelector('.contentU')


// Botones collapsible para aparecer y desaparecer cuadros de caracteristicas

btnGA.addEventListener('click', () => {
    if (contentGA.classList.contains('POP')) {
        contentGA.classList.remove('POP');
    } else {
        contentGA.classList.add('POP');
    }
});

btnEP.addEventListener('click', () => {
    if (contentEP.classList.contains('POP')) {
        contentEP.classList.remove('POP');
    } else {
        contentEP.classList.add('POP');
    }
});

btnPP.addEventListener('click', () => {
    if (contentPP.classList.contains('POP')) {
        contentPP.classList.remove('POP');
    } else {
        contentPP.classList.add('POP');
    }
});

btnU.addEventListener('click', () => {
    if (contentU.classList.contains('POP')) {
        contentU.classList.remove('POP');
    } else {
        contentU.classList.add('POP');
    }
});


// Función de búsqueda
async function searchGenAsp() {
    const formData = new FormData(document.getElementById('input-form'));
    const searchCriteria = Object.fromEntries(formData.entries());

    // Filtrar solo los criterios que tienen valores
    const categories = {};
    for (const [key, value] of Object.entries(searchCriteria)) {
        if (value) {
            categories[key] = value;
        }
    }

    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categories })
        });

        const data = await response.json();
        console.log("Data received from server:", data); // Log para verificar datos

        if (data.indexData && data.indexData.length > 0) {
            indexData = data.indexData; // Almacena los datos para uso futuro
            const allColumns = getAllColumns(indexData);
            populateAxisSelectors(allColumns); // Poblamos los selectores dinámicamente
            displayResults(data.results);
            displayIdsText(data.idsText);
        } else {
            console.error("No hay datos disponibles para la gráfica.");
        }
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
    }
}

async function fetchAllData() {
    try {
        const response = await fetch('/search', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ categories: {} }) // Enviar un cuerpo vacío
        });

        const data = await response.json();
        displayResults(data.results);
    } catch (error) {
        console.error('Error al obtener todos los datos:', error);
    }
}

function displayResults(results) {
    const tableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');

        // Función para mostrar valores "0" correctamente
        const showValue = (value) => (value === null || value === undefined) ? '' : value;

        row.innerHTML = `
            <td>${showValue(result.id)}</td>
            <td>${showValue(result.Or)}</td>
            <td>${showValue(result.Fam)}</td>
            <td>${showValue(result.ComNa)}</td>
            <td>${showValue(result.SciNa)}</td>
            <td>${showValue(result.BiogRe)}</td>
            <td>${showValue(result.BiogZo)}</td>
            <td>${showValue(result.HoldBio)}</td>
            <td>${showValue(result.HoldPre)}</td>
            <td>${showValue(result.HoldTemp)}</td>
            <td>${showValue(result.HoldAB)}</td>
            <td>${showValue(result.HoldLR)}</td>
            <td>${showValue(result.HoldAD)}</td>
            <td>${showValue(result.HabPat)}</td>
            <td>${showValue(result.LSI)}</td>

            <td>${showValue(result.eco_pot?.CultCultIdDi)}</td>
            <td>${showValue(result.eco_pot?.CultInspArt)}</td>
            <td>${showValue(result.eco_pot?.CultEdu)}</td>
            <td>${showValue(result.eco_pot?.CultRecEcot)}</td>
            <td>${showValue(result.eco_pot?.CultSpiReg)}</td>
            <td>${showValue(result.eco_pot?.RegBioind)}</td>
            <td>${showValue(result.eco_pot?.RegBiocont)}</td>
            <td>${showValue(result.eco_pot?.RegPol)}</td>
            <td>${showValue(result.eco_pot?.RegSeed)}</td>
            <td>${showValue(result.eco_pot?.SupNutCy)}</td>
            <td>${showValue(result.eco_pot?.SupSoIm)}</td>
            <td>${showValue(result.eco_pot?.ProFF)}</td>
            <td>${showValue(result.eco_pot?.ProWildF)}</td>
            <td>${showValue(result.eco_pot?.ProBiomol)}</td>
            <td>${showValue(result.eco_pot?.ProBiopro)}</td>
            <td>${showValue(result.eco_pot?.ProBiom)}</td>
            <td>${showValue(result.eco_pot?.ProBiomimi)}</td>
            <td>${showValue(result.eco_pot?.DissVector)}</td>
            <td>${showValue(result.eco_pot?.DissPest)}</td>

            <td>${showValue(result.prod_pot?.ManSt)}</td>
            <td>${showValue(result.prod_pot?.ManRu)}</td>
            <td>${showValue(result.prod_pot?.ManAg)}</td>
            <td>${showValue(result.prod_pot?.ManSoSt)}</td>
            <td>${showValue(result.prod_pot?.ManHab)}</td>
            <td>${showValue(result.prod_pot?.ManTer)}</td>
            <td>${showValue(result.prod_pot?.ManTra)}</td>
            <td>${showValue(result.prod_pot?.ManFac)}</td>
            <td>${showValue(result.prod_pot?.NutFeed)}</td>
            <td>${showValue(result.prod_pot?.NutCost)}</td>
            <td>${showValue(result.prod_pot?.RepSexMat)}</td>
            <td>${showValue(result.prod_pot?.RepNumbOff)}</td>
            <td>${showValue(result.prod_pot?.RepCy)}</td>
            <td>${showValue(result.prod_pot?.RepGestInc)}</td>
            <td>${showValue(result.prod_pot?.RepSexInt)}</td>
            <td>${showValue(result.prod_pot?.ProPopStu)}</td>
            <td>${showValue(result.prod_pot?.ProProf)}</td>
            <td>${showValue(result.prod_pot?.ProLong)}</td>
            <td>${showValue(result.prod_pot?.ProReL)}</td>
            <td>${showValue(result.prod_pot?.ProOpBre)}</td>
            <td>${showValue(result.prod_pot?.ProAddVal)}</td>
            <td>${showValue(result.prod_pot?.MarCultAcc)}</td>
            <td>${showValue(result.prod_pot?.MarPri)}</td>
            <td>${showValue(result.prod_pot?.MarCompDom)}</td>
            <td>${showValue(result.prod_pot?.MarMarCha)}</td>
            <td>${showValue(result.prod_pot?.RegRest)}</td>

            <td>${showValue(result.use?.MaUSubs)}</td>
            <td>${showValue(result.use?.MaUSelCons)}</td>
            <td>${showValue(result.use?.MaUCom)}</td>
            <td>${showValue(result.use?.SoUseFo)}</td>
            <td>${showValue(result.use?.SoUseFe)}</td>
            <td>${showValue(result.use?.SoUseBioconv)}</td>
            <td>${showValue(result.use?.SoUseBiocont)}</td>
            <td>${showValue(result.use?.SoUsePol)}</td>
            <td>${showValue(result.use?.SoUsePet)}</td>
            <td>${showValue(result.use?.SoUseCult)}</td>
            <td>${showValue(result.use?.SoUseOth)}</td>
            <td>${showValue(result.use?.ObtHar)}</td>
            <td>${showValue(result.use?.ObtSHar)}</td>
            <td>${showValue(result.use?.ObtPro)}</td>
            <td>${showValue(result.use?.ContUtNA)}</td>
            <td>${showValue(result.use?.ContUtCA)}</td>
            <td>${showValue(result.use?.ContUtSA)}</td>
            <td>${showValue(result.use?.ContUtAs)}</td>
            <td>${showValue(result.use?.ContUtEu)}</td>
            <td>${showValue(result.use?.ContUtOc)}</td>
            <td>${showValue(result.use?.ContUtAf)}</td>
            <td>${showValue(result.use?.MarYN)}</td>
            <td>${showValue(result.use?.MarLoc)}</td>
            <td>${showValue(result.use?.MarReg)}</td>
            <td>${showValue(result.use?.MarNat)}</td>
            <td>${showValue(result.use?.MarInt)}</td>
            <td>${showValue(result.use?.MarMP)}</td>
            <td>${showValue(result.use?.ScLS)}</td>
            <td>${showValue(result.use?.ScMS)}</td>
            <td>${showValue(result.use?.ScLaS)}</td>
            <td>${showValue(result.use?.SocAccCSA)}</td>
            <td>${showValue(result.use?.SocAccNA)}</td>
            <td>${showValue(result.use?.SocAccAf)}</td>
            <td>${showValue(result.use?.SocAccOc)}</td>
            <td>${showValue(result.use?.SocAccEu)}</td>
            <td>${showValue(result.use?.SocAccAs)}</td>
            <td>${showValue(result.use?.LegPunc)}</td>
            <td>${showValue(result.use?.LegLeg)}</td>

            <td>${showValue(result.index?.Use)}</td>
            <td>${showValue(result.index?.ProdPot)}</td>
            <td>${showValue(result.index?.EcoPot)}</td>
        `;
        tableBody.appendChild(row);
    });
}

/* function displayIdsText(idsText) {
    const idsTextElement = document.getElementById('ids-text');
    idsTextElement.textContent = idsText;
}

let chart1 = null;
let chart2 = null;
let chart3 = null; */

/* function createChart(indexData) {

    // Destruye las gráficas anteriores si existen
    if (chart1) {
        chart1.destroy();
    }
    if (chart2) {
        chart2.destroy();
    }
    if (chart3){
        chart3.destroy();
    }

    // Gráfica de Use vs ProdPot
    const ctx1 = document.getElementById('indexChart').getContext('2d');
    const chartData1 = {
        labels: indexData.map(data => data.id),
        datasets: [{
            label: 'Use vs Productive Potential',
            data: indexData.map(data => ({ x: data.use, y: data.prodPot })),
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 4
        }]
    };

    chart1 = new Chart(ctx1, {
        type: 'scatter',
        data: chartData1,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Use'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Productive Potential'
                    }
                }
            }
        }
    });

    // Gráfica de Use vs EcoPot
    const ctx2 = document.getElementById('indexChart2').getContext('2d');
    const chartData2 = {
        labels: indexData.map(data => data.id),
        datasets: [{
            label: 'Use vs Ecosystemic Potential',
            data: indexData.map(data => ({ x: data.use, y: data.ecoPot })),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 4
        }]
    };

    chart2 = new Chart(ctx2, {
        type: 'scatter',
        data: chartData2,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Use'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Ecosystemic Potential'
                    }
                }
            }
        }
    });

    const ctx3 = document.getElementById('indexChart3').getContext('2d');
    const chartData3 = {
        labels: indexData.map(data => data.id),
        datasets: [{
            label: 'Productive Potential vs Ecosystemic Potential',
            data: indexData.map(data => ({ x: data.prodPot, y: data.ecoPot })),
            backgroundColor: 'rgba(153, 102, 255, 0.2)',
            borderColor: 'rgba(153, 102, 255, 1)',
            borderWidth: 4
        }]
    };

    chart3 = new Chart(ctx3, {
        type: 'scatter',
        data: chartData3,
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: 'Productive Potential'
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Ecosystemic Potential'
                    }
                }
            }
        }
    });
}  */

// Variables globales para la gráfica
let dynamicChart = null;
let indexData = []; // Almacenar los datos recibidos del servidor

// Convertir categorías de texto a valores numéricos
function convertCategoricalToNumerical(data, column) {
    const uniqueValues = [...new Set(data.map(item => item[column]))]; // Obtener valores únicos
    const mapping = {};

    uniqueValues.forEach((value, index) => {
        mapping[value] = index + 1; // Asignar un valor numérico a cada categoría
    });
    
    return data.map(item => ({
        ...item,
        [`${column}_numeric`]: mapping[item[column]] // Crear una nueva columna con valores numéricos
    }));
}

// Calcular la regresión lineal de los puntos
function calculateLinearRegression(data, xKey, yKey) {
    const xValues = data.map(item => item[xKey]);
    const yValues = data.map(item => item[yKey]);

    const n = xValues.length;
    const sumX = xValues.reduce((a, b) => a + b, 0);
    const sumY = yValues.reduce((a, b) => a + b, 0);
    const sumXY = xValues.reduce((sum, x, i) => sum + x * yValues[i], 0);
    const sumX2 = xValues.reduce((sum, x) => sum + x * x, 0);

    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const intercept = (sumY - slope * sumX) / n;

    // Generar los puntos de la línea de regresión
    const minX = Math.min(...xValues);
    const maxX = Math.max(...xValues);
    const regressionPoints = [
        { x: minX, y: slope * minX + intercept },
        { x: maxX, y: slope * maxX + intercept }
    ];

    return regressionPoints;
}

// Obtener todas las columnas del dataset dinámicamente desde los datos
function getAllColumns(data) {
    const firstItem = data[0] || {}; // Toma el primer elemento o un objeto vacío si no hay datos
    return Object.keys(firstItem); // Devuelve todas las claves como columnas
}

// Llenar las opciones de los selectores de ejes con todas las columnas posibles
function populateAxisSelectors(columns) {
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    // Limpiar opciones previas
    xAxisSelect.innerHTML = '';
    yAxisSelect.innerHTML = '';

    // Crear opciones para cada columna
    columns.forEach(column => {
        const optionX = document.createElement('option');
        optionX.value = column;
        optionX.textContent = column;
        xAxisSelect.appendChild(optionX);

        const optionY = document.createElement('option');
        optionY.value = column;
        optionY.textContent = column;
        yAxisSelect.appendChild(optionY);
    });
}

// Actualizar las gráficas según la selección de ejes
function updateChart() {
    const xAxis = document.getElementById('x-axis-select').value;
    const yAxis = document.getElementById('y-axis-select').value;

    if (!xAxis || !yAxis) {
        console.error('Por favor selecciona columnas para ambos ejes.');
        return;
    }

    createDynamicChart(indexData, xAxis, yAxis);
}

// Crear la gráfica dinámica basada en la selección de ejes
function createDynamicChart(data, xAxis, yAxis) {
    const ctx = document.getElementById('dynamicChart').getContext('2d');

    // Limpiar gráfica anterior
    if (dynamicChart) dynamicChart.destroy();

    // Verificar si alguno de los ejes es categórico (string)
    if (typeof data[0][xAxis] === 'string') {
        data = convertCategoricalToNumerical(data, xAxis);
        xAxis += '_numeric'; // Cambiar el nombre de la columna para usar la versión numérica
    }
    if (typeof data[0][yAxis] === 'string') {
        data = convertCategoricalToNumerical(data, yAxis);
        yAxis += '_numeric'; // Cambiar el nombre de la columna para usar la versión numérica
    }

    // Calcular los puntos de la regresión lineal
    const regressionPoints = calculateLinearRegression(data, xAxis, yAxis);

    // Configuración de la nueva gráfica
    dynamicChart = new Chart(ctx, {
        type: 'scatter', // Usar un gráfico de dispersión sin conectar los puntos
        data: {
            datasets: [
                {
                    label: `${xAxis} vs ${yAxis}`,
                    data: data.map(item => ({
                        x: item[xAxis],
                        y: item[yAxis],
                        insectId: item.id // Añadir el ID del insecto para mostrar en el tooltip
                    })),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                },
                {
                    label: 'Linear Regression',
                    data: regressionPoints,
                    type: 'line', // Tipo de gráfico para la regresión lineal
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: false
                }
            ]
        },
        options: {
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: xAxis
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: yAxis
                    }
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const { x, y, insectId } = context.raw;
                            return `ID: ${insectId} (${xAxis}: ${x}, ${yAxis}: ${y})`;
                        }
                    }
                }
            }
        }
    });
}