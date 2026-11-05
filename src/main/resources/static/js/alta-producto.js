
const formularioProducto = document.getElementById("formularioProducto");
const categoriaProducto = document.getElementById("categoriaProducto");
const estadoRegistro = document.getElementById("estadoRegistro");
const botonGuardar = document.getElementById("botonGuardar");

async function cargarCategoriasFormulario() {
    try {
        const respuesta = await fetch("/sketchcoffee/categorias");
        if (!respuesta.ok) {
            throw new Error("HTTP " + respuesta.status);
        }

        const categorias = await respuesta.json();
        if (!Array.isArray(categorias)) {
            throw new Error("La API de categorías no devolvió una lista");
        }

        for (let i = 0; i < categorias.length; i++) {
            const opcion = document.createElement("option");
            opcion.value = categorias[i].id;
            opcion.textContent = categorias[i].nombre;
            categoriaProducto.appendChild(opcion);
        }
    } catch (error) {
        console.error("Error cargando categorías:", error);
        estadoRegistro.textContent = "No se pudieron obtener las categorías. Revisa la conexión con el servidor.";
        botonGuardar.disabled = true;
    }
}

async function registrarProducto(evento) {
    evento.preventDefault();

    const sku = document.getElementById("skuProducto").value.trim();
    const nombre = document.getElementById("nombreProducto").value.trim();
    const descripcion = document.getElementById("descripcionProducto").value.trim();
    const precioTexto = document.getElementById("precioProducto").value;
    const precio = Number(precioTexto);
    const imagen = document.getElementById("imagenProducto").value.trim();
    const existenciasTexto = document.getElementById("existenciasProducto").value;
    const existencias = Number(existenciasTexto);
    const categoriaId = Number(categoriaProducto.value);
    const activo = document.getElementById("activoProducto").checked;

    if (sku === "" || nombre === "" || precioTexto === "" ||
            !Number.isFinite(precio) || precio < 0 || precio > 99999999.99 ||
            existenciasTexto === "" || !Number.isInteger(existencias) || existencias < 0 ||
            categoriaProducto.value === "" || !Number.isInteger(categoriaId) || categoriaId <= 0) {
        estadoRegistro.textContent = "Revisa SKU, nombre, precio, existencias y categoría.";
        return;
    }

    // Campos obligatorios y opcionales exactamente como los espera ProductoRequest.java.
    const datosProducto = {
        sku: sku,
        nombre: nombre,
        descripcion: descripcion,
        precio: precio,
        imagen: imagen === "" ? null : imagen,
        existencias: existencias,
        activo: activo,
        categoriaId: categoriaId
    };

    estadoRegistro.textContent = "Guardando producto...";
    botonGuardar.disabled = true;

    try {
        const respuesta = await fetch("/sketchcoffee/productos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(datosProducto)
        });

        // Los errores 400/404/409 del controlador incluyen {"mensaje": "..."}.
        const resultado = await respuesta.json();
        if (respuesta.status === 201) {
            estadoRegistro.textContent = "Producto creado correctamente. ID: " + resultado.id;
            formularioProducto.reset();
        } else if (respuesta.status === 400) {
            estadoRegistro.textContent = "Datos incorrectos: " + (resultado.mensaje || "Revisa el formulario");
        } else if (respuesta.status === 404) {
            estadoRegistro.textContent = "Categoría no encontrada: " + (resultado.mensaje || "");
        } else if (respuesta.status === 409) {
            estadoRegistro.textContent = "SKU duplicado: " + (resultado.mensaje || "");
        } else {
            estadoRegistro.textContent = "No se pudo guardar. Código HTTP: " + respuesta.status;
        }
    } catch (error) {
        console.error("Error al registrar producto:", error);
        estadoRegistro.textContent = "No se pudo conectar o interpretar la respuesta del servidor.";
    } finally {
        botonGuardar.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", cargarCategoriasFormulario);
formularioProducto.addEventListener("submit", registrarProducto);
