const btnGA = document.querySelector('.collapsibleGA')
const btnEP = document.querySelector('.collapsibleEP')
const btnPP = document.querySelector('.collapsiblePP')
const btnU = document.querySelector('.collapsibleU')
const btnC = document.querySelector('.collapsibleC')
const contentGA = document.querySelector('.contentGA')
const contentEP = document.querySelector('.contentEP')
const contentPP = document.querySelector('.contentPP')
const contentU = document.querySelector('.contentU')
const contentC = document.querySelector('.contentC')


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

btnC.addEventListener('click', () => {
    if (contentC.classList.contains('POP')) {
        contentC.classList.remove('POP');
    } else {
        contentC.classList.add('POP');
    }
});

// Seleccionar todos los iconos con las clases de iconos y los popups correspondientes
const iconEP = document.querySelector(".iconEP");
const iconPP = document.querySelector(".iconPP");
const iconU = document.querySelector(".iconU");
const iconC = document.querySelector(".iconC");

// Asignar eventos de clic a cada ícono y mostrar/ocultar su respectivo popup
iconEP.addEventListener("click", function () {
    togglePopup(this.querySelector(".popup-content-embedded"));
});

iconPP.addEventListener("click", function () {
    togglePopup(this.querySelector(".popup-content-embedded"));
});

iconU.addEventListener("click", function () {
    togglePopup(this.querySelector(".popup-content-embedded"));
});

iconC.addEventListener("click", function () {
    togglePopup(this.querySelector(".popup-content-embedded"));
});


// Función para mostrar/ocultar un popup
function togglePopup(popup) {
    // Cerrar todos los popups antes de mostrar el seleccionado
    document.querySelectorAll(".popup-content-embedded").forEach(p => {
        if (p !== popup) {
            p.style.display = 'none';
        }
    });

    // Mostrar u ocultar el popup seleccionado
    popup.style.display = (popup.style.display === 'block') ? 'none' : 'block';
}

