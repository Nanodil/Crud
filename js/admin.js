import {
  validarCampoRequerido,
  validarCodigo,
  validarURL,
  validarGeneral,
  validarNumeros,
} from "./validaciones.js";

import { Producto } from "./productoClass.js";

//declarar variables
let listaProductos = [];

//Este archivo tendra toda a logica de ABM o CRUD
let producto = document.querySelector("#producto");
let cantidad = document.querySelector("#cantidad");
let codigo = document.querySelector("#codigo");
let descripcion = document.querySelector("#descripcion");
let url = document.querySelector("#url");
let formulario = document.querySelector("#formProducto");

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

//verificar si hay datos en localStorage
cargaInicial();

function guardarProducto(event) {
  event.preventDefault();
  // validar datos del formulario
  if (validarGeneral()) {
    // crear un nuevo producto
    console.log("aqui deberia crear un producto");

    agregarProducto();
  } else {
    console.log("aqui solo mostrar el cartel de error");
  }
}

function agregarProducto() {
  let productoNuevo = new Producto(
    codigo.value,
    producto.value,
    descripcion.value,
    cantidad.value,
    url.value
  );
  //console.log(productoNuevo);
  // guardar el producto en el arreglo
  listaProductos.push(productoNuevo);
  console.log(listaProductos);
  // guardar en el localStorage
  localStorage.setItem("listaProductosKey", JSON.stringify(listaProductos));
  //limpiar el formulario
  limpiarFormulario();
  // dibujar fila en la tabla
  crearFila(productoNuevo);
}

function cargaInicial() {
  //si hay algo en localStorage lo guardo en el arreglo sino dejo el arreglo vacio
  listaProductos = JSON.parse(localStorage.getItem("listaProductosKey")) || [];

  console.log("listaProductos");
  //llamar a la funcion que crea fila
  listaProductos.forEach(itemProducto =>{
    crearFila(itemProducto);

  })
}

function crearFila(itemProducto) {
  //console.log(itemProducto);
  //traigo el nodo padre
  let tabla = document.querySelector("#tablaProductos");
  //console.log(tabla);
  tabla.innerHTML += `<tr>
  <th scope="row">${itemProducto.codigo}</th>
  <td>${itemProducto.nombreProducto}</td>
  <td>${itemProducto.descripcion}</td>
  <td>${itemProducto.cantidad}</td>
  <td>${itemProducto.url}</td>
  <td>
    <button class="btn btn-warning">Editar</button>
    <button class="btn btn-danger">Borrar</button>
  </td>
</tr>`;
}

function limpiarFormulario(){
  //limpia los value de los elementos del form
  formulario.reset();
  //limpiar las clases de cada elemento del form
  codigo.className = 'form-control';
}