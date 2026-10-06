/* Chunksforge · web de presentación
 * - Fondo de la portada: el mismo mapa animado del menú principal (barcos, serpientes, kraken,
 *   destellos, nubes en paralaje y rosa de los vientos), con los datos que exporta
 *   tools/export_web_assets.gd en js/fondo.js.
 * - Inventario de herramientas con inspector (como la barra y el panel del editor).
 * - Pestañas de etapa, visor de capturas, menú con la sección actual y aparición escalonada.
 */
"use strict";

const ARTE = "assets/arte/";
const CAPTURAS = "assets/capturas/";
const UI = "assets/ui/";
const MOVIMIENTO = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* --- Herramientas ----------------------------------------------------------------------- */

const HERRAMIENTAS = [
	{
		id: "tierra", nombre: "Tierra / Masa continental", tecla: "T", icono: "tool_land", etapa: 1,
		capturas: ["pincel-terreno"],
		texto: "Esculpe el heightmap: eleva continentes, suaviza laderas y aplana mesetas con un pincel de caída suave.",
		puntos: [
			"Modos Elevar, Suavizar y Aplanar; el clic derecho hace lo contrario.",
			"Tamaño, fuerza y dureza del borde del pincel.",
			"Estilos de terreno: templado, desértico, helado y volcánico.",
			"Texturas propias para arena, hierba y roca.",
			"Nivel del mar ajustable en tiempo real.",
		],
	},
	{
		id: "agua", nombre: "Agua / Costas", tecla: "A", icono: "tool_water", etapa: 1,
		capturas: ["editor"],
		texto: "Hunde el terreno para abrir mares, lagos y bahías. La profundidad, el oleaje y los anillos de costa salen solos de la altura.",
		puntos: [
			"Sumergir, suavizar y aplanar; el clic derecho eleva.",
			"Colores de aguas someras y profundas.",
			"Oleaje animado y anillos de costa opcionales.",
			"Textura de agua propia con su intensidad.",
		],
	},
	{
		id: "relieve", nombre: "Relieve", tecla: "M", icono: "tool_relief", etapa: 1,
		capturas: ["relieve", "paleta-assets"],
		texto: "Montañas y colinas: estampa una a una o pinta cordilleras enteras con el pincel de dispersión.",
		puntos: [
			"Modos Estampar y Pincel, con distancia mínima entre sellos.",
			"Variación aleatoria de tamaño, giro y tono.",
			"Variante aleatoria dentro del mismo set.",
			"Lo que está más al sur tapa a lo del norte (orden por profundidad).",
			"Clic derecho: borra bajo el pincel.",
		],
	},
	{
		id: "vegetacion", nombre: "Vegetación", tecla: "V", icono: "tool_vegetation", etapa: 1,
		capturas: ["vegetacion"],
		texto: "Bosques pintados con dispersión tipo Poisson: densos y naturales, sin árboles amontonados.",
		puntos: [
			"Densidad y tamaño del pincel.",
			"Sólo sobre tierra firme (opcional).",
			"Volteo horizontal aleatorio.",
			"Árboles propios desde la carpeta de assets.",
		],
	},
	{
		id: "rios", nombre: "Ríos y rutas", tecla: "R", icono: "tool_river", etapa: 1,
		capturas: ["rios"],
		texto: "Ríos que se ensanchan hacia la desembocadura y caminos discontinuos, trazados punto a punto con curvas suaves.",
		puntos: [
			"Clic: añadir punto. Doble clic, Enter o clic derecho: terminar.",
			"Anchura en el nacimiento y en la desembocadura.",
			"Suavizado de la curva.",
			"Pasa el cursor por encima de un trazo y pulsa clic derecho para borrarlo.",
		],
	},
	{
		id: "simbolos", nombre: "Símbolos", tecla: "C", icono: "tool_settlement", etapa: 1,
		capturas: ["gestor-assets"],
		texto: "Ciudades, aldeas, castillos, torres, ruinas y puntos de interés, más todas las categorías que crees con tus propias imágenes.",
		puntos: [
			"Paleta con los símbolos integrados y tus sets (con marca dorada).",
			"Vista previa flotante con la escala activa.",
			"Categorías propias: una carpeta = una categoría.",
			"Gestor de assets a un clic: abrir carpeta, recargar, importar.",
		],
	},
	{
		id: "nacion", nombre: "Pincel de Nación", tecla: "N", icono: "tool_nation", etapa: 2,
		capturas: ["reinos", "disputa-panel"],
		texto: "Pinta el territorio de cada reino con pincel o cubo y gestiona naciones, provincias y territorios en disputa.",
		puntos: [
			"Pincel, Cubo y Borrar; aguas territoriales opcionales.",
			"Añadir, renombrar, colorear, fusionar y eliminar reinos y provincias.",
			"Porcentaje del mapa de cada reino y provincia.",
			"Fronteras automáticas desde tus capitales (Voronoi geodésico).",
			"Territorios en disputa: franjas de los reinos que los reclaman y su % aparte.",
		],
	},
	{
		id: "limites", nombre: "Trazar límites", tecla: "F", icono: "tool_border", etapa: 2,
		capturas: ["limites", "limite-borrar"],
		texto: "Fronteras dibujadas a mano en estilo pixel art: continua (nacional), punteada (provincial) o discontinua (disputada).",
		puntos: [
			"Color, grosor y suavizado.",
			"Patrones propios desde la carpeta de assets.",
			"Visibles en las dos etapas.",
			"El límite bajo el cursor se resalta en rojo: clic derecho y fuera.",
		],
	},
	{
		id: "asentamientos", nombre: "Ciudades y puntos de interés", tecla: "P", icono: "tool_markers", etapa: 2,
		capturas: ["asentamientos"],
		texto: "Capitales, ciudades, villas y puertos con su etiqueta enlazada, que les sigue al moverlos.",
		puntos: [
			"Una capital por reino.",
			"Nombres generados al azar o escritos a mano.",
			"Se ocultan al alejar la vista según su importancia.",
			"Clic derecho o Supr para borrar.",
		],
	},
	{
		id: "etiquetas", nombre: "Etiquetas", tecla: "E", icono: "tool_label", etapa: 3,
		capturas: ["etiquetas"],
		texto: "Topónimos con estilos rápidos (reino, mar, ciudad, región, accidente geográfico) y seis fuentes, incluida la pixel Grimorio Pixel.",
		puntos: [
			"Tamaño, espaciado, rotación y curvatura.",
			"Color, contorno, negrita, cursiva y MAYÚSCULAS.",
			"Arrástralas para moverlas.",
			"Clic derecho o Supr para borrar.",
		],
	},
	{
		id: "borrador", nombre: "Borrador", tecla: "X", icono: "tool_eraser", etapa: 3,
		capturas: ["borrador"],
		texto: "Borra todo lo que queda bajo el círculo: símbolos, ríos, etiquetas, asentamientos y límites. Antes de borrar, lo resalta en rojo.",
		puntos: [
			"Elige qué tipos de elemento borra.",
			"Vaciar capas enteras, con confirmación.",
			"Borrar todo menos el terreno.",
			"Cada trazo es una sola acción de Deshacer.",
		],
	},
	{
		id: "rejilla", nombre: "Rejilla y visor", tecla: "G", icono: "tool_grid", etapa: 3,
		capturas: ["rejilla", "vista-politica"],
		texto: "Rejilla cuadrada o hexagonal y los ajustes de la vista: terreno, agua y, en la Etapa 2, la vista política.",
		puntos: [
			"Tamaño de celda, grosor, color y desplazamiento.",
			"Incluir la rejilla en la exportación, o no.",
			"Sombreado de relieve y curvas de nivel.",
			"Opacidad política, grosor de frontera y ancho de las franjas en disputa.",
		],
	},
];