// Cerrar los popups al hacer clic fuera de ellos
window.addEventListener("click", function (event) {
    if (!event.target.closest('.iconEP') && !event.target.closest('.iconPP') && !event.target.closest('.iconU') && !event.target.closest('.iconC')) {
        document.querySelectorAll(".popup-content-embedded").forEach(p => {
            p.style.display = 'none';
        });
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
            body: JSON.stringify({ categories: {} }) // Enviar un cuerpo vacío para obtener todos los datos
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data received from server:", data); // Log para verificar datos

        if (data.results && data.results.length > 0) {
            displayResults(data.results); // Mostrar resultados en la tabla
            displayIdsText(data.idsText); // Mostrar texto con IDs

            // Asignar `indexData` a los datos recibidos para ser usado en la gráfica
            indexData = data.indexData;
            console.log("Index Data (fetchAll):", indexData); // Verificar contenido de `indexData`

            // Obtener todas las columnas y poblar los selectores de ejes
            const allColumns = getAllColumns(indexData);
            populateAxisSelectors(allColumns);

        } else {
            console.log("No se encontraron datos.");
            displayIdsText("No se encontraron registros coincidentes.");
        }
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
            document.getElementById("record-description").innerHTML = text;
        })
        .catch(() => {
            document.getElementById("record-description").innerHTML = 'Description not available for this record.';
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
                labels: ['Use', 'Productive Potential', 'Ecosystem Potential', 'Challenges','Average'],
                datasets: [{
                    label: 'Insect score',
                    data: [
                        parseInt(record.Use) || 0,
                        parseInt(record.ProdPot) || 0,
                        parseInt(record.EcoPot) || 0,
                        parseInt(record.Challenges) || 0,
                        parseInt(record.Average) || 0
                    ],
                    backgroundColor: 'rgba(140, 9, 9, 0.2)',
                    borderColor: 'rgba(140, 9, 9, 1)',
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(140, 9, 9, 1)',
                    pointBorderColor: '#fff',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(140, 9, 9, 1)',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(140, 9, 9, 1)',
                    pointHoverBackgroundColor: '#fff',
                    pointHoverBorderColor: 'rgba(140, 9, 9, 1)',

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
                },
                plugins: {
                    title: {
                        display: true,                  
                        text: 'Total Values of Insect Indexes', 
                        font: {
                            size: 16,                    
                            family: 'Poppins',            
                            weight: 'bold',              
                        },
                        color: '#000',                   
                        padding: {
                            top: 10,                     
                            bottom: 10                   
                        },
                        align: 'center'                  
                    }
                }
            }
        });

        // Crear Pie Chart con los valores específicos de uso
        pieChart = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: [
                    'Food', 'Feed', 'Bioconversion','Biocontrol', 'Pollination', 'Pet', 'Cultural', 'Other'
                ],
                datasets: [{
                    label: 'score',
                    data: [
                        parseInt(record.SoUseFo) || 0, parseInt(record.SoUseFe) || 0, parseInt(record.SoUseBioconv) || 0,
                        parseInt(record.SoUseBiocont) || 0, parseInt(record.SoUsePol) || 0, parseInt(record.SoUsePet) || 0, 
                        parseInt(record.SoUseCult) || 0, parseInt(record.SoUseOth) || 0
                    ],
                    backgroundColor: [
                        '#E68773', '#98D261', '#CB2929','#CF0E4F', '#21EA95', '#E1A718', '#08AB08', '#930000'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true, 
                plugins: {
                    title: {
                        display: true,                  
                        text: 'Use - Sort of Use', 
                        font: {
                            size: 20,                    
                            family: 'Poppins',            
                            weight: 'bold',              
                        },
                        color: '#000',                   
                        padding: {
                            top: 10,                     
                            bottom: 10                   
                        },
                        align: 'center'                 
                    }
                }
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

            <td>${showValue(result.challenges?.Vector)}</td>
            <td>${showValue(result.challenges?.Pest)}</td>
            <td>${showValue(result.challenges?.Toxins)}</td>
            <td>${showValue(result.challenges?.Allergens)}</td>
            <td>${showValue(result.challenges?.AntFact)}</td>
            <td>${showValue(result.challenges?.InvSp)}</td>
            <td>${showValue(result.challenges?.Phobia)}</td>
            <td>${showValue(result.challenges?.Stigma)}</td>

            <td>${showValue(result.index?.Use)}</td>
            <td>${showValue(result.index?.ProdPot)}</td>
            <td>${showValue(result.index?.EcoPot)}</td>
            <td>${showValue(result.index?.Challenges)}</td>
            <td>${showValue(result.index?.Average)}</td>
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

    // Crear opciones solo para las columnas que están en el diccionario `columnNameMap`
    columns.forEach(column => {
        if (columnNameMap[column]) { // Verificar si la columna está en el diccionario
            const columnName = columnNameMap[column];

            const optionX = document.createElement('option');
            optionX.value = column;
            optionX.textContent = columnName;
            xAxisSelect.appendChild(optionX);

            const optionY = document.createElement('option');
            optionY.value = column;
            optionY.textContent = columnName;
            yAxisSelect.appendChild(optionY);
        }
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
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: `${columnNameMap[xAxis]} vs ${columnNameMap[yAxis]}`,
                    data: data.map(item => ({
                        x: item[xAxis],
                        y: item[yAxis],
                        insectSciNa: item.SciNa,
                        insectComNa: item.ComNa,
                        insectid: item.id
                    })),
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 2,
                    pointHoverRadius: 10,
                    pointBorderWidth: 2,
                    pointRadius: 4
                },
                {
                    label: 'Regression',
                    data: regressionPoints,
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: true
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
                        text: columnNameMap[xAxis],
                        font: {
                            size: 16,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 14, // Tamaño de fuente para los números en el eje x
                            family: 'Poppins'
                        }
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: columnNameMap[yAxis],
                        font: {
                            size: 16,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            size: 14, // Tamaño de fuente para los números en el eje y
                            family: 'Poppins'
                        }
                    }
                }
            },
            plugins: {
                tooltip: { enabled: false }, // Deshabilitar el tooltip de Chart.js
                legend: {
                    labels: {
                        font: {
                            family: 'Poppins', // Fuente para los labels de la leyenda
                            size: 16
                        }
                    }
                }
            },
            onHover: function(event, elements) {
                const tooltip = document.getElementById('customTooltip');
                if (elements.length) {
                    const position = elements[0].element.getCenterPoint();
                    const uniqueItems = new Set();

                    // Crear el contenido del tooltip
                    const tooltipContent = `<ul style="margin: 0; padding: 0; list-style-type: none;">` +
                        elements.map(el => {
                            const { x, y, insectSciNa, insectComNa, insectid } = el.element.$context.raw;
                            const itemText = `${insectid}. <b>${insectComNa}</b>, <em>${insectSciNa}</em> (${columnNameMap[xAxis]}: ${x}, ${columnNameMap[yAxis]}: ${y})`;
                            if (!uniqueItems.has(itemText)) {
                                uniqueItems.add(itemText);
                                return `<li>${itemText}</li>`;
                            }
                            return '';
                        }).join('') + `</ul>`;

                    tooltip.innerHTML = tooltipContent;

                    // Posicionar el tooltip con margen adicional y dentro del canvas
                    let newLeft = position.x + ctx.canvas.offsetLeft + 20;
                    let newTop = position.y + ctx.canvas.offsetTop + 20;
                    
                    const tooltipHeight = tooltip.offsetHeight;

                    if (tooltipHeight < position.y + 30) {
                        newTop = position.y + ctx.canvas.offsetTop - tooltipHeight; // Mover hacia arriba
                    }

                    // Aplicar la posición fija como prueba
                    tooltip.style.left = `${newLeft}px`;
                    tooltip.style.top = `${newTop}px`;
                    tooltip.style.display = 'block';
                } else {
                    tooltip.style.display = 'none';
                }
            },
            interaction: {
                mode: 'nearest',
                intersect: true,
                axis: 'xy'
            }
        }
    });
}

