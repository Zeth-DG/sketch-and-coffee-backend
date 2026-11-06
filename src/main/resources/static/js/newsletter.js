const formNewsletter = document.getElementById('formNewsletter');
const inputEmail = document.getElementById('inputEmailNewsletter');
const alertContainer = document.getElementById('alertNewsletter');

// Función para renderizar alertas Bootstrap dinámicas
function mostrarAlerta(mensaje, tipo) {
  alertContainer.innerHTML = `
    <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
      ${mensaje}
      <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
    </div>
  `;
}

if (formNewsletter) {
  formNewsletter.addEventListener('submit', function(event) {
    event.preventDefault(); // Evita recargar la página
    
    const emailValue = inputEmail.value.trim();
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // 1. Validar campo vacío
    if (emailValue === "") {
      mostrarAlerta("El campo de correo no puede estar vacío.", "danger");
      inputEmail.focus();
      return;
    }

    // 2. Validar formato de correo electrónico
    if (!regexEmail.test(emailValue)) {
      mostrarAlerta("Por favor, ingresa un correo electrónico válido (ejemplo: usuario@dominio.com).", "warning");
      inputEmail.focus();
      return;
    }

    // 3. Envío exitoso
    mostrarAlerta("¡Gracias por suscribirte a Sketch & Coffee!", "success");
    inputEmail.value = ""; // Limpiar el input
  });
}