const NOMBRE_ETAPA = { 1: "Etapa 1 · Terreno", 2: "Etapa 2 · Geopolítica", 3: "Las dos etapas" };

function crear(etiqueta, atributos = {}, hijos = []) {
	const el = document.createElement(etiqueta);
	for (const [clave, valor] of Object.entries(atributos)) {
		if (clave === "texto") el.textContent = valor;
		else el.setAttribute(clave, valor);
	}
	for (const hijo of hijos) el.append(hijo);
	return el;
}

function iniciarHerramientas() {
	const inspector = document.getElementById("inspector");
	const ranuras = new Map();
	if (!inspector) return;

	for (const h of HERRAMIENTAS) {
		const grupo = document.querySelector(`.inventario[data-etapa="${h.etapa}"]`);
		const ranura = crear("button", {
			class: "ranura", type: "button", "aria-pressed": "false",
			"aria-label": `${h.nombre} (tecla ${h.tecla})`, title: `${h.nombre} (${h.tecla})`,
		}, [
			crear("img", { src: `${UI}${h.icono}.png`, width: "36", height: "36", alt: "" }),
			crear("span", { class: "tecla", "aria-hidden": "true", texto: h.tecla }),
		]);
		ranura.addEventListener("click", () => seleccionar(h.id));
		grupo.append(ranura);
		ranuras.set(h.id, ranura);
	}

	function seleccionar(id) {
		const h = HERRAMIENTAS.find((x) => x.id === id);
		if (!h) return;
		for (const [clave, ranura] of ranuras) ranura.setAttribute("aria-pressed", String(clave === id));
		const capturas = crear("div", { class: "capturas-herramienta" });
		h.capturas.forEach((nombre, i) => {
			const boton = crear("button", {
				class: "miniatura captura-herramienta", type: "button",
				"aria-label": `Ver en grande: ${h.nombre}`,
			}, [crear("img", {
				src: `${CAPTURAS}${nombre}.webp`, alt: `${h.nombre} en el editor`, loading: "lazy",
				width: "1600", height: "900",
			})]);
			boton.addEventListener("click", () => abrirVisor(
				h.capturas.map((n) => ({ src: `${CAPTURAS}${n}.webp`, titulo: h.nombre, alt: `${h.nombre} en el editor` })), i));
			capturas.append(boton);
		});
		inspector.replaceChildren(
			crear("div", { class: "cabecera" }, [
				crear("span", { class: "icono" }, [crear("img", { src: `${UI}${h.icono}.png`, width: "36", height: "36", alt: "" })]),
				crear("div", {}, [
					crear("h3", { texto: h.nombre }),
					crear("span", { class: "etapa", texto: `${NOMBRE_ETAPA[h.etapa]} · tecla ` }, [crear("kbd", { texto: h.tecla })]),
				]),
			]),
			crear("div", { class: "separador" }),
			crear("p", { texto: h.texto }),
			crear("ul", { class: "vinetas" }, h.puntos.map((p) => crear("li", { texto: p }))),
			capturas,
		);
	}

	seleccionar(HERRAMIENTAS[0].id);

	// Como en el editor: la tecla de cada herramienta la selecciona (mientras se ve la sección).
	let seccionVisible = false;
	const seccion = document.getElementById("herramientas");
	new IntersectionObserver((entradas) => {
		seccionVisible = entradas[0].isIntersecting;
	}, { threshold: 0.25 }).observe(seccion);
	document.addEventListener("keydown", (e) => {
		if (!seccionVisible || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
		if (document.querySelector("dialog[open]")) return;
		const h = HERRAMIENTAS.find((x) => x.tecla === e.key.toUpperCase());
		if (h) {
			seleccionar(h.id);
			ranuras.get(h.id).focus({ preventScroll: true });
		}
	});
}

/* --- Pestañas de etapa ----------------------------------------------------------------- */

function iniciarPestanas() {
	const pestanas = [...document.querySelectorAll('.pestanas [role="tab"]')];
	const activar = (pestana, enfocar) => {
		for (const p of pestanas) {
			const activa = p === pestana;
			p.setAttribute("aria-selected", String(activa));
			p.tabIndex = activa ? 0 : -1;
			document.getElementById(p.getAttribute("aria-controls")).hidden = !activa;
		}
		if (enfocar) pestana.focus();
	};
	pestanas.forEach((p, i) => {
		p.addEventListener("click", () => activar(p, false));
		p.addEventListener("keydown", (e) => {
			if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
				const paso = e.key === "ArrowRight" ? 1 : -1;
				activar(pestanas[(i + paso + pestanas.length) % pestanas.length], true);
			}
		});
	});
}

