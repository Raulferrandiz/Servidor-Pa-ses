import { leerFavoritos, guardarFavoritos } from "./almacen.js";
import { crearElementoFavorito } from "./vista.js";
import { ordenarListaPorDataset } from "./dom.js";

//Nombre del evento que se lanza cuando cambian los favoritos
export const EVENTO_CAMBIO = "favoritos:cambio";

//Lista de favoritos de la pagina
let lista = null;

//Carga los favoritos guardados y prepara los botones de quitar y ordenar
export function inicializarFavoritos(elementoLista, botonOrdenar) {
  lista = elementoLista;

  for (const pais of leerFavoritos()) {
    lista.appendChild(crearElementoFavorito(pais));
  }

  lista.addEventListener("click", (evento) => {
    const boton = evento.target.closest('[data-accion="quitar"]');
    if (!boton || !lista.contains(boton)) return;

    const elemento = boton.closest("li");
    const codigo = elemento.dataset.codigo;
    elemento.remove();
    notificarCambio(codigo);
  });

  botonOrdenar.addEventListener("click", () => {
    ordenarListaPorDataset(lista, "poblacion", true);
    notificarCambio(null);
  });

  actualizarBotonOrdenar(botonOrdenar);
  lista.addEventListener(EVENTO_CAMBIO, () => actualizarBotonOrdenar(botonOrdenar));
}

//Comprueba si un pais ya esta en favoritos
export function estaEnFavoritos(codigo) {
  return Array.from(lista.children).some((li) => li.dataset.codigo === codigo);
}

//Añade un pais a favoritos si no estaba ya
export function anadirFavorito(pais) {
  if (estaEnFavoritos(pais.codigo)) return false;

  lista.appendChild(crearElementoFavorito(pais));
  notificarCambio(pais.codigo);
  return true;
}

//Saca los datos de los favoritos que hay en la lista de la pagina
function leerFavoritosDelDom() {
  return Array.from(lista.children).map((li) => ({
    codigo: li.dataset.codigo,
    nombre: li.dataset.nombre,
    poblacion: Number(li.dataset.poblacion),
    bandera: li.dataset.bandera,
  }));
}

//Guardamos los favoritos y avisamos de que la lista ha cambiado
function notificarCambio(codigo) {
  guardarFavoritos(leerFavoritosDelDom());
  lista.dispatchEvent(new CustomEvent(EVENTO_CAMBIO, { detail: { codigo } }));
}

//Desactiva el boton de ordenar si hay menos de 2 favoritos
function actualizarBotonOrdenar(boton) {
  boton.disabled = lista.children.length < 2;
}
