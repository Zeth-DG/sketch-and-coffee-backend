let carrito = JSON.parse(localStorage.getItem('carrito_sketch')) || [];

// Formato "Oración": primera letra en mayúscula y el resto en minúsculas.
function formatearNombre(texto) {
    if (!texto) return "";
    return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

function agregarAlCarrito(item) {
    if (item.opcionesSabores && item.opcionesSabores.length > 0 && typeof abrirModalSabor === "function") {
        productoSaborTemp = item;
        abrirModalSabor(item);
        return;
    }

    let cantidad = Number(item.cantidad) > 0 ? Number(item.cantidad) : 1;
    let precioFinal = item.precio;
    let nombreFinal = formatearNombre(item.nombre);

    let checkAdd = document.getElementById(`add_${item.id}`);
    if (checkAdd && checkAdd.checked) {
        precioFinal += item.permiteAdicional.precio;
        nombreFinal += ` con ${item.permiteAdicional.nombre}`;
    }

    let checkPaq = document.getElementById(`paq_${item.id}`);
    if (checkPaq && checkPaq.checked) {
        precioFinal += 45;
        nombreFinal += ` (En paquete)`;
    }

    nombreFinal = formatearNombre(nombreFinal);

    let productoEnCarrito = {
        id: item.id + (checkAdd?.checked ? '_add' : '') + (checkPaq?.checked ? '_paq' : ''),
        nombre: nombreFinal,
        precio: precioFinal,
        cantidad: cantidad
    };

    let existente = carrito.find(p => p.id === productoEnCarrito.id);
    if (existente) {
        existente.cantidad += cantidad;
    } else {
        carrito.push(productoEnCarrito);
    }

    guardarYActualizarCarrito();

    // Mensaje de éxito
    mostrarToastNotificacion(`¡${nombreFinal} agregado al pedido!`);
}

function guardarYActualizarCarrito() {
    localStorage.setItem('carrito_sketch', JSON.stringify(carrito));
    actualizarContadorCarrito();
    renderizarModalCarrito();
}

function actualizarContadorCarrito() {
    let totalItems = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    let contador = document.getElementById("contador-carrito");
    if (contador) contador.textContent = totalItems;
}

function renderizarModalCarrito() {
    let listaContainer = document.getElementById("lista-carrito");
    let totalContainer = document.getElementById("total-carrito");
    if (!listaContainer || !totalContainer) return;

    listaContainer.innerHTML = "";

    if (carrito.length === 0) {
        listaContainer.innerHTML = `
        <div class="estado-vacio">
            <i class="bi bi-cart-x text-muted" style="font-size: 3rem;"></i>
            <h6 class="fw-bold mt-3 mb-1">Tu pedido está vacío</h6>
            <p class="text-muted small mb-0">Explora el menú y agrega algo rico.</p>
        </div>
    `;
        totalContainer.textContent = "$0 MXN";

        // Deshabilitar el botón "Mostrar al mesero" si no hay items
        let btnMostrar = document.getElementById('btnMostrarMesero');
        if (btnMostrar) btnMostrar.disabled = true;

        return;
    }

    // Si hay items, aseguramos que el botón esté habilitado
    let btnMostrar = document.getElementById('btnMostrarMesero');
    if (btnMostrar) btnMostrar.disabled = false;

    let total = 0;
    carrito.forEach((item, index) => {
        let subtotal = item.precio * item.cantidad;
        total += subtotal;

        let div = document.createElement("div");
        div.className = "list-group-item d-flex justify-content-between align-items-center py-3";
        div.innerHTML = `
            <div>
                <h6 class="mb-0 fw-bold">${formatearNombre(item.nombre)}</h6>
                ${item.descripcion ? `<small class="text-muted d-block">${item.descripcion}</small>` : ''}
                <small class="text-muted">$${item.precio} c/u</small>
            </div>
            <div class="d-flex align-items-center gap-3">
                <!-- Controles de Cantidad (+ / -) -->
                <div class="btn-group btn-group-sm border rounded" role="group">
                    <button type="button" class="btn btn-light px-2" onclick="cambiarCantidad(${index}, -1)">-</button>
                    <span class="px-2 d-flex align-items-center fw-bold bg-white">${item.cantidad}</span>
                    <button type="button" class="btn btn-light px-2" onclick="cambiarCantidad(${index}, 1)">+</button>
                </div>
                <span class="fw-bold text-dark" style="min-width: 60px; text-align: right;">$${subtotal}</span>
                <button class="btn btn-outline-danger btn-sm border-0" onclick="eliminarDelCarrito(${index})" title="Eliminar producto">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        `;
        listaContainer.appendChild(div);
    });

    totalContainer.textContent = `$${total} MXN`;
}

// Nueva función para sumar o restar cantidades
function cambiarCantidad(index, cambio) {
    carrito[index].cantidad += cambio;

    // Si la cantidad baja a 0 o menos, podemos eliminarlo automáticamente o dejarlo en 1
    if (carrito[index].cantidad <= 0) {
        carrito.splice(index, 1);
    }

    guardarYActualizarCarrito();
}

function eliminarDelCarrito(index) {
    carrito.splice(index, 1);
    guardarYActualizarCarrito();
}

// Variable para respaldar el último carrito en caso de borrado accidental
let carritoRespaldo = [];

function vaciarCarrito() {
    if (carrito.length === 0) return;

    // Pedir confirmación para evitar accidentes
    if (confirm("¿Estás seguro de que deseas vaciar todo tu pedido?")) {
        carritoRespaldo = [...carrito]; // Guardamos copia de seguridad
        carrito = [];
        guardarYActualizarCarrito();

        // Mostrar aviso temporal con opción de deshacer
        mostrarAlertaRestaurar();
    }
}

function restaurarCarrito() {
    if (carritoRespaldo.length > 0) {
        carrito = [...carritoRespaldo];
        carritoRespaldo = [];
        guardarYActualizarCarrito();
    }
}

function mostrarAlertaRestaurar() {
    let listaContainer = document.getElementById("lista-carrito");
    if (!listaContainer) return;

    // Añadimos un aviso dentro del modal del carrito
    let alertaDiv = document.createElement("div");
    alertaDiv.className = "alert alert-warning alert-dismissible fade show mt-2 small d-flex justify-content-between align-items-center";
    alertaDiv.innerHTML = `
        <span>Pedido vaciado.</span>
        <button class="btn btn-sm btn-dark py-0" onclick="restaurarCarrito()">Deshacer</button>
    `;
    listaContainer.prepend(alertaDiv);
}

// Al cerrar el carrito desde "Mostrar a Mesero", abrimos el modal de confirmación.
let mostrarPedidoListoAlCerrar = false;

document.addEventListener("click", (evento) => {
    if (evento.target.closest("#btnMostrarMesero")) {
        mostrarPedidoListoAlCerrar = true;
    }
});

document.getElementById('modalCarrito')?.addEventListener('show.bs.modal', () => {
    renderizarModalCarrito();
});

document.getElementById('modalCarrito')?.addEventListener('hidden.bs.modal', () => {
    if (!mostrarPedidoListoAlCerrar) return;

    mostrarPedidoListoAlCerrar = false;
    const modalPedidoListo = document.getElementById('modalPedidoListo');
    if (modalPedidoListo && window.bootstrap) {
        bootstrap.Modal.getOrCreateInstance(modalPedidoListo).show();
    }
});

// Función para mostrar la notificación flotante (Toast)
function mostrarToastNotificacion(mensaje) {
    let toastEl = document.getElementById('toastAgregarCarrito');
    let toastMensaje = document.getElementById('toastMensaje');

    if (toastEl && toastMensaje) {
        toastMensaje.textContent = mensaje;
        let toast = new bootstrap.Toast(toastEl, { delay: 2500 }); // Se oculta tras 2.5 segundos
        toast.show();
    }
}

// Listener delegado: cualquier botón con data-agregar-carrito agrega su producto.
// Se usa así para no repetir onclick con JSON en cada plantilla HTML.
document.addEventListener("click", (evento) => {
    const boton = evento.target.closest("[data-agregar-carrito]");
    if (!boton) return;

    agregarAlCarrito({
        id: boton.dataset.id || `producto_${Date.now()}`,
        nombre: boton.dataset.nombre || "Producto",
        precio: Number(boton.dataset.precio) || 0,
        descripcion: boton.dataset.descripcion || "",
        cantidad: Number(boton.dataset.cantidad) || 1
    });
});