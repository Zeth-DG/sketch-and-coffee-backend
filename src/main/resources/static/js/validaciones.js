export function validarCorreo (email){
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

export function validarTelefono(telefono){
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

    const telefonoSinSeparadores = telefonoLimpio.replace(/[\s()-]/g, "");

    // 10 dígitos exactos y sin 3 (o más) números iguales consecutivos (ej. 888, 111).
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

export function validarMensaje(mensaje){
    if (typeof mensaje != "string"){
        return{
            valido: false, 
            mensaje: "El mensaje debe ser texto."
        }; 
    }//debe ser texto 

    const mensajeLimpio = mensaje.trim();
    
    if(mensajeLimpio === ""){
        return{
            valido: false, 
            mensaje: "Escribe tu mensaje."
        };
    }//if
    
    if(mensajeLimpio.length < 10){
        return{
            valido: false, 
            mensaje: `Tu mensaje debe tener al menos 10 caracteres (llevas ${mensajeLimpio.length})`
        };
    }//if

    if(mensajeLimpio.length>1000){
        return{
            valido: false, 
            mensaje: `Tu mensaje no puede pasar de 1000 caracteres (llevas ${mensajeLimpio.length})`
        };
    }//if

    return{
        valido: true,
        mensaje: "El mensaje es válido"
    }//return
}//funcion validar mensaje

export function validarNombre (nombre){
    if(typeof nombre !== "string"){
        return{
            valido: false, 
            mensaje: "Introduce texto"
        }
    }//validar que sea un string

    const nombreLimpio = nombre.trim();

    if (nombreLimpio === "") {
        return {
            valido: false, 
            mensaje: "Escribe tu nombre."
        }; 
    }

    if (nombreLimpio.length < 3 || nombreLimpio.length > 100 ){
        return {
            valido: false,
            mensaje: "Tu nombre debe tener entre 3 y 100 caracteres."
        }; 
    }
    const nameRegex = /^[\p{L}\s\.-]+$/u;

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

export function validarAsunto(asunto){
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

export function validarPrivacidad(aceptada){
    if (aceptada === "null" || aceptada === "undefined" || aceptada === "false" || aceptada === ""){
        return{
            valido: false, 
            mensaje: "Marca la casilla para aceptar el aviso de privacidad."
        };
    }//if

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

// Validar Nombre del producto Alexandra
export function validarNombreProducto(nombre) {
    if (typeof nombre !== "string") {
        return {
            valido: false,
            mensaje: "Introduce texto para el nombre."
        };
    }

    const nombreLimpio = nombre.trim();

    if (nombreLimpio === "") {
        return {
            valido: false,
            mensaje: "Escribe el nombre del producto."
        };
    }

    if (nombreLimpio.length < 3 || nombreLimpio.length > 100) {
        return {
            valido: false,
            mensaje: "El nombre del producto debe tener entre 3 y 100 caracteres."
        };
    }
    
    const regexNombre = /^[\p{L}0-9\s\.\-]+$/u;
    if (!regexNombre.test(nombreLimpio)) {
        return { valido: false, mensaje: "El nombre contiene caracteres no permitidos." };
    }

    return {
        valido: true,
        mensaje: "Nombre del producto válido."
    };
}//función validar nombre de producto

//Validar Descripcion del producto Alexandra 
export function validarDescripcionProducto(descripcion) {
    if (typeof descripcion !== "string") {
        return {
            valido: false,
            mensaje: "La descripción debe ser texto."
        };
    }

    const descripcionLimpia = descripcion.trim();

    if (descripcionLimpia === "") {
        return {
            valido: false,
            mensaje: "Escribe una descripción para el producto."
        };
    }

    if (descripcionLimpia.length < 5 || descripcionLimpia.length > 500) {
        return {
            valido: false,
            mensaje: "La descripción debe tener entre 5 y 500 caracteres."
        };
    }

    const regexDescripcion = /^[\p{L}0-9\s\.\-]+$/u;
    if (!regexDescripcion.test(descripcionLimpia)) {
        return {
            valido: false,
            mensaje: "La descripción contiene caracteres no permitidos."
        };
    }

    return {
        valido: true,
        mensaje: "Descripción válida."
    };
}//función validar descripción

//====================================================================
// Validar Precio del producto(Manuel)
export function validarPrecioProducto(precio) {
    const precioNum = Number(precio);
    
    if (precio === "" || isNaN(precioNum)) {
        return {
            valido: false,
            mensaje: "Introduce un precio válido para el producto."
        };

    }

    if (precioNum <= 0) {
        return {
            valido: false,
            mensaje: "El precio debe ser mayor a cero."
        };

    }

    if (precioNum > 100000) {
        return {
            valido: false,
            mensaje: "El precio excede el límite máximo permitido."
        };

    }

    return {
        valido: true,
        mensaje: "Precio del producto válido."
    };

}// validarPrecioProducto

//==============================================================================
// Validar Categoria del producto (Manuel)
export function validarCategoriaProducto(categoria) {
    const categoriasPermitidas = [
        "Bebidas calientes",
        "Bebidas frías",
        "Postres",
        "Platillos",
        "Café en grano"
    ];
    
    if (!categoria || !categoriasPermitidas.includes(categoria.trim())) {
        return {
            valido: false,
            mensaje: "Selecciona una categoría válida del menú."
        };
    }

    return {
        valido: true,
        mensaje: "Categoría válida."
    };
}// validarCategoriaProducto


// ===========================================================================================

// Validar Stock del producto (Máximo 10 productos) NOTA: Este valor puede cambiar en un futuro (Manuel)
export function validarStockProducto(stock) {
    const stockNum = Number(stock);

    if (stock === "" || isNaN(stockNum) || !Number.isInteger(stockNum)) {
        return {
            valido: false,
            mensaje: "Introduce un número entero válido para el stock."
        };

    }

    if (stockNum < 0) {
        return {
            valido: false,
            mensaje: "El stock no puede ser un valor negativo."
        };

    }

    if (stockNum > 10) {
        return {
            valido: false,
            mensaje: "El stock máximo permitido es de hasta 10 productos."
        };

    }

    return {
        valido: true,
        mensaje: "Stock válido."
    };

}//validarStockProducto

//=============FIN VALIDACIONES MANUEL =======================================

// ============================================================
//   VALIDACIONES DEL FORMULARIO DE REGISTRO
//   Reutilizan las funciones de arriba. Las versiones
//   repetidas y que no cumplían los criterios necesarios 
//   (validarNombreRegistro, validarTelefonoRegistro,
//   validarCorreoRegistro, validarContrasenaRegistro,
//   validarConfirmarContrasena, validarApellidoRegistro) se
//   eliminaron porque eran más laxas.
// ============================================================

// Validar Apellido — misma lógica que validarNombre.
export function validarApellido(apellido) {
    if (typeof apellido !== "string") {
        return {
            valido: false,
            mensaje: "Introduce texto"
        };
    }

    const apellidoLimpio = apellido.trim();

    if (apellidoLimpio === "") {
        return {
            valido: false,
            mensaje: "Escribe tu apellido."
        };
    }

    if (apellidoLimpio.length < 3 || apellidoLimpio.length > 100) {
        return {
            valido: false,
            mensaje: "Tu apellido debe tener entre 3 y 100 caracteres."
        };
    }

    const apellidoRegex = /^[\p{L}\s\.-]+$/u;

    if (!apellidoRegex.test(apellidoLimpio)) {
        return {
            valido: false,
            mensaje: "Usa solo letras, espacios, puntos o guiones. No uses números ni símbolos."
        };
    }

    return {
        valido: true,
        mensaje: "Apellido válido."
    };
}

// Validar Contraseña — mínimo 6 caracteres (coincide con el placeholder).
// OJO: NO usamos .trim() porque un espacio al inicio/final SÍ es parte
// de la contraseña que el usuario escribió.
export function validarContrasena(contrasena) {
    if (typeof contrasena !== "string") {
        return {
            valido: false,
            mensaje: "La contraseña debe recibirse como texto."
        };
    }

    if (contrasena === "") {
        return {
            valido: false,
            mensaje: "Escribe tu contraseña."
        };
    }

    if (contrasena.length < 6) {
        return {
            valido: false,
            mensaje: `Tu contraseña debe tener al menos 6 caracteres (llevas ${contrasena.length}).`
        };
    }

    return {
        valido: true,
        mensaje: "Contraseña válida."
    };
}

// Compara "Contraseña" con "Confirmar contraseña" (Gonzalo).
export function validarCoincidenciaContrasenas(contrasena, confirmacion) {
    if (typeof contrasena !== "string" || typeof confirmacion !== "string") {
        return {
            valido: false,
            mensaje: "Las contraseñas deben recibirse como texto."
        };
    }

    if (confirmacion === "") {
        return {
            valido: false,
            mensaje: "Vuelve a escribir tu contraseña para confirmarla."
        };
    }

    if (contrasena !== confirmacion) {
        if (contrasena.trim() === confirmacion.trim()) {
            return {
                valido: false,
                mensaje: "Las contraseñas no coinciden: a una le sobran espacios al inicio o al final."
            };
        }

        if (contrasena.toLowerCase() === confirmacion.toLowerCase()) {
            return {
                valido: false,
                mensaje: "Las contraseñas no coinciden: cambian las mayúsculas. Revisa si tienes Bloq Mayús activado."
            };
        }

        return {
            valido: false,
            mensaje: "Las contraseñas no coinciden. Revísalas e inténtalo de nuevo."
        };
    }

    return {
        valido: true,
        mensaje: "Las contraseñas coinciden."
    };
}