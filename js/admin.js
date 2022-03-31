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
let productoExistente = false; //false tengo que agregar un producto nuevo, true tengo que modificar
//Este archivo tendra toda a logica de ABM o CRUD
let producto = document.querySelector("#producto");
let cantidad = document.querySelector("#cantidad");
let codigo = document.querySelector("#codigo");
let descripcion = document.querySelector("#descripcion");
let url = document.querySelector("#url");
let formulario = document.querySelector("#formProducto");
let btnAgregar = document.querySelector("#btnAgregar");

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

btnAgregar.addEventListener('click', limpiarFormulario)
//verificar si hay datos en localStorage
cargaInicial();

function guardarProducto(event) {
  event.preventDefault();
  // validar datos del formulario
  if (validarGeneral()) {
    //tengo que modificar o tengo que modificar algo nuevo
    //if(productoExistente)
    if (productoExistente) {
      //modificar
      actualizarProducto();
    } else {
      //agregar
      // crear un nuevo producto
      console.log("aqui deberia crear un producto");
      agregarProducto();
    }
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
  listaProductos.forEach((itemProducto) => {
    crearFila(itemProducto);
  });
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
    <button class="btn btn-warning" onclick="prepararEdicionProducto('${itemProducto.codigo}')">Editar</button>
    <button class="btn btn-danger">Borrar</button>
  </td>
</tr>`;
}

function limpiarFormulario() {
  //limpia los value de los elementos del form
  formulario.reset();
  //limpiar las clases de cada elemento del form
  codigo.className = "form-control";
productoExistente = false;
}

//funcion invocada desde el html
window.prepararEdicionProducto = (codigo) => {
  //console.log(codigo);
  //buscar el objeto dentro del arreglo
  let productoEncontrado = listaProductos.find((itemProducto) => {
    return itemProducto.codigo == codigo;
  });
  //console.log(productoEncontrado);
  //mostrar los datos del objeto en formulario
  document.querySelector("#codigo").value = productoEncontrado.codigo;
  document.querySelector("#producto").value = productoEncontrado.nombreProducto;
  document.querySelector("#descripcion").value = productoEncontrado.descripcion;
  document.querySelector("#cantidad").value = productoEncontrado.cantidad;
  document.querySelector("#url").value = productoEncontrado.url;

  //cambiar el valor de la variable bandera para editar
  productoExistente = true;
};

function actualizarProducto() {
  console.log("aqui tengo que modificar producto");
  console.log(codigo.value);

  //buscar la posicion del objeto con el codigo indicado
  let indiceProducto = listaProductos.findIndex((itemProducto) => {
    return itemProducto.codigo == codigo.value;
  });

  //actualizar los valores del objeto encontrado dentro de mi arreglo
  listaProductos[indiceProducto].nombreProducto =
    document.querySelector("#producto").value;
  listaProductos[indiceProducto].descripcion =
    document.querySelector("#descripcion").value;
  listaProductos[indiceProducto].cantidad =
    document.querySelector("#cantidad").value;
  listaProductos[indiceProducto].url = document.querySelector("#url").value;

  console.log(listaProductos[indiceProducto]);

  //actualizar el localStorage
  localStorage.setItem("listaProductosKey", JSON.stringify(listaProductos));

  //actualizar la tabla
  borrarFilas();
  listaProductos.forEach((itemProducto) => {
    crearFila(itemProducto);
  });
}

function borrarFilas() {
  //traigo el nodo padre
  let tabla = document.querySelector("#tablaProductos");
  tabla.innerHTML = "";
}
