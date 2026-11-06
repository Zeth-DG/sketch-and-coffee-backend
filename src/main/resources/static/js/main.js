import { cargarHeader } from "./header.js"
import { cargarFooter } from "./footer.js";


// ==========================================
//      CONFIGURACIÓN DE EMAILJS
// ==========================================
// Datos de la cuenta de EmailJS de la cafetería.
const EMAILJS_PUBLIC_KEY  = "zFMrBrDP8RI_sAiW5";
const EMAILJS_SERVICE_ID  = "service_q308q27";
const EMAILJS_TEMPLATE_ID = "template_24el2ub";

// Se comprueba que el SDK haya cargado antes de usarlo. Si el CDN no
// responde (sin internet, red bloqueada), el resto de la página sigue
// funcionando en lugar de romperse por completo.
const emailjsDisponible = typeof emailjs !== "undefined";

if (emailjsDisponible) {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
} else {
  console.warn("EmailJS no cargó: el formulario validará pero no enviará correo.");
}

cargarHeader();
cargarFooter();