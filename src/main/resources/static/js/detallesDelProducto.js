// ==========================================================================
// INTERACCIONES PARA DETALLES DEL PRODUCTO - SKETCH & COFFEE
// ARCHIVO: ./js/script.js
// ==========================================================================

// Formato "Oración": primera letra en mayúscula y el resto en minúsculas.
function formatearNombre(texto) {
  if (!texto) return "";
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase();
}

/**
 * Cambia la imagen principal cuando el usuario hace clic en una miniatura
 * @param {HTMLElement} element - La miniatura (div) que recibió el clic
 * @param {string} newSrc - Ruta local de la imagen (ej. './assets/img/foto1.jpg')
 */
function changeImage(element, newSrc) {
  const mainImg = document.getElementById('main-product-img');
  if (!mainImg) return;

  mainImg.src = newSrc;
  mainImg.alt = `Vista del ${document.getElementById('product-title').textContent}`;
  document.querySelectorAll('.thumb-item').forEach(item => {
    item.classList.remove('active');
  });
  element.classList.add('active');
}

/**
 * Selecciona una opción dentro de un grupo (Molienda o Gramaje)
 * @param {HTMLElement} button - Botón de la opción clickeada
 */
function selectOption(button) {
  const parent = button.parentElement;
  parent.querySelectorAll('.btn-option').forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
}

/**
 * Incrementa o decremeta el contador de cantidad (+ / -)
 * @param {number} val - Cantidad a sumar (+1) o restar (-1)
 */
function updateQty(val) {
  const input = document.getElementById('qty-input');
  if (!input) return;

  let current = parseInt(input.value) || 1;
  current = Math.max(1, Math.min(10, current + val));
  input.value = current;
}

/**
 * Agrega al carrito global el producto que se está viendo,
 * respetando la cantidad elegida en el selector.
 */
let productoActualId = 1;
function addToCart() {
  const producto = products[productoActualId];
  if (!producto) return;

  if (typeof window.agregarAlCarrito !== "function") {
    console.warn("El carrito global todavía no está disponible.");
    return;
  }

  const input = document.getElementById('qty-input');
  const qty = input ? (parseInt(input.value) || 1) : 1;
  const precio = Number(String(producto.price).replace(/[^\d.]/g, "")) || 0;

  agregarAlCarrito({
    id: `detalle-${productoActualId}`,
    nombre: formatearNombre(producto.name),
    precio: precio,
    cantidad: qty
  });
}

/**
 * Alterna el contenido visible entre las pestañas (Tabs)
 * @param {Event} evt - Evento de clic
 * @param {string} tabName - ID del contenedor de la pestaña (ej. 'tab-desc')
 */
function openTab(evt, tabName) {
  // Oculta todos los contenidos y quita estados activos
  document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));

  // Muestra el contenido seleccionado y activa el botón correspondete
  const targetTab = document.getElementById(tabName);
  if (targetTab) {
    targetTab.classList.add('active');
  }

  evt.currentTarget.classList.add('active');
}

// ==========================================================================
// PRODUCTOS DEL CARRUSEL
// ==========================================================================

