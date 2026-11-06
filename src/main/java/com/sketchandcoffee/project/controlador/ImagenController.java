package com.sketchandcoffee.project.controlador;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.UUID;

/**
 * Subida de imagenes para el panel de administracion.
 *
 * Las fotos originales viven empaquetadas dentro del jar
 * (src/main/resources/static/imagenes), pero las que se suben desde el
 * panel se guardan en una carpeta fuera del classpath: un jar no se
 * puede modificar en caliente y una imagen guardada en la BD sin su
 * archivo en disco seria un 404 al reiniciar.
 *
 * La ruta de la carpeta viene de app.imagenes.ruta (application.properties),
 * con PROD_IMAGENES como override en produccion. El prefijo de las rutas
 * devueltas es "subidas/..." para no chocar con el handler de las imagenes
 * empaquetadas ("imagenes/...") — se sirven con ConfiguracionSubidas.
 *
 * Responsable: remediacion despliegue AWS (nov 2026)
 */
@RestController
@RequestMapping("/sketchcoffee/imagenes")
@CrossOrigin(origins = "*")
public class ImagenController {

    /** Defensa en profundidad; el tope real lo fija Spring con multipart. */
    private static final long TAMANIO_MAXIMO_BYTES = 5L * 1024 * 1024;

    /** Whitelist de extensiones: difiere la decision al tipo real del archivo. */
    private static final Set<String> EXTENSIONES_PERMITIDAS =
            Set.of("jpg", "jpeg", "png", "webp", "gif");

    private final Path carpetaDestino;

    public ImagenController(@Value("${app.imagenes.ruta}") String ruta) {
        this.carpetaDestino = Paths.get(ruta).toAbsolutePath().normalize();
    }

    @PostMapping
    public ResponseEntity<?> subir(@RequestParam("archivo") MultipartFile archivo) {

        if (archivo == null || archivo.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "No se recibió ningún archivo de imagen"));
        }

        if (archivo.getSize() > TAMANIO_MAXIMO_BYTES) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "La imagen no puede pesar más de 5 MB"));
        }

        String contentType = archivo.getContentType() == null ? "" : archivo.getContentType();
        if (!contentType.toLowerCase(Locale.ROOT).startsWith("image/")) {
            return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE)
                    .body(Map.of("mensaje", "El archivo debe ser una imagen (JPG, PNG, WEBP o GIF)"));
        }

        String extension = extensionSegura(archivo.getOriginalFilename());
        if (extension == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Formato no permitido: solo JPG, PNG, WEBP o GIF"));
        }

        // El nombre lo genera SIEMPRE el servidor (UUID). Se evita conservar
        // el nombre del cliente (rutas tipo "../../x" y choques entre
        // archivos con el mismo nombre).
        String nombreSeguro = UUID.randomUUID() + "." + extension;
        Path destino = carpetaDestino.resolve(nombreSeguro);

        try {
            Files.createDirectories(carpetaDestino);
            try (InputStream datos = archivo.getInputStream()) {
                Files.copy(datos, destino, StandardCopyOption.REPLACE_EXISTING);
            }
        } catch (IOException e) {
            return ResponseEntity.internalServerError()
                    .body(Map.of("mensaje", "No se pudo guardar la imagen en el servidor"));
        }

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of(
                        "archivo", nombreSeguro,
                        "ruta", "subidas/" + nombreSeguro));
    }

    /**
     * Extrae y valida la extension del nombre original. Solo se usa como
     * whitelist de formatos; el nombre final es un UUID, nunca texto del
     * cliente, asi que no hay riesgo de path traversal.
     */
    private String extensionSegura(String nombreOriginal) {
        if (nombreOriginal == null) {
            return null;
        }
        int punto = nombreOriginal.lastIndexOf('.');
        if (punto < 0 || punto == nombreOriginal.length() - 1) {
            return null;
        }
        String extension = nombreOriginal.substring(punto + 1).toLowerCase(Locale.ROOT);
        return EXTENSIONES_PERMITIDAS.contains(extension) ? extension : null;
    }
}// class ImagenController