/* --- Visor de capturas ------------------------------------------------------------------- */

let lista = [];
let indice = 0;

function mostrar() {
	const item = lista[indice];
	document.getElementById("visor-imagen").src = item.src;
	document.getElementById("visor-imagen").alt = item.alt || item.titulo;
	document.getElementById("visor-titulo").textContent = item.titulo;
	document.getElementById("visor-contador").textContent = `${indice + 1} / ${lista.length}`;
	for (const b of document.querySelectorAll("#visor [data-paso]")) b.hidden = lista.length < 2;
	document.getElementById("visor-contador").hidden = lista.length < 2;
}

function abrirVisor(elementos, i) {
	const visor = document.getElementById("visor");
	lista = elementos;
	indice = i;
	mostrar();
	if (!visor.open) visor.showModal();
}

function iniciarVisor() {
	const visor = document.getElementById("visor");
	if (!visor) return;
	const miniaturas = [...document.querySelectorAll("#galeria-lista .miniatura")];
	const elementos = miniaturas.map((m) => ({
		src: m.dataset.grande, titulo: m.dataset.titulo, alt: m.querySelector("img").alt,
	}));
	miniaturas.forEach((m, i) => m.addEventListener("click", () => abrirVisor(elementos, i)));
	const mover = (paso) => {
		indice = (indice + paso + lista.length) % lista.length;
		mostrar();
	};
	for (const b of visor.querySelectorAll("[data-paso]")) b.addEventListener("click", () => mover(Number(b.dataset.paso)));
	visor.querySelector("[data-cerrar]").addEventListener("click", () => visor.close());
	// Clic fuera de la ventana: cerrar.
	visor.addEventListener("click", (e) => {
		if (e.target === visor) visor.close();
	});
	visor.addEventListener("keydown", (e) => {
		if (e.key === "ArrowRight") mover(1);
		if (e.key === "ArrowLeft") mover(-1);
	});
}

