# Chunksforge · web de presentación

Web estática (HTML + CSS + JavaScript, sin dependencias ni compilación) que presenta Chunksforge:

- qué es y para qué sirve;
- sus dos etapas;
- las herramientas, en un inventario interactivo con inspector;
- las facilidades y qué lo diferencia de otras herramientas;
- una galería de mapas y capturas reales.

Usa el mismo estilo visual que el programa:

- la paleta de 31 colores;
- la fuente bitmap «Grimorio Pixel» convertida a TrueType;
- los paneles 9-slice de madera, pergamino y oro, y los cursores de guantelete;
- el mapa animado del menú principal como portada.

## Verla

- Abre `index.html` en el navegador, o
- sírvela en local con Node 18 o superior:

```bash
node servidor.mjs
```

y entra en http://localhost:8080.

## Estructura

```
index.html            la página principal (por secciones, con el precio)
terminos.html         Términos del Servicio (software de escritorio digital, 16 USD pago único)
privacidad.html       Política de Privacidad
css/estilos.css       paleta y componentes 9-slice
css/generado.css      fuente y máscara del rótulo incrustadas (generado; así funciona también con file://)
js/main.js            fondo animado, inventario de herramientas, pestañas, visor y menú
js/fondo.js           mapa del menú: tamaño, máscara de agua y actores (generado)
assets/arte/          rótulo CHUNKSFORGE, mapa del menú y sprites (generados)
assets/fuentes/       grimorio-pixel.ttf (generada)
assets/ui/            sprites de la interfaz del programa (copiados)
assets/capturas/      capturas del programa en WebP (generadas)
servidor.mjs          servidor estático mínimo
```

## Regenerar los recursos

Todo lo marcado como «generado» o «copiado» sale del propio proyecto de Godot (`../mapa`), con la herramienta `tools/WebAssets.tscn`. Necesita ventana, no `--headless`:

```bash
godot --path ../mapa res://tools/WebAssets.tscn -- --web=<ruta de esta carpeta> --capturas=<carpeta de capturas>[;<otra carpeta>]
```

Las capturas se obtienen con las pruebas del proyecto:

```bash
godot --path ../mapa res://tests/UIShots.tscn -- --out=<carpeta>
```

```bash
godot --path ../mapa res://tests/SmokeTest.tscn -- --out=<carpeta>
```

La lista de capturas que se convierten está en `SCREENSHOTS`, dentro de `tools/export_web_assets.gd`.
