const wrapper = document.querySelector('.wrapper');
const loginLink = document.querySelector('.login-link');
const loginnLink = document.querySelector('.loginn-link');
const registerLink = document.querySelector('.register-link');
const registerProLink = document.querySelector('.registerpro-link');
const btnlog = document.querySelector('.btlogin');
const closelog=document.querySelector('.icon-close')
const research=document.querySelector('.research') 
const logo=document.querySelector('.logo') 
const row=document.querySelector('.row') 


registerLink.addEventListener('click', ()=> {
    wrapper.classList.add('active');
})

registerProLink.addEventListener('click', ()=> {
    wrapper.classList.add('plus');
})

loginLink.addEventListener('click', ()=> {
    wrapper.classList.remove('active');
})

loginnLink.addEventListener('click', ()=> {
    wrapper.classList.remove('plus');
})

btnlog.addEventListener('click', ()=> {
    wrapper.classList.add('pop');
})

closelog.addEventListener('click', ()=> {
    wrapper.classList.remove('pop');
})

research.addEventListener('click', ()=> {
    wrapper.classList.remove('pop');
})

research.addEventListener('click', ()=> {
    row.classList.add('pop');
})

research.addEventListener('dblclick', ()=> {
    row.classList.remove('pop');
})

logo.addEventListener('click', ()=> {
    row.classList.remove('pop');
})

btnlog.addEventListener('click', ()=> {
    row.classList.remove('pop');
})


async function addGenAsp() {
    const genAspId = document.getElementById('genAspId').value;

    const newGenAsp = {
        id: genAspId,
    };

    const response = await fetch('/gen_asp', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newGenAsp)
    });

    if (response.ok) {
        searchGenAsp(); 
    } else {
        alert('Error al añadir el registro');
    }
}

async function deleteGenAsp() {
    const genAspId = document.getElementById('genAspId').value;

    const response = await fetch(`/gen_asp/${genAspId}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        searchGenAsp(); 
    } else {
        alert('Error al eliminar el registro');
    }
}
