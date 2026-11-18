import { crearElemento, formatearPoblacion } from "./dom.js";

//Crea la tarjeta del pais con su bandera, sus datos y el boton de favoritos
export function crearTarjetaPais(pais, yaEsFavorito = false) {
  const bandera = crearElemento("img", {
    clase: "tarjeta-bandera",
    atributos: { src: pais.bandera, alt: `Bandera de ${pais.nombre}` },
  });

  const datos = crearElemento("dl", { clase: "tarjeta-datos" }, [
    crearElemento("dt", { texto: "Capital" }),
    crearElemento("dd", { texto: pais.capital }),
    crearElemento("dt", { texto: "Región" }),
    crearElemento("dd", { texto: pais.region }),
    crearElemento("dt", { texto: "Población" }),
    crearElemento("dd", { texto: formatearPoblacion(pais.poblacion) }),
  ]);

  const boton = crearElemento("button", {
    clase: "btn-favorito",
    atributos: { type: "button" },
    dataset: { accion: "anadir-favorito" },
  });
  actualizarBotonFavorito(boton, yaEsFavorito);

  const cuerpo = crearElemento("div", { clase: "tarjeta-cuerpo" }, [
    crearElemento("h3", { texto: pais.nombre }),
    datos,
    boton,
  ]);

  return crearElemento("article", { clase: "tarjeta", dataset: { codigo: pais.codigo } }, [
    bandera,
    cuerpo,
  ]);
}

//Cambia el texto del boton segun si el pais ya esta en favoritos
export function actualizarBotonFavorito(boton, yaEsFavorito) {
  boton.disabled = yaEsFavorito;
  boton.textContent = yaEsFavorito ? "✓ En favoritos" : "Añadir a favoritos";
}

//Crea un mensaje de aviso o de error
export function crearAviso(texto, tipo = "info") {
  return crearElemento("p", {
    clase: `aviso aviso--${tipo}`,
    texto,
    atributos: { role: tipo === "error" ? "alert" : "status" },
  });
}

//Crea el elemento de la lista de favoritos con su boton de quitar
export function crearElementoFavorito(pais) {
  const bandera = crearElemento("img", {
    clase: "favorito-bandera",
    atributos: { src: pais.bandera, alt: "" },
  });

  const texto = crearElemento("div", { clase: "favorito-texto" }, [
    crearElemento("span", { clase: "favorito-nombre", texto: pais.nombre }),
    crearElemento("span", { clase: "favorito-poblacion", texto: formatearPoblacion(pais.poblacion) }),
  ]);

  const quitar = crearElemento("button", {
    clase: "btn-quitar",
    texto: "Quitar",
    atributos: { type: "button", "aria-label": `Quitar ${pais.nombre} de favoritos` },
    dataset: { accion: "quitar" },
  });

  return crearElemento(
    "li",
    {
      clase: "favorito",
      dataset: {
        codigo: pais.codigo,
        nombre: pais.nombre,
        poblacion: pais.poblacion,
        bandera: pais.bandera,
      },
    },
    [bandera, texto, quitar]
  );
}