const products = {
  1: {
    name: "LATTE",
    price: "$ 85.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffe_Latte.jpg", "./imagenes/fotosComidaTop10/Sketch&Coffe_Latte_2.png", "./imagenes/fotosComidaTop10/Sketch&Coffe_Latte_3.png"],
    desc: "Espresso de altura coronado con una densa capa de microespuma de leche de tu preferencia.",
    cata: "Perfil suave, cremoso y equilibrado.",
    prep: "Servir caliente para disfrutar el equilibrio del espresso con la leche vaporizada.",
    envio: "Disponible para recoger en sucursal."
  },
  2: {
    name: "CAPUCHINO",
    price: "$ 90.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffee_IA_Capuchino1.jpg", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_Capuchino2.jpg", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_Capuchino3.jpg"],
    desc: "Un balance armonioso entre la intensidad del espresso de especialidad y una nube de leche al vapor suave y cremosa.",
    cata: "Notas dulces y achocolatadas.",
    prep: "Servir caliente, con su capa de espuma de leche.",
    envio: "Disponible para recoger en sucursal."
  },
  3: {
    name: "CHAI LATTE",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffee_IA_ChaiLatte1.jpg", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_ChaiLatte2.jpg", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_ChaiLatte3.jpg"],
    desc: "Infusión aromática de tés negros con cardamomo, canela y jengibre.",
    cata: "Perfil especiado y dulce.",
    prep: "Servir caliente para resaltar sus especias y aromas.",
    envio: "Disponible para recoger en sucursal."
  },
  4: {
    name: "CROISSANT SALADO",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffee_croissant salado.png", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_croissant salado2.jpg", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_croissant salado3.jpg"],
    desc: "Láminas doradas y crujientes de fino hojaldre artesanal, horneadas a la perfección para lograr una textura ligera, suave y esponjosa por dentro.",
    cata: "Perfil crujiente y sabroso.",
    prep: "Disfrutar recién horneado, ideal como opción salada.",
    envio: "Disponible para recoger en sucursal."
  },
  5: {
    name: "ENCHILADAS",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffee_Enchiladas_gratinadas.png", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_Enchiladas_gratinadas2.jpg", "./imagenes/fotosComidaTop10/Sketch&Coffee_IA_Enchiladas_gratinadas3.jpg"],
    desc: "Tortillas artesanales con pechuga de pollo bañadas en deliciosa crema y salsa de la casa, queso, cebolla fresca y cilantro recién cortado, listas para deleitar tu paladar.",
    cata: "Perfil picante y sabroso.",
    prep: "Servir calientes para disfrutar la salsa y el queso gratinado.",
    envio: "Disponible para recoger en sucursal."
  },
  6: {
    name: "CHILAQUILES",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffee_Chilaquiles.png", "./imagenes/alimentos-menu/chilaquiles.jpeg", "./imagenes/cafeteria/chilaquiles.jpg"],
    desc: "Totopos crujientes bañados con salsa especiada, enriquecidos con crema ácida, queso espolvoreado y el punto exacto de picor.",
    cata: "Perfil picante y sabroso.",
    prep: "Servir calientes para conservar el contraste de texturas.",
    envio: "Disponible para recoger en sucursal."
  },
  7: {
    name: "AMERICANO",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/alimentos-menu/americano.jpeg", "./imagenes/cafeteria/cafe_americano.jpg"],
    desc: "Extracción limpia de grano recién molido con notas tostadas, aroma envolvente y un perfil suave pero con carácter.",
    cata: "Notas tostadas y aroma envolvente, con un perfil suave pero con carácter.",
    prep: "Servir caliente para apreciar el aroma del café recién extraído.",
    envio: "Disponible para recoger en sucursal."
  },
  8: {
    name: "CHOCOLATE CALIENTE",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffee_Chocolate.png", "./imagenes/alimentos-menu/chocolate-caliente.jpeg"],
    desc: "Cacao puro fundido en leche entera, logrando una bebida rica, espesa y con el dulzor perfecto para reconfortar el alma.",
    cata: "Perfil dulce y cremoso.",
    prep: "Servir caliente para disfrutar su textura cremosa.",
    envio: "Disponible para recoger en sucursal."
  },
  9: {
    name: "TISANA PINK BLOSSOM",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/fotosComidaTop10/Sketch&Coffee_Tisana_Pink_Blossom.png", "./imagenes/cafeteria/Bebida_roja.jpg"],
    desc: "Infusión frutal de notas florales y matices rosados vibrantes, fresca, ligera y naturalmente dulce.",
    cata: "Perfil especiado y dulce.",
    prep: "Se puede disfrutar caliente o fría.",
    envio: "Disponible para recoger en sucursal."
  },
  10: {
    name: "CREPA CON NUTELLA Y PHILADELPHIA",
    price: "$ 95.00 MXN",
    rating: "★★★★★",
    images: ["./imagenes/menu-interactivo/crepas.jpg"],
    desc: "Fina crepa artesanal dorada a la plancha, rellena de queso crema y crema de avellana y cacao.",
    cata: "Textura suave con notas dulces de avellana y cacao.",
    prep: "Servir recién preparada.",
    envio: "Disponible para recoger en sucursal."
  }
};

