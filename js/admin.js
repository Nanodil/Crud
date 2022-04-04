import {
  validarCampoRequerido,
  validarCodigo,
  validarNumeros,
  validarURL,
  validarGeneral,
} from "./validaciones.js";

import { Producto } from "./productoClass.js";
//declaracion de variables

let producto = document.querySelector("#producto");
let cantidad = document.querySelector("#cantidad");
let codigo = document.querySelector("#codigo");
let descripcion = document.querySelector("#descripcion");
let url = document.querySelector("#url");
let formulario = document.querySelector("#formProducto");
let listaProductos = [];
let productoExistente = false //Si es false, significa que no existe el producto entonces tengo que agregar uno nuevo. Pero si es true, tengo que modificar. 
// agregar eventos desde javascript
let btnAgregar = document.querySelector("#btnAgregar")
let btnDatosPrueba = document.querySelector("#btnDatosPrueba")
console.log(btnDatosPrueba)
producto.addEventListener("blur", () => {
  validarCampoRequerido(producto);
});
cantidad.addEventListener("blur", () => {
  validarNumeros(cantidad);
});
descripcion.addEventListener("blur", () => {
  validarCampoRequerido(descripcion);
});
codigo.addEventListener("blur", () => {
  validarCodigo(codigo);
});
url.addEventListener("blur", () => {
  validarURL(url);
});
formulario.addEventListener("submit", guardarProducto);
btnAgregar.addEventListener("click", limpiarFormulario);
btnDatosPrueba.addEventListener("click", cargarDatosPrueba);

// Verifico si hay datos en el local Storage
cargaInicial();

function guardarProducto(e) {
  e.preventDefault();
  //funcion para validar datos del formulario
  if (validarGeneral()) {
    //verifico si existe el objeto
    if (productoExistente)
         { // modificar
          actualizarProducto()} 
           else
           //agregar
              {agregarProducto()}}
  else {console.log("aqui debería mostrar un error");}
              }

function agregarProducto() {
  let productoNuevo = new Producto(
    codigo.value,
    producto.value,
    descripcion.value,
    cantidad.value,
    url.value
  );
  console.log(productoNuevo);

  listaProductos.push(productoNuevo);
  console.log(listaProductos);

  // guardar en el local Storage:

  localStorage.setItem("listaProductosKey", JSON.stringify(listaProductos));
  //dibujar en la tabla

  crearFila(productoNuevo);
  limpiarFormulario();

  //mostrar mensaje al ursuario
  Swal.fire(
    'Producto Agregado',
    'El producto fue correctamente agregado',
    'success'
  )
}
// Si hay algo en el local lo guardo en el arreglo, sino, dejo el array vacio
function cargaInicial() {
  listaProductos = JSON.parse(localStorage.getItem("listaProductosKey")) || [];
  //Llamar a la funcion que crea filas
  listaProductos.forEach((itemProducto) => {
    crearFila(itemProducto);
  });
}

function crearFila(itemProducto) {
  let tabla = document.querySelector("#tablaProductos");
  // console.log(tabla);
  tabla.innerHTML += `  <tr>
  <th scope="row">${itemProducto.codigo}</th>
  <td>${itemProducto.nombreProducto}</td>
<td>${itemProducto.descripcion}</td>
<td>${itemProducto.cantidad}</td>
<td>${itemProducto.url}</td>
<td>
    <button class="btn btn-warning" onclick="prepararEdicionProducto(
    ${itemProducto.codigo})">Editar</button>
    <button class="btn btn-danger" onclick="eliminarProducto(${itemProducto.codigo})" >Borrar</button>
</td>
</tr>
`;
}

function limpiarFormulario() {
  formulario.reset();

  codigo.className = "form-control";
  producto.className = "form-control";
  descripcion.className = "form-control";
  cantidad.className = "form-control";
  url.className = "form-control";

  productoExistente = false
}

