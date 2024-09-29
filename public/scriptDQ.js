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

// Función para capturar clics en las filas de la tabla y abrir el modal con detalles del registro
function makeTableInteractive() {
    const rows = document.querySelectorAll('#results-table tbody tr');
    rows.forEach(row => {
        row.addEventListener('click', () => {
            const cells = row.getElementsByTagName('td');
            const record = {};

            // Obtener los IDs de los encabezados para mapear con las celdas
            const headers = document.querySelectorAll('#results-table th');

            // Rellenar el objeto 'record' con los datos de la fila seleccionada utilizando los IDs de los th
            Array.from(cells).forEach((cell, index) => {
                const columnId = headers[index]?.id;  // Obtener el ID del encabezado (id del <th>)
                if (columnId) {
                    record[columnId] = cell.innerText.trim();  // Asignar el valor de la celda al ID del encabezado
                }
            });

            console.log("Record Data: ", record);  // Verificar los datos extraídos de la fila
            openModal(record);  // Abrir el modal con el registro seleccionado
        });
    });
}

// Variable para controlar la sección actual del modal
let currentSection = 1;

// Función para mostrar la sección correspondiente del modal
function showSection(section) {
    // Ocultar todas las secciones
    document.querySelectorAll('.modal-section').forEach(sec => sec.style.display = 'none');

    // Mostrar la sección correspondiente
    document.getElementById(`section-${section}`).style.display = 'block';

    // Actualizar el título del modal
    const title = section === 1 ? ' ' : 'Insect Characteristics & Statistics';

    // Mostrar u ocultar botones de navegación según la sección actual
    document.getElementById('prev-btn').style.display = section === 1 ? 'none' : 'inline';
    document.getElementById('next-btn').style.display = section === 2 ? 'none' : 'inline';
}

// Función para ir a la siguiente sección
function nextSection() {
    if (currentSection < 2) {
        currentSection++;
        showSection(currentSection);
    }
}

// Función para ir a la sección anterior
function prevSection() {
    if (currentSection > 1) {
        currentSection--;
        showSection(currentSection);
    }
}

function openModal(record) {
    const modal = document.getElementById("record-modal");
    
    // Asegurarse de que el modal existe
    if (!modal) {
        console.error("Modal not found");
        return;
    }

    // Asignar la imagen del registro (debe estar en la carpeta /images con el id como nombre de archivo)
    const imageElement = document.getElementById("record-image");
    if (imageElement) {
        const imagePath = `/DQ/Images/${record.id}.jpeg`;
        fetch(imagePath)
            .then(response => {
                if (response.ok) {
                    imageElement.src = imagePath;
                } else {
                    imageElement.src = `/DQ/Images/${record.id}.jpg`; // Mostrar imagen predeterminada si no existe
                }
            })
            .catch(() => {
                imageElement.src = `/DQ/Images/placeholder.jpeg`;
            });
    }

    // Obtener la descripción del registro
    fetch(`/DQ/Descriptions/${record.id}.txt`)
        .then(response => response.text())
        .then(text => {
            document.getElementById("record-description").innerText = text;
        })
        .catch(() => {
            document.getElementById("record-description").innerText = 'Description not available for this record.';
        });

    // Mostrar nombre (común o científico)
    document.getElementById("record-name").innerText = (record.ComNa +'   ('+ record.SciNa +') ') ;

    // Mostrar la primera sección del modal
    currentSection = 1;
    showSection(currentSection);

    // Mostrar el modal
    modal.style.display = "block";

    //Muetra las graficas
    setTimeout(() => generateCharts(record), 300);
}

// Función para cerrar el modal
function closeModal() {
    const modal = document.getElementById("record-modal");
    modal.style.display = "none";
}

let spiderChart = null;
let pieChart = null;

function generateCharts(record) {

        // Verificar si las instancias de gráficos ya existen y destruirlas
        if (spiderChart !== null) {
            console.log("Destruyendo gráfica Spider Chart anterior.");
            spiderChart.destroy();
            spiderChart = null;
        }
        if (pieChart !== null) {
            console.log("Destruyendo gráfica Pie Chart anterior.");
            pieChart.destroy();
            pieChart = null;
        }

        // Obtener los contextos de los gráficos
        const canvas1 = document.getElementById('chart1');
        const canvas2 = document.getElementById('chart2');
        const ctx1 = canvas1.getContext('2d');
        const ctx2 = canvas2.getContext('2d');

        // Crear Spider Chart (Radar Chart) con los tres índices
        spiderChart = new Chart(ctx1, {
            type: 'radar',
            data: {
                labels: ['Use', 'Productive Potential', 'Ecological Potential'],
                datasets: [{
                    label: 'Insect score',
                    data: [
                        parseInt(record.Use) || 0,
                        parseInt(record.ProdPot) || 0,
                        parseInt(record.EcoPot) || 0
                    ],
                    backgroundColor: 'rgba(54, 162, 235, 0.2)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(54, 162, 235, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(54, 162, 235, 1)',

                    pointRadius: 6,  
                    pointHoverRadius: 8,  
                    pointBorderWidth: 3,  
                    pointStyle: 'circle'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,  // Desactivar relación de aspecto para controlar el tamaño
                scale: {
                    ticks: { beginAtZero: true }
                }
            }
        });

        // Crear Pie Chart con los valores específicos de uso
        pieChart = new Chart(ctx2, {
            type: 'pie',
            data: {
                labels: [
                    'MaUSubs', 'MaUSelCons', 'MaUCom', 'SoUseFo', 'SoUseFe', 'SoUseBioconv',
                    'SoUseBiocont', 'SoUsePol', 'SoUsePet', 'SoUseCult', 'SoUseOth'
                ],
                datasets: [{
                    label: 'Use Details',
                    data: [
                        parseInt(record.MaUSubs) || 0, parseInt(record.MaUSelCons) || 0,
                        parseInt(record.MaUCom) || 0, parseInt(record.SoUseFo) || 0,
                        parseInt(record.SoUseFe) || 0, parseInt(record.SoUseBioconv) || 0,
                        parseInt(record.SoUseBiocont) || 0, parseInt(record.SoUsePol) || 0,
                        parseInt(record.SoUsePet) || 0, parseInt(record.SoUseCult) || 0,
                        parseInt(record.SoUseOth) || 0
                    ],
                    backgroundColor: [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40',
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true // Desactivar relación de aspecto para controlar el tamaño
            }
        });
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

    makeTableInteractive();

}

function displayIdsText(idsText) {
    const idsTextElement = document.getElementById('ids-text');
    idsTextElement.textContent = idsText;
}

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