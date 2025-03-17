
/* Control de menú desplegable */

document.addEventListener('DOMContentLoaded', function () {
    const menuToggle = document.querySelector('.menu-toggle'); 
    const navigation = document.querySelector('.navigation');
    const icon = menuToggle.querySelector('i');
    
    if (menuToggle && navigation && icon) {
        menuToggle.addEventListener('click', function () {
            navigation.classList.toggle('active'); 

            if (navigation.classList.contains('active')) {
                icon.classList.replace('bx-bug-alt', 'bx-x'); 
            } else {
                icon.classList.replace('bx-x', 'bx-bug-alt'); 
            }
        });
    } else {
        console.error("No se encontró el menú o el icono."); 
    }
});





