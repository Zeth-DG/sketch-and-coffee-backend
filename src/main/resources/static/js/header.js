export async function cargarHeader() {
  const contenedorHeader = document.querySelector("#header-global");

  if (!contenedorHeader) {
    return;
  }

  try {
    const respuesta = await fetch("./componentes/header.html");

    if (!respuesta.ok) {
      throw new Error("No se pudo cargar el header.");
    }

    const headerHTML = await respuesta.text();

    contenedorHeader.innerHTML = headerHTML;

    const campoBusqueda = contenedorHeader.querySelector("#buscar-producto");
    if (campoBusqueda) {
      campoBusqueda.value = new URLSearchParams(window.location.search).get("buscar") || "";
    }

    configurarSesion(contenedorHeader);
    marcarEnlaceActivo();
    await cargarCarritoGlobal();
  } catch (error) {
    console.error("Error al cargar el header:", error);
  }
}

/**
 * Carga el modal y la lógica del carrito una sola vez por página.
 * En menu-interactivo.html el script ya viene incluido, por eso se comprueba
 * que la API no exista antes de inyectarlo de nuevo.
 */
async function cargarCarritoGlobal() {
  try {
    if (typeof window.agregarAlCarrito !== "function") {
      const respuesta = await fetch("./componentes/carrito.html");
      if (!respuesta.ok) {
        throw new Error("No se pudo cargar el componente del carrito.");
      }

      document.body.insertAdjacentHTML("beforeend", await respuesta.text());

      await new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = new URL("../js/carrito-menu-interactivo.js", import.meta.url).href;
        script.onload = resolve;
        script.onerror = () => reject(new Error("No se pudo cargar carrito-menu-interactivo.js"));
        document.body.appendChild(script);
      });
    }

    if (typeof window.actualizarContadorCarrito === "function") {
      window.actualizarContadorCarrito();
    }
    if (typeof window.renderizarModalCarrito === "function") {
      window.renderizarModalCarrito();
    }
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
}

function configurarSesion(header) {
  const botonCuenta = header.querySelector("#btnCuenta");
  const enlacePanel = header.querySelector("#btnPanelAdmin");
  const botonCerrarSesion = header.querySelector("#btnCerrarSesion");
  let usuario = null;

  try {
    usuario = JSON.parse(localStorage.getItem("app_authenticated_user") || "null");
  } catch (error) {
    console.error("No se pudo leer la sesión:", error);
  }

  if (!usuario) return;

  if (botonCuenta) botonCuenta.classList.add("d-none");
  if (botonCerrarSesion) botonCerrarSesion.classList.remove("d-none");
  if (usuario.rol === "administrador" && enlacePanel) {
    enlacePanel.classList.remove("d-none");
  }

  botonCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("app_authenticated_user");
    window.location.replace("index.html");
  });
}

export function marcarEnlaceActivo() {
  const paginaActual = window.location.pathname.split("/").pop() || "index.html";

  const enlaces = document.querySelectorAll("#header-global .nav-link");

  enlaces.forEach((enlace) => {
    const destino = enlace.getAttribute("href").split("/").pop();

    enlace.classList.remove("active");
    enlace.removeAttribute("aria-current");

    if (destino === paginaActual) {
      enlace.classList.add("active");
      enlace.setAttribute("aria-current", "page");
    }
  });
}