/* --- Menú con la sección actual y aparición escalonada ---------------------------------------- */

function iniciarMenu() {
	const enlaces = new Map([...document.querySelectorAll(".menu a")].map((a) => [a.getAttribute("href").slice(1), a]));
	const observador = new IntersectionObserver((entradas) => {
		for (const e of entradas) {
			if (!e.isIntersecting) continue;
			for (const a of enlaces.values()) a.classList.remove("activo");
			enlaces.get(e.target.id)?.classList.add("activo");
		}
	}, { rootMargin: "-45% 0px -50% 0px" });
	for (const id of enlaces.keys()) {
		const seccion = document.getElementById(id);
		if (seccion) observador.observe(seccion);
	}
}

function iniciarRevelado() {
	const elementos = document.querySelectorAll(".revelar");
	if (!MOVIMIENTO || !("IntersectionObserver" in window)) {
		elementos.forEach((el) => el.classList.add("visible"));
		return;
	}
	const observador = new IntersectionObserver((entradas) => {
		for (const e of entradas) {
			if (e.isIntersecting) {
				e.target.classList.add("visible");
				observador.unobserve(e.target);
			}
		}
	}, { rootMargin: "0px 0px -8% 0px" });
	elementos.forEach((el) => observador.observe(el));
}

/* --- Fondo animado de la portada (MenuBackground) ------------------------------------------ */

