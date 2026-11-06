// menu-filtros.js
// Lógica modular para gestionar categorías, filtros avanzados, precio, ordenamiento, limpieza y paginación dinámica.
import { cargarProductosCatalogo } from './menu-productos.js';

// Formato "Oración": primera letra en mayúscula y el resto en minúsculas.
function formatearNombre(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

document.addEventListener("DOMContentLoaded", async () => {
    function normalizarTexto(texto) {
        return texto
            .toLocaleLowerCase('es')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    }

    // 1. Obtener los productos originales
    const productosOriginales = await cargarProductosCatalogo();
    if (!productosOriginales.length) return;

    let productosFiltrados = [...productosOriginales];

    // Configuración de Paginación
    const PRODUCTOS_POR_PAGINA = 9;
    let paginaActual = 1;

    // Referencias del DOM (respetando tus IDs originales)
    const grilla = document.getElementById('grilla-productos');
    const subtitulo = document.getElementById('subtitulo-catalogo');
    const textoContador = document.getElementById('texto-contador-productos');
    const selectOrden = document.getElementById('desplegable-ordenamiento');
    const botonAplicar = document.getElementById('boton-aplicar-filtros');
    const botonLimpiar = document.getElementById('boton-limpiar-filtros');
    const botonesPildora = document.querySelectorAll('#contenedor-categorias .boton-pildora');
    const contenedorPaginacion = document.getElementById('paginacion-productos');

    // Referencias de Rango de Precio
    const rangoPrecio = document.getElementById('rango-precio');
    const precioMaximoTexto = document.getElementById('precio-maximo');

    // Estado actual de categoría seleccionada
    let categoriaActiva = 'todos';
    let busquedaProducto = normalizarTexto(
        new URLSearchParams(window.location.search).get('buscar') || ''
    ).trim();

    // Función auxiliar para renderizar tarjetas con paginación
    function renderizarPagina() {
        const totalProductos = productosFiltrados.length;
        const totalPaginas = Math.ceil(totalProductos / PRODUCTOS_POR_PAGINA) || 1;

        if (paginaActual > totalPaginas) paginaActual = 1;

        const inicio = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
        const fin = inicio + PRODUCTOS_POR_PAGINA;
        const productosPagina = productosFiltrados.slice(inicio, fin);

        if (productosPagina.length === 0) {
            grilla.innerHTML = '<p class="col-12 text-center py-4">No se encontraron productos con este rango de precio o filtros.</p>';
        } else {
            grilla.innerHTML = productosPagina.map((prod, indice) => {
                const id = `producto-${inicio + indice + 1}`;
                const precio = Number(prod.precio).toFixed(2);
                const nombreFormateado = formatearNombre(prod.nombre);
                return `
                    <div class="col" role="listitem">
                      <article id="${id}" class="tarjeta-producto" aria-labelledby="nombre-${id}">
                        <div class="contenedor-imagen-producto">
                          <img src="${prod.imagen}" alt="${nombreFormateado}" loading="lazy">
                        </div>
                        <h3 id="nombre-${id}" class="titulo-producto">${nombreFormateado}</h3>
                        <p class="descripcion-producto">${prod.descripcion || 'Una opción deliciosa para disfrutar en Sketch & Coffee.'}</p>
                        <div class="precio-producto" aria-label="Precio: ${precio} pesos mexicanos">$${precio} MXN</div>
                        <div class="pie-tarjeta-producto">
                          <span class="indicador-gris" aria-hidden="true"></span>
                          <button class="btn boton-anadir${prod.disponible ? ' activo' : ''}"
                                  data-sku="${prod.sku}" ${prod.disponible ? '' : 'disabled'}
                                  data-agregar-carrito data-id="catalogo-${prod.sku}"
                                  data-nombre="${nombreFormateado}" data-precio="${prod.precio}"
                                  aria-label="Añadir ${nombreFormateado} al carrito de compras">
                            ${prod.disponible ? 'Añadir' : 'Agotado'}
                          </button>
                        </div>
                      </article>
                    </div>`;
            }).join('');
        }//else

        // Actualizar contadores y accesibilidad (aria-live)
        const indexInicio = totalProductos > 0 ? inicio + 1 : 0;
        const indexFin = Math.min(fin, totalProductos);

        if (subtitulo) subtitulo.textContent = `${totalProductos} productos disponibles`;
        if (textoContador) textoContador.textContent = `Mostrando ${indexInicio} a ${indexFin} de ${totalProductos} productos`;

        renderizarControlesPaginacion(totalPaginas);
    }//renderizarPagina

    // Renderizar dinámicamente los botones de paginación del 1 hasta el total necesario
    function renderizarControlesPaginacion(totalPaginas) {
        if (!contenedorPaginacion) return;

        let htmlPaginacion = `
            <a id="boton-pagina-anterior" href="#" class="boton-pagina" aria-label="Ir a la página anterior de resultados">&lt;</a>
        `;

        for (let i = 1; i <= totalPaginas; i++) {
            const esActiva = i === paginaActual;
            htmlPaginacion += `
                <a href="#" class="boton-pagina${esActiva ? ' activo' : ''}" ${esActiva ? 'aria-current="page"' : ''} data-pagina="${i}" aria-label="Página ${i} de resultados">${i}</a>
            `;
        }

        htmlPaginacion += `
            <a id="boton-pagina-siguiente" href="#" class="boton-pagina" aria-label="Ir a la página siguiente de resultados">&gt;</a>
        `;

        contenedorPaginacion.innerHTML = htmlPaginacion;

        // Reasignar eventos a los elementos generados
        const btnAnterior = document.getElementById('boton-pagina-anterior');
        const btnSiguiente = document.getElementById('boton-pagina-siguiente');
        const botonesNumericos = contenedorPaginacion.querySelectorAll('[data-pagina]');

        if (btnAnterior) {
            btnAnterior.style.opacity = paginaActual === 1 ? '0.5' : '1';
            btnAnterior.style.pointerEvents = paginaActual === 1 ? 'none' : 'auto';
            btnAnterior.addEventListener('click', (e) => {
                e.preventDefault();
                if (paginaActual > 1) {
                    paginaActual--;
                    renderizarPagina();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });// =>
        }//if btnAnterior

        if (btnSiguiente) {
            btnSiguiente.style.opacity = paginaActual === totalPaginas || totalPaginas === 0 ? '0.5' : '1';
            btnSiguiente.style.pointerEvents = paginaActual === totalPaginas || totalPaginas === 0 ? 'none' : 'auto';
            btnSiguiente.addEventListener('click', (e) => {
                e.preventDefault();
                if (paginaActual < totalPaginas) {
                    paginaActual++;
                    renderizarPagina();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });// =>
        }//if btnSiguiente

        botonesNumericos.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                paginaActual = Number(e.target.getAttribute('data-pagina'));
                renderizarPagina();
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });// =>
        });//botonesNumericos.forEach
    }//renderizarControlesPaginacion

    // --- EVENTO DE RANGO DE PRECIO EN TIEMPO REAL ---
    if (rangoPrecio) {
        rangoPrecio.addEventListener('input', (e) => {
            const valorMax = e.target.value;
            if (precioMaximoTexto) {
                precioMaximoTexto.textContent = `$${valorMax}`;
            }//if precioMaximoTexto
            aplicarFiltrosYOrden();
        });//rangoPrecio.addEventListener
    }//if rangoPrecio

    // --- 1. GESTIÓN DE CATEGORÍAS (PÍLDORAS) ---
    botonesPildora.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Actualizar clases activas y atributos ARIA
            botonesPildora.forEach(b => {
                b.classList.remove('activo');
                b.setAttribute('aria-pressed', 'false');
            });//btnesPildora

            e.target.classList.add('activo');
            e.target.setAttribute('aria-pressed', 'true');

            // Determinar categoría según el ID del botón
            const idBoton = e.target.id;
            if (idBoton === 'categoria-todos') {
                categoriaActiva = 'todos';
                busquedaProducto = '';

                const campoBusqueda = document.getElementById('buscar-producto');
                if (campoBusqueda) campoBusqueda.value = '';

                const url = new URL(window.location.href);
                url.searchParams.delete('buscar');
                window.history.replaceState({}, '', url);
            }
            else if (idBoton === 'categoria-grano') categoriaActiva = 'grano';
            else if (idBoton === 'categoria-bebidas') categoriaActiva = 'bebidas';
            else if (idBoton === 'categoria-reposteria') categoriaActiva = 'snack';
            else if (idBoton === 'categoria-accesorios') categoriaActiva = 'postres';

            paginaActual = 1; // Reiniciar a la página 1 al cambiar de categoría
            aplicarFiltrosYOrden();
        });//click
    });//forEach

    // --- 2. APLICAR FILTROS AVANZADOS (CHECKBOXES, RANGO DE PRECIO) Y ORDENAMIENTO ---
    function aplicarFiltrosYOrden() {
        let resultado = [...productosOriginales];

        if (busquedaProducto) {
            resultado = resultado.filter(prod =>
                normalizarTexto(prod.nombre).includes(busquedaProducto)
            );
        }

        // Filtrar por categoría de píldora
        if (categoriaActiva !== 'todos') {
            resultado = resultado.filter(prod => {
                const nombre = prod.nombre.toLowerCase();
                const depto = prod.departamento.toLowerCase();
                
                // Si el departamento dice "postre" o "snack", lo protegemos de la categoría bebidas
                const esPostreOSnack = depto.includes('postre') || depto.includes('snack');

                if (categoriaActiva === 'grano') {
                    return nombre.includes('grano') || depto.includes('grano');
                }
                
                if (categoriaActiva === 'bebidas') {
                    if (esPostreOSnack) return false; 
                    return depto.includes('bebida') || nombre.includes('latte') || nombre.includes('capuchino') || nombre.includes('chocolate') || nombre.includes('tisana') || nombre.includes('americano');
                }
                
                if (categoriaActiva === 'snack') {
                    return depto.includes('snack') || nombre.includes('chilaquiles') || nombre.includes('enchiladas') || nombre.includes('croissant');
                }
                
                if (categoriaActiva === 'postres') {
                    // Agregamos 'pastel', 'brownie' y 'cheesecake' para mayor seguridad
                    return depto.includes('postre') || nombre.includes('crepa') || nombre.includes('pastel') || nombre.includes('brownie') || nombre.includes('cheesecake');
                }
                
                return true;
            });// prod =>
        }// if categoriaActiva

        // Filtrar por Rango de Precio (Precio Máximo del Slider)
        if (rangoPrecio) {
            const maxPrecioActual = Number(rangoPrecio.value);
            resultado = resultado.filter(prod => Number(prod.precio) <= maxPrecioActual);
        }//if rangoPrecio

        // Filtrar por Checkboxes de Tostado
        const tostadosSeleccionados = Array.from(document.querySelectorAll('#grupo-filtro-tostado input:checked'))
            .map(input => input.id.replace('filtro-tostado-', ''));

        if (tostadosSeleccionados.length > 0) {
            resultado = resultado.filter(prod => {
                const desc = (prod.nombre + " " + prod.descripcion).toLowerCase();
                return tostadosSeleccionados.some(t => desc.includes(t));
            });// resultado =>
        }//tostadoSeleccionados

        // Filtrar por Checkboxes de Origen
        const origenesSeleccionados = Array.from(document.querySelectorAll('#grupo-filtro-origen input:checked'))
            .map(input => input.id.replace('filtro-origen-', ''));

        if (origenesSeleccionados.length > 0) {
            resultado = resultado.filter(prod => {
                const desc = (prod.nombre + " " + prod.descripcion).toLowerCase();
                return origenesSeleccionados.some(o => desc.includes(o));
            });// =>
        }//origenesSeleccionados

        // Filtrar por Checkboxes de Presentación
        const presentacionesSeleccionadas = Array.from(document.querySelectorAll('#grupo-filtro-presentacion input:checked'))
            .map(input => input.id.replace('filtro-presentacion-', ''));

        if (presentacionesSeleccionadas.length > 0) {
            resultado = resultado.filter(prod => {
                const desc = (prod.nombre + " " + prod.descripcion).toLowerCase();
                return presentacionesSeleccionadas.some(p => desc.includes(p));
            });// =>
        }// presentacionesSeleccionadas

        // --- 3. ORDENAMIENTO ---
        const criterioOrden = selectOrden.value;
        if (criterioOrden === 'menor-precio') {
            resultado.sort((a, b) => Number(a.precio) - Number(b.precio));
        } else if (criterioOrden === 'mayor-precio') {
            resultado.sort((a, b) => Number(b.precio) - Number(a.precio));
        } // 'relevancia' mantiene el orden original del top

        productosFiltrados = resultado;
        paginaActual = 1; // Reiniciar a página 1 al filtrar
        renderizarPagina();
    }//aplicarFiltrosYOrden

    // Evento al dar clic en el botón "Aplicar" del aside
    if (botonAplicar) {
        botonAplicar.addEventListener('click', (e) => {
            e.preventDefault();
            aplicarFiltrosYOrden();
        });// =>
    }//if botonAplicar

    // Evento al cambiar el desplegable de orden
    if (selectOrden) {
        selectOrden.addEventListener('change', () => {
            aplicarFiltrosYOrden();
        }); // =>
    }// if selectOrden

    // --- 4. BOTÓN "LIMPIAR" FILTROS ---
    if (botonLimpiar) {
        botonLimpiar.addEventListener('click', (e) => {
            e.preventDefault();

            // Desmarcar todos los checkboxes del panel lateral
            document.querySelectorAll('#columna-filtros input[type="checkbox"]').forEach(chk => {
                chk.checked = false;
            });// forEach

            // Restablecer rango de precio a su máximo valor (650)
            if (rangoPrecio) {
                rangoPrecio.value = 650;
                if (precioMaximoTexto) precioMaximoTexto.textContent = '$650';
            }//if rangoPrecio

            // Restablecer píldoras a "Todos"
            botonesPildora.forEach(b => {
                b.classList.remove('activo');
                b.setAttribute('aria-pressed', 'false');
            });//btnPildor forEach
            const botonTodos = document.getElementById('categoria-todos');
            if (botonTodos) {
                botonTodos.classList.add('activo');
                botonTodos.setAttribute('aria-pressed', 'true');
            }//if botonTodos
            categoriaActiva = 'todos';

            busquedaProducto = '';
            const campoBusqueda = document.getElementById('buscar-producto');
            if (campoBusqueda) campoBusqueda.value = '';
            const url = new URL(window.location.href);
            url.searchParams.delete('buscar');
            window.history.replaceState({}, '', url);

            // Restablecer select de orden
            if (selectOrden) selectOrden.value = 'relevancia';

            // Restaurar productos originales en pantalla
            productosFiltrados = [...productosOriginales];
            paginaActual = 1;
            renderizarPagina();
        });//botonLimpiar.addEventListener
    }//if btnLimpiar

    // Aplicar filtros iniciales y renderizar al cargar la página
    aplicarFiltrosYOrden();

    // --- 5. LEER PARÁMETRO URL PARA CATEGORÍA AUTOMÁTICA ---
    const urlParams = new URLSearchParams(window.location.search);
    const categoriaURL = urlParams.get('cat');

    if (categoriaURL) {
        // Busca el botón de la píldora según el parámetro (ej. 'categoria-grano')
        const botonCategoria = document.getElementById(`categoria-${categoriaURL}`);
        if (botonCategoria) {
            // Simula un clic en el botón. Esto hace que se ilumine y filtre los productos.
            botonCategoria.click(); 
        }
    } else {
        // Si no hay parámetro, aplica los filtros normales por defecto
        aplicarFiltrosYOrden();
    }
});//DOM