function getTableData() {
    const rows = document.querySelectorAll('#results-table tbody tr'); // Seleccionar todas las filas de la tabla
    const data = [];

    rows.forEach(row => {
        const cells = row.getElementsByTagName('td');

        const record = {
            id: cells[0] ? cells[0].innerText.trim() : '',    // ID del registro (1ra columna)
            ComNa: cells[3] ? cells[3].innerText.trim() : 'N/A',  
            Use: cells[104] ? parseInt(cells[104].innerText) || 0 : 0,    
            ProdPot: cells[105] ? parseInt(cells[105].innerText) || 0 : 0, 
            EcoPot: cells[106] ? parseInt(cells[106].innerText) || 0 : 0,   
            Challenges: cells[107] ? parseInt(cells[107].innerText) || 0 : 0,  
            Average: cells[108] ? parseInt(cells[108].innerText) || 0 : 0   
        };

        // Agregar el registro a los datos si tiene valores válidos
        if (record.Use || record.ProdPot || record.EcoPot || record.Challenges || record.Average) {
            data.push(record);
        }
    });

    return data;
}

function generateTopInsectsRadarChart(records) {
    // Calcular el promedio de los índices para cada insecto
    const insectScores = records.map(record => {
        const ecoPot = parseInt(record.EcoPot) || 0;
        const prodPot = parseInt(record.ProdPot) || 0;
        const use = parseInt(record.Use) || 0;
        const challenges = parseInt(record.Challenges) || 0;
        const average = parseInt(record.Average) || 0;
        const averageScore = (ecoPot + prodPot + use + Average + Challenges) / 5;

        return {
            id: record.id,
            name: record.ComNa || `ID: ${record.id}`, // Usar el nombre común si está disponible, o el ID
            ecoPot,
            prodPot,
            use,
            challenges,
            average,
            averageScore
        };
    });

    // Seleccionar los tres insectos con los mayores promedios
    const topThreeInsects = insectScores.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3);

    // Verificar si se encontraron al menos tres insectos
    if (topThreeInsects.length < 3) {
        console.error("No hay suficientes insectos con índices válidos para crear la gráfica.");
        return;
    }

    // Configurar los datasets para la gráfica Radar
    const datasets = topThreeInsects.map(insect => ({
        label: insect.name, // Nombre del insecto como etiqueta
        data: [insect.ecoPot, insect.prodPot, insect.use, insect.challenges, insect.average], // Datos de los índices
        backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.2)`,
        borderColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 1)`,
        borderWidth: 2
    }));

    //  Crear la gráfica de Radar con los datos de los tres insectos
    const ctx = document.getElementById('topInsectsRadarChart').getContext('2d');
    
    // Limpiar gráfica anterior si existe
    if (window.radarChart) {
        window.radarChart.destroy();
    }

    window.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Ecosystem Potential', 'Productive Potential', 'Use','Challenges', 'Average'], // Etiquetas para los índices
            datasets: datasets // Los datasets generados
        },
        options: {
            scale: {
                ticks: {
                    beginAtZero: true,
                    font: {
                        size: 16 ,
                        family: 'Poppins',
                        weight: 'bold'// Tamaño de fuente de los números en los ejes
                    }
                },
                pointLabels: {
                    font: {
                        size: 14,
                        family: 'Poppins',
                        weight: 'bold' }
                }
            },
            plugins: {
                legend: {
                    position: 'top' ,
                    labels: {
                            font: {
                                family: 'Poppins', // Fuente para los labels de la leyenda
                                size: 16
                            }
                        }
                },
                title: {
                    display: true,
                    text: 'Top 3 Insects by Average Score',
                    font: {
                        size: 16,
                        family: 'Poppins',
                        weight: 'bold'
                    }
                }
            },
            interaction: {
                mode: 'nearest', // Encuentra el punto más cercano
                intersect: true // Requiere que el mouse esté directamente sobre el punto
            }
            
        }
    });
}

