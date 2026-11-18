import { buscarPais, PaisNoEncontradoError, ErrorServidor } from "./api.js";
import { crearTarjetaPais, crearAviso, actualizarBotonFavorito } from "./vista.js";
import { inicializarFavoritos, anadirFavorito, estaEnFavoritos, EVENTO_CAMBIO } from "./favoritos.js";

//Elementos de la pagina que vamos a usar
const formBusqueda = document.querySelector("#form-busqueda");
const inputPais = document.querySelector("#input-pais");
const resultado = document.querySelector("#resultado-busqueda");
const listaFavoritos = document.querySelector("#lista-favoritos");
const botonOrdenar = document.querySelector("#btn-ordenar");

//Pais que se esta mostrando y la busqueda en curso
let paisActual = null;
let controladorActual = null;

//Muestra un elemento en la zona de resultado
function mostrarEnResultado(nodo) {
  resultado.replaceChildren(nodo);
}

//Al enviar el formulario buscamos el pais y mostramos el resultado o el error
formBusqueda.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nombrePais = inputPais.value.trim();
  inputPais.value = "";
  inputPais.focus();

  if (nombrePais === "") {
    mostrarEnResultado(crearAviso("Escribe el nombre de un país.", "error"));
    return;
  }

  controladorActual?.abort();
  const controlador = new AbortController();
  controladorActual = controlador;

  paisActual = null;
  mostrarEnResultado(crearAviso(`Buscando "${nombrePais}"…`));

  try {
    const pais = await buscarPais(nombrePais, controlador.signal);
    paisActual = pais;
    mostrarEnResultado(crearTarjetaPais(pais, estaEnFavoritos(pais.codigo)));
  } catch (error) {
    if (error.name === "AbortError") return;

    let mensaje;
    if (error instanceof PaisNoEncontradoError) {
      mensaje = `${error.message} Recuerda escribirlo en inglés (p. ej. "Spain", "Germany").`;
    } else if (error instanceof ErrorServidor) {
      mensaje = error.message;
    } else if (error.name === "TimeoutError") {
      mensaje = "El servidor está tardando demasiado en responder. Inténtalo de nuevo.";
    } else {
      mensaje = "No se ha podido conectar con el servidor. Comprueba tu conexión.";
      console.error(error);
    }
    mostrarEnResultado(crearAviso(mensaje, "error"));
  } finally {
    if (controladorActual === controlador) controladorActual = null;
  }
});

//Añade a favoritos el pais buscado al pulsar el boton
resultado.addEventListener("click", (evento) => {
  const boton = evento.target.closest('[data-accion="anadir-favorito"]');
  if (!boton || !paisActual) return;

  anadirFavorito(paisActual);
  actualizarBotonFavorito(boton, true);
});

//Cuando cambian los favoritos actualizamos el boton del pais buscado
listaFavoritos.addEventListener(EVENTO_CAMBIO, () => {
  const boton = resultado.querySelector('[data-accion="anadir-favorito"]');
  if (boton && paisActual) {
    actualizarBotonFavorito(boton, estaEnFavoritos(paisActual.codigo));
  }
});

//Cargamos los favoritos al abrir la pagina
inicializarFavoritos(listaFavoritos, botonOrdenar);
