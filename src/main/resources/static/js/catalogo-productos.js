
const rutaProductos = "/sketchcoffee/productos";
const rutaCategorias = "/sketchcoffee/categorias";

const listaProductos = document.getElementById("listaProductos");
const estadoCatalogo = document.getElementById("estadoCatalogo");
const categoriaFiltro = document.getElementById("categoriaFiltro");
const botonActualizar = document.getElementById("botonActualizar");

async function cargarCategorias() {
    try {
        const respuesta = await fetch(rutaCategorias);
        if (!respuesta.ok) {
            throw new Error("HTTP " + respuesta.status);
        }

        const categorias = await respuesta.json();
        if (!Array.isArray(categorias)) {
            throw new Error("La respuesta de categorías no es una lista");
        }

        for (let i = 0; i < categorias.length; i++) {
            const categoria = categorias[i];
            const opcion = document.createElement("option");
            opcion.value = categoria.id;
            opcion.textContent = categoria.nombre;
            categoriaFiltro.appendChild(opcion);
        }
    } catch (error) {
        console.error("No se pudieron consultar las categorías:", error);
        // El catálogo completo puede funcionar aunque falle el filtro.
        categoriaFiltro.disabled = true;
    }
}

function obtenerImagenSegura(ruta) {
    if (typeof ruta !== "string") {
        return "";
    }

    const imagen = ruta.trim();
    if (imagen.startsWith("https://") || imagen.startsWith("http://") || imagen.startsWith("/img/")) {
        return imagen;
    }
    return "";
}

function crearTarjeta(producto) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta-producto";

    const espacioImagen = document.createElement("div");
    espacioImagen.className = "imagen-producto";
    const rutaImagen = obtenerImagenSegura(producto.imagen);

    if (rutaImagen !== "") {
        const imagen = document.createElement("img");
        imagen.src = rutaImagen;
        imagen.alt = "Imagen de " + producto.nombre;
        imagen.loading = "lazy";
        espacioImagen.appendChild(imagen);
    } else {
        const marcador = document.createElement("span");
        marcador.textContent = "Sketch & Coffee";
        espacioImagen.appendChild(marcador);
    }

    const contenido = document.createElement("div");
    contenido.className = "contenido-tarjeta";

    const categoria = document.createElement("p");
    categoria.className = "etiqueta";
    categoria.textContent = producto.categoria && producto.categoria.nombre
        ? producto.categoria.nombre : "Sin categoría";

    const nombre = document.createElement("h3");
    nombre.textContent = producto.nombre;

    const descripcion = document.createElement("p");
    descripcion.textContent = producto.descripcion || "";

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = Number(producto.precio).toLocaleString("es-MX", {
        style: "currency", currency: "MXN"
    });

    const existencias = document.createElement("p");
    existencias.className = "detalle";
    existencias.textContent = Number(producto.existencias) > 0
        ? "Disponibles: " + producto.existencias : "Sin existencias";

    contenido.appendChild(categoria);
    contenido.appendChild(nombre);
    contenido.appendChild(descripcion);
    contenido.appendChild(precio);
    contenido.appendChild(existencias);
    tarjeta.appendChild(espacioImagen);
    tarjeta.appendChild(contenido);
    return tarjeta;
}

async function cargarProductos() {
    const categoriaId = categoriaFiltro.value;
    let ruta = rutaProductos;

    if (categoriaId !== "") {
        ruta = rutaProductos + "/categoria/" + encodeURIComponent(categoriaId);
    }

    estadoCatalogo.textContent = "Cargando productos...";
    listaProductos.replaceChildren();

    try {
        const respuesta = await fetch(ruta);
        if (!respuesta.ok) {
            throw new Error("HTTP " + respuesta.status);
        }

        const productos = await respuesta.json();
        if (!Array.isArray(productos)) {
            throw new Error("La API no devolvió una lista de productos");
        }

        let visibles = 0;
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];
            // En el catálogo público no mostramos productos desactivados.
            if (producto.activo === false) {
                continue;
            }
            listaProductos.appendChild(crearTarjeta(producto));
            visibles++;
        }

        estadoCatalogo.textContent = visibles === 0
            ? "Todavía no hay productos disponibles."
            : "Productos encontrados: " + visibles;
    } catch (error) {
        console.error("Error consultando los productos:", error);
        estadoCatalogo.textContent = "No se pudo consultar el catálogo. Revisa que Spring Boot y MySQL estén funcionando.";
    }
}

categoriaFiltro.addEventListener("change", cargarProductos);
botonActualizar.addEventListener("click", cargarProductos);
document.addEventListener("DOMContentLoaded", async function () {
    await cargarCategorias();
    await cargarProductos();
});
