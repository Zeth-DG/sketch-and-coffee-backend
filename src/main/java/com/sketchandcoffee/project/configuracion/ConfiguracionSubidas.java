package com.sketchandcoffee.project.configuracion;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * Sirve las imagenes subidas desde el panel de administracion.
 *
 * Spring ya entrega todo lo empaquetado en static/ (classpath), pero una
 * imagen subida por el usuario vive fuera del jar. Se registra un resource
 * handler que mapea /subidas/** a la carpeta configurada en
 * app.imagenes.ruta (la misma donde escribe ImagenController).
 *
 * El prefijo es distinto on purpose: "/imagenes/**" ya lo resuelve el
 * classpath de static/, y un handler de disco sobre la misma ruta le
 * ganaria a las fotos empaquetadas y las ensenaria como 404.
 */
@Configuration
public class ConfiguracionSubidas implements WebMvcConfigurer {

    @Value("${app.imagenes.ruta}")
    private String rutaImagenes;

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // addResourceLocations exige ruta con / final: sin ella, la ruta
        // absoluta de archivo no resuelve y la imagen daria 404.
        String rutaNormalizada = rutaImagenes.endsWith("/") ? rutaImagenes : rutaImagenes + "/";
        registry.addResourceHandler("/subidas/**")
                .addResourceLocations("file:" + rutaNormalizada);
    }
}// class ConfiguracionSubidas
