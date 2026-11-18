import { LOCALE } from "./config.js";

//Crea un elemento HTML con su clase, texto, atributos e hijos
export function crearElemento(etiqueta, opciones = {}, hijos = []) {
  const { clase, texto, atributos = {}, dataset = {} } = opciones;
  const elemento = document.createElement(etiqueta);

  if (clase) elemento.className = clase;
  if (texto !== undefined) elemento.textContent = texto;

  for (const [nombre, valor] of Object.entries(atributos)) {
    elemento.setAttribute(nombre, valor);
  }
  for (const [clave, valor] of Object.entries(dataset)) {
    elemento.dataset[clave] = valor;
  }
  for (const hijo of hijos) {
    elemento.appendChild(hijo);
  }
  return elemento;
}

//Pone la poblacion con puntos y "hab." al final
export function formatearPoblacion(numero) {
  return `${Number(numero).toLocaleString(LOCALE)} hab.`;
}

//Ordena los elementos de una lista segun un dato, de mayor a menor por defecto
export function ordenarListaPorDataset(lista, clave, descendente = true) {
  const ordenados = Array.from(lista.children).sort((a, b) => {
    const diferencia = Number(a.dataset[clave]) - Number(b.dataset[clave]);
    return descendente ? -diferencia : diferencia;
  });

  for (const elemento of ordenados) {
    lista.appendChild(elemento);
  }
}
