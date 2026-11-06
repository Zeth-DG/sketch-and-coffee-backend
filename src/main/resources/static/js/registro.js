import {
    validarNombre,
    validarApellido,
    validarTelefono,
    validarCorreo,
    validarContrasena,
    validarCoincidenciaContrasenas,
    validarPrivacidad
} from "./validaciones.js";

import {
    mostrarError,
    configurarValidacionCampo,
    actualizarErrorPrivacidad
} from "./interfaz.js";


document.addEventListener("DOMContentLoaded", () => {

    const formulario = document.getElementById("formularioContacto");
    if (!formulario) return;

    // ---------- Referencias del DOM ----------
    const iptNombre = document.getElementById("campoNombreRegistro");
    const errorNombre = document.getElementById("errorNombreRegistro");

    const iptApellido = document.getElementById("campoApellidoRegistro");
    const errorApellido = document.getElementById("errorApellidoRegistro");

    const iptTelefono = document.getElementById("campoTelefonoRegistro");
    const errorTelefono = document.getElementById("errorTelefonoRegistro");

    const iptCorreo = document.getElementById("campoCorreoRegistro");
    const errorCorreo = document.getElementById("errorEmailRegistro");

    const iptContrasena = document.getElementById("campoContrasena");
    const errorContrasena = document.getElementById("errorContrasena");
    const btnVerContrasena = document.getElementById("btnVerContrasena");

    const iptConfirmar = document.getElementById("campoConfirmarContrasena");
    const errorConfirmar = document.getElementById("errorConfirmarContrasena");
    const btnVerConfirmarContrasena = document.getElementById("btnVerConfirmarContrasena");

    const chkPrivacidad = document.getElementById("campoPrivacidad");
    const errorPrivacidad = document.getElementById("errorPrivacidad");

    const contenedorAlerta = document.getElementById("alerta-registro");

    btnVerContrasena.addEventListener("click", () => {
        if (iptContrasena.type === "password") {
            iptContrasena.type = "text";
            btnVerContrasena.textContent = "Ocultar";
            btnVerContrasena.setAttribute("aria-label", "Ocultar contraseña");
        } else {
            iptContrasena.type = "password";
            btnVerContrasena.textContent = "Ver";
            btnVerContrasena.setAttribute("aria-label", "Mostrar contraseña");
        }
    });

    btnVerConfirmarContrasena.addEventListener("click", () => {
        if (iptConfirmar.type === "password") {
            iptConfirmar.type = "text";
            btnVerConfirmarContrasena.textContent = "Ocultar";
            btnVerConfirmarContrasena.setAttribute("aria-label", "Ocultar contraseña");
        } else {
            iptConfirmar.type = "password";
            btnVerConfirmarContrasena.textContent = "Ver";
            btnVerConfirmarContrasena.setAttribute("aria-label", "Mostrar contraseña");
        }
    });

    // ---------- Helper: alerta global ----------
    function mostrarAlerta(mensaje, tipo) {
        contenedorAlerta.innerHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Cerrar"></button>
            </div>
        `;
    }

    // ---------- Helper: mostrar error + aria-invalid ----------
    // (interfaz.js sólo pinta el texto; aquí además marcamos aria-invalid
    //  en el input para lectores de pantalla)
    function pintarError(input, errorEl, resultado) {
        mostrarError(errorEl, resultado);
        if (input) input.setAttribute("aria-invalid", resultado.valido ? "false" : "true");
    }

    // ---------- Validación en vivo ----------
    configurarValidacionCampo(iptNombre, errorNombre, validarNombre);
    configurarValidacionCampo(iptApellido, errorApellido, validarApellido);
    configurarValidacionCampo(iptTelefono, errorTelefono, validarTelefono);
    configurarValidacionCampo(iptCorreo, errorCorreo, validarCorreo);
    configurarValidacionCampo(iptContrasena, errorContrasena, validarContrasena);

    // Para "Confirmar contraseña" necesitamos ambos valores.
    // configurarValidacionCampo pasa el value del propio campo a la función,
    // así que la envolvemos para capturar también la contraseña original.
    const validarConfirmacion = (valorConfirmacion) =>
        validarCoincidenciaContrasenas(iptContrasena.value, valorConfirmacion);

    configurarValidacionCampo(iptConfirmar, errorConfirmar, validarConfirmacion);

    // Si el usuario edita la contraseña, revalidamos la confirmación
    // (solo si ya había escrito algo en "confirmar").
    iptContrasena.addEventListener("input", () => {
        if (iptConfirmar.value !== "") {
            pintarError(
                iptConfirmar,
                errorConfirmar,
                validarCoincidenciaContrasenas(iptContrasena.value, iptConfirmar.value)
            );
        }
    });

    // Checkbox de privacidad
    chkPrivacidad.addEventListener("change", () => {
        const resultado = validarPrivacidad(chkPrivacidad.checked);
        mostrarError(errorPrivacidad, resultado);
    });

    // ---------- Envío del formulario ----------
    formulario.addEventListener("submit", async (evento) => {
        evento.preventDefault();

        // 1) Leer valores
        const nombre = iptNombre.value;
        const apellido = iptApellido.value;
        const telefono = iptTelefono.value;
        const correo = iptCorreo.value;
        const contrasena = iptContrasena.value;
        const confirmar = iptConfirmar.value;
        const privacidad = chkPrivacidad.checked;

        // 2) Validar
        const rNombre = validarNombre(nombre);
        const rApellido = validarApellido(apellido);
        const rTelefono = validarTelefono(telefono);
        const rCorreo = validarCorreo(correo);
        const rContrasena = validarContrasena(contrasena);
        const rConfirmar = validarCoincidenciaContrasenas(contrasena, confirmar);
        const rPrivacidad = validarPrivacidad(privacidad);

        // 3) Mostrar todos los errores (para que el usuario los vea juntos)
        pintarError(iptNombre, errorNombre, rNombre);
        pintarError(iptApellido, errorApellido, rApellido);
        pintarError(iptTelefono, errorTelefono, rTelefono);
        pintarError(iptCorreo, errorCorreo, rCorreo);
        pintarError(iptContrasena, errorContrasena, rContrasena);
        pintarError(iptConfirmar, errorConfirmar, rConfirmar);
        mostrarError(errorPrivacidad, rPrivacidad);

        const todoValido =
            rNombre.valido &&
            rApellido.valido &&
            rTelefono.valido &&
            rCorreo.valido &&
            rContrasena.valido &&
            rConfirmar.valido &&
            rPrivacidad.valido;

        if (!todoValido) {
            mostrarAlerta("Revisa los campos marcados en rojo.", "danger");
            return;
        }

        // 4) Construir usuario (contraseña SIN trim: los espacios son válidos)
        const usuario = {
            nombre: nombre.trim(),
            apellido: apellido.trim(),
            telefono: telefono.trim(),
            correo: correo.trim().toLowerCase(),
            passwordHash: contrasena
        };

        // 5) Guardar (saveUserToStorage devuelve false si el correo ya existe)
        try {
            const response = await fetch("/sketchcoffee/usuarios/registro", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(usuario)
            });

            // 6) Evaluar las respuestas del servidor Java
            if (response.status === 201 || response.status === 200) {
                // Éxito
                mostrarAlerta(
                    "Registro completado correctamente. ¡Bienvenido a Sketch & Coffee!",
                    "success"
                );

                // Limpiar formulario y errores visuales
                formulario.reset();
                [
                    errorNombre, errorApellido, errorTelefono, errorCorreo,
                    errorContrasena, errorConfirmar, errorPrivacidad
                ].forEach((el) => (el.textContent = ""));

                [iptNombre, iptApellido, iptTelefono, iptCorreo, iptContrasena, iptConfirmar]
                    .forEach((el) => el.setAttribute("aria-invalid", "false"));

                // Redirigir a inicio de sesión después de 2 segundos
                setTimeout(() => {
                    console.log("Redirigiendo a página de inicio de sesión...");
                    window.location.href = "inicio-sesion.html";
                }, 2000);

            } else if (response.status === 409) {
                // Conflicto: El correo ya existe
                mostrarAlerta(
                    "Este correo ya está registrado en el sistema. Intenta con otro o inicia sesión.",
                    "warning"
                );
            } else if (response.status === 400) {
                // Solicitud errónea
                mostrarAlerta(
                    "Los datos enviados no son válidos. Revisa la información.",
                    "danger"
                );
            } else {
                mostrarAlerta("Ocurrió un error inesperado en el servidor.", "danger");
            }

        } catch (error) {
            console.error("No se pudo conectar con el servidor backend:", error);
            mostrarAlerta("No se pudo establecer conexión con el servidor. Verifica que tu backend esté activo.", "danger");
        }
    });
});