window.prepararEdicionProducto = (codigo) => {
  let productoEncontrado = listaProductos.find ((itemProducto) =>  {return itemProducto.codigo == codigo});
  console.log (productoEncontrado)
  document.querySelector("#codigo").value = productoEncontrado.codigo;
  document.querySelector("#producto").value = productoEncontrado.nombreProducto;
  document.querySelector("#descripcion").value = productoEncontrado.descripcion;
  document.querySelector("#cantidad").value = productoEncontrado.cantidad;
  document.querySelector("#url").value = productoEncontrado.url;

  productoExistente = true;



} 

window.eliminarProducto = (codigo) =>{ console.log (codigo)
  Swal.fire({
    title: 'Estas seguro de borrar el producto?',
    text: "No se puede revertir este proceso posteriormente",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, borrar!',
    cancelButtonText: 'Cancelar!'
  }).then((result) => {
    if (result.isConfirmed) {

      let _listaProductos = listaProductos.filter((itemProducto) =>{return itemProducto.codigo != codigo})
      listaProductos = _listaProductos;
      localStorage.setItem ('listaProductosKey', JSON.stringify(listaProductos))

      //Borro tabla

      borrarFilas();

      //Vuelvo a dibujar tabla:

      listaProductos.forEach((itemProducto)=>crearFila(itemProducto))

      console.log(_listaProductos)

      Swal.fire(
        'Producto eliminado!',
        'El producto fue correctamente eliminado',
        'success'
      )
    }
  })
}

function actualizarProducto() {
  // console.log("aqui tengo que modificar los productos");
  // console.log(codigo.value);
  Swal.fire({
    title: "¿Esta seguro que desea editar el producto?",
    text: "No puede revertir posteriormente este proceso",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "si",
    cancelButtonText: "cancelar",
  }).then((result) => {
    // console.log(result);
    if (result.isConfirmed) {
      //aqui es donde procedemos a editar
      //buscar la posicion del objeto con el codigo indicado
      let indiceProducto = listaProductos.findIndex((itemProducto) => {
        return itemProducto.codigo == codigo.value;
      });

      // actualizar los valores del objeto encontrado dentro de mi arreglo
      listaProductos[indiceProducto].nombreProducto =
        document.querySelector("#producto").value;
      listaProductos[indiceProducto].descripcion =
        document.querySelector("#descripcion").value;
      listaProductos[indiceProducto].cantidad =
        document.querySelector("#cantidad").value;
      listaProductos[indiceProducto].url = document.querySelector("#url").value;

      console.log(listaProductos[indiceProducto]);
      // actualizar el localstorage
      localStorage.setItem("listaProductosKey", JSON.stringify(listaProductos));
      // actualizar la tabla
      borrarFilas();
      listaProductos.forEach((itemProducto) => {
        crearFila(itemProducto);
      });
      //limpiar el formulario
      limpiarFormulario();

      // mostrar un mensaje que el producto fue editado
      Swal.fire("Producto editado", "Su producto fue correctamente editado", "success");
    }
  });
}

function borrarFilas() {
  // traigo el nodo padre que seria el tbody
  let tabla = document.querySelector("#tablaProductos");
  tabla.innerHTML = "";
}

function cargarDatosPrueba () {

if (!localStorage.getItem ('listaProductosKey')){

console.log ("Aqui cargo datos de prueba")

let datos =
[
{codigo: "123" ,
nombreProducto: "planta 1",
cantidad: "2",
descripcion: "Esto es una planta",
url:"https://images.pexels.com/photos/9458756/pexels-photo-9458756.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" } ,

{codigo: "123" ,
nombreProducto: "planta 1",
cantidad: "2",
descripcion: "Esto es una planta",
url:"https://images.pexels.com/photos/9458756/pexels-photo-9458756.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500" } ,

]
}else {

  console.log ("Aqui no hago nada ya que hay datos cargados")

}

}
