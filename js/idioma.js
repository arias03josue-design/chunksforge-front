/* Chunksforge · idioma de la web (español / inglés).
 *
 * Cada texto está dos veces en el HTML, con lang="es" y lang="en"; el CSS sólo muestra el del
 * idioma activo (html[data-idioma]). Los atributos traducibles llevan la versión inglesa en
 * data-en-<atributo> (data-en-alt, data-en-title, data-en-aria-label...).
 *
 * Este archivo se carga en el <head> (sin defer): elige el idioma antes de pintar la página, así no
 * hay parpadeo. Orden: ?lang=es|en en la URL, la elección guardada y el idioma del navegador.
 * Al cambiar de idioma se emite el evento "cambio-idioma" en document (lo usa js/main.js).
 */
"use strict";

(function () {
	const IDIOMAS = ["es", "en"];
	const CLAVE = "chunksforge-idioma";
	const raiz = document.documentElement;

	function guardado() {
		try {
			return localStorage.getItem(CLAVE);
		} catch {
			return null;
		}
	}

	function inicial() {
		const parametro = new URLSearchParams(location.search).get("lang");
		if (IDIOMAS.includes(parametro)) return parametro;
		const memoria = guardado();
		if (IDIOMAS.includes(memoria)) return memoria;
		return (navigator.language || "es").toLowerCase().startsWith("es") ? "es" : "en";
	}

	function poner(idioma) {
		raiz.dataset.idioma = idioma;
		raiz.lang = idioma;
	}

	poner(inicial());

	// Atributos traducibles: se recuerda el texto español la primera vez.
	let traducibles = null;

	function aplicarAtributos(idioma) {
		if (!traducibles) {
			traducibles = [];
			for (const el of document.querySelectorAll("*")) {
				const atributos = Object.keys(el.dataset).filter((k) => /^en[A-Z]/.test(k));
				if (!atributos.length) continue;
				const nombres = atributos.map((k) => k.slice(2).replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()).slice(1));
				for (const nombre of nombres) {
					if (!el.hasAttribute(`data-es-${nombre}`)) el.setAttribute(`data-es-${nombre}`, el.getAttribute(nombre) ?? "");
				}
				traducibles.push([el, nombres]);
			}
		}
		for (const [el, nombres] of traducibles) {
			for (const nombre of nombres) el.setAttribute(nombre, el.getAttribute(`data-${idioma}-${nombre}`) ?? "");
		}
		const titulo = raiz.getAttribute(`data-titulo-${idioma}`);
		if (titulo) document.title = titulo;
		const descripcion = document.querySelector('meta[name="description"]');
		const textoDescripcion = raiz.getAttribute(`data-descripcion-${idioma}`);
		if (descripcion && textoDescripcion) descripcion.content = textoDescripcion;
	}

	function marcarBotones(idioma) {
		for (const b of document.querySelectorAll(".idiomas [data-idioma]")) {
			b.setAttribute("aria-pressed", String(b.dataset.idioma === idioma));
		}
	}

	function cambiar(idioma) {
		if (!IDIOMAS.includes(idioma)) return;
		poner(idioma);
		try {
			localStorage.setItem(CLAVE, idioma);
		} catch {
			// Sin almacenamiento (modo privado...): el cambio sólo dura esta visita.
		}
		aplicarAtributos(idioma);
		marcarBotones(idioma);
		document.dispatchEvent(new CustomEvent("cambio-idioma", { detail: idioma }));
	}

	window.Idioma = {
		actual: () => raiz.dataset.idioma,
		cambiar,
		// Elige el texto del idioma activo de un objeto {es, en}.
		texto: (t) => (t && typeof t === "object" ? t[raiz.dataset.idioma] ?? t.es : t),
	};

	document.addEventListener("DOMContentLoaded", () => {
		const idioma = raiz.dataset.idioma;
		aplicarAtributos(idioma);
		marcarBotones(idioma);
		for (const b of document.querySelectorAll(".idiomas [data-idioma]")) {
			b.addEventListener("click", () => cambiar(b.dataset.idioma));
		}
	});
})();
