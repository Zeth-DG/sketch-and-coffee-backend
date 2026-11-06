export class MensajeUsuario {
  constructor(nombre, asunto, email, telefono, mensaje) {
    this.nombre = nombre.trim();
    this.asunto = asunto.trim();
    this.email = email.trim();
    this.telefono = telefono.trim();
    this.mensaje = mensaje.trim();
  }

  crearNuevoMensaje() {
    const mensajeCompleto = `
    Un nuevo usuario ha llenado un formulario:
    Nombre: ${this.nombre}
    Email: ${this.email}
    Teléfono: ${this.telefono}
    Asunto: ${this.asunto}
    Mensaje: ${this.mensaje}
    `;

    return mensajeCompleto.trim();
  }//constructor
}//clase