function loadProduct(productId, shouldScroll = true) {
  const product = products[productId];
  if (!product) return;

  productoActualId = Number(productId) || productoActualId;

  const mainImage = document.getElementById("main-product-img");
  const title = document.getElementById("product-title");
  const price = document.getElementById("product-price");
  const rating = document.getElementById("product-rating");
  const thumbnails = document.getElementById("product-thumbnails");

  const nombreFormateado = formatearNombre(product.name);

  if (mainImage) {
    mainImage.src = product.images[0];
    mainImage.alt = nombreFormateado;
  }
  if (title) title.textContent = nombreFormateado;
  if (price) price.textContent = product.price;
  if (rating) rating.textContent = `CALIFICACIÓN • ${product.rating}`;

  if (thumbnails) {
    thumbnails.replaceChildren();
    product.images.forEach((image, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = `thumb-item${index === 0 ? " active" : ""}`;
      button.setAttribute("aria-label", `Ver imagen ${index + 1} de ${nombreFormateado}`);
      button.addEventListener("click", () => changeImage(button, image));

      const thumbnail = document.createElement("img");
      thumbnail.src = image;
      thumbnail.alt = "";
      thumbnail.addEventListener("error", () => {
        button.disabled = true;
        button.classList.add("thumb-item-placeholder");
        button.setAttribute("aria-label", `Vista ${index + 1} pendiente de imagen de ${nombreFormateado}`);
        button.textContent = `Vista ${index + 1}`;
      }, { once: true });
      button.append(thumbnail);
      thumbnails.append(button);
    });
  }

  document.getElementById("tab-desc").textContent = product.desc;
  document.getElementById("tab-cata").textContent = product.cata;
  document.getElementById("tab-prep").textContent = product.prep;
  document.getElementById("tab-envio").textContent = product.envio;

// ==========================================
  //    Logica dinamica para molienda y gramaje
  // ==========================================
  const grupoMolienda = document.getElementById("grupoMolienda");
  const grupoGramaje = document.getElementById("grupoGramaje");
  const botonesTamano = document.querySelectorAll(".btn-tamano");
  const labelGramaje = grupoGramaje ? grupoGramaje.querySelector(".option-label") : null;

  const nombreLower = product.name.toLowerCase();

  const esCafeGrano = nombreLower.includes("grano") || nombreLower.includes("americano");

  const esBebida = nombreLower.includes("latte") || 
                  nombreLower.includes("capuchino") || 
                  nombreLower.includes("chai") || 
                  nombreLower.includes("chocolate") || 
                  nombreLower.includes("tisana") || 
                  nombreLower.includes("americano");

  if (grupoMolienda) {
      if (esCafeGrano) {
        grupoMolienda.classList.remove("d-none");
      } else {
        grupoMolienda.classList.add("d-none");
      }
  }

  if (grupoGramaje) {
      if (esBebida || esCafeGrano) {
        grupoGramaje.classList.remove("d-none");
        
        if (labelGramaje) {
          labelGramaje.textContent = esBebida ? "Tamaño de bebida" : "Tamaño / gramaje";
        }

        // Cambiamos los textos de los botones dinámicamente
        if (botonesTamano.length >= 3) {
          if (esBebida) {
            botonesTamano[0].textContent = "Chico";
            botonesTamano[1].textContent = "Mediano";
            botonesTamano[2].textContent = "Grande";
          } else {
            botonesTamano[0].textContent = "250 g";
            botonesTamano[1].textContent = "500 g";
            botonesTamano[2].textContent = "1 kg";
          }
        }

      } else {
        grupoGramaje.classList.add("d-none");
      }
  }
  // ==========================================


  if (shouldScroll) {
    document.querySelector(".product-detail-grid").scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}

loadProduct(1, false);