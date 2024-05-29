const btnGA = document.querySelector('.collapsibleGA')
const btnEP = document.querySelector('.collapsibleEP')
const btnPP = document.querySelector('.collapsiblePP')
const btnU = document.querySelector('.collapsibleU')
const contentGA = document.querySelector('.contentGA')
const contentEP = document.querySelector('.contentEP')
const contentPP = document.querySelector('.contentPP')
const contentU = document.querySelector('.contentU')

/*Botones collapsible para aparecer y desaparecer cuadros de caracteristicas*/

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

        const results = await response.json();
        displayResults(results);
    } catch (error) {
        console.error('Error al realizar la búsqueda:', error);
    }
}

function displayResults(results) {
    const tableBody = document.getElementById('results-table').getElementsByTagName('tbody')[0];
    tableBody.innerHTML = '';

    results.forEach(result => {
        const row = document.createElement('tr');
        
        // Asegúrate de que las claves coincidan con los nombres de tus columnas
        row.innerHTML = `

        
            <td>${result.id}</td>
            <td>${result.Or || ''}</td>
            <td>${result.Fam || ''}</td>
            <td>${result.ComNa || ''}</td>
            <td>${result.SciNa || ''}</td>
            <td>${result.BiogRe || ''}</td>
            <td>${result.BiogZo || ''}</td>
            <td>${result.HoldBio || ''}</td>
            <td>${result.HoldPre || ''}</td>
            <td>${result.HoldTemp || ''}</td>
            <td>${result.HoldAB || ''}</td>
            <td>${result.HoldLR || ''}</td>
            <td>${result.HoldAD || ''}</td>
            <td>${result.HabPat || ''}</td>
            <td>${result.LSI || ''}</td>

            <td>${result.CultCultIdDi || ''}</td>
            <td>${result.CultInspArt || ''}</td>
            <td>${result.CultEdu || ''}</td>
            <td>${result.CultRecEcot || ''}</td>
            <td>${result.CultSpiReg || ''}</td>
            <td>${result.RegBioind || ''}</td>
            <td>${result.RegBiocont || ''}</td>
            <td>${result.RegPol || ''}</td>
            <td>${result.RegSeed || ''}</td>
            <td>${result.SupNutCy || ''}</td>
            <td>${result.SupSoIm || ''}</td>
            <td>${result.ProFF || ''}</td>
            <td>${result.ProWildF || ''}</td>
            <td>${result.ProBiomol || ''}</td>
            <td>${result.ProBiopro || ''}</td>
            <td>${result.ProBiom || ''}</td>
            <td>${result.ProBiomimi || ''}</td>
            <td>${result.DissVector || ''}</td>
            <td>${result.DissPest || ''}</td>


            <td>${result.ManSt || ''}</td>
            <td>${result.ManRu || ''}</td>
            <td>${result.ManAg || ''}</td>
            <td>${result.ManSoSt || ''}</td>
            <td>${result.ManHab || ''}</td>
            <td>${result.ManTer || ''}</td>
            <td>${result.ManTra || ''}</td>
            <td>${result.ManFac || ''}</td>
            <td>${result.NutFeed || ''}</td>
            <td>${result.NutCost || ''}</td>
            <td>${result.RepSexMat || ''}</td>
            <td>${result.RepNumbOff || ''}</td>
            <td>${result.RepCy || ''}</td>
            <td>${result.RepGestInc || ''}</td>
            <td>${result.RepSexInt || ''}</td>
            <td>${result.ProPopStu || ''}</td>
            <td>${result.ProProf || ''}</td>
            <td>${result.ProLong || ''}</td>
            <td>${result.ProReL || ''}</td>
            <td>${result.ProOpBre || ''}</td>
            <td>${result.ProAddVal || ''}</td>
            <td>${result.MarCultAcc || ''}</td>
            <td>${result.MarPri || ''}</td>
            <td>${result.MarCompDom || ''}</td>
            <td>${result.MarMarCha || ''}</td>
            <td>${result.RegRest || ''}</td>


            <td>${result.MaUSubs || ''}</td>
            <td>${result.MaUSelCons || ''}</td>
            <td>${result.SoUseBioconv || ''}</td>
            <td>${result.SoUseBiocont || ''}</td>
            <td>${result.SoUsePol || ''}</td>
            <td>${result.SoUsePet || ''}</td>
            <td>${result.SoUseCult || ''}</td>
            <td>${result.SoUseOth || ''}</td>
            <td>${result.ObtHar || ''}</td>
            <td>${result.ObtSHar || ''}</td>
            <td>${result.ObtPro || ''}</td>
            <td>${result.ContUtNA || ''}</td>
            <td>${result.ContUtCA || ''}</td>
            <td>${result.ContUtSA || ''}</td>
            <td>${result.ContUtAs || ''}</td>
            <td>${result.ContUtEu || ''}</td>
            <td>${result.ContUtOc || ''}</td>
            <td>${result.ContUtAf || ''}</td>
            <td>${result.MarYN || ''}</td>
            <td>${result.MarLoc || ''}</td>
            <td>${result.MarReg || ''}</td>
            <td>${result.MarNat || ''}</td>
            <td>${result.MarInt || ''}</td>
            <td>${result.MarMP || ''}</td>
            <td>${result.ScLS || ''}</td>
            <td>${result.ScMS || ''}</td>
            <td>${result.ScLaS || ''}</td>
            <td>${result.SocAccCSA || ''}</td>
            <td>${result.SocAccNA || ''}</td>
            <td>${result.SocAccAf || ''}</td>
            <td>${result.SocAccOc || ''}</td>
            <td>${result.SocAccEu || ''}</td>
            <td>${result.SocAccAs || ''}</td>
            <td>${result.LegPunc || ''}</td>
            <td>${result.LegLeg || ''}</td>


            <td>${result.Use || ''}</td>
            <td>${result.ProdPot || ''}</td>
            <td>${result.EcoPot || ''}</td>
            
        `;
        tableBody.appendChild(row);
    });
}