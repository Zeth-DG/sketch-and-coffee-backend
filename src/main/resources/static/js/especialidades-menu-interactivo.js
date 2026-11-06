// Formato "Oración": primera letra en mayúscula y el resto en minúsculas.
function formatearNombre(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

let especialidadWizardState = {
    platillo: null,
    detallePersonalizacion: null,
    esPaquete: false,
    precioPaqueteExtra: 60, // Fallback; el precio real se lee de menu.json.
    bebidaPaquete: 'Café Americano (Incluido)',
    frutaPaquete: 'Papaya'
};

// El precio del paquete vive en menu.json (categoría "platillos").
function obtenerPrecioPaquete() {
    const categoriaPlatillos = menuData?.categorias?.find(c => c.id === "platillos");
    const precio = Number(categoriaPlatillos?.precioPaquete);
    return Number.isFinite(precio) && precio >= 0 ? precio : 60;
}

// PASO 1: Platillos Principales 
function iniciarWizardEspecialidades() {
    especialidadWizardState = {
        platillo: null,
        detallePersonalizacion: null,
        esPaquete: false,
        precioPaqueteExtra: obtenerPrecioPaquete(),
        bebidaPaquete: 'Café Americano (Incluido)',
        frutaPaquete: 'Papaya'
    };

    let catPlatillos = menuData.categorias.find(c => c.id === "platillos");
    if (!catPlatillos) return;

    const contenedor = document.getElementById("menu-contenedor");

    let htmlPlatillos = catPlatillos.items.map(item => `
        <div class="col-12 col-md-4">
            <div class="card h-100 p-3 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick='seleccionarPlatilloEspecialidad(${JSON.stringify(item)})'>
                <h5 class="fw-bold mb-1">${formatearNombre(item.nombre)}</h5>
                ${item.descripcion ? `<p class="text-muted small mb-2">${item.descripcion}</p>` : ''}
                <span class="fw-bold text-dark">$${item.precio} MXN</span>
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">1. Elige tu platillo</h4>
            <p class="text-muted small">Selecciona un platillo para comenzar</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                ${htmlPlatillos}
            </div>
        </div>
    `;
}

// PASO 1: Elegir platillo
// Todos los platillos pasan primero por la pregunta del paquete.
function seleccionarPlatilloEspecialidad(platilloObj) {
    especialidadWizardState.platillo = platilloObj;
    especialidadWizardState.detallePersonalizacion = null;
    preguntarSiEsPaquete();
}

// PASO 2: ¿Hacerlo paquete?
function preguntarSiEsPaquete() {
    const contenedor = document.getElementById("menu-contenedor");
    const precioPaquete = obtenerPrecioPaquete();
    especialidadWizardState.precioPaqueteExtra = precioPaquete;

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="iniciarWizardEspecialidades()">
                <i class="bi bi-arrow-left me-1"></i> Volver a especialidades
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">2. ¿Deseas hacerlo paquete?</h4>
            <p class="text-muted small">Incluye bebida, fruta de temporada y papas saladas (+$${precioPaquete} MXN)</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="definirPaquete(true)">
                        <div class="fs-1 mb-2">🍽️ + ☕</div>
                        <h5 class="fw-bold m-0">Sí, hacerlo paquete</h5>
                        <p class="text-muted small m-0 mt-1">Añade bebida + fruta + papas por +$${precioPaquete} MXN</p>
                    </div>
                </div>
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="definirPaquete(false)">
                        <div class="fs-1 mb-2">🍳</div>
                        <h5 class="fw-bold m-0">Solo el platillo</h5>
                        <p class="text-muted small m-0 mt-1">Ordenar únicamente $${especialidadWizardState.platillo.precio} MXN</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function definirPaquete(esPaq) {
    especialidadWizardState.esPaquete = esPaq;

    if (esPaq) {
        mostrarPasoComplementosPaquete();
    } else {
        mostrarPasoExtrasSinPaquete();
    }
}

// Devuelve los extras opcionales de un platillo, sin la opción base ("Solos"/"Sencillos").
function obtenerExtrasOpcionales(platilloObj) {
    if (!platilloObj || platilloObj.tipoPersonalizacion !== 'extras') return [];
    if (!Array.isArray(platilloObj.opcionesPersonalizacion)) return [];

    return platilloObj.opcionesPersonalizacion
        .slice(1)
        .map(op => {
            if (typeof op === 'string') return { nombre: op, precioAdicional: 0 };
            return { nombre: op.nombre, precioAdicional: op.precioAdicional || 0 };
        })
        .filter(op => op.nombre);
}

// "Con Jamón" → "Jamón" para el texto del botón y del carrito.
function nombreExtraCorto(nombre) {
    return String(nombre).replace(/^con\s+/i, '').trim();
}

// Normaliza las opciones de personalización que se eligen con radio buttons.
function obtenerOpcionesRadio(platilloObj) {
    if (!platilloObj || !Array.isArray(platilloObj.opcionesPersonalizacion)) return [];

    return platilloObj.opcionesPersonalizacion
        .map(op => {
            if (typeof op === 'string') return { nombre: op, precioAdicional: 0 };
            return { nombre: op.nombre, precioAdicional: op.precioAdicional || 0 };
        })
        .filter(op => op.nombre);
}

// Renderiza únicamente los controles de personalización del platillo.
function htmlOpcionesPersonalizacion(platilloObj) {
    if (!platilloObj) return '';

    // Molletes: extras opcionales con checkbox (la opción base "Solos" no se muestra).
    if (platilloObj.tipoPersonalizacion === 'extras') {
        const extras = obtenerExtrasOpcionales(platilloObj);
        if (extras.length === 0) return '';

        const botones = extras.map((extra, idx) => {
            const valor = JSON.stringify(extra).replace(/'/g, '&#39;');
            const precioTexto = extra.precioAdicional > 0 ? ` (+$${extra.precioAdicional})` : '';
            return `
                <div class="col-12 col-md-6 mb-2">
                    <input type="checkbox" class="btn-check" name="extraPlatillo" value='${valor}' id="extra_${idx}" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-3 rounded-3 text-wrap" for="extra_${idx}">
                        + ${nombreExtraCorto(extra.nombre)}${precioTexto}
                    </label>
                </div>
            `;
        }).join('');

        return `<div class="row g-2 justify-content-center">${botones}</div>`;
    }

    // Chapata (sabor) y Huevos (preparación): una sola opción con radio buttons.
    const opciones = obtenerOpcionesRadio(platilloObj);
    if (opciones.length === 0) return '';

    const botones = opciones.map((opcion, idx) => {
        const valor = JSON.stringify(opcion).replace(/'/g, '&#39;');
        const precioTexto = opcion.precioAdicional > 0
            ? `<span class="small d-block mt-1 opacity-75">(+$${opcion.precioAdicional})</span>`
            : '';

        return `
            <div class="col-12 col-md-4 mb-2">
                <input type="radio" class="btn-check" name="opcionPersonalizada" value='${valor}' id="op_${idx}" ${idx === 0 ? 'checked' : ''} autocomplete="off">
                <label class="btn btn-sabor-option w-100 py-3 rounded-3 text-wrap" for="op_${idx}">
                    ${formatearNombre(opcion.nombre)}
                    ${precioTexto}
                </label>
            </div>
        `;
    }).join('');

    return `<div class="row g-2 justify-content-center">${botones}</div>`;
}

// Sección completa con título, usada en la vista con paquete.
function htmlSeccionPersonalizacion(platilloObj, titulo) {
    const opcionesHtml = htmlOpcionesPersonalizacion(platilloObj);
    if (!opcionesHtml) return '';

    const nombrePlatillo = formatearNombre(platilloObj.nombre).trim();
    const subtitulo = platilloObj.tipoPersonalizacion === 'extras'
        ? 'Elige los extras que quieras agregar; se suman al total.'
        : 'Elige una opción.';

    return `
        <div class="text-center mb-3">
            <h5 class="fw-bold mb-1">${titulo || `Personaliza tu ${nombrePlatillo}`}</h5>
            <p class="text-muted small mb-0">${subtitulo}</p>
        </div>
        ${opcionesHtml}
    `;
}

// PASO 3 sin paquete: solo personalización del platillo.
function mostrarPasoExtrasSinPaquete() {
    const contenedor = document.getElementById("menu-contenedor");
    const platillo = especialidadWizardState.platillo;
    const nombrePlatillo = formatearNombre(platillo.nombre).trim();
    const opcionesHtml = htmlOpcionesPersonalizacion(platillo);

    const subtitulo = !opcionesHtml
        ? 'Este platillo no requiere personalización.'
        : platillo.tipoPersonalizacion === 'extras'
            ? 'Elige los extras que quieras agregar; se suman al total.'
            : 'Elige una opción para tu platillo.';

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="preguntarSiEsPaquete()">
                <i class="bi bi-arrow-left me-1"></i> Volver
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">3. Personaliza tu ${nombrePlatillo}</h4>
            <p class="text-muted small mb-0">${subtitulo}</p>
        </div>
        ${opcionesHtml ? `<div class="col-12 mb-4">${opcionesHtml}</div>` : ''}
        <div class="col-12 text-center">
            <button class="btn btn-dark btn-lg rounded-pill px-5 shadow" onclick="finalizarAgregarEspecialidadAlCarrito()">
                <i class="bi bi-cart-plus me-2"></i> Agregar al carrito
            </button>
        </div>
    `;
}

// PASO 3 con paquete: complementos + personalización del platillo.
function mostrarPasoComplementosPaquete() {
    const contenedor = document.getElementById("menu-contenedor");
    const platillo = especialidadWizardState.platillo;
    const nombrePlatillo = formatearNombre(platillo.nombre).trim();
    const seccionPersonalizacion = htmlSeccionPersonalizacion(
        platillo,
        `Personaliza tu ${nombrePlatillo}`
    );

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="preguntarSiEsPaquete()">
                <i class="bi bi-arrow-left me-1"></i> Volver
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">3. Personaliza tu paquete</h4>
            <p class="text-muted small">Elige una bebida y fruta para acompañar.</p>
        </div>

        <div class="col-12 col-md-8 mx-auto p-4 rounded-3 border shadow-sm">
            ${seccionPersonalizacion ? `<div class="mb-4 pb-4 border-bottom">${seccionPersonalizacion}</div>` : ''}

            <!-- Selección de Bebida -->
            <div class="mb-4">
                <label class="form-label fw-bold text-dark">Elige una bebida:</label>
                <select id="select-bebida-paq" class="form-select border-secondary" onchange="actualizarSubopcionesBebida()">
                    <option value="Café Americano">Café americano</option>
                    <option value="Refresco">Refresco (335 ml)</option>
                    <option value="Jugo del Valle">Jugo del Valle (355 ml)</option>
                    <option value="Capuchino (+$20)">Cambiar por Capuchino (+$20 MXN)</option>
                    <option value="Latte (+$20)">Cambiar por Latte (+$20 MXN)</option>
                </select>
            </div>

            <!-- Contenedor dinámico para los sabores de Refresco o Jugo -->
            <div id="contenedor-sabores-bebida" class="mb-4"></div>

            <!-- Selección de Fruta -->
            <div class="mb-4">
                <label class="form-label fw-bold text-dark">Fruta de temporada:</label>
                <div class="row g-2">
                    <div class="col-6">
                        <input type="radio" class="btn-check" name="frutaPaq" id="frutaPapaya" value="Papaya" checked autocomplete="off">
                        <label class="btn btn-sabor-option w-100 py-2 rounded-3" for="frutaPapaya">Papaya</label>
                    </div>
                    <div class="col-6">
                        <input type="radio" class="btn-check" name="frutaPaq" id="frutaManzana" value="Manzana" autocomplete="off">
                        <label class="btn btn-sabor-option w-100 py-2 rounded-3" for="frutaManzana">Manzana</label>
                    </div>
                </div>
            </div>

            <!-- Acompañante Fijo: Papas -->
            <div class="mb-4 p-3 bg-white rounded border">
                <small class="text-muted d-block">Incluye además:</small>
                <span class="fw-bold text-dark">🍟 Papas saladas (estilo Sabritas)</span>
            </div>

            <div class="text-center pt-2">
                <button class="btn btn-dark btn-lg rounded-pill px-5 shadow" onclick="finalizarAgregarEspecialidadAlCarrito()">
                    <i class="bi bi-cart-plus me-2"></i> Agregar paquete al pedido
                </button>
            </div>
        </div>
    `;

    // Ejecutar una vez al cargar para verificar si el valor por defecto requiere subopciones
    actualizarSubopcionesBebida();
}

function actualizarSubopcionesBebida() {
    const selectBebida = document.getElementById("select-bebida-paq");
    const contenedorSabores = document.getElementById("contenedor-sabores-bebida");
    const seleccion = selectBebida.value;

    if (seleccion === "Refresco") {
        contenedorSabores.innerHTML = `
            <label class="form-label fw-bold text-dark small">Elige el sabor de tu refresco (335 ml):</label>
            <div class="row g-2">
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_orig" value="Coca-Cola original" checked autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_orig">Coca-Cola original</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_light" value="Coca-Cola light" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_light">Coca-Cola light</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_zero" value="Coca-Cola zero" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_zero">Coca-Cola zero</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_fanta" value="Fanta" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_fanta">Fanta</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_mundet" value="Sidral mundet" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_mundet">Sidral mundet</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_fresca" value="Fresca" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_fresca">Fresca</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_jnar" value="Jarrito naranja" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_jnar">Jarrito naranja</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_jpin" value="Jarrito piña" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_jpin">Jarrito piña</label>
                </div>
                <div class="col-6 col-md-4">
                    <input type="radio" class="btn-check" name="saborRefresco" id="ref_jlim" value="Jarrito limón" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="ref_jlim">Jarrito limón</label>
                </div>
            </div>
        `;
    } else if (seleccion === "Jugo del Valle") {
        contenedorSabores.innerHTML = `
            <label class="form-label fw-bold text-dark small">Elige el sabor de tu jugo (355 ml):</label>
            <div class="row g-2">
                <div class="col-4">
                    <input type="radio" class="btn-check" name="saborJugo" id="jug_mango" value="Mango" checked autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="jug_mango">Mango</label>
                </div>
                <div class="col-4">
                    <input type="radio" class="btn-check" name="saborJugo" id="jug_manzana" value="Manzana" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="jug_manzana">Manzana</label>
                </div>
                <div class="col-4">
                    <input type="radio" class="btn-check" name="saborJugo" id="jug_durazno" value="Durazno" autocomplete="off">
                    <label class="btn btn-sabor-option w-100 py-2 rounded-3 text-wrap" for="jug_durazno">Durazno</label>
                </div>
            </div>
        `;
    } else {
        // Si elige café o capuchino, limpia el contenedor de sabores
        contenedorSabores.innerHTML = "";
    }
}

// Finalizar y enviar al Carrito
function finalizarAgregarEspecialidadAlCarrito() {
    let p = especialidadWizardState;
    let precioTotal = p.platillo.precio;
    let descripcionDetallada = "";

    // Opción única elegida con radio buttons (sabor de chapata o preparación de huevos).
    const opcionSeleccionada = document.querySelector('input[name="opcionPersonalizada"]:checked');
    if (opcionSeleccionada) {
        try {
            p.detallePersonalizacion = JSON.parse(opcionSeleccionada.value);
        } catch (e) {
            p.detallePersonalizacion = {
                nombre: opcionSeleccionada.value,
                precioAdicional: 0
            };
        }
    } else if (p.platillo.tipoPersonalizacion !== 'extras') {
        p.detallePersonalizacion = null;
    }

    if (p.detallePersonalizacion) {
        let nombreOpcion = p.detallePersonalizacion.nombre || p.detallePersonalizacion;
        let precioExtra = p.detallePersonalizacion.precioAdicional || 0;

        precioTotal += precioExtra;

        let etiquetaOpcion = 'Opción';
        if (p.platillo.tipoPersonalizacion === 'sabor') etiquetaOpcion = 'Sabor';
        if (p.platillo.tipoPersonalizacion === 'preparacion') etiquetaOpcion = 'Preparación';

        descripcionDetallada += `${etiquetaOpcion}: ${formatearNombre(nombreOpcion)}`;
        if (precioExtra > 0) {
            descripcionDetallada += ` (+$${precioExtra})`;
        }
    }

    // ✅ Extras opcionales marcados con checkbox (Molletes, etc.)
    let extrasSeleccionados = [];
    if (p.platillo.tipoPersonalizacion === 'extras') {
        extrasSeleccionados = Array.from(document.querySelectorAll('input[name="extraPlatillo"]:checked'))
            .map(input => {
                try { return JSON.parse(input.value); }
                catch (e) { return null; }
            })
            .filter(Boolean);
    }

    let precioExtras = extrasSeleccionados.reduce((total, extra) => total + (extra.precioAdicional || 0), 0);
    precioTotal += precioExtras;

    let nombresExtras = extrasSeleccionados.map(extra => nombreExtraCorto(extra.nombre));

    if (extrasSeleccionados.length > 0) {
        let detalleExtras = extrasSeleccionados
            .map(extra => `${nombreExtraCorto(extra.nombre)}${extra.precioAdicional > 0 ? ` (+$${extra.precioAdicional})` : ''}`)
            .join(', ');
        descripcionDetallada += (descripcionDetallada ? " | " : "") + `Extras: ${detalleExtras}`;
    }

    if (p.esPaquete) {
        precioTotal += p.precioPaqueteExtra;
        
        let bebidaSel = document.getElementById("select-bebida-paq")?.value || "Café Americano";
        if (bebidaSel.includes("+20")) {
            precioTotal += 20;
        }

        // ✅ Capturamos el sabor si es Refresco o Jugo
        let saborBebida = "";
        if (bebidaSel === "Refresco") {
            let saborRef = document.querySelector('input[name="saborRefresco"]:checked')?.value;
            if (saborRef) saborBebida = ` (${saborRef})`;
        } else if (bebidaSel === "Jugo del Valle") {
            let saborJug = document.querySelector('input[name="saborJugo"]:checked')?.value;
            if (saborJug) saborBebida = ` (${saborJug})`;
        }

        let frutaSel = document.querySelector('input[name="frutaPaq"]:checked')?.value || "Papaya";

        descripcionDetallada += (descripcionDetallada ? " | " : "") 
            + `Paquete: ${bebidaSel}${saborBebida}, Fruta: ${frutaSel}, Papas saladas`;
    }

    let nombreProducto = p.platillo.nombre.trim();
    if (nombresExtras.length > 0) {
        nombreProducto += ` con ${nombresExtras.join(' y ')}`;
    }
    if (p.esPaquete) {
        nombreProducto += ' (Paquete)';
    }
    nombreProducto = formatearNombre(nombreProducto);

    let productoFinal = {
        id: 'platillo_' + Date.now(),
        nombre: nombreProducto,
        precio: precioTotal,
        cantidad: 1,
        descripcion: descripcionDetallada
    };

    carrito.push(productoFinal);
    guardarYActualizarCarrito();

    mostrarToastNotificacion(`¡${productoFinal.nombre} agregado al pedido!`);
    renderizarCategoria('platillos');
}