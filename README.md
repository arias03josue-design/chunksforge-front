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

## Idiomas (español / inglés)

- Todas las páginas tienen el selector **ES / EN** en la barra superior. La elección se guarda en el navegador.
- También se puede forzar con `?lang=es` o `?lang=en` en la URL. Sin elección previa, se usa el idioma del navegador.
- Cada texto está dos veces en el HTML, con `lang="es"` y `lang="en"`, y el CSS sólo muestra el idioma activo. Sin JavaScript se ve el español.
- Los atributos traducibles (`alt`, `title`, `aria-label`...) llevan la versión inglesa en `data-en-<atributo>`.
- Los textos generados por JavaScript (el inventario de herramientas) están en `js/main.js` como `{ es, en }`.
- Los textos legales vienen de los `.txt` (en inglés). Cada página legal muestra el original en inglés o su traducción al español, según el idioma elegido.

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
eula.html             Acuerdo de Licencia de Usuario Final (de eula.txt)
terms.html            Términos del Servicio (de termsofservice.txt)
privacy.html          Política de Privacidad (de PrivacyPolicy.txt)
*.txt                 textos legales originales, en inglés; las páginas incluyen además la traducción al español
js/idioma.js          selector de idioma español / inglés (se carga en el <head> de todas las páginas)
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