function iniciarFondo() {
	const canvas = document.getElementById("fondo-mapa");
	const F = window.FONDO;
	if (!canvas || !F) return;
	const ctx = canvas.getContext("2d");
	const nombres = ["fondo-mapa", "ship", "serpent", "tentacle", "cloud0", "cloud1", "cloud2", "compass"];
	const img = {};
	let pendientes = nombres.length;
	for (const n of nombres) {
		img[n] = new Image();
		img[n].onload = () => {
			if (--pendientes === 0) empezar();
		};
		img[n].src = `${ARTE}${n}.png`;
	}

	const azar = (a, b) => a + Math.random() * (b - a);
	const celda = (x, y) => {
		if (x < 0 || y < 0 || x >= F.ancho || y >= F.alto) return "2";
		return F.agua[Math.floor(y / F.paso) * F.columnas + Math.floor(x / F.paso)] || "2";
	};
	const esAgua = (x, y) => celda(x, y) !== "2";
	const aguaAlAzar = () => {
		for (let i = 0; i < 400; i++) {
			const x = azar(20, F.ancho - 20);
			const y = azar(20, F.alto - 20);
			if (esAgua(x, y)) return [Math.floor(x), Math.floor(y)];
		}
		return [F.ancho / 2, F.alto / 2];
	};
	const direccion = () => {
		const a = Math.random() * Math.PI * 2;
		return [Math.cos(a), Math.sin(a)];
	};

	const barcos = F.barcos.map(([x, y]) => ({ x, y, dir: direccion(), vel: azar(3, 5.5), fase: azar(0, 2) }));
	const serpientes = F.serpientes.map(([x, y]) => ({ x, y, dir: direccion(), fase: azar(0, 10) }));
	const kraken = { x: F.kraken[0], y: F.kraken[1], fase: azar(0, 10) };
	const nubes = Array.from({ length: 6 }, (_, i) => ({
		x: azar(0, F.ancho * 1.6), y: azar(0, F.alto), vel: azar(2, 4.5), tex: `cloud${i % 3}`,
	}));
	const destellos = [];
	let t = 0;
	let escala = 3;
	let anterior = 0;
	let activo = true;

	function ajustar() {
		const dpr = Math.max(1, Math.round(window.devicePixelRatio || 1));
		canvas.width = Math.round(canvas.clientWidth * dpr);
		canvas.height = Math.round(canvas.clientHeight * dpr);
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
		ctx.imageSmoothingEnabled = false;
		// Escala entera de arte (x3 como en la app) que cubra siempre toda la portada.
		escala = Math.max(3, Math.ceil(canvas.clientWidth / (F.ancho - 40)), Math.ceil(canvas.clientHeight / (F.alto - 40)));
	}

	function actualizar(dt) {
		t += dt;
		for (const b of barcos) {
			const delante = [b.x + b.dir[0] * 8, b.y + b.dir[1] * 8];
			if (!esAgua(delante[0], delante[1])) {
				const giro = azar(60, 140) * (Math.random() < 0.5 ? 1 : -1) * Math.PI / 180;
				const [dx, dy] = b.dir;
				b.dir = [dx * Math.cos(giro) - dy * Math.sin(giro), dx * Math.sin(giro) + dy * Math.cos(giro)];
				continue;
			}
			b.x += b.dir[0] * b.vel * dt;
			b.y += b.dir[1] * b.vel * dt;
		}
		for (const s of serpientes) {
			if (celda(s.x + s.dir[0] * 12, s.y + s.dir[1] * 12) !== "0") {
				const giro = azar(-0.6, 0.6);
				const [dx, dy] = [-s.dir[0], -s.dir[1]];
				s.dir = [dx * Math.cos(giro) - dy * Math.sin(giro), dx * Math.sin(giro) + dy * Math.cos(giro)];
			} else {
				s.x += s.dir[0] * 1.6 * dt;
				s.y += s.dir[1] * 1.6 * dt;
			}
		}
		for (let i = destellos.length - 1; i >= 0; i--) {
			destellos[i].vida -= dt;
			if (destellos[i].vida <= 0) destellos.splice(i, 1);
		}
		while (destellos.length < 36) {
			const [x, y] = aguaAlAzar();
			destellos.push({ x, y, vida: azar(0.3, 1.2) });
		}
		for (const n of nubes) n.x += n.vel * dt;
	}

	// Sprite anclado por el centro de su base, en coordenadas de arte del mapa.
	function sprite(imagen, origen, x, y, voltear) {
		const s = escala;
		const w = imagen.width;
		const h = imagen.height;
		const px = origen[0] + Math.floor(x - w / 2) * s;
		const py = origen[1] + Math.floor(y - h) * s;
		if (voltear) {
			ctx.save();
			ctx.translate(px + w * s, py);
			ctx.scale(-1, 1);
			ctx.drawImage(imagen, 0, 0, w * s, h * s);
			ctx.restore();
		} else {
			ctx.drawImage(imagen, px, py, w * s, h * s);
		}
	}

	function dibujar() {
		const W = canvas.clientWidth;
		const H = canvas.clientHeight;
		const s = escala;
		ctx.fillStyle = "#1c130d";
		ctx.fillRect(0, 0, W, H);
		const maxX = Math.max(F.ancho - W / s - 4, 0);
		const maxY = Math.max(F.alto - H / s - 4, 0);
		const off = [
			(Math.sin(t * 0.045) * 0.5 + 0.5) * maxX + 2,
			(Math.sin(t * 0.031 + 1.3) * 0.5 + 0.5) * maxY + 2,
		];
		const origen = [Math.round(-off[0] * s), Math.round(-off[1] * s)];
		ctx.drawImage(img["fondo-mapa"], origen[0], origen[1], F.ancho * s, F.alto * s);

		for (const d of destellos) {
			const px = origen[0] + d.x * s;
			const py = origen[1] + d.y * s;
			ctx.fillStyle = d.vida % 0.4 > 0.2 ? "#f4eeda" : "#73a5a8";
			ctx.fillRect(px, py, s, s);
			if (d.vida > 0.6) {
				ctx.fillStyle = "#73a5a8";
				for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) ctx.fillRect(px + dx * s, py + dy * s, s, s);
			}
		}

		if ((t + kraken.fase) % 14 < 9) {
			for (let i = 0; i < 3; i++) {
				const ola = (t * 2 + i * 0.7) % 1 > 0.5 ? 1 : 0;
				sprite(img.tentacle, origen, kraken.x + i * 7 - 7, kraken.y - ola - (i % 2) * 2, i === 1);
			}
		}
		for (const serp of serpientes) {
			if ((t + serp.fase) % 12 > 8.5) continue;
			const vaiven = (t * 1.5 + serp.fase) % 1 > 0.5 ? 1 : 0;
			sprite(img.serpent, origen, serp.x, serp.y + vaiven, serp.dir[0] > 0);
		}
		for (const b of barcos) {
			const vaiven = (t + b.fase) % 1.2 > 0.6 ? 1 : 0;
			sprite(img.ship, origen, b.x, b.y + vaiven, b.dir[0] < 0);
		}

		// Nubes en paralaje (1,6 veces más rápidas que el mapa).
		const vuelta = F.ancho * 1.6 + 60;
		ctx.globalAlpha = 0.8;
		for (const n of nubes) {
			const tex = img[n.tex];
			const x = ((((n.x - off[0] * 1.6) % vuelta) + vuelta) % vuelta) - 40;
			const y = n.y - off[1] * 1.6 * 0.5;
			ctx.drawImage(tex, Math.round(x * s), Math.round(y * s), tex.width * s, tex.height * s);
		}
		ctx.globalAlpha = 1;

		// Rosa de los vientos (en pantallas estrechas taparía la placa de la versión).
		const rosa = img.compass;
		if (W >= 700) ctx.drawImage(rosa, W - rosa.width * s - 24, H - rosa.height * s - 24, rosa.width * s, rosa.height * s);
		// Viñeta escalonada.
		ctx.fillStyle = "rgba(28, 19, 13, 0.22)";
		for (let banda = 1; banda <= 4; banda++) {
			const g = banda * s * 3;
			ctx.fillRect(0, 0, W, g);
			ctx.fillRect(0, H - g, W, g);
			ctx.fillRect(0, 0, g, H);
			ctx.fillRect(W - g, 0, g, H);
		}
	}

	let corriendo = false;

	function arrancar() {
		if (corriendo || !activo || document.hidden) return;
		corriendo = true;
		anterior = 0;
		requestAnimationFrame(bucle);
	}

	function bucle(ahora) {
		if (!activo || document.hidden) {
			corriendo = false;
			return;
		}
		const dt = anterior ? Math.min((ahora - anterior) / 1000, 0.1) : 0;
		anterior = ahora;
		actualizar(dt);
		dibujar();
		requestAnimationFrame(bucle);
	}

	function empezar() {
		ajustar();
		actualizar(0);
		dibujar();
		window.addEventListener("resize", () => {
			ajustar();
			dibujar();
		});
		if (!MOVIMIENTO) return;
		// Se detiene si la portada no se ve o la pestaña está oculta.
		new IntersectionObserver((entradas) => {
			activo = entradas[0].isIntersecting;
			arrancar();
		}).observe(canvas);
		document.addEventListener("visibilitychange", arrancar);
		arrancar();
	}
}

iniciarFondo();
iniciarHerramientas();
iniciarPestanas();
iniciarVisor();
iniciarMenu();
iniciarRevelado();
