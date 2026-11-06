const claveUsuarios = "usuarios_registrados";

async function crearHash(contrasena) {
    const datos = new TextEncoder().encode(contrasena);
    const resultado = await crypto.subtle.digest("SHA-256", datos);
    return Array.from(new Uint8Array(resultado))
        .map((byte) => byte.toString(16).padStart(2, "0"))
        .join("");
}

function obtenerUsuarios() {
    return JSON.parse(localStorage.getItem(claveUsuarios) || "[]");
}

function guardarUsuarios(usuarios) {
    localStorage.setItem(claveUsuarios, JSON.stringify(usuarios));
}

async function crearUsuarioAdministrador() {
    const usuarios = obtenerUsuarios();

    if (usuarios.length === 0) {
        usuarios.push({
            id: 1,
            nombre: "Administrador",
            usuario: "administrador",
            correo: "admin@ejemplo.com",
            contrasenaHash: await crearHash("123456789"),
            rol: "administrador"
        });
    }

    for (const usuario of usuarios) {
        if (typeof usuario.contrasena === "string") {
            usuario.contrasenaHash = await crearHash(usuario.contrasena);
            delete usuario.contrasena;
        }
    }

    const correoAdminNuevo = "admin2@ejemplo.com";
    const cuentaExistente = usuarios.find(
        (usuario) => usuario.correo.toLowerCase() === correoAdminNuevo
    );

    if (!cuentaExistente) {
        const siguienteId = Math.max(0, ...usuarios.map((usuario) => Number(usuario.id) || 0)) + 1;
        usuarios.push({
            id: siguienteId,
            nombre: "Administradora",
            usuario: correoAdminNuevo,
            correo: correoAdminNuevo,
            contrasenaHash: await crearHash("123456789"),
            rol: "administrador"
        });
    } else if (cuentaExistente.rol !== "administrador") {
        console.warn(`No se creó el perfil administrador: ${correoAdminNuevo} ya pertenece a un usuario.`);
    }

    guardarUsuarios(usuarios);

    const sesion = JSON.parse(localStorage.getItem("app_authenticated_user") || "null");
    if (sesion) {
        delete sesion.contrasena;
        delete sesion.contrasenaHash;
        delete sesion.contrasenaSalt;
        localStorage.setItem("app_authenticated_user", JSON.stringify(sesion));
    }
}

async function guardarUsuario(nuevoUsuario) {
    const usuarios = obtenerUsuarios();
    const correo = nuevoUsuario.correo.trim().toLowerCase();

    if (usuarios.some((usuario) => usuario.correo.toLowerCase() === correo)) {
        return false;
    }

    const { contrasena, ...datosUsuario } = nuevoUsuario;
    usuarios.push({
        ...datosUsuario,
        id: usuarios.length + 1,
        correo,
        usuario: correo,
        contrasenaHash: await crearHash(contrasena),
        rol: "usuario"
    });
    guardarUsuarios(usuarios);
    return true;
}

async function autenticarUsuario(correo, contrasena) {
    const dato = correo.trim().toLowerCase();
    const usuario = obtenerUsuarios().find(
        (actual) =>
            actual.correo.toLowerCase() === dato ||
            actual.usuario.toLowerCase() === dato
    );

    if (!usuario || usuario.contrasenaHash !== await crearHash(contrasena)) {
        return null;
    }

    const { contrasenaHash, ...usuarioSinContrasena } = usuario;
    return usuarioSinContrasena;
}

export {
    crearUsuarioAdministrador as seedInitialUsers,
    guardarUsuario as saveUserToStorage,
    autenticarUsuario as authenticateStoredUser
};
