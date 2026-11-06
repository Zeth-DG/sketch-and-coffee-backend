document.addEventListener("DOMContentLoaded", () => {

    // 1. Clase Base (Polimorfismo)
    class PromocionBase {
        constructor(datos) {
            this.titulo = datos.titulo;
            this.descripcion = datos.descripcion;
            this.precioActual = datos.precioActual;
            this.precioAnterior = datos.precioAnterior;
            this.imagen = datos.imagen;
            this.video = datos.video || null;
            this.altImg = datos.altImg;
            this.descuento = datos.descuento;
            this.categoria = datos.categoria;
            this.etiquetaTipo = datos.etiquetaTipo;
        }//constructor

        // Identificador y precio numérico para el carrito global
        get idCarrito() {
            return "promo-" + this.titulo
                .toLowerCase()
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
        }//idCarrito

        get precioCarrito() {
            return Number(String(this.precioActual).replace(/[^\d.]/g, "")) || 0;
        }//precioCarrito

        renderizar() {
            throw new Error("El método renderizar debe ser implementado por la subclase.");
        }//renderizar
    }//class PromocionBase

    // 2. Subclases especializadas (Polimorfismo aplicado con soporte opcional de video o imagen)
    class PromocionBebida extends PromocionBase {
        renderizar() {
            const mediaHTML = this.video
                ? `<video src="${this.video}" autoplay loop muted playsinline aria-label="${this.altImg}"></video>`
                : `<img src="${this.imagen}" alt="${this.altImg}">`;

            const precioAnteriorHTML = this.precioAnterior
                ? `<span class="precio-anterior text-muted text-decoration-line-through">${this.precioAnterior}</span>`
                : '';

            return `
                <div class="col-12 col-md-6 col-lg-4 item-promocion" data-categoria="${this.categoria}" role="listitem">
                    <article class="tarjeta-producto h-100 d-flex flex-column position-relative">
                        <span class="insignia-descuento" aria-label="Descuento ${this.descuento}">${this.descuento}</span>
                        <div class="contenedor-imagen-producto">
                            ${mediaHTML}
                        </div>
                        <div class="card-body p-4 d-flex flex-column flex-grow-1">
                            <div class="grupo-filtro mb-1"><h3 class="h6 text-uppercase fw-bold m-0" style="font-family: var(--fuente-titulo-principal); font-style: italic; color: var(--color-magenta);">${this.etiquetaTipo}</h3></div>
                            <h4 class="card-title h5 fw-bold mb-2">${this.titulo}</h4>
                            <p class="card-text small text-muted flex-grow-1">${this.descripcion}</p>
                            <div class="contenedor-precio d-flex align-items-baseline gap-2 mb-3">
                                <span class="precio-actual h4 fw-bold m-0" style="color: var(--color-magenta);">${this.precioActual}</span>
                                ${precioAnteriorHTML}
                            </div>
                            <button type="button" class="btn btn-custom-magenta w-100 mt-auto"
                                data-agregar-carrito data-id="${this.idCarrito}"
                                data-nombre="${this.titulo}" data-precio="${this.precioCarrito}"
                                aria-label="Añadir ${this.titulo} al carrito">
                                Añadir al carrito
                            </button>
                        </div>
                    </article>
                </div>
            `;
        }//renderizar
    }//class PromocionBebida

    class PromocionSnack extends PromocionBase {
        renderizar() {
            const mediaHTML = this.video
                ? `<video src="${this.video}" autoplay loop muted playsinline aria-label="${this.altImg}"></video>`
                : `<img src="${this.imagen}" alt="${this.altImg}">`;

            const precioAnteriorHTML = this.precioAnterior
                ? `<span class="precio-anterior text-muted text-decoration-line-through">${this.precioAnterior}</span>`
                : '';

            return `
                <div class="col-12 col-md-6 col-lg-4 item-promocion" data-categoria="${this.categoria}" role="listitem">
                    <article class="tarjeta-producto h-100 d-flex flex-column position-relative">
                        <span class="insignia-descuento" aria-label="Descuento ${this.descuento}">${this.descuento}</span>
                        <div class="contenedor-imagen-producto">
                            ${mediaHTML}
                        </div>
                        <div class="card-body p-4 d-flex flex-column flex-grow-1">
                            <div class="grupo-filtro mb-1"><h3 class="h6 text-uppercase fw-bold m-0" style="font-family: var(--fuente-titulo-principal); font-style: italic; color: var(--color-magenta);">${this.etiquetaTipo}</h3></div>
                            <h4 class="card-title h5 fw-bold mb-2">${this.titulo}</h4>
                            <p class="card-text small text-muted flex-grow-1">${this.descripcion}</p>
                            <div class="contenedor-precio d-flex align-items-baseline gap-2 mb-3">
                                <span class="precio-actual h4 fw-bold m-0" style="color: var(--color-magenta);">${this.precioActual}</span>
                                ${precioAnteriorHTML}
                            </div>
                            <button type="button" class="btn btn-custom-magenta w-100 mt-auto"
                                data-agregar-carrito data-id="${this.idCarrito}"
                                data-nombre="${this.titulo}" data-precio="${this.precioCarrito}"
                                aria-label="Añadir ${this.titulo} al carrito">
                                Añadir al carrito
                            </button>
                        </div>
                    </article>
                </div>
            `;
        }//renderizar
    }//class PromocionSnack

    class PromocionPostre extends PromocionBase {
        renderizar() {
            const mediaHTML = this.video
                ? `<video src="${this.video}" autoplay loop muted playsinline aria-label="${this.altImg}"></video>`
                : `<img src="${this.imagen}" alt="${this.altImg}">`;

            const precioAnteriorHTML = this.precioAnterior
                ? `<span class="precio-anterior text-muted text-decoration-line-through">${this.precioAnterior}</span>`
                : '';

            return `
                <div class="col-12 col-md-6 col-lg-4 item-promocion" data-categoria="${this.categoria}" role="listitem">
                    <article class="tarjeta-producto h-100 d-flex flex-column position-relative">
                        <span class="insignia-descuento" aria-label="Oferta especial">${this.descuento}</span>
                        <div class="contenedor-imagen-producto">
                            ${mediaHTML}
                        </div>
                        <div class="card-body p-4 d-flex flex-column flex-grow-1">
                            <div class="grupo-filtro mb-1"><h3 class="h6 text-uppercase fw-bold m-0" style="font-family: var(--fuente-titulo-principal); font-style: italic; color: var(--color-magenta);">${this.etiquetaTipo}</h3></div>
                            <h4 class="card-title h5 fw-bold mb-2">${this.titulo}</h4>
                            <p class="card-text small text-muted flex-grow-1">${this.descripcion}</p>
                            <div class="contenedor-precio d-flex align-items-baseline gap-2 mb-3">
                                <span class="precio-actual h4 fw-bold m-0" style="color: var(--color-magenta);">${this.precioActual}</span>
                                ${precioAnteriorHTML}
                            </div>
                            <button type="button" class="btn btn-custom-magenta w-100 mt-auto"
                                data-agregar-carrito data-id="${this.idCarrito}"
                                data-nombre="${this.titulo}" data-precio="${this.precioCarrito}"
                                aria-label="Agregar ${this.titulo} al carrito">
                                Agregar al carrito
                            </button>
                        </div>
                    </article>
                </div>
            `;
        }//renderizar
    }//class PromocionPostre

    let listaDatosPromos = [];
    const gridPromociones = document.getElementById("grid-promociones");
    const contadorPromos = document.getElementById("contador-promos");

    function renderizarCatalogo(filtro = "todos") {
        if (!gridPromociones) return;
        gridPromociones.innerHTML = "";
        let visibles = 0;

        listaDatosPromos.forEach(promo => {
            if (filtro === "todos" || promo.categoria === filtro) {
                gridPromociones.innerHTML += promo.renderizar();
                visibles++;
            }//if
        });//forEach listaDatosPromos

        if (contadorPromos) {
            contadorPromos.textContent = `${visibles} Promoción${visibles !== 1 ? 'es' : ''} vigente${visibles !== 1 ? 's' : ''}`;
        }//if contadorPromos
    }//renderizarCatalogo

    // 3. Función Asíncrona con tus productos personalizados
    async function cargarPromocionesEnVivo() {
        try {
            const datosRemotos = await new Promise((resolve) => {
                setTimeout(() => {
                    resolve([
                        {
                            titulo: "2x1 en Café",
                            descripcion: "Llévate una taza de cafe de tu elección y recibe otra gratis. Oferta válida solo Lunes",
                            precioActual: "$55.00 MXN",
                            precioAnterior: "",
                            imagen: "./imagenes/cafeteria/cafe_americano.jpg",
                            altImg: "Café Americano: Taza de café humeante",
                            descuento: "",
                            categoria: "combo-bebidas",
                            etiquetaTipo: "Oferta Especial"
                        },
                        {
                            titulo: "Cafe + Pay de Queso",
                            descripcion: "Disfruta de un delicioso café acompañado de un pay de queso recién horneado. Oferta válida solo miercoles",
                            precioActual: "$120.00 MXN",
                            precioAnterior: "$150.00 MXN",
                            imagen: "./imagenes/alimentos-menu/cafepayn.jpg",
                            altImg: "Dúo de Origen: Dos bolsas de café",
                            descuento: "-15%",
                            categoria: "combo-postres",
                            etiquetaTipo: "Deleite"
                        },
                        {
                            titulo: "Cafe + Alimento a elección",
                            descripcion: "Disfruta de un café de tu elección acompañado de un alimento a tu gusto. Oferta válida en tu primera compra",
                            precioActual: "$100.00 MXN",
                            precioAnterior: "$120.00",
                            imagen: "./imagenes/alimentos-menu/chilaquiles.jpeg",
                            altImg: "Chilaquiles: Plato de chilaquiles con salsa roja y crema",
                            descuento: "-20%",
                            categoria: "combo-snacks",
                            etiquetaTipo: "Calma el antojo"
                        }
                    ]);//resolve
                }, 500);//setTimeout
            });//datosRemotos

            listaDatosPromos = datosRemotos.map(item => {
                if (item.categoria === "combo-bebidas") {
                    return new PromocionBebida(item);

                }//if

                if (item.categoria === "combo-snacks") {
                    return new PromocionSnack(item);

                }//if

                if (item.categoria === "combo-postres") {
                    return new PromocionPostre(item);

                }//if
                return new PromocionPostre(item);

            });//map datosRemotos

            renderizarCatalogo("todos");

        } catch (error) {
            console.error("Error al sincronizar promociones en tiempo real:", error);
            if (gridPromociones) {
                gridPromociones.innerHTML = `<div class="col-12 text-center py-5"><p class="text-danger">No se pudieron cargar las promociones actualizadas.</p></div>`;
            }//if
        }//catch

    }//cargarPromocionesEnVivo

    cargarPromocionesEnVivo();

    // 4. Temporizador Regresivo (Urgencia Flash)
    let tiempoRestante = 12 * 3600;
    const elHoras = document.getElementById("horas");
    const elMinutos = document.getElementById("minutos");
    const elSegundos = document.getElementById("segundos");

    function actualizarTemporizador() {
        if (tiempoRestante <= 0 || !elHoras) return;
        tiempoRestante--;
        elHoras.textContent = String(Math.floor(tiempoRestante / 3600)).padStart(2, '0');
        elMinutos.textContent = String(Math.floor((tiempoRestante % 3600) / 60)).padStart(2, '0');
        elSegundos.textContent = String(tiempoRestante % 60).padStart(2, '0');

    }//actualizarTemporizador

    setInterval(actualizarTemporizador, 1000);

    // 5. Filtros Interactivos
    const botonesFiltro = document.querySelectorAll(".selector-rapido button");
    botonesFiltro.forEach(boton => {
        boton.addEventListener("click", () => {
            botonesFiltro.forEach(b => {
                b.classList.remove("btn-filtro-activo", "activo");
                b.classList.add("btn-filtro-inactivo");
                b.setAttribute("aria-pressed", "false");
            });//forEach botonesFiltro

            boton.classList.remove("btn-filtro-inactivo");
            boton.classList.add("btn-filtro-activo", "activo");
            boton.setAttribute("aria-pressed", "true");

            renderizarCatalogo(boton.getAttribute("data-filtro"));

        });//click

    });//forEach botonesFiltro

    // 6. Botón Subir
    const btnSubir = document.getElementById("btnSubir");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            if (btnSubir) btnSubir.style.display = "flex";
        } else {
            if (btnSubir) btnSubir.style.display = "none";
        }//else

    });//scroll

    if (btnSubir) {
        btnSubir.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }//ifbtnsubir
});//DOMContentLoaded