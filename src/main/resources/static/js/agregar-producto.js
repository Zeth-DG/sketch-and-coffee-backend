import {
    validarNombreProducto,
    validarDescripcionProducto,
    validarPrecioProducto,
    validarCategoriaProducto
} from './validaciones.js';

document.addEventListener('DOMContentLoaded', async () => {
    let usuarioSesion = null;
    try {
        usuarioSesion = JSON.parse(localStorage.getItem('app_authenticated_user') || 'null');
    } catch (error) {
        console.error('No se pudo leer la sesión:', error);
        window.location.replace('inicio-sesion.html');
        return;
    }

    // La base guarda el rol como ENUM('cliente','admin'), no 'administrador'
    if (!usuarioSesion || usuarioSesion.rol?.toLowerCase() !== 'admin') {
        window.location.replace('inicio-sesion.html');
        return;
    }

    const formulario = document.getElementById('formulario-producto');
    const entradaImagen = document.getElementById('imagen');
    const vistaPreviaImagen = document.getElementById('preview-imagen');
    const contenedorProductos = document.getElementById('contenedor-lista-productos');
    const mensajeResultado = document.getElementById('mensaje-producto');
    const imagenPredeterminada = vistaPreviaImagen.src;
    let imagenSeleccionada = '';

    const botonGuardar = document.getElementById('btn-guardar');
    const textoGuardarOriginal = botonGuardar.textContent;
    /** Id del producto en edicion (null = modo creacion). */
    let productoEditandoId = null;
    /** Referencia del producto que se esta editando (respuesta de la API). */
    let productoEnEdicion = null;

    // ------------------------------------------------------------------
    // Conexión con la API de productos: crear por POST, listar por GET
    // y eliminar por DELETE contra el backend de Spring Boot.
    // ------------------------------------------------------------------

    /** Respaldo con los ids del script base_datos.sql si el GET falla. */
    const categoriasDeRespaldo = [
        { id: 1, nombre: 'Bebidas frías' },
        { id: 2, nombre: 'Bebidas calientes' },
        { id: 3, nombre: 'Postres' },
        { id: 4, nombre: 'Platillos' },
        { id: 5, nombre: 'Café en grano' }
    ];

    let catalogoCategorias = [];

    async function cargarCategorias() {
        try {
            const respuesta = await fetch('/sketchcoffee/categorias');
            if (respuesta.ok) {
                catalogoCategorias = await respuesta.json();
            } else {
                console.warn('No se pudieron cargar las categorías del backend, se usan los ids por defecto.');
                catalogoCategorias = categoriasDeRespaldo;
            }
        } catch (error) {
            console.warn('Error de red al cargar las categorías, se usan los ids por defecto:', error);
            catalogoCategorias = categoriasDeRespaldo;
        }
    }

    /** El select guarda el nombre; el backend pide el id numérico. */
    function idDeCategoria(nombreCategoria) {
        const encontrada = catalogoCategorias.find(
            (cat) => cat.nombre.toLowerCase() === nombreCategoria.trim().toLowerCase()
        );
        return encontrada ? encontrada.id : null;
    }

    // ------------------------------------------------------------------
    // Modo edición y subida de imágenes
    // ------------------------------------------------------------------

    function activarModoEdicion(producto) {
        productoEditandoId = producto.id;
        productoEnEdicion = producto;
        document.getElementById('nombre').value = producto.nombre ?? '';
        document.getElementById('descripcion').value = producto.descripcion ?? '';
        document.getElementById('precio').value = producto.precio ?? '';
        document.getElementById('categoria').value = producto.categoria?.nombre ?? '';
        // Sin archivo nuevo seleccionado, se conserva la imagen actual.
        imagenSeleccionada = '';
        entradaImagen.value = '';
        vistaPreviaImagen.src = imagenDePrevisualizacion();
        botonGuardar.textContent = 'Guardar cambios';
        mostrarResultado(`Editando "${producto.nombre}". Modifica los campos y guarda los cambios.`);
        formulario.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function salirModoEdicion() {
        if (productoEditandoId === null) {
            return;
        }
        productoEditandoId = null;
        productoEnEdicion = null;
        botonGuardar.textContent = textoGuardarOriginal;
    }

    /** Imagen del preview: la base64 local (leída del archivo) o la del producto en edición. */
    function imagenDePrevisualizacion() {
        if (imagenSeleccionada) {
            return imagenSeleccionada;
        }
        return productoEnEdicion?.imagen || imagenPredeterminada;
    }

    /**
     * Sube el archivo seleccionado al backend (POST multipart) y devuelve
     * la ruta servida por /subidas/... (p. ej. "subidas/xxxxx.jpg").
     * Devuelve null si no hay archivo; lanza (con el mensaje ya mostrado
     * en pantalla) si la subida falla.
     */
    async function subirImagenSeleccionada() {
        const archivo = entradaImagen.files[0];
        if (!archivo) {
            return null;
        }

        if (!archivo.type.startsWith('image/')) {
            mostrarResultado('Selecciona un archivo de imagen válido.', false);
            throw new Error('formato de imagen no permitido');
        }
        // Tope propio de 1 MB: quedarse por debajo del default de multipart
        // de Spring (1 MB) evita un 500/413 desde el server si la propiedad
        // de configuración no aplica en esta version de Spring Boot.
        if (archivo.size > 1000000) {
            mostrarResultado('La imagen debe pesar menos de 1 MB.', false);
            throw new Error('archivo demasiado pesado');
        }

        const datosFormulario = new FormData();
        datosFormulario.append('archivo', archivo);

        const respuesta = await fetch('/sketchcoffee/imagenes', {
            method: 'POST',
            body: datosFormulario
        });

        if (respuesta.status === 201) {
            const cuerpo = await respuesta.json();
            return cuerpo.ruta;
        }

        let mensaje = `El servidor rechazó la imagen (estado ${respuesta.status}).`;
        try {
            const cuerpoError = await respuesta.json();
            if (cuerpoError && cuerpoError.mensaje) {
                mensaje = cuerpoError.mensaje;
            }
        } catch (errorJson) {
            // Respuesta sin cuerpo JSON: se conserva el mensaje por estado.
        }
        mostrarResultado(mensaje, false);
        throw new Error('la subida de la imagen falló');
    }

    function mostrarResultado(mensaje, correcto = true) {
        mensajeResultado.textContent = mensaje;
        mensajeResultado.className = correcto ? 'alert alert-success' : 'alert alert-danger';
    }

    // Los productos ahora viven en la base de datos, no en LocalStorage.
    async function obtenerProductos() {
        const respuesta = await fetch('/sketchcoffee/productos');
        if (!respuesta.ok) {
            throw new Error('El backend respondió ' + respuesta.status + ' al listar productos.');
        }
        return respuesta.json();
    }

    function crearTarjetaProducto(producto) {
        const tarjeta = document.createElement('article');
        tarjeta.className = 'producto-item';

        if (producto.imagen) {
            const imagen = document.createElement('img');
            imagen.src = producto.imagen;
            imagen.alt = producto.nombre;
            tarjeta.appendChild(imagen);
        }

        const informacion = document.createElement('div');
        informacion.className = 'producto-info';

        const nombre = document.createElement('h3');
        nombre.textContent = producto.nombre;
        informacion.appendChild(nombre);

        const descripcion = document.createElement('p');
        descripcion.textContent = producto.descripcion;
        informacion.appendChild(descripcion);

        const categoria = document.createElement('p');
        // La API devuelve la categoría como objeto anidado { id, nombre, ... }
        const nombreCategoria = producto.categoria?.nombre
            ?? (typeof producto.categoria === 'string' ? producto.categoria : 'General');
        categoria.textContent = `Categoría: ${nombreCategoria}`;
        informacion.appendChild(categoria);

        const precio = document.createElement('p');
        precio.className = 'producto-precio';
        precio.textContent = `$${producto.precio.toFixed(2)} MXN`;
        informacion.appendChild(precio);

        const botonEditar = document.createElement('button');
        botonEditar.type = 'button';
        botonEditar.className = 'btn-guardar';
        botonEditar.textContent = 'Editar';
        botonEditar.addEventListener('click', () => activarModoEdicion(producto));
        informacion.appendChild(botonEditar);

        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn-cancelar';
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => eliminarProducto(producto.id));
        informacion.appendChild(botonEliminar);

        tarjeta.appendChild(informacion);
        return tarjeta;
    }

    async function mostrarProductos() {
        let productos;
        try {
            productos = await obtenerProductos();
        } catch (error) {
            console.error('No se pudieron cargar los productos del servidor:', error);
            contenedorProductos.replaceChildren();
            const mensajeError = document.createElement('p');
            mensajeError.className = 'mensaje-vacio';
            mensajeError.textContent = 'No se pudieron leer los productos del servidor. Verifica tu conexión y recarga la página.';
            contenedorProductos.appendChild(mensajeError);
            return;
        }

        contenedorProductos.replaceChildren();

        if (productos.length === 0) {
            const mensajeVacio = document.createElement('p');
            mensajeVacio.className = 'mensaje-vacio';
            mensajeVacio.textContent = 'Aún no hay productos en el menú. ¡Agrega el primero!';
            contenedorProductos.appendChild(mensajeVacio);
            return;
        }

        productos.forEach((producto) => {
            contenedorProductos.appendChild(crearTarjetaProducto(producto));
        });
    }

    async function eliminarProducto(id) {
        try {
            const respuesta = await fetch(`/sketchcoffee/productos/${id}`, { method: 'DELETE' });

            if (respuesta.status === 204) {
                mostrarResultado('Producto eliminado.');
                await mostrarProductos();
            } else if (respuesta.status === 404) {
                mostrarResultado('El producto ya no existe en el menú.', false);
                await mostrarProductos();
            } else if (respuesta.status === 409) {
                mostrarResultado('No se puede eliminar: el producto ya aparece en uno o más pedidos.', false);
            } else {
                mostrarResultado('No se pudo actualizar la lista de productos.', false);
            }
        } catch (error) {
            console.error('No se pudo eliminar el producto:', error);
            mostrarResultado('No se pudo conectar con el servidor para eliminar el producto.', false);
        }
    }

    function actualizarVistaPrevia() {
        document.getElementById('preview-nombre').textContent =
            document.getElementById('nombre').value.trim() || 'Nombre del producto';
        document.getElementById('preview-descripcion').textContent =
            document.getElementById('descripcion').value.trim() || 'Descripción del producto...';
        document.getElementById('preview-precio').textContent =
            `$${Number(document.getElementById('precio').value || 0).toFixed(2)}`;
        vistaPreviaImagen.src = imagenDePrevisualizacion();
    }

    function convertirImagen(archivo) {
        return new Promise((resolve, reject) => {
            const lector = new FileReader();
            lector.addEventListener('load', () => resolve(String(lector.result)));
            lector.addEventListener('error', () => reject(new Error('No se pudo leer la imagen.')));
            lector.readAsDataURL(archivo);
        });
    }

    ['nombre', 'descripcion', 'precio'].forEach((id) => {
        document.getElementById(id).addEventListener('input', actualizarVistaPrevia);
    });

    entradaImagen.addEventListener('change', () => {
        const archivo = entradaImagen.files[0];
        imagenSeleccionada = '';

        if (!archivo) {
            actualizarVistaPrevia();
            return;
        }
        if (!archivo.type.startsWith('image/')) {
            mostrarResultado('Selecciona un archivo de imagen válido.', false);
            entradaImagen.value = '';
            return;
        }
        if (archivo.size > 1000000) {
            mostrarResultado('La imagen debe pesar menos de 1 MB para subirse al servidor.', false);
            entradaImagen.value = '';
            return;
        }

        convertirImagen(archivo)
            .then((imagen) => {
                imagenSeleccionada = imagen;
                actualizarVistaPrevia();
            })
            .catch((error) => {
                console.error(error);
                mostrarResultado('No se pudo leer la imagen. Prueba con otro archivo.', false);
                entradaImagen.value = '';
            });
    });

    formulario.addEventListener('submit', async (evento) => {
        evento.preventDefault();

        const nombre = document.getElementById('nombre').value;
        const descripcion = document.getElementById('descripcion').value;
        const precio = document.getElementById('precio').value;
        const categoria = document.getElementById('categoria').value;

        const resultadoNombre = validarNombreProducto(nombre);
        const resultadoDescripcion = validarDescripcionProducto(descripcion);
        const resultadoPrecio = validarPrecioProducto(precio);
        const resultadoCategoria = validarCategoriaProducto(categoria);

        document.getElementById('error-nombre').textContent =
            resultadoNombre.valido ? '' : resultadoNombre.mensaje;
        document.getElementById('error-descripcion').textContent =
            resultadoDescripcion.valido ? '' : resultadoDescripcion.mensaje;
        document.getElementById('error-precio').textContent =
            resultadoPrecio.valido ? '' : resultadoPrecio.mensaje;
        document.getElementById('error-categoria').textContent =
            resultadoCategoria.valido ? '' : resultadoCategoria.mensaje;

        if (!resultadoNombre.valido || !resultadoDescripcion.valido ||
            !resultadoPrecio.valido || !resultadoCategoria.valido) {
            mostrarResultado('Revisa los campos marcados antes de guardar.', false);
            return;
        }

        // El select guarda el nombre de la categoría; el backend pide
        // el id numérico. Se resuelve antes que nada para no subir la
        // imagen si el guardado está condenado a fallar.
        const categoriaId = idDeCategoria(categoria);
        if (categoriaId === null) {
            mostrarResultado('No se encontró la categoría en la base de datos. Recarga la página e intenta de nuevo.', false);
            return;
        }

        // La imagen (si el usuario eligió una) se sube primero con multipart;
        // la ruta que devuelve el backend viaja después en el producto.
        let rutaImagen = null;
        try {
            rutaImagen = await subirImagenSeleccionada();
        } catch (error) {
            // El mensaje de error ya se mostró en pantalla: solo se corta.
            return;
        }

        const editando = productoEditandoId !== null;

        const cuerpo = {
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: Number(precio),
            categoriaId
        };
        if (editando) {
            // Los PUT del backend exigen sku (validar() lo pide) y
            // copiarDatos sobreescribe imagen/existencias/activo con lo
            // que llegue: se reenvian del producto tal como estan para
            // que el formulario (que no tiene esos campos) no borre datos.
            cuerpo.sku = productoEnEdicion.sku;
            cuerpo.imagen = rutaImagen ?? productoEnEdicion.imagen ?? null;
            cuerpo.existencias = productoEnEdicion.existencias ?? 0;
            cuerpo.activo = productoEnEdicion.activo ?? true;
        } else {
            // El backend exige sku (VARCHAR(30), obligatorio y único) y el
            // formulario no tiene ese campo: se genera uno automático.
            cuerpo.sku = `SC-${Date.now()}`;
            if (rutaImagen) {
                cuerpo.imagen = rutaImagen;
            }
        }

        const destino = editando
            ? `/sketchcoffee/productos/${productoEditandoId}`
            : '/sketchcoffee/productos';

        try {
            const respuesta = await fetch(destino, {
                method: editando ? 'PUT' : 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cuerpo)
            });

            if (respuesta.status === 201 || respuesta.status === 200) {
                const guardado = await respuesta.json();
                const verbo = editando ? 'actualizado' : 'guardado';
                formulario.reset();
                imagenSeleccionada = '';
                productoEditandoId = null;
                productoEnEdicion = null;
                botonGuardar.textContent = textoGuardarOriginal;
                mostrarResultado(`Producto "${guardado.nombre}" ${verbo} en la base de datos con el SKU ${guardado.sku}.`);
                await mostrarProductos();
            } else {
                // 400 validación, 404 categoría/producto inexistente, 409 SKU repetido
                let mensaje = `El servidor rechazó el guardado (estado ${respuesta.status}).`;
                try {
                    const cuerpoError = await respuesta.json();
                    if (cuerpoError && cuerpoError.mensaje) {
                        mensaje = cuerpoError.mensaje;
                    }
                } catch (errorJson) {
                    // Respuesta sin cuerpo JSON: se conserva el mensaje por estado.
                }
                console.error('Error al guardar el producto:', respuesta.status, mensaje);
                mostrarResultado(mensaje, false);
            }
        } catch (error) {
            console.error('No se pudo guardar el producto:', error);
            mostrarResultado('No se pudo conectar con el servidor para guardar el producto.', false);
        }

        vistaPreviaImagen.src = imagenDePrevisualizacion();
    });

    document.getElementById('btn-cancelar').addEventListener('click', () => {
        salirModoEdicion();
        formulario.reset();
        imagenSeleccionada = '';
        actualizarVistaPrevia();
        mensajeResultado.textContent = '';
        mensajeResultado.className = '';
    });

    await cargarCategorias();
    try {
        await mostrarProductos();
    } catch (error) {
        console.error('No se pudieron cargar los productos guardados:', error);
        mostrarResultado('No se pudieron leer los productos guardados en este navegador.', false);
    }
});
