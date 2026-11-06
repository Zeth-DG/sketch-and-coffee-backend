document.addEventListener("DOMContentLoaded", async () => {

    // Selección de elementos del DOM
    const formularioLogin = document.querySelector("#formularioLogin");
    const campoUsuario = document.querySelector("#campoUsuarioLogin");
    const campoContrasena = document.querySelector("#campoContrasenaLogin");

    const errorUsuario = document.querySelector("#errorUsuarioLogin");
    const errorContrasena = document.querySelector("#errorContrasenaLogin");
    const alertaGeneral = document.querySelector("#alertaGeneralLogin");
    const btnOlvidaste = document.querySelector("#btnOlvidastePassword");

    if (!formularioLogin) return;

    /*=========================================================
              RECUPERACIÓN RÁPIDA DE CONTRASEÑA 
    =========================================================*/
    if (btnOlvidaste) {
        btnOlvidaste.addEventListener("click", (e) => {
            e.preventDefault();

            // Limpiar estados previos de error
            limpiarEstadoValidacion(campoUsuario, errorUsuario);
            if (alertaGeneral) alertaGeneral.classList.add("d-none");

            const usuarioVal = campoUsuario.value.trim();

            if (usuarioVal === "") {
                mostrarErrorCampo(
                    campoUsuario,
                    errorUsuario,
                    "Ingresa tu correo electrónico para enviarte las instrucciones de recuperación."
                );// Marcar el campo como inválido y mostrar mensaje de error
                campoUsuario.focus();
                return;
            }//if usuarioVal === ""

            if (!usuarioVal.includes("@") || !usuarioVal.includes(".")) {
                mostrarErrorCampo(
                    campoUsuario,
                    errorUsuario,
                    "Ingresa un correo electrónico válido."
                );// mostrar mensaje de error si el correo no es válido
                campoUsuario.focus();
                return;
            }//if el correo no tiene formato válido

            if (alertaGeneral) {
                alertaGeneral.className = "alert alert-success";
                alertaGeneral.textContent = `Se han enviado las instrucciones de recuperación al correo: ${usuarioVal}`;
                alertaGeneral.classList.remove("d-none");
                alertaGeneral.setAttribute("tabindex", "-1");
                alertaGeneral.focus();
            }// Mostrar mensaje de éxito en la zona de alerta general

            const zonaPolite = document.getElementById("notificacion-polite");
            if (zonaPolite) {
                zonaPolite.textContent = `Enviando correo de recuperación a ${usuarioVal}`;
            }// Actualizar la zona de notificación para lectores de pantalla
        });//btnOlvidaste.addEventListener
    }//if btnOlvidaste


    // Captura del evento submit evitando la recarga de página
    formularioLogin.addEventListener("submit", async (e) => {
        e.preventDefault(); 

        // Limpiar estados previos
        limpiarEstadoValidacion(campoUsuario, errorUsuario);
        limpiarEstadoValidacion(campoContrasena, errorContrasena);
        if (alertaGeneral) alertaGeneral.classList.add("d-none");

        const usuarioVal = campoUsuario.value.trim();
        const contrasenaVal = campoContrasena.value;

        let esValido = true;

        // Validación de campos vacíos en cliente
        if (usuarioVal === "") {
            mostrarErrorCampo(campoUsuario, errorUsuario, "El correo o nombre de usuario es obligatorio.");
            esValido = false;
        } else if (usuarioVal.includes("@") && !usuarioVal.includes(".")) {
            mostrarErrorCampo(campoUsuario, errorUsuario, "Ingresa un correo electrónico válido.");
            esValido = false;
        } else {
            marcarCampoValido(campoUsuario, errorUsuario);
        }//else

        // Validación de contraseña
        if (contrasenaVal === "") {
            mostrarErrorCampo(campoContrasena, errorContrasena, "La contraseña es obligatoria.");
            esValido = false;
        } else if (contrasenaVal.length < 6) {
            mostrarErrorCampo(campoContrasena, errorContrasena, "La contraseña debe tener al menos 6 caracteres.");
            esValido = false;
        } else {
            marcarCampoValido(campoContrasena, errorContrasena);
        }//else


        // Gestión de foco si hay errores
        if (!esValido) {
            const primerCampoInvalido = formularioLogin.querySelector(".is-invalid");
            if (primerCampoInvalido) {
                primerCampoInvalido.focus();
            }//if primerCampoInvalido
            return; 
        }//if !esValido



        /*=========================================================
            AUTENTICACIÓN MEDIANTE FETCH CONTRA EL BACKEND
        =========================================================*/
        let usuarioEncontrado;
        try {
            const response = await fetch("/sketchcoffee/usuarios/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },//headers
                body: JSON.stringify({
                    correo: usuarioVal,
                    passwordHash: contrasenaVal // Coincide exactamente con el Map que espera UsuarioController.java
                })// JSON.stringify esto nos permite enviar un objeto JavaScript como JSON al backend
            });//fetch

            if (response.status === 200) {
                usuarioEncontrado = await response.json();
            } else if (response.status === 401 || response.status === 404 || response.status === 500) {

                // Manejo de credenciales inválidas o error de autenticación
                if (alertaGeneral) {
                    alertaGeneral.className = "alert alert-danger"; 
                    alertaGeneral.textContent = "Credenciales incorrectas. Verifica tus datos.";
                    alertaGeneral.classList.remove("d-none");
                    alertaGeneral.setAttribute("tabindex", "-1");
                    alertaGeneral.focus();
                }// Mostrar mensaje de error en la zona de alerta general
                return;
            } else {
                throw new Error("Error en la respuesta del servidor");
            }//else

        } catch (error) {
            console.error("No se pudo conectar con el servidor:", error);
            if (alertaGeneral) {
                alertaGeneral.className = "alert alert-danger";
                alertaGeneral.textContent = "No se pudo conectar con el servidor backend. Asegúrate de que esté encendido.";
                alertaGeneral.classList.remove("d-none");
            }//if alertaGeneral
            return;
        }//catch

        // Si la autenticación es exitosa, guardar sesión y redirigir
        if (usuarioEncontrado) {
            localStorage.setItem("app_authenticated_user", JSON.stringify(usuarioEncontrado));
            
            // Redirección según rol obtenido de la base de datos
            if (usuarioEncontrado.rol && usuarioEncontrado.rol.toLowerCase() === "admin") {
                window.location.href = "creacion_de_producto.html";
            } else {
                window.location.href = "index.html";
            }//else usuarioEncontrado.rol
        }//if usuarioEncontrado
    }); // formularioLogin

    // Funciones auxiliares de UI y Accesibilidad
    function mostrarErrorCampo(input, contenedorError, mensaje) {
        input.setAttribute("aria-invalid", "true");
        input.classList.add("is-invalid");

        if (contenedorError) {
            contenedorError.textContent = mensaje;
            contenedorError.classList.remove("d-none");
        }//if contenedorError
    }//fuction mostrarErrorCampo

    function marcarCampoValido(input, contenedorError) {
        input.setAttribute("aria-invalid", "false");
        input.classList.remove("is-invalid");

        if (contenedorError) {
            contenedorError.textContent = "";
            contenedorError.classList.add("d-none");
        }//if contenedorError
    }//function marcarCampoValido

    function limpiarEstadoValidacion(input, contenedorError) {
        input.removeAttribute("aria-invalid");
        input.classList.remove("is-invalid");
        if (contenedorError) {
            contenedorError.textContent = "";
            contenedorError.classList.add("d-none");
        }//if contenedorError
    }//function limpiarEstadoValidacion

}); // DOMContentLoaded