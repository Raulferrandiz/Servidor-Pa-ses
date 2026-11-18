import { CLAVE_FAVORITOS } from "./config.js";

//Comprueba que un favorito tenga el formato correcto para usarse
function esFavoritoValido(item) {
  return (
    item !== null &&
    typeof item === "object" &&
    typeof item.codigo === "string" && item.codigo !== "" &&
    typeof item.nombre === "string" && item.nombre !== "" &&
    Number.isFinite(item.poblacion) &&
    typeof item.bandera === "string"
  );
}

//Lee los favoritos, quita los repetidos y solo guarda los validos
export function leerFavoritos() {
  try {
    const texto = localStorage.getItem(CLAVE_FAVORITOS);
    if (!texto) return [];

    const datos = JSON.parse(texto);
    if (!Array.isArray(datos)) return [];

    const vistos = new Set();
    return datos.filter((item) => {
      if (!esFavoritoValido(item) || vistos.has(item.codigo)) return false;
      vistos.add(item.codigo);
      return true;
    });
  } catch {
    return [];
  }
}

//Guardamos los favoritos en el navegador
export function guardarFavoritos(favoritos) {
  try {
    localStorage.setItem(CLAVE_FAVORITOS, JSON.stringify(favoritos));
  } catch (error) {
    console.warn("No se han podido guardar los favoritos:", error);
  }
}