function TopRadarinsects(){
    const tableData = getTableData(); // Obtener los datos de la tabla
    generateTopInsectsRadarChart(tableData);
}

const columnNameMap = {
    'id': 'ID',
    'Or': 'Order',
    'Fam': 'Family',
    'ComNa': 'Common Name',
    'SciNa': 'Scientific Name',
    'BiogRe': 'Biogeographic - Realm',
    'BiogZo': 'Biogeographic - Zone',
    'HoldBio': 'Holdridge - Biome',
    'HoldPre': 'Holdridge - Annual Precipitation',
    'HoldTemp': 'Holdridge - Temperature',
    'HoldAB': 'Holdridge - Altitudinal Belts',
    'HoldLR': 'Holdridge - Latitudinal Regions',
    'HoldAD': 'Holdridge - Altitudinal Distribution',
    'HabPat': 'Habitat Pattern',
    'LSI': 'Landscape Structure Index',
    'EcoPot': 'Ecosystem Potential',
    'ProdPot': 'Productive Potential',
    'Use': 'Use',
    'CultCultIdDi': 'Cultural Identity (Ecosystem)',
    'CultInspArt': 'Inspiration (Ecosystem)',
    'CultEdu': 'Education (Ecosystem)',
    'CultRecEcot': 'Recreation (Ecosystem)',
    'CultSpiReg': 'Spiritual Relevance (Ecosystem)',
    'RegBioind': 'Bioindicator (Regulation)',
    'RegBiocont': 'Biocontrol (Regulation)',
    'RegPol': 'Pollination (Regulation)',
    'RegSeed': 'Seed Dispersal (Regulation)',
    'SupNutCy': 'Nutrient Cycling (Supporting)',
    'SupSoIm': 'Soil Improvement (Supporting)',
    'ProFF': 'Food and Feed Production',
    'ProWildF': 'Wild Food Production',
    'ProBiomol': 'Biomolecules Production',
    'ProBiopro': 'Bioproducts Production',
    'ProBiom': 'Biomass',
    'ProBiomimi': 'Biomimicry',
    'ManSt': 'Management - Stress',
    'ManRu': 'Management - Rusticity',
    'ManAg': 'Management - Agility',
    'ManSoSt': 'Management - Social Structure',
    'ManHab': 'Management - Habits',
    'ManTer': 'Management - Territoriality',
    'ManTra': 'Management - Transportation',
    'ManFac': 'Management - Facilities',
    'NutFeed': 'Nutrition - Feeding Type',
    'NutCost': 'Nutrition - Cost of Feed',
    'RepSexMat': 'Reproduction - Sexual Maturity',
    'RepNumbOff': 'Reproduction - Number of Offspring',
    'RepCy': 'Reproduction - Cycles',
    'RepGestInc': 'Reproduction - Gestation/Incubation',
    'RepSexInt': 'Reproduction - Sexual Interaction',
    'ProPopStu': 'Production - Population Study',
    'ProProf': 'Production - Profit',
    'ProLong': 'Production - Longevity',
    'ProReL': 'Production - Research Level',
    'ProOpBre': 'Production - Optimal Breeding Type',
    'ProAddVal': 'Production - Added Value',
    'MarCultAcc': 'Market - Cultural Acceptance',
    'MarPri': 'Market - Price',
    'MarCompDom': 'Market - Competition with Domestic Species',
    'MarReg': 'Market - Regional',
    'MarNat': 'Market - National',
    'MarInt': 'Market - International',
    'MarMP': 'Market - Main Product of Use',
    'ScLS': 'Production Scale - Low',
    'ScMS': 'Production Scale - Medium',
    'ScLaS': 'Production Scale - Large',
    'SocAccCSA': 'Social Acceptability - Central/South America',
    'SocAccNA': 'Social Acceptability - North America',
    'SocAccAf': 'Social Acceptability - Africa',
    'SocAccOc': 'Social Acceptability - Oceania',
    'SocAccEu': 'Social Acceptability - Europe',
    'SocAccAs': 'Social Acceptability - Asia',
    'LegPunc': 'Legislation - Punctuation',
    'LegLeg': 'Legislation',
    'Or_numeric':'Order (numeric)',
    'Fam_numeric':'Family (numeric)',
    'ComNa_numeric':'Common Name (numeric)',
    'SciNa_numeric':'Scientific Name (numeric)',
    'BiogRe_numeric':'Biogeographic - Realm (numeric)',
    'BiogZo_numeric':'Biogeographic - Zone (numeric)',
    'HoldBio_numeric':'Holdridge - Biome (numeric)',
    'HoldPre_numeric':'Holdridge - Annual Precipitation (numeric)',
    'HoldTemp_numeric':'Holdridge - Temperature (numeric)',
    'HoldAB_numeric':'Holdridge - Altitudinal Belts (numeric)',
    'HoldLR_numeric':'Holdridge - Latitudinal Regions (numeric)',
    'HoldAD_numeric':'Holdridge - Altitudinal Distribution (numeric)',
    'HabPat_numeric':'Habitat Pattern (numeric)',
    'LSI_numeric':'Landscape Structure Index (numeric)',
    'EcoPot_numeric':'Ecosystem Potential (numeric)',
    'ProdPot_numeric':'Productive Potential (numeric)',
    'Use_numeric':'Use (numeric)',
    'CultCultIdDi_numeric':'Cultural Identity (Ecosystem) (numeric)',
    'CultInspArt_numeric':'Inspiration (Ecosystem) (numeric)',
    'CultEdu_numeric':'Education (Ecosystem) (numeric)',
    'CultRecEcot_numeric':'Recreation (Ecosystem) (numeric)',
    'CultSpiReg_numeric':'Spiritual Relevance (Ecosystem) (numeric)',
    'RegBioind_numeric':'Bioindicator (Regulation) (numeric)',
    'RegBiocont_numeric':'Biocontrol (Regulation) (numeric)',
    'RegPol_numeric':'Pollination (Regulation) (numeric)',
    'RegSeed_numeric':'Seed Dispersal (Regulation) (numeric)',
    'SupNutCy_numeric':'Nutrient Cycling (Supporting) (numeric)',
    'SupSoIm_numeric':'Soil Improvement (Supporting) (numeric)',
    'ProFF_numeric':'Food and Feed Production (numeric)',
    'ProWildF_numeric':'Wild Food Production (numeric)',
    'ProBiomol_numeric':'Biomolecules Production (numeric)',
    'ProBiopro_numeric':'Bioproducts Production (numeric)',
    'ProBiom_numeric':'Biomass (numeric)',
    'ProBiomimi_numeric':'Biomimicry (numeric)',
    'DissVector_numeric':'Disservices - Vector (numeric)',
    'DissPest_numeric':'Disservices - Pest (numeric)',
    'ManSt_numeric':'Management - Stress (numeric)',
    'ManRu_numeric':'Management - Rusticity (numeric)',
    'ManAg_numeric':'Management - Agility (numeric)',
    'ManSoSt_numeric':'Management - Social Structure (numeric)',
    'ManHab_numeric':'Management - Habits (numeric)',
    'ManTer_numeric':'Management - Territoriality (numeric)',
    'ManTra_numeric':'Management - Transportation (numeric)',
    'ManFac_numeric':'Management - Facilities (numeric)',
    'NutFeed_numeric':'Nutrition - Feeding Type (numeric)',
    'NutCost_numeric':'Nutrition - Cost of Feed (numeric)',
    'RepSexMat_numeric':'Reproduction - Sexual Maturity (numeric)',
    'RepNumbOff_numeric':'Reproduction - Number of Offspring (numeric)',
    'RepCy_numeric':'Reproduction - Cycles (numeric)',
    'RepGestInc_numeric':'Reproduction - Gestation/Incubation (numeric)',
    'RepSexInt_numeric':'Reproduction - Sexual Interaction (numeric)',
    'ProPopStu_numeric':'Production - Population Study (numeric)',
    'ProProf_numeric':'Production - Profit (numeric)',
    'ProLong_numeric':'Production - Longevity (numeric)',
    'ProReL_numeric':'Production - Research Level (numeric)',
    'ProOpBre_numeric':'Production - Optimal Breeding Type (numeric)',
    'ProAddVal_numeric':'Production - Added Value (numeric)',
    'MarCultAcc_numeric':'Market - Cultural Acceptance (numeric)',
    'MarPri_numeric':'Market - Price (numeric)',
    'MarCompDom_numeric':'Market - Competition with Domestic Species (numeric)',
    'MarReg_numeric':'Market - Regional (numeric)',
    'MarNat_numeric':'Market - National (numeric)',
    'MarInt_numeric':'Market - International (numeric)',
    'MarMP_numeric':'Market - Main Product of Use (numeric)',
    'ScLS_numeric':'Production Scale - Low (numeric)',
    'ScMS_numeric':'Production Scale - Medium (numeric)',
    'ScLaS_numeric':'Production Scale - Large (numeric)',
    'SocAccCSA_numeric':'Social Acceptability - Central/South America (numeric)',
    'SocAccNA_numeric':'Social Acceptability - North America (numeric)',
    'SocAccAf_numeric':'Social Acceptability - Africa (numeric)',
    'SocAccOc_numeric':'Social Acceptability - Oceania (numeric)',
    'SocAccEu_numeric':'Social Acceptability - Europe (numeric)',
    'SocAccAs_numeric':'Social Acceptability - Asia (numeric)',
    'LegPunc_numeric':'Legislation - Punctuation (numeric)',
    'LegLeg_numeric':'Legislation numeric',
    'Vector':'Vector',
    'Pest':'Pest',
    'Toxins':'Toxins',
    'Allergens':'Allergens',
    'AntFact':'Antinutritional factors',
    'InvSp':'Invasive species',
    'Phobia':'Phobia',
    'Stigma':'Stigmatization',
    'Challenges':'Challenges',
    'Average':'Average'
};


function clean() {
    // Limpiar el contenido de la tabla de resultados
    const tableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    // Limpiar los selectores de ejes
    document.getElementById('x-axis-select').innerHTML = '';
    document.getElementById('y-axis-select').innerHTML = '';

    // Reiniciar el formulario de búsqueda si existe
    document.getElementById('input-form').reset();

    // Limpiar el texto de resultados, como los IDs de búsqueda
    document.getElementById('ids-text').textContent = '';

    // Resetear la variable `indexData` para comenzar desde cero
    indexData = [];

    // Destruir las gráficas si existen
    if (dynamicChart) {
        dynamicChart.destroy();
        dynamicChart = null;
    }
    if (window.radarChart) {
        window.radarChart.destroy();
        window.radarChart = null;
    }
}

async function executeSearchAndUpdate() {
    await searchGenAsp();

    updateChart();

    TopRadarinsects();
}

async function executeFetchAllAndUpdate() {
    await fetchAllData();

    updateChart();

    TopRadarinsects();
}