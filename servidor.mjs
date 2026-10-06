// Servidor estático mínimo para previsualizar la web (sin dependencias):
//   node servidor.mjs [puerto]
// La web también funciona abriendo index.html directamente en el navegador.
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const RAIZ = dirname(fileURLToPath(import.meta.url));
const PUERTO = Number(process.argv[2] || process.env.PORT || 8080);
const TIPOS = {
	".html": "text/html; charset=utf-8",
	".css": "text/css; charset=utf-8",
	".js": "text/javascript; charset=utf-8",
	".png": "image/png",
	".webp": "image/webp",
	".ttf": "font/ttf",
	".svg": "image/svg+xml",
	".json": "application/json; charset=utf-8",
};

createServer(async (peticion, respuesta) => {
	try {
		const ruta = decodeURIComponent(new URL(peticion.url, "http://localhost").pathname);
		let archivo = normalize(join(RAIZ, ruta));
		if (!archivo.startsWith(RAIZ)) throw new Error("fuera de la raíz");
		if ((await stat(archivo)).isDirectory()) archivo = join(archivo, "index.html");
		const datos = await readFile(archivo);
		respuesta.writeHead(200, { "Content-Type": TIPOS[extname(archivo).toLowerCase()] || "application/octet-stream" });
		respuesta.end(datos);
	} catch {
		respuesta.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
		respuesta.end("No encontrado");
	}
}).listen(PUERTO, () => {
	console.log(`Chunksforge · web en http://localhost:${PUERTO}`);
});
