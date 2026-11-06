import {
    validarNombreProducto,
    validarDescripcionProducto,
    validarPrecioProducto,
    validarCategoriaProducto
} from './validaciones.js';

document.addEventListener('DOMContentLoaded', () => {
    let usuarioSesion = null;
    try {
        usuarioSesion = JSON.parse(localStorage.getItem('app_authenticated_user') || 'null');
    } catch (error) {
        console.error('No se pudo leer la sesión:', error);
        window.location.replace('inicio-sesion.html');
        return;
    }

    if (!usuarioSesion || usuarioSesion.rol !== 'administrador') {
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

    function mostrarResultado(mensaje, correcto = true) {
        mensajeResultado.textContent = mensaje;
        mensajeResultado.className = correcto ? 'alert alert-success' : 'alert alert-danger';
    }

    function obtenerProductos() {
        const productos = JSON.parse(localStorage.getItem('productos_agregados') || '[]');
        if (!Array.isArray(productos)) {
            throw new Error('El formato de los productos guardados no es válido.');
        }
        return productos;
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
        categoria.textContent = `Categoría: ${producto.categoria}`;
        informacion.appendChild(categoria);

        const precio = document.createElement('p');
        precio.className = 'producto-precio';
        precio.textContent = `$${producto.precio.toFixed(2)} MXN`;
        informacion.appendChild(precio);

        const botonEliminar = document.createElement('button');
        botonEliminar.type = 'button';
        botonEliminar.className = 'btn-cancelar';
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.addEventListener('click', () => eliminarProducto(producto.id));
        informacion.appendChild(botonEliminar);

        tarjeta.appendChild(informacion);
        return tarjeta;
    }

    function mostrarProductos() {
        const productos = obtenerProductos();
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

    function eliminarProducto(id) {
        try {
            const productos = obtenerProductos().filter((producto) => producto.id !== id);
            localStorage.setItem('productos_agregados', JSON.stringify(productos));
            mostrarProductos();
            mostrarResultado('Producto eliminado.');
        } catch (error) {
            console.error('No se pudo eliminar el producto:', error);
            mostrarResultado('No se pudo actualizar la lista de productos.', false);
        }
    }

    function actualizarVistaPrevia() {
        document.getElementById('preview-nombre').textContent =
            document.getElementById('nombre').value.trim() || 'Nombre del producto';
        document.getElementById('preview-descripcion').textContent =
            document.getElementById('descripcion').value.trim() || 'Descripción del producto...';
        document.getElementById('preview-precio').textContent =
            `$${Number(document.getElementById('precio').value || 0).toFixed(2)}`;
        vistaPreviaImagen.src = imagenSeleccionada || imagenPredeterminada;
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
        if (archivo.size > 1500000) {
            mostrarResultado('La imagen debe pesar menos de 1.5 MB para guardarse en este navegador.', false);
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

        let imagen = imagenSeleccionada;
        const archivo = entradaImagen.files[0];
        if (archivo && !imagen) {
            try {
                imagen = await convertirImagen(archivo);
            } catch (error) {
                console.error('No se pudo leer la imagen seleccionada:', error);
                mostrarResultado('No se pudo leer la imagen. Prueba con otro archivo.', false);
                return;
            }
        }

        const producto = {
            id: Date.now(),
            nombre: nombre.trim(),
            descripcion: descripcion.trim(),
            precio: Number(precio),
            categoria,
            imagen
        };

        try {
            const productos = obtenerProductos();
            productos.push(producto);
            localStorage.setItem('productos_agregados', JSON.stringify(productos));
            mostrarProductos();
            formulario.reset();
            imagenSeleccionada = '';
            actualizarVistaPrevia();
            mostrarResultado('Producto guardado. También aparecerá en el catálogo.');
        } catch (error) {
            console.error('No se pudo guardar el producto:', error);
            mostrarResultado('No se pudo guardar. Puede que el almacenamiento del navegador esté lleno.', false);
        }
    });

    document.getElementById('btn-cancelar').addEventListener('click', () => {
        formulario.reset();
        imagenSeleccionada = '';
        actualizarVistaPrevia();
        mensajeResultado.textContent = '';
        mensajeResultado.className = '';
    });

    try {
        mostrarProductos();
    } catch (error) {
        console.error('No se pudieron cargar los productos guardados:', error);
        mostrarResultado('No se pudieron leer los productos guardados en este navegador.', false);
    }
});
