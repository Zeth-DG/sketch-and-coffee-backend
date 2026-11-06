let productoSaborTemp = null;

// Formato "Oración": primera letra en mayúscula y el resto en minúsculas.
function formatearNombre(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

// Lógica del Selector de Sabores para Bebidas
function abrirModalSabor(item) {
    document.getElementById("tituloModalSabor").textContent = formatearNombre(item.nombre);
    const contenedor = document.getElementById("contenedor-sabores-radio");
    contenedor.innerHTML = "";

    item.opcionesSabores.forEach((sabor, idx) => {
        contenedor.innerHTML += `
            <div class="col-12 col-sm-6 mb-2">
                <input type="radio" class="btn-check" name="saborBebida" id="sabor_${idx}" value="${sabor}" ${idx === 0 ? 'checked' : ''} autocomplete="off">
                <label class="btn btn-sabor-option w-100 py-3 rounded-3 text-wrap" for="sabor_${idx}">
                    ${sabor}
                </label>
            </div>
        `;
    });

    let modal = new bootstrap.Modal(document.getElementById('modalSaborBebida'));
    modal.show();
}

function confirmarSaborYBebida() {
    let saborSeleccionado = document.querySelector('input[name="saborBebida"]:checked');
    if (!saborSeleccionado || !productoSaborTemp) return;

    let nombreConSabor = formatearNombre(`${productoSaborTemp.nombre} (${saborSeleccionado.value})`);

    let productoEnCarrito = {
        id: productoSaborTemp.id + '_' + saborSeleccionado.value.toLowerCase().replace(/\s+/g, ''),
        nombre: nombreConSabor,
        precio: productoSaborTemp.precio,
        cantidad: 1
    };

    let existente = carrito.find(p => p.id === productoEnCarrito.id);
    if (existente) {
        existente.cantidad++;
    } else {
        carrito.push(productoEnCarrito);
    }

    guardarYActualizarCarrito();

    let modalEl = document.getElementById('modalSaborBebida');
    let modal = bootstrap.Modal.getInstance(modalEl);
    modal.hide();

    productoSaborTemp = null;
}

/*Crepas y waffles */
// Estado temporal para la personalización de Crepas / Waffles
let crepaWizardState = {
    tipo: 'Crepa',          // 'Crepa' o 'Waffle'
    base: null,             // Objeto base elegida
    incluidos: [],          // Array de hasta 2 ingredientes
    extras: []              // Array de ingredientes extra ($15 c/u)
};

// PASO 1: Elegir Crepa o Waffle
function iniciarWizardCrepaWaffle() {
    crepaWizardState = { tipo: 'Crepa', base: null, incluidos: [], extras: [] };

    const contenedor = document.getElementById("menu-contenedor");
    contenedor.innerHTML = `
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">1. ¿Qué deseas armar hoy?</h4>
            <p class="text-muted small">Selecciona una opción para empezar</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="seleccionarTipoCrepa('Crepa')">
                        <div class="fs-1 mb-2">🥞</div>
                        <h5 class="fw-bold m-0">Crepa</h5>
                        <p class="text-muted small m-0 mt-1">Delgada, suave y recién hecha</p>
                    </div>
                </div>
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="seleccionarTipoCrepa('Waffle')">
                        <div class="fs-1 mb-2">🧇</div>
                        <h5 class="fw-bold m-0">Waffle</h5>
                        <p class="text-muted small m-0 mt-1">Crujiente por fuera, suave por dentro</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// PASO 2: Elegir Tipo de Masa / Base (Filtrado por tipo)
function seleccionarTipoCrepa(tipo) {
    crepaWizardState.tipo = tipo;
    let catCrepas = menuData.categorias.find(c => c.id === "crepas-waffles");
    if (!catCrepas || !catCrepas.bases) return;

    // Filtrar las bases según si el usuario eligió Crepa o Waffle
    let basesFiltradas = catCrepas.bases.filter(base => {
        if (!base.tipo) return true; // Si no tiene tipo especificado, se muestra en ambos
        return base.tipo.toLowerCase() === tipo.toLowerCase();
    });

    const contenedor = document.getElementById("menu-contenedor");

    let htmlBases = basesFiltradas.map((base, idx) => `
        <div class="col-12 col-md-5">
            <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick='seleccionarBaseCrepa(${JSON.stringify(base)})'>
                <h5 class="fw-bold m-0">${formatearNombre(base.nombre)}</h5>
                <p class="text-dark fw-bold mt-2 mb-0">$${base.precioBase} MXN</p>
            </div>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="iniciarWizardCrepaWaffle()">
                <i class="bi bi-arrow-left me-1"></i> Volver a elegir producto
            </button>
        </div>
        <div class="col-12 text-center mb-4">
            <h4 class="fw-bold">2. Elige el tipo de masa para tu ${tipo}</h4>
            <p class="text-muted small">Selecciona tu masa favorita</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                ${htmlBases}
            </div>
        </div>
    `;
}

// PASO 3: Elegir 2 Ingredientes Incluidos (Con estilo rosa/magenta al seleccionar)
function seleccionarBaseCrepa(baseObj) {
    crepaWizardState.base = baseObj;
    let catCrepas = menuData.categorias.find(c => c.id === "crepas-waffles");
    if (!catCrepas) return;

    const contenedor = document.getElementById("menu-contenedor");

    let htmlIngredientes = catCrepas.listaIngredientes.map((ing, idx) => `
        <div class="col-6 col-md-4 col-lg-3 mb-2">
            <input type="checkbox" class="btn-check ing-wizard-incluido" value="${ing}" id="wizard_inc_${idx}" onchange="validarIngredientesIncluidosWizard(this)" autocomplete="off">
            <label class="btn btn-sabor-option w-100 py-3 rounded-3 text-wrap" for="wizard_inc_${idx}">
                ${ing}
            </label>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="seleccionarTipoCrepa('${crepaWizardState.tipo}')">
                <i class="bi bi-arrow-left me-1"></i> Volver a masas
            </button>
        </div>
        <div class="col-12 text-center mb-3">
            <h4 class="fw-bold">3. Elige tus 2 ingredientes incluidos</h4>
            <p class="text-muted small">${crepaWizardState.tipo} de <strong>${formatearNombre(baseObj.nombre)}</strong> ($${baseObj.precioBase} MXN)</p>
        </div>
        <div class="col-12 mb-4">
            <div class="row g-2 justify-content-center">
                ${htmlIngredientes}
            </div>
        </div>
        <div class="col-12 text-center">
            <button class="btn btn-dark btn-lg rounded-pill px-5 shadow" onclick="avanzarPasoExtras()">
                Continuar a Extras ➡
            </button>
        </div>
    `;
}

function validarIngredientesIncluidosWizard(inputEl) {
    let seleccionados = document.querySelectorAll('.ing-wizard-incluido:checked');
    if (seleccionados.length > 2) {
        alert("Solo puedes seleccionar hasta 2 ingredientes incluidos.");
        inputEl.checked = false;
    }
}

// PASO 4: Ingredientes Extra Opcionales (Con estilo rosa/magenta)
function avanzarPasoExtras() {
    let seleccionados = Array.from(document.querySelectorAll('.ing-wizard-incluido:checked')).map(cb => cb.value);
    crepaWizardState.incluidos = seleccionados;

    let catCrepas = menuData.categorias.find(c => c.id === "crepas-waffles");
    if (!catCrepas) return;

    const contenedor = document.getElementById("menu-contenedor");

    let htmlExtras = catCrepas.listaIngredientes.map((ing, idx) => `
        <div class="col-6 col-md-4 col-lg-3 mb-2">
            <input type="checkbox" class="btn-check ing-wizard-extra" value="${ing}" id="wizard_ext_${idx}" onchange="actualizarPrecioTotalWizard()" autocomplete="off">
            <label class="btn btn-sabor-option w-100 py-3 rounded-3 text-wrap" for="wizard_ext_${idx}">
                ${ing} <span class="small d-block mt-1 opacity-75">(+$15)</span>
            </label>
        </div>
    `).join('');

    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="seleccionarBaseCrepa(crepaWizardState.base)">
                <i class="bi bi-arrow-left me-1"></i> Volver a ingredientes incluidos
            </button>
        </div>
        <div class="col-12 text-center mb-3">
            <h4 class="fw-bold">4. ¿Deseas agregar más ingredientes extra?</h4>
            <p class="text-muted small">Cada extra añade $15 MXN a tu pedido (Opcional)</p>
        </div>
        <div class="col-12 mb-4">
            <div class="row g-2 justify-content-center">
                ${htmlExtras}
            </div>
        </div>
        <div class="col-12 text-center p-4 rounded-3 border">
            <h5 class="fw-bold mb-2">Resumen: <span class="text-dark">${crepaWizardState.tipo} de ${formatearNombre(crepaWizardState.base.nombre)}</span></h5>
            <h3 class="fw-bold text-dark mb-3" id="precio-total-wizard-display">$${crepaWizardState.base.precioBase} MXN</h3>
            <button class="btn btn-dark btn-lg rounded-pill px-5 shadow" onclick="finalizarAgregarCrepaAlCarrito()">
                <i class="bi bi-cart-plus me-2"></i> Agregar al pedido
            </button>
        </div>
    `;
}

function actualizarPrecioTotalWizard() {
    let extrasContados = document.querySelectorAll('.ing-wizard-extra:checked').length;
    let precioFinal = crepaWizardState.base.precioBase + (extrasContados * 15);
    document.getElementById("precio-total-wizard-display").textContent = `$${precioFinal} MXN`;
}

function finalizarAgregarCrepaAlCarrito() {
    let extrasSeleccionados = Array.from(document.querySelectorAll('.ing-wizard-extra:checked')).map(cb => cb.value);
    crepaWizardState.extras = extrasSeleccionados;

    let precioTotal = crepaWizardState.base.precioBase + (extrasSeleccionados.length * 15);

    let descripcionDetallada = `Masa: ${formatearNombre(crepaWizardState.base.nombre)} | Incluye: ${crepaWizardState.incluidos.join(', ') || 'Ninguno'}`;
    if (extrasSeleccionados.length > 0) {
        descripcionDetallada += ` | Extras: ${extrasSeleccionados.join(', ')}`;
    }

    // Concordancia de género: Crepa personalizada vs Waffle personalizado
    // Asegurar concordancia de género
    let esCrepa = crepaWizardState.tipo.toLowerCase().includes('crepa');
    let sufijoGenero = esCrepa ? 'personalizada' : 'personalizado';

    let productoPersonalizado = {
        id: 'crepa_waffle_' + Date.now(),
        nombre: `${crepaWizardState.tipo} ${sufijoGenero}`,
        precio: precioTotal,
        cantidad: 1,
        descripcion: descripcionDetallada
    };

    carrito.push(productoPersonalizado);
    guardarYActualizarCarrito();

    // Mensaje de éxito
    mostrarToastNotificacion(`¡${productoPersonalizado.nombre} agregad${esCrepa ? 'a' : 'o'} al pedido!`);

    renderizarCategoria('crepas-waffles');
}