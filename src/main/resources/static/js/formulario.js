import {validarCorreo, validarNombre, validarTelefono, validarMensaje, validarAsunto, validarPrivacidad} from "./validaciones.js"
import {mostrarError, actualizarErrorCampo, actualizarErrorPrivacidad, configurarValidacionCampo} from "./interfaz.js"
import {MensajeUsuario} from "./mensaje-usuario.js"

// Definimos las constantes aquí mismo para no depender de main.js
const EMAILJS_SERVICE_ID  = "service_q308q27";
const EMAILJS_TEMPLATE_ID = "template_24el2ub";

document.addEventListener("DOMContentLoaded", () => {
  
  // ... (tus variables del DOM siguen igual)
  const iptNombre = document.getElementById("campoNombre"); 
  const errorNombre = document.getElementById("errorNombre"); 
  const iptTelefono = document.getElementById("campoTelefono"); 
  const errorTelefono = document.getElementById("errorTelefono"); 
  const iptEmail = document.getElementById("campoCorreo"); 
  const errorEmail = document.getElementById("errorEmail"); 
  const slcAsunto = document.getElementById("campoAsunto"); 
  const errorAsunto = document.getElementById("errorAsunto"); 
  const iptMensaje = document.getElementById("campoMensaje");
  const errorMensaje = document.getElementById("errorMensaje"); 
  const successMessage = document.getElementById("successMessage");
  const errorPrivacidad = document.getElementById("errorPrivacidad"); 
  const contactForm = document.getElementById("formularioContacto");
  const btnEnviar = document.getElementById("btnEnviar"); 
  const privacidad = document.getElementById("campoPrivacidad");

  // menu.html también carga este archivo, pero no tiene el formulario de contacto.
  if (!contactForm) return;

  contactForm.addEventListener("submit", (evento) => {
    evento.preventDefault(); 
    
    // ... (tus validaciones siguen igual)
    let nombreUsr = iptNombre.value; 
    let telefonoUsr = iptTelefono.value; 
    let emailUsr = iptEmail.value; 
    let asuntoUsr = slcAsunto.value; 
    let mensajeUsr = iptMensaje.value; 
    
    let resultadoNombre = validarNombre(nombreUsr); 
    let resultadoTelefono = validarTelefono(telefonoUsr); 
    let resultadoEmail = validarCorreo(emailUsr); 
    let resultadoAsunto = validarAsunto(asuntoUsr); 
    let resultadoMensaje = validarMensaje(mensajeUsr); 
    let resultadoPrivacidad = validarPrivacidad(privacidad.checked); 

    mostrarError(errorNombre, resultadoNombre); 
    mostrarError(errorTelefono, resultadoTelefono); 
    mostrarError(errorEmail, resultadoEmail); 
    mostrarError(errorAsunto, resultadoAsunto);
    mostrarError(errorMensaje, resultadoMensaje); 
    mostrarError(errorPrivacidad, resultadoPrivacidad); 

    const formularioValido = 
      resultadoNombre.valido &&
      resultadoTelefono.valido &&
      resultadoEmail.valido &&
      resultadoAsunto.valido &&
      resultadoMensaje.valido &&
      resultadoPrivacidad.valido; 

    if(!formularioValido){
      return; 
    }

    const nuevoMensaje = new MensajeUsuario(nombreUsr, asuntoUsr, emailUsr, telefonoUsr, mensajeUsr); 
    // const mensajeFinal = nuevoMensaje.crearNuevoMensaje(); // No lo estás usando en el envío, pero lo dejo por si acaso

    // ==========================================
    //      ENVÍO DEL CORREO CON EMAILJS
    // ==========================================
    // Verificamos directamente si emailjs existe en el navegador
    if (typeof emailjs === "undefined") {
      alert("No se pudo conectar con el servicio de correo. Escríbenos por WhatsApp.");
      return;
    }

    const textoBoton = btnEnviar.textContent;
    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando…";

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      nombre:   nombreUsr,
      telefono: telefonoUsr,
      correo:   emailUsr,
      asunto:   asuntoUsr,
      mensaje:  mensajeUsr
    })
      .then(() => {
        contactForm.style.display = "none";
        successMessage.style.display = "block";
      })
      .catch((error) => {
        console.error("Error de EmailJS:", error);
        alert("No se pudo enviar el mensaje. Revisa tu conexión e inténtalo de nuevo.");
      })
      .finally(() => {
        btnEnviar.disabled = false;
        btnEnviar.textContent = textoBoton;
      });
  });

  //mostrar errores en tiempo real
  configurarValidacionCampo(iptEmail, errorEmail, validarCorreo);
  configurarValidacionCampo(iptTelefono, errorTelefono, validarTelefono);
  configurarValidacionCampo(iptNombre, errorNombre, validarNombre); 
  configurarValidacionCampo(iptMensaje, errorMensaje, validarMensaje); 
  configurarValidacionCampo(slcAsunto, errorAsunto, validarAsunto); 
  privacidad.addEventListener("change", () => {
    actualizarErrorPrivacidad(privacidad, errorPrivacidad, validarPrivacidad);
  });
});