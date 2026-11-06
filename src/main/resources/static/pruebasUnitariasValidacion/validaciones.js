function validarCorreo (email){
    if(typeof email !=="string"){
        return {
            valido: false, 
            mensaje: "Introduce texto"
        };
    }//verifica que sea un string

    const emailLimpio = email.trim(); //quitar espacios al inicio y al final
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/; //estructura aceptada 

    if(emailLimpio === ""){
        return {
            valido: false,
            mensaje: "Escribe tu correo electrónico."
        }
    }//verifica que no este vacío

    if (!emailRegex.test(emailLimpio)){
        return {
            valido: false,
            mensaje: "Escribe un correo con el formato nombre@dominio.com, sin espacios."
        }
    }//verifica que tenga la expresión regular de un email

    return {
        valido: true, 
        mensaje: "Correo electrónico válido"
    }; 
}//funcion validar correo 

module.exports.validarCorreo = validarCorreo; 

function validarTelefono(telefono){
    if(typeof telefono !== "string"){
        return {
            valido: false, 
            mensaje: "El teléfono debe recibirse como texto."
        };
    }//validar que sea tipo string, no necesitamos que sea número
    
    const telefonoLimpio = telefono.trim(); //quitar espacios al principio y al final

    if (telefonoLimpio === ""){
        return{
            valido: false, 
            mensaje: "Escribe tu número de teléfono."
        }; 
    }//no dejar el campo vacío

    //para quitar espacios, guiones y paréntesis entre números
    const telefonoSinSeparadores = telefonoLimpio.replace(/[\s()-]/g, "");
    //10 dígitos exactos y sin 3 (o más) números iguales consecutivos (ej. 888, 111)
    const regexTelefono = /^(?!.*(\d)\1{2})\d{10}$/;

    if (!regexTelefono.test(telefonoSinSeparadores)){
        return {
            valido: false, 
            mensaje: "Ingresa un teléfono válido de 10 dígitos (sin números repetidos 3 veces seguidas)"
        }; 
    }//if longitud incorrecta o números repetidos 3+ veces seguidas

    const primerDigito = telefonoSinSeparadores[0];

    if (!/[2-9]/.test(primerDigito)) {
        return { 
            valido: false, 
            mensaje: "El número debe empezar con un dígito del 2 al 9" 
        };
    }//if el numero no empieza con 2-9

    return {
        valido: true,
        mensaje: "El número telefónico es válido."
    }; 
}//funcion validar telefono sin separadores y de 10 dígitos

module.exports.validarTelefono = validarTelefono; 

function validarMensaje(mensaje){
    if (typeof mensaje != "string"){
        return{
            valido: false, 
            mensaje: "El mensaje debe ser texto."
        }; 
    }//debe ser texto 

    const mensajeLimpio = mensaje.trim(); //quitar espacios al inicio y al final
    
    //el mensaje esta vacío?
    if(mensajeLimpio === ""){
        return{
            valido: false, 
            mensaje: "Escribe tu mensaje."
        };
    }//if
    
    //el mensaje es de menos de 10 caracteres?
    if(mensajeLimpio.length < 10){
        return{
            valido: false, 
            mensaje: `Tu mensaje debe tener al menos 10 caracteres (llevas ${mensajeLimpio.length})`
        };
    }//if

    //el mensaje es muy largo?
    if(mensajeLimpio.length>1000){
        return{
            valido: false, 
            mensaje: `Tu mensaje no puede pasar de 1000 caracteres (llevas ${mensajeLimpio.length})`
        };
    }//if

    //paso todas las validaciones: 
    return{
        valido: true,
        mensaje: "El mensaje es válido"
    }//return
}//funcion validar mensaje

module.exports.validarMensaje = validarMensaje;

function validarNombre (nombre){
    if(typeof nombre !== "string"){
        return{
            valido: false, 
            mensaje: "Introduce texto"
        }
    }//validar que sea un string

    const nombreLimpio = nombre.trim();//quitar espacios al principio y al final

    //existe el dato nombre?
    if (nombreLimpio === "") {
        return {
            valido: false, 
            mensaje: "Escribe tu nombre."
        }; 
    }
    // el nombre tiene una longitud mayor a 3 caracteres pero menor a 30?
    if (nombreLimpio.length < 3 || nombreLimpio.length > 100 ){
        return {
            valido: false,
            mensaje: "Tu nombre debe tener entre 3 y 100 caracteres."
        }; 
    }
    const nameRegex = /^[\p{L}\s\.-]+$/u; //unicode se agrega que acepte puntos

    //tiene caracteres invalidos?
    if (!nameRegex.test(nombreLimpio)) {
        return {
            valido: false, 
            mensaje: "Usa solo letras, espacios, puntos o guiones. No uses números ni símbolos."
        }; 
    }

    return {
        valido: true,
        mensaje: "Nombre válido."
    };
}//funcion validar nombre

module.exports.validarNombre = validarNombre;

function validarAsunto(asunto){
    if (asunto === ""){
        return{
            valido: false, 
            mensaje: "Selecciona un asunto de la lista."
        }; 
    }

    return{
        valido: true,
        mensaje: "Asunto seleccionado correctamente."
    }
}//funcion validarAsunto

module.exports.validarAsunto = validarAsunto; 

function validarPrivacidad(aceptada){
    if (aceptada === "null" || aceptada === "undefined" || aceptada === "false" || aceptada === ""){
        return{
            valido: false, 
            mensaje: "Marca la casilla para aceptar el aviso de privacidad."
        };
    }//if

    //el checkbox está vacío?
    if (!aceptada){
        return{
            valido: false, 
            mensaje: "Marca la casilla para aceptar el aviso de privacidad."
        };
    }//if

    return{
        valido: true, 
        mensaje: "Aviso de privacidad aceptado correctamente."
    };
}//funcion validarPrivacidad

module.exports.validarPrivacidad = validarPrivacidad; 