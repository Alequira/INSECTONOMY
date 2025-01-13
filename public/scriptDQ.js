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

// Seleccionar todos los iconos con las clases de iconos y los popups correspondientes  - Pregunta sobre cada pop - 
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
        console.log("Data received from server:", data); 

        if (data.indexData && data.indexData.length > 0) {
            buffer = [];
            indexData = data.indexData; 
            const allColumns = getAllColumns(indexData);
            populateAxisSelectors(allColumns); 
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
            body: JSON.stringify({ categories: {} }) 
        });

        if (!response.ok) {
            throw new Error(`Error en la solicitud: ${response.status}`);
        }

        const data = await response.json();
        console.log("Data received from server:", data); 

        if (data.results && data.results.length > 0) {
            displayResults(data.results); 
            displayIdsText(data.idsText); 

            indexData = data.indexData;
            console.log("Index Data (fetchAll):", indexData); 

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
    console.log("makeTableInteractive ejecutada");
    const rows = document.querySelectorAll('#results-table tbody tr');
    console.log("Filas encontradas:", rows.length);
    rows.forEach(row => {
        let clickTimeout = null;

        row.addEventListener('click', () => {
            if (clickTimeout) return; // Evitar conflictos con doble clic
            console.log("Fila clickeada:", row);
            clickTimeout = setTimeout(() => {
                const recordId = row.getAttribute('data-id');
                if (!recordId) {
                    console.error("No se encontró el atributo data-id en la fila seleccionada.");
                    return;
                }

                // Manejar selección/deselección
                toggleRowSelection(row, recordId);

                clearTimeout(clickTimeout);
                clickTimeout = null;
            }, 200); // Confirmar que no es doble clic
        });

        row.addEventListener('dblclick', () => {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
                clickTimeout = null;
            }

            const cells = row.getElementsByTagName('td');
            const record = {};

            const headers = document.querySelectorAll('#results-table th');
            Array.from(cells).forEach((cell, index) => {
                const columnId = headers[index]?.id;
                if (columnId) {
                    record[columnId] = cell.innerText.trim();
                }
            });

            console.log("Record Data:", record);
            openModal(record); // Abrir modal con detalles del registro
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
    document.getElementById("record-name").innerHTML = (record.ComNa +  ', <i>' + record.SciNa + '</i>' ) ;

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
                labels: ['Use', 'Productive Potential', 'Ecosystem Potential', 'Challenges', 'Average'],
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

                    pointRadius: 6,  
                    pointHoverRadius: 8,  
                    pointBorderWidth: 3,  
                    pointStyle: 'circle'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                scale: {
                    ticks: {
                        beginAtZero: true,
                        font: {
                            size: 16,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 16,
                            family: 'Poppins',
                            weight: 'bold' }
                    }
                },
                plugins: {
                    legend: {
                        position: 'top' ,
                        labels: {
                                font: {
                                    family: 'Poppins', 
                                    size: 16
                                }
                            }
                    },
                    title: {
                        display: true,
                        text: 'Total Values of Insect Indexes',
                        font: {
                            size: 14,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    },
                    color: '#000',                   
                    padding: {
                        top: 10,                     
                        bottom: 10                   
                    },
                    align: 'center' 
                },
                interaction: {
                    mode: 'nearest', // Encuentra el punto más cercano
                    intersect: true // Requiere que el mouse esté directamente sobre el punto
                }
                
            }
        });

        // Crear Pie Chart con los valores específicos de uso
        pieChart = new Chart(ctx2, {
            type: 'line',
            data: {
                labels: [
                    'Food', 'Feed', 'Bioconversion','Biocontrol', 'Pollination', 'Pet', 'Cultural', 'Other'
                ],
                datasets: [{
                    label: 'Score',
                    data: [
                        parseInt(record.SoUseFo) || 0, parseInt(record.SoUseFe) || 0, parseInt(record.SoUseBioconv) || 0,
                        parseInt(record.SoUseBiocont) || 0, parseInt(record.SoUsePol) || 0, parseInt(record.SoUsePet) || 0, 
                        parseInt(record.SoUseCult) || 0, parseInt(record.SoUseOth) || 0
                    ],
                    fill: true,
                    backgroundColor: 'rgba(140, 9, 9, 0.2)',
                    borderColor: 'rgba(140, 9, 9, 1)',
                    tension: 0.1,
                    borderWidth: 2,
                    pointBackgroundColor: 'rgba(140, 9, 9, 1)',
                    pointBorderColor: '#fff',
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
                maintainAspectRatio: true,
                scale: {
                    ticks: {
                        beginAtZero: true,
                        font: {
                            size: 16,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 20,
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
                        text: 'Use - Sort of Use',
                        font: {
                            size: 16,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    }
                },
                interaction: {// Encuentra el punto más cercano
                    intersect: true // Requiere que el mouse esté directamente sobre el punto
                }
                
            }
        });
}

function displayResults(results) {
    const tableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', result.id);

        // Función para mostrar valores "0" correctamente
        const showValue = (value) => (value === null || value === undefined) ? '' : value;

        row.innerHTML = `
            <td><b>${showValue(result.id)}</b></td>
            <td>${showValue(result.Or)}</td>
            <td>${showValue(result.Fam)}</td>
            <td><b>${showValue(result.ComNa)}<b></td>
            <td><i>${showValue(result.SciNa)}</i></td>
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
let indexData = []; 

function convertCategoricalToNumerical(data, column) {
    const uniqueValues = [...new Set(data.map(item => item[column]).filter(value => value !== null && value !== undefined))];
    const mapping = {};
    const reverseMapping = {};

    uniqueValues.forEach((value, index) => {
        mapping[value] = index + 1; 
        reverseMapping[index + 1] = value; 
    });

    console.log(`Mapping for column "${column}":`, mapping);
    console.log(`Reverse Mapping for column "${column}":`, reverseMapping);

    return {
        convertedData: data.map(item => ({
            ...item,
            [`${column}_numeric`]: mapping[item[column]] || 0
        })),
        reverseMapping
    };
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
    const firstItem = data[0] || {};
    return Object.keys(firstItem); 
}

function populateAxisSelectors(columns) {
    const xAxisSelect = document.getElementById('x-axis-select');
    const yAxisSelect = document.getElementById('y-axis-select');

    xAxisSelect.innerHTML = '';
    yAxisSelect.innerHTML = '';

    columns.forEach(column => {
        if (columnNameMapx[column]) { 
            const columnNamex = columnNameMapx[column];

            const optionX = document.createElement('option');
            optionX.value = column;
            optionX.textContent = columnNamex;
            xAxisSelect.appendChild(optionX);
        }
    });

    columns.forEach(column => {
        if (columnNameMapy[column]){
            const columnNamey = columnNameMapy[column];

            const optionY = document.createElement('option');
            optionY.value = column;
            optionY.textContent = columnNamey;
            yAxisSelect.appendChild(optionY);
        }
    });
}

function updateChart() {
    const xAxis = document.getElementById('x-axis-select').value;
    const yAxis = document.getElementById('y-axis-select').value;

    if (!xAxis || !yAxis) {
        console.error('Por favor selecciona columnas para ambos ejes.');
        return;
    }

    // Determinar qué datos usar
    const dataToUse = buffer.length > 0 ? bufferRecords() : indexData;

    createDynamicChart(dataToUse, xAxis, yAxis);

    generateHeatmapFromExistingData(dataToUse, yAxis);
    
}

function bufferRecords() {
    return indexData.filter(record => buffer.includes(record.id.toString()));
}

function createDynamicChart(data, xAxis, yAxis) {
    const ctx = document.getElementById('dynamicChart').getContext('2d');

    if (dynamicChart) dynamicChart.destroy();

    let xReverseMapping = null;
    let yReverseMapping = null;

    // Convertir valores categóricos a numéricos
    if (typeof data[0][xAxis] === 'string') {
        const conversion = convertCategoricalToNumerical(data, xAxis);
        data = conversion.convertedData;
        xReverseMapping = conversion.reverseMapping;
        xAxis += '_numeric';
    }
    if (typeof data[0][yAxis] === 'string') {
        const conversion = convertCategoricalToNumerical(data, yAxis);
        data = conversion.convertedData;
        yReverseMapping = conversion.reverseMapping;
        yAxis += '_numeric';
    }

    const regressionPoints = calculateLinearRegression(data, xAxis, yAxis);

    dynamicChart = new Chart(ctx, {
        type: 'scatter',
        data: {
            datasets: [
                {
                    label: `${columnNameMapx[xAxis.replace('_numeric', '')]} vs ${columnNameMapy[yAxis.replace('_numeric', '')]}`,
                    data: data.map(item => ({
                        x: item[xAxis],
                        y: item[yAxis],
                        originalX: xReverseMapping ? xReverseMapping[item[xAxis]] : item[xAxis],
                        originalY: yReverseMapping ? yReverseMapping[item[yAxis]] : item[yAxis],
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
                    label: 'Linear regression for calculated indexes',
                    data: regressionPoints,
                    type: 'line',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 2,
                    fill: true
                }
            ]
        },
        options: {
            maintainAspectRatio: false,
            scales: {
                x: {
                    type: 'linear',
                    position: 'bottom',
                    title: {
                        display: true,
                        text: columnNameMapx[xAxis.replace('_numeric', '')],
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
                        text: columnNameMapy[yAxis.replace('_numeric', '')],
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
                },
                title: {
                    display: true,
                    text: 'Regression graph',
                    font: {
                        size: 16,
                        family: 'Poppins',
                        weight: 'bold'
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
                            const { originalX, originalY, insectSciNa, insectComNa, insectid } = el.element.$context.raw;
                            const itemText = `${insectid}. <b>${insectComNa}</b>, <em>${insectSciNa}</em> (${columnNameMapx[xAxis]}: ${originalX}, ${columnNameMapy[yAxis]}: ${originalY})`;
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
            SciNa: cells[4] ? cells[4].innerText.trim() : 'N/A', 
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
        const averageScore = (ecoPot + prodPot + use + challenges + average) / 5;

        return {
            InsectId: record.id,
            InsectComNa: record.ComNa,
            InsectSciNa: record.SciNa || "Unknown Scientific Name",
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
        alert("There is not enough data to make a graph.");
        return;
    }

    // Configurar los datasets para la gráfica Radar
    const datasets = topThreeInsects.map(insect => ({
        label: insect.InsectSciNa, 
        data: [insect.ecoPot, insect.prodPot, insect.use, insect.challenges, insect.average],
        raw: insect,
        backgroundColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.2)`,
        borderColor: `rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 1)`,
        borderWidth: 2,
        pointHoverRadius: 10,
        pointBorderWidth: 2,
        pointRadius: 4,
    }));

    // Crear la gráfica de Radar
    const ctx = document.getElementById('topInsectsRadarChart').getContext('2d');
    
    // Limpiar gráfica anterior si existe
    if (window.radarChart) {
        window.radarChart.destroy();
    }

    window.radarChart = new Chart(ctx, {
        type: 'radar',
        data: {
            labels: ['Ecosystem Potential', 'Productive Potential', 'Use', 'Challenges', 'Average'],
            datasets: datasets
        },
        options: {
            maintainAspectRatio: true,
            scales: {
                r: {
                    angleLines: {
                        color: 'rgba(0, 0, 0, 0.25)', 
                        lineWidth: 1 
                    },
                    grid: {
                        color: 'rgba(0, 0, 0, 0.25)', 
                        lineWidth: 1
                    },
                    ticks: {
                        beginAtZero: true,
                        font: {
                            size: 14,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    },
                    pointLabels: {
                        font: {
                            size: 12,
                            family: 'Poppins',
                            weight: 'bold'
                        }
                    }
                }
            },
            plugins: {
                tooltip: { enabled: false }, // Tooltip deshabilitado
                legend: {
                    position: 'top',
                    labels: {
                        font: {
                            style: 'italic',
                            family: 'Poppins',
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
            onHover: function (event, elements) {
                const tooltip = document.getElementById('customTooltip2');
            
                if (elements.length) {
                    const uniqueItems = new Set(); // Para evitar duplicados en el tooltip
                    const tooltipContent = elements
                        .map((el) => {
                            const element = el.element;
                            const dataset = element.$context.dataset.raw; 
                            const valueIndex = element.$context.index; 
                            const label = element.$context.chart.data.labels[valueIndex];
            
                            // Mapa entre etiquetas y propiedades
                            const labelToRawKeyMap = {
                                'Ecosystem Potential': 'ecoPot',
                                'Productive Potential': 'prodPot',
                                'Use': 'use',
                                'Challenges': 'challenges',
                                'Average': 'average'
                            };
            
                            const rawKey = labelToRawKeyMap[label];
                            const value = dataset[rawKey];
            
                            if (!label || value === undefined) {
                                console.error("No se pudieron encontrar los datos del tooltip.");
                                return null;
                            }
            
                            const itemText = `${dataset.InsectId}. <b>${dataset.InsectComNa}</b>, <i>${dataset.InsectSciNa || "N/A"}</i> (<b>${label}:</b> ${value})`;
                            if (!uniqueItems.has(itemText)) {
                                uniqueItems.add(itemText);
                                return `<li>${itemText}</li>`;
                            }
                            return null;
                        })
                        .filter((item) => item !== null)
                        .join("");
            
                    tooltip.innerHTML = `<ul style="list-style: none; margin: 0; padding: 0;">${tooltipContent}</ul>`;
                    tooltip.style.display = 'block';
            
                    // Ajustar la posición del tooltip
                    const position = elements[0].element.getCenterPoint(); 
                    tooltip.style.left = `${position.x + elements[0].element.$context.chart.canvas.offsetLeft + 20}px`;
                    tooltip.style.top = `${position.y + elements[0].element.$context.chart.canvas.offsetTop + 20}px`;
                } else {
                    tooltip.style.display = 'none';
                }
            }
        }
    });
}

function TopRadarinsects(){
    if ( buffer.length == 0){
        const tableData = getTableData(); // Obtener los datos de la tabla
    generateTopInsectsRadarChart(tableData);
    }
    else {
        generateTopInsectsRadarChart(bufferRecords());
    }
}

const columnNameMapx = {
    'id': 'ID',
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
    'BiogRe_numeric':'Biogeographic - Realm ',
    'BiogZo_numeric':'Biogeographic - Zone ',
    'HoldBio_numeric':'Holdridge - Biome ',
    'HoldPre_numeric':'Holdridge - Annual Precipitation ',
    'HoldTemp_numeric':'Holdridge - Temperature ',
    'HoldAB_numeric':'Holdridge - Altitudinal Belts ',
    'HoldLR_numeric':'Holdridge - Latitudinal Regions ',
    'HoldAD_numeric':'Holdridge - Altitudinal Distribution ',
    'HabPat_numeric':'Habitat Pattern ',
    'LSI_numeric':'Landscape Structure Index ',
    'CultCultIdDi_numeric':'Cultural Identity (Ecosystem) ',
    'CultInspArt_numeric':'Inspiration (Ecosystem) ',
    'CultEdu_numeric':'Education (Ecosystem) ',
    'CultRecEcot_numeric':'Recreation (Ecosystem) ',
    'CultSpiReg_numeric':'Spiritual Relevance (Ecosystem) ',
    'RegBioind_numeric':'Bioindicator (Regulation) ',
    'RegBiocont_numeric':'Biocontrol (Regulation) ',
    'RegPol_numeric':'Pollination (Regulation) ',
    'RegSeed_numeric':'Seed Dispersal (Regulation) ',
    'SupNutCy_numeric':'Nutrient Cycling (Supporting) ',
    'SupSoIm_numeric':'Soil Improvement (Supporting) ',
    'ProFF_numeric':'Food and Feed Production ',
    'ProWildF_numeric':'Wild Food Production ',
    'ProBiomol_numeric':'Biomolecules Production ',
    'ProBiopro_numeric':'Bioproducts Production ',
    'ProBiom_numeric':'Biomass ',
    'ProBiomimi_numeric':'Biomimicry ',
    'DissVector_numeric':'Disservices - Vector ',
    'DissPest_numeric':'Disservices - Pest ',
    'ManSt_numeric':'Management - Stress ',
    'ManRu_numeric':'Management - Rusticity ',
    'ManAg_numeric':'Management - Agility ',
    'ManSoSt_numeric':'Management - Social Structure ',
    'ManHab_numeric':'Management - Habits ',
    'ManTer_numeric':'Management - Territoriality ',
    'ManTra_numeric':'Management - Transportation ',
    'ManFac_numeric':'Management - Facilities ',
    'NutFeed_numeric':'Nutrition - Feeding Type ',
    'NutCost_numeric':'Nutrition - Cost of Feed ',
    'RepSexMat_numeric':'Reproduction - Sexual Maturity ',
    'RepNumbOff_numeric':'Reproduction - Number of Offspring ',
    'RepCy_numeric':'Reproduction - Cycles ',
    'RepGestInc_numeric':'Reproduction - Gestation/Incubation ',
    'RepSexInt_numeric':'Reproduction - Sexual Interaction ',
    'ProPopStu_numeric':'Production - Population Study ',
    'ProProf_numeric':'Production - Profit ',
    'ProLong_numeric':'Production - Longevity ',
    'ProReL_numeric':'Production - Research Level ',
    'ProOpBre_numeric':'Production - Optimal Breeding Type ',
    'ProAddVal_numeric':'Production - Added Value ',
    'MarCultAcc_numeric':'Market - Cultural Acceptance ',
    'MarPri_numeric':'Market - Price ',
    'MarCompDom_numeric':'Market - Competition with Domestic Species ',
    'MarReg_numeric':'Market - Regional ',
    'MarNat_numeric':'Market - National ',
    'MarInt_numeric':'Market - International ',
    'MarMP_numeric':'Market - Main Product of Use ',
    'ScLS_numeric':'Production Scale - Low ',
    'ScMS_numeric':'Production Scale - Medium ',
    'ScLaS_numeric':'Production Scale - Large ',
    'SocAccCSA_numeric':'Social Acceptability - Central/South America ',
    'SocAccNA_numeric':'Social Acceptability - North America ',
    'SocAccAf_numeric':'Social Acceptability - Africa ',
    'SocAccOc_numeric':'Social Acceptability - Oceania ',
    'SocAccEu_numeric':'Social Acceptability - Europe ',
    'SocAccAs_numeric':'Social Acceptability - Asia ',
    'LegPunc_numeric':'Legislation - Punctuation ',
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
};

const columnNameMapy = {
    'EcoPot': 'Ecosystem Potential',
    'ProdPot': 'Productive Potential',
    'Use': 'Use',
    'Challenges':'Challenges'
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
    if (window.heatmapChart){
        window.heatmapChart.destroy();
        window.heatmapChart = null;
    }

    const graphDiv = document.getElementById('div-graph-pop');
    graphDiv.style.display = 'none';
}

let heatmapChart = null;

async function executeSearchAndUpdate() {
    try {
        const graphDiv = document.getElementById('div-graph-pop');
        graphDiv.style.display = 'block';

        await searchGenAsp();

        updateChart();
        TopRadarinsects();
    } catch (error) {
        console.error('Error ejecutando la búsqueda:', error);
    }
}

async function executeFetchAllAndUpdate() {
    try {
        const graphDiv = document.getElementById('div-graph-pop');
        graphDiv.style.display = 'block';

        await fetchAllData();

        updateChart();
        TopRadarinsects();
    } catch (error) {
        console.error('Error ejecutando la búsqueda:', error);
    }
}

let buffer = [];

function toggleRowSelection(row, recordId) {
    if (!buffer.includes(recordId)) {
        buffer.push(recordId);
        row.classList.add('selected-row'); 
    } else {
        buffer = buffer.filter(id => id !== recordId);
        row.classList.remove('selected-row'); 
    }
    console.log("Buffer actual:", buffer);
}

function bufferRecords() {
    return indexData.filter(record => buffer.includes(record.id.toString()));
}

const insectData = {
    ordersToFamilies: {
        "Ortoptera": ["Gryllidae", "Acrididae", "Tettigoniidae", "Pyrgomorphidae", "Rhaphidophoridae"],
        "Hymenoptera": ["Formicidae", "Apidae", "Braconidae", "Trichogrammatidae", "Vespidae"],
        "Blattodea": ["Blaberidae", "Termitidae", "Blattidae"],
        "Lepidoptera": ["Bombycidae", "Nymphalide", "Erebidae", "Papilionidae", "Notodontidae", "Crambidae", "Saturniidae"],
        "Coleoptera": ["Carabidae", "Cerambycidae", "Coccinellidae", "Lucanidae", "Tenebrionidae", "Scarabaeidae", "Passalidae", "Elateroidea", "Lampyridae"],
        "Diptera": ["Stratiomyidae", "Muscidae", "Asilidae", "Culicidae", "Syrphidae", "Tephritidae", "Calliphoridae", "Chaobiridae", "Oestridae", "Drosophilidae"],
        "Mantodea": ["Mantidae"],
        "Hemiptera": ["Pentatomidae", "Tessaratomidae", "Belostomatidae", "Dactylopiidae", "Cicadidae", "Reduviidae"],
        "Ephemeroptera": ["Leptohyphidae"],
        "Megaloptera": ["Corydalidae"],
        "Siphonaptera": ["Pulicidae"],
        "Psocodea": ["Pediculidae"],
        "Thysanoptera": ["Thripidae"]
    },
    familiesToOrders: {
        "Gryllidae": "Ortoptera",
        "Acrididae": "Ortoptera",
        "Tettigoniidae": "Ortoptera",
        "Pyrgomorphidae": "Ortoptera",
        "Rhaphidophoridae": "Ortoptera",
        "Formicidae": "Hymenoptera",
        "Apidae": "Hymenoptera",
        "Braconidae": "Hymenoptera",
        "Trichogrammatidae": "Hymenoptera",
        "Vespidae": "Hymenoptera",
        "Blaberidae": "Blattodea",
        "Termitidae": "Blattodea",
        "Blattidae": "Blattodea",
        "Bombycidae": "Lepidoptera",
        "Nymphalide": "Lepidoptera",
        "Erebidae": "Lepidoptera",
        "Papilionidae": "Lepidoptera",
        "Notodontidae": "Lepidoptera",
        "Crambidae": "Lepidoptera",
        "Saturniidae": "Lepidoptera",
        "Carabidae": "Coleoptera",
        "Cerambycidae": "Coleoptera",
        "Coccinellidae": "Coleoptera",
        "Lucanidae": "Coleoptera",
        "Tenebrionidae": "Coleoptera",
        "Scarabaeidae": "Coleoptera",
        "Passalidae": "Coleoptera",
        "Elateroidea": "Coleoptera",
        "Lampyridae": "Coleoptera",
        "Stratiomyidae": "Diptera",
        "Muscidae": "Diptera",
        "Asilidae": "Diptera",
        "Culicidae": "Diptera",
        "Syrphidae": "Diptera",
        "Tephritidae": "Diptera",
        "Calliphoridae": "Diptera",
        "Chaobiridae": "Diptera",
        "Oestridae": "Diptera",
        "Drosophilidae": "Diptera",
        "Mantidae": "Mantodea",
        "Pentatomidae": "Hemiptera",
        "Tessaratomidae": "Hemiptera",
        "Belostomatidae": "Hemiptera",
        "Dactylopiidae": "Hemiptera",
        "Cicadidae": "Hemiptera",
        "Reduviidae": "Hemiptera",
        "Leptohyphidae": "Ephemeroptera",
        "Corydalidae": "Megaloptera",
        "Pulicidae": "Siphonaptera",
        "Pediculidae": "Psocodea",
        "Thripidae": "Thysanoptera"
    }
};

// Actualizar familias al seleccionar un orden
document.getElementById('Or').addEventListener('change', function() {
    const selectedOrder = this.value;
    updateFamilyOptions(selectedOrder);
});

// Función para actualizar las familias dinámicamente
function updateFamilyOptions(selectedOrder) {
    const familySelect = document.getElementById("Fam");
    familySelect.innerHTML = `<option value="">N/A</option>`; 

    if (selectedOrder && insectData.ordersToFamilies[selectedOrder]) {
        insectData.ordersToFamilies[selectedOrder].forEach(family => {
            const option = document.createElement("option");
            option.value = family;
            option.textContent = family;
            familySelect.appendChild(option);
        });
    }
}


// Nombres completos de las categorías
const categoryNames = {
    use: 'Use',
    prod_pot: 'Productive Potential',
    eco_pot: 'Ecosystem Potential',
    challenges: 'Challenges'
};

// Nombres completos de las subcategorías
const subcategoryNames = {
    SoUseFo: 'Food',
    SoUseFe: 'Feed',
    SoUseBioconv: 'Bioconversion',
    SoUseBiocont: 'Biocontrol',
    SoUseCult: 'Cultural Use',
    SoUseOth: 'Other Uses',
    ManStSc: 'Standard Management',
    ManRuSc: 'Rural Management',
    ManAgSc: 'Agricultural Management',
    ManSoStSc: 'Soil Stability',
    ManHabSc: 'Habitat Support',
    ManFacSc: 'Facilities',
    ManTerSc: 'Territorial Support',
    ManTraSc: 'Transportation',
    NutFeedSc: 'Feed Nutrition',
    NutCostSc: 'Cost Efficiency',
    RepSexMatSc: 'Sexual Maturity',
    RepNumBOffSc: 'Number of Offspring',
    RepCySc: 'Reproductive Cycle',
    RepGestIncSc: 'Gestation/Incubation',
    RepSexIntSc: 'Sexual Interaction',
    ProPopStuSc: 'Population Study',
    ProProfSc: 'Profitability',
    ProLongSc: 'Longevity',
    ProRelSc: 'Reliability',
    ProOpBreSc: 'Open Breeding',
    ProAddValSc: 'Added Value',
    CultCultIdDi: 'Cultural Identity & Diversity',
    CultInspArt: 'Inspiration for Art',
    CultEdu: 'Education',
    CultRecEcot: 'Recreation & Ecotourism',
    CultSpiReg: 'Spiritual & Regional Significance',
    RegBioInd: 'Bioindicators',
    RegBioCont: 'Biocontrol',
    RegPol: 'Pollination',
    RegSeed: 'Seed Dispersal',
    SupNutCy: 'Nutrient Cycles',
    SupSoIm: 'Soil Improvement',
    Vector: 'Vector',
    Pest: 'Pests',
    Toxins: 'Toxins',
    Allergens: 'Allergens',
    Phobia: 'Phobia',
    Stigma: 'Stigma'
};

// Función para generar el heatmap
function generateHeatmapFromExistingData(indexData, yAxis) {
    if (!indexData || indexData.length === 0) {
        console.error('No data available for heatmap');
        return;
    }

    const yAxisToCategory = {
        "Use": "use",
        "ProdPot": "prod_pot",
        "EcoPot": "eco_pot",
        "Challenges": "challenges"
    };

    const selectedCategory = yAxisToCategory[yAxis];
    if (!selectedCategory) {
        console.error(`Invalid Y-Axis value: ${yAxis}`);
        return;
    }

    const subcategoriesByCategory = {
        use: ['SoUseFo', 'SoUseFe', 'SoUseBioconv', 'SoUseBiocont', 'SoUseCult', 'SoUseOth'],
        prod_pot: [
            'ManStSc', 'ManRuSc', 'ManAgSc', 'ManSoStSc', 'ManHabSc', 'ManFacSc', 'ManTerSc', 'ManTraSc',
            'NutFeedSc', 'NutCostSc', 'RepSexMatSc', 'RepNumBOffSc', 'RepCySc', 'RepGestIncSc',
            'RepSexIntSc', 'ProPopStuSc', 'ProProfSc', 'ProLongSc', 'ProRelSc', 'ProOpBreSc', 'ProAddValSc'
        ],
        eco_pot: [
            'CultCultIdDi', 'CultInspArt', 'CultEdu', 'CultRecEcot', 'CultSpiReg',
            'RegBioInd', 'RegBioCont', 'RegPol', 'RegSeed', 'SupNutCy', 'SupSoIm'
        ],
        challenges: ['Vector', 'Pest', 'Toxins', 'Allergens', 'Phobia', 'Stigma']
    };

    const subcategories = subcategoriesByCategory[selectedCategory];
    if (!subcategories) {
        console.error(`Invalid category selected for heatmap: ${selectedCategory}`);
        return;
    }

    const heatmapData = [];

    indexData.forEach(record => {
        const categoryData = record[selectedCategory];
        if (!categoryData) return;

        subcategories.forEach(subcategory => {
            const value = categoryData[subcategory] ?? 0;
            if (value >= 0 && value <= 3) {
                heatmapData.push({
                    x: subcategoryNames[subcategory] || subcategory, // Nombres completos
                    y: value,
                    value: 1
                });
            }
        });
    });

    const groupedData = heatmapData.reduce((acc, { x, y, value }) => {
        const key = `${x}-${y}`;
        if (!acc[key]) acc[key] = { x, y, value: 0 };
        acc[key].value += value;
        return acc;
    }, {});

    const groupedArray = Object.values(groupedData);

    generateHeatmapChart(groupedArray, selectedCategory);
}


// Paleta Viridis (fija)
const viridisColors = [
    [68, 1, 84],   // Azul oscuro
    [59, 82, 139], // Azul intermedio
    [33, 145, 140], // Verde-azulado
    [94, 201, 98],  // Verde brillante
    [253, 231, 37], // Amarillo
    [239, 59, 44]   // Naranja/Rojo
];

// Función global para calcular el color Viridis
function getColor(density, minDensity, maxDensity) {
    const ratio = (density - minDensity) / (maxDensity - minDensity); // Normalizar densidad
    const index = Math.floor(ratio * (viridisColors.length - 1));
    const nextIndex = Math.min(index + 1, viridisColors.length - 1);
    const weight = ratio * (viridisColors.length - 1) - index;

    const r = Math.floor(viridisColors[index][0] * (1 - weight) + viridisColors[nextIndex][0] * weight);
    const g = Math.floor(viridisColors[index][1] * (1 - weight) + viridisColors[nextIndex][1] * weight);
    const b = Math.floor(viridisColors[index][2] * (1 - weight) + viridisColors[nextIndex][2] * weight);

    return `rgba(${r}, ${g}, ${b}, 0.7)`; // Ajustar opacidad al color
}


// Generar el gráfico del heatmap
function generateHeatmapChart(data, selectedCategory) {
    const ctx = document.getElementById('heatmapCanvas').getContext('2d');

    if (heatmapChart) {
        heatmapChart.destroy();
    }

    const maxDensity = Math.max(...data.map(d => d.value));
    const minDensity = Math.min(...data.map(d => d.value));

    heatmapChart = new Chart(ctx, {
        type: 'bubble',
        data: {
            datasets: [{
                data: data.map(item => ({
                    x: item.x,
                    y: item.y,
                    r: Math.sqrt(item.value) * 5
                })),
                backgroundColor: data.map(item => getColor(item.value, minDensity, maxDensity))
            }]
        },
        options: {
            layout: {
                padding: {
                    right: 80,
                    top: 20,
                    bottom: 20,
                    left: 20
                }
            },
            scales: {
                x: {
                    type: 'category',
                    labels: [...new Set(data.map(d => d.x))], // Nombres completos en eje X
                    title: { 
                        display: true, 
                        text: 'Subcategories' ,
                        font: {
                            family: 'Poppins',
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    offset: true,
                },
                y: {
                    type: 'linear',
                    min: -1,
                    max: 4,
                    title: { 
                        display: true, 
                        text: `${categoryNames[selectedCategory] || 'Category'} - Score (0-3)`,
                        font: {
                            family: 'Poppins',
                            size: 16,
                            weight: 'bold'
                        }
                    },
                    ticks: {
                        font: {
                            family: 'Poppins',
                            size: 14
                        }
                    }
                }
            },
            plugins: {
                tooltip: {
                    bodyFont: {
                        family: 'Poppins',
                        size: 14
                    },
                    callbacks: {
                        label: context => {
                            const { x, y, r } = context.raw;
                            const count = Math.round(Math.pow(r / 5, 2));
                            return `${categoryNames[selectedCategory] || 'Category'}: ${x}, Score: ${y}, Count: ${count}`;
                        }
                    }
                },
                legend: { display: false },
                title: {
                    display: true,
                    text: `Heatmap of ${categoryNames[selectedCategory]|| 'Data'} (Discrete values)`,
                    font: { size: 16, family: 'Poppins', weight: 'bold' }
                }
            }
        },
        plugins: [createColorLegendPlugin(minDensity, maxDensity, getColor, 'right', selectedCategory)]
    });
}

function createColorLegendPlugin(minDensity, maxDensity, getColor, position = 'right', selectedCategory) {
    return {
        id: 'colorLegend',
        afterDraw: chart => {
            const ctx = chart.ctx;
            const { top, bottom, right } = chart.chartArea;
            const legendWidth = 20; // Ancho del gradiente
            const legendHeight = bottom - top; // Altura completa del gráfico

            // Posición de la escala (vertical a la derecha)
            const startX = right + 20; // Justo a la derecha del gráfico
            const startY = top;

            // Crear un gradiente Viridis invertido (rojo arriba, azul abajo)
            const gradient = ctx.createLinearGradient(startX, startY + legendHeight, startX, startY);
            for (let i = 0; i <= 1; i += 0.01) {
                const color = getColor(minDensity + i * (maxDensity - minDensity), minDensity, maxDensity);
                gradient.addColorStop(i, color);
            }

            // Dibujar el gradiente
            ctx.fillStyle = gradient;
            ctx.fillRect(startX, startY, legendWidth, legendHeight);

            // Dibujar las etiquetas de densidad
            ctx.fillStyle = 'black';
            ctx.textAlign = 'left';
            ctx.font = '12px Arial';

            // Etiqueta superior (densidad máxima, rojo)
            ctx.fillText(`${maxDensity}`, startX + legendWidth + 5, startY + 10);

            // Etiqueta inferior (densidad mínima, azul)
            ctx.fillText(`${minDensity}`, startX + legendWidth + 5, startY + legendHeight - 5);

            // Etiqueta central (Número de especies por categoría y puntaje)
            const dynamicText = selectedCategory ? `Number of species by ${categoryNames[selectedCategory] || selectedCategory} and score` : "Number of species and score";
            ctx.save();
            ctx.translate(startX + legendWidth + 25, startY + legendHeight / 2);
            ctx.rotate(-Math.PI / 2); // Rotar el texto 90 grados para que sea vertical
            ctx.textAlign = 'center';
            ctx.fillText(dynamicText, 0, 0); // Mostrar texto dinámico
            ctx.restore();
        }
    };
}