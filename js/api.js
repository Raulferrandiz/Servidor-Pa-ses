import { URL_API, TIEMPO_MAXIMO_MS } from "./config.js";

//Error cuando no se encuentra el pais
export class PaisNoEncontradoError extends Error {
  constructor(nombre) {
    super(`No se ha encontrado ningún país con el nombre "${nombre}".`);
    this.name = "PaisNoEncontradoError";
  }
}

//Error cuando el servidor responde con un fallo
export class ErrorServidor extends Error {
  constructor(estado) {
    super(`El servidor ha respondido con un error (${estado}). Inténtalo más tarde.`);
    this.name = "ErrorServidor";
    this.estado = estado;
  }
}

//Pasa los datos de la API a nuestro formato
function normalizarPais(crudo) {
  return {
    codigo: crudo.alpha3Code,
    nombre: crudo.name,
    capital: crudo.capital || "Sin capital",
    region: crudo.region || "Desconocida",
    poblacion: Number(crudo.population) || 0,
    bandera: crudo.flags?.png || "",
  };
}

//Busca un pais por su nombre en la API y devuelve sus datos
export async function buscarPais(nombre, senal) {
  const url = `${URL_API}/name/${encodeURIComponent(nombre)}`;

  const senales = [AbortSignal.timeout(TIEMPO_MAXIMO_MS)];
  if (senal) senales.push(senal);

  const respuesta = await fetch(url, { signal: AbortSignal.any(senales) });

  if (respuesta.status === 404) throw new PaisNoEncontradoError(nombre);
  if (!respuesta.ok) throw new ErrorServidor(respuesta.status);

  const datos = await respuesta.json();

  if (!Array.isArray(datos) || datos.length === 0) {
    throw new PaisNoEncontradoError(nombre);
  }

  const buscado = nombre.toLowerCase();
  const exacto = datos.find((pais) => pais.name?.toLowerCase() === buscado);

  return normalizarPais(exacto ?? datos[0]);
}
