let menuData = { categorias: [] };
let temperaturaSeleccionadaActual = '';

// Formato "Oración": primera letra en mayúscula y el resto en minúsculas.
function formatearNombre(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

document.addEventListener("DOMContentLoaded", () => {
    cargarMenu();
    if (typeof actualizarContadorCarrito === 'function') {
        actualizarContadorCarrito();
    }
});

function normalizarMenu(menu) {
    menu.categorias.forEach(cat => {
        if (cat.subcategorias) {
            cat.subcategorias.forEach(sub => {
                if (Array.isArray(sub.items)) {
                    let itemsPlanos = [];
                    sub.items.forEach(item => {
                        if (Array.isArray(item)) {
                            // Es un array anidado: lo aplanamos
                            item.forEach(subItem => itemsPlanos.push(normalizarItem(subItem)));
                        } else {
                            itemsPlanos.push(normalizarItem(item));
                        }
                    });
                    sub.items = itemsPlanos;
                }
            });
        } else if (Array.isArray(cat.items)) {
            let itemsPlanos = [];
            cat.items.forEach(item => {
                if (Array.isArray(item)) {
                    item.forEach(subItem => itemsPlanos.push(normalizarItem(subItem)));
                } else {
                    itemsPlanos.push(normalizarItem(item));
                }
            });
            cat.items = itemsPlanos;
        }
    });
    return menu;
}

function normalizarItem(item) {
    // Unificar precioBase → precio
    if (item.precioBase !== undefined && item.precio === undefined) {
        item.precio = item.precioBase;
    }
    // Unificar sabores (array de objetos) → opcionesSabores (array de strings)
    if (item.sabores && !item.opcionesSabores) {
        item.opcionesSabores = item.sabores.map(s =>
            typeof s === 'string' ? s : s.nombre
        );
    }
    return item;
}

async function cargarMenu() {
    try {
        let respuesta = await fetch('./menu_interactivo/menu_interactivo.json');
        if (!respuesta.ok) throw new Error(`Error HTTP: ${respuesta.status}`);
        menuData = await respuesta.json();
        //Normalizar estructura
        menuData = normalizarMenu(menuData);

        if (!menuData || !Array.isArray(menuData.categorias)) {
            console.error("El formato del JSON no es válido.");
            return;
        }

        renderizarTabsCategorias();
    } catch (error) {
        console.error("Error al cargar el archivo JSON del menú:", error);
    }
}

function renderizarTabsCategorias() {
    const tabsContenedor = document.getElementById("categorias-tabs");
    if (!tabsContenedor) return;
    tabsContenedor.innerHTML = "";

    const ordenCategorias = ["bebidas", "platillos", "crepas-waffles", "postres"];

    ordenCategorias.forEach((catId, index) => {
        let cat = menuData.categorias.find(c => c.id === catId);
        if (!cat) return;

        let btn = document.createElement("button");
        btn.className = `btn btn-outline-dark rounded-pill px-4 ${index === 0 ? 'active' : ''}`;
        btn.textContent = cat.nombre;
        btn.onclick = () => {
            document.querySelectorAll("#categorias-tabs button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            renderizarCategoria(cat.id);
        };
        tabsContenedor.appendChild(btn);
    });

    renderizarCategoria(ordenCategorias[0]);
}

function renderizarCategoria(categoriaId) {
    const contenedor = document.getElementById("menu-contenedor");
    if (!contenedor) return;
    contenedor.innerHTML = "";

    let categoria = menuData.categorias.find(c => c.id === categoriaId);
    if (!categoria) return;

    if (categoria.id === "bebidas") {
        mostrarPaso1Bebidas();
    } else if (categoria.id === "crepas-waffles" || categoria.esPersonalizable) {
        iniciarWizardCrepaWaffle();
    } else if (categoria.id === "platillos") {
        iniciarWizardEspecialidades();
    } else {
        if (Array.isArray(categoria.items)) {
            let esPostre = categoria.id === "postres";
            categoria.items.forEach(item => {
                contenedor.appendChild(crearTarjetaProducto(item, esPostre));
            });
        }
    }
}

// Wizard de Bebidas - Paso 1
function mostrarPaso1Bebidas() {
    temperaturaSeleccionadaActual = '';
    const contenedor = document.getElementById("menu-contenedor");
    contenedor.innerHTML = `
        <div class="col-12 text-center mb-3">
            <h4 class="fw-bold">¿Cómo prefieres tu bebida hoy?</h4>
            <p class="text-muted small">Selecciona una opción para ver nuestro menú</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                <div class="col-12 col-md-4">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="mostrarPaso2Bebidas('Frías')">
                        <div class="fs-1 mb-2">❄️</div>
                        <h5 class="fw-bold m-0">Bebidas Frías</h5>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="mostrarPaso2Bebidas('Calientes')">
                        <div class="fs-1 mb-2">☕</div>
                        <h5 class="fw-bold m-0">Bebidas Calientes</h5>
                    </div>
                </div>
                <div class="col-12 col-md-4">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="mostrarResultadosBebidas('Otras bebidas', null)">
                        <div class="fs-1 mb-2">🥤</div>
                        <h5 class="fw-bold m-0">Otras Bebidas</h5>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Wizard de Bebidas - Paso 2
function mostrarPaso2Bebidas(temperatura) {
    temperaturaSeleccionadaActual = temperatura;
    const contenedor = document.getElementById("menu-contenedor");
    contenedor.innerHTML = `
        <div class="col-12 mb-3">
            <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="renderizarCategoria('bebidas')">
                <i class="bi bi-arrow-left me-1"></i> Volver a temperaturas
            </button>
        </div>
        <div class="col-12 text-center mb-3">
            <h4 class="fw-bold">Bebidas ${temperatura}</h4>
            <p class="text-muted small">¿Buscas algo con café o prefieres sin café?</p>
        </div>
        <div class="col-12">
            <div class="row g-3 justify-content-center">
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="mostrarResultadosBebidas('${temperatura}', true)">
                        <div class="fs-1 mb-2">☕</div>
                        <h5 class="fw-bold m-0">Con Café</h5>
                        <p class="text-muted small m-0 mt-1">Lattes y capuchinos.</p>
                    </div>
                </div>
                <div class="col-12 col-md-5">
                    <div class="card h-100 p-4 text-center border-0 shadow-sm cursor-pointer card-wizard" onclick="mostrarResultadosBebidas('${temperatura}', false)">
                        <div class="fs-1 mb-2">🍵</div>
                        <h5 class="fw-bold m-0">Sin café</h5>
                        <p class="text-muted small m-0 mt-1">Tés, Tisanas, Frappés, Sodas, Smoothies...</p>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Resultados del Wizard de Bebidas
function mostrarResultadosBebidas(subcategoriaNombre, conCafe) {
    const contenedor = document.getElementById("menu-contenedor");
    contenedor.innerHTML = "";

    let catBebidas = menuData.categorias.find(c => c.id === "bebidas");
    if (!catBebidas || !catBebidas.subcategorias) return;

    let accionVolver = (subcategoriaNombre === "Otras bebidas")
        ? "renderizarCategoria('bebidas')"
        : `mostrarPaso2Bebidas('${temperaturaSeleccionadaActual}')`;

    let subcat = catBebidas.subcategorias.find(s => s.nombre === subcategoriaNombre);
    if (!subcat || !subcat.items) return;

    let itemsFiltrados = subcat.items;
    if (conCafe !== null) {
        itemsFiltrados = subcat.items.filter(item => item.tieneCafe === conCafe);
    }

    let headerDiv = document.createElement("div");
    headerDiv.className = "col-12 mb-4";
    headerDiv.innerHTML = `
        <div class="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 p-3 rounded-3 border">
            <div>
                <button class="btn btn-sm btn-dark rounded-pill px-3 shadow-sm mb-2" onclick="${accionVolver}">
                    <i class="bi bi-arrow-left me-1"></i> Volver atrás
                </button>
                <h4 class="fw-bold m-0">${subcategoriaNombre} ${conCafe === true ? '(Con Café)' : conCafe === false ? '(Sin Café)' : ''}</h4>
            </div>
            <button class="btn btn-sm btn-outline-dark rounded-pill px-3" onclick="renderizarCategoria('bebidas')">
                <i class="bi bi-arrow-repeat me-1"></i> Reiniciar filtro de bebidas
            </button>
        </div>
    `;
    contenedor.appendChild(headerDiv);

    itemsFiltrados.forEach(item => {
        contenedor.appendChild(crearTarjetaProducto(item));
    });
}

function crearTarjetaProducto(item, esPostre = false) {
    let col = document.createElement("div");
    col.className = "col-12 col-md-6 col-lg-4";

    let extrasHtml = "";
    if (item.permiteAdicional) {
        extrasHtml = `<div class="form-check mt-2">
            <input class="form-check-input" type="checkbox" id="add_${item.id}">
            <label class="form-check-label small" for="add_${item.id}">${item.permiteAdicional.nombre} (+$${item.permiteAdicional.precio})</label>
        </div>`;
    }

    let paqueteHtml = "";
    if (item.permitePaquete) {
        paqueteHtml = `<div class="form-check mt-1">
            <input class="form-check-input" type="checkbox" id="paq_${item.id}">
            <label class="form-check-label small text-muted" for="paq_${item.id}">Hacer en paquete (+ bebida y complemento)</label>
        </div>`;
    }

    // Clase condicional para postres
    let claseCard = esPostre ? "card h-100 shadow-sm border-0 card-postre" : "card h-100 shadow-sm border-0";

    col.innerHTML = `
        <div class="${claseCard}">
            <div class="card-body d-flex flex-column justify-content-between">
                <div>
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title fw-bold mb-0">${formatearNombre(item.nombre)}</h5>
                        <span class="badge bg-dark fs-6">$${item.precio} MXN</span>
                    </div>
                    <p class="card-text text-muted small">${item.descripcion || ''}</p>
                    ${extrasHtml}
                    ${paqueteHtml}
                </div>
                <button class="btn btn-outline-dark btn-sm mt-3 w-100 rounded-pill" onclick='agregarAlCarrito(${JSON.stringify(item)})'>
                    <i class="bi bi-plus-lg"></i> Agregar al pedido
                </button>
            </div>
        </div>
    `;
    return col;
}

// Función corregida para conectar las tarjetas del Hero con las categorías del menú
function seleccionarCategoriaDesdeHero(categoriaId) {
    // 1. Desplazamiento suave hacia la sección del menú
    document.getElementById("menu-seccion")?.scrollIntoView({ behavior: 'smooth' });

    // 2. Renderizar la categoría y activar su pestaña correspondiente
    setTimeout(() => {
        renderizarCategoria(categoriaId);

        document.querySelectorAll("#categorias-tabs button").forEach(btn => {
            btn.classList.remove("active");
            // Comparamos el texto del botón con el nombre de la categoría en el JSON
            let catObj = menuData.categorias.find(c => c.id === categoriaId);
            if (catObj && btn.textContent.trim().toLowerCase() === catObj.nombre.toLowerCase()) {
                btn.classList.add("active");
            }
        });
    }, 200);
}
