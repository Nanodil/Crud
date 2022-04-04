//declarar variables
let productos = [];

cargaInicial();
function cargaInicial(){
    productos = JSON.parse(localStorage.getItem('listaProductosKey')) || [];

    //si hay datos dentro del arreglo dibujo las columnas con cards
    if(productos.length >0){
        //aqui dibujo las cards
        crearColumna();
    }
}

function crearColumna(){
    let grilla = document.querySelector('#grilla');
    console.log(grilla);
}