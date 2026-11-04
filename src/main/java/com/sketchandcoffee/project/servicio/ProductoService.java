package com.sketchandcoffee.project.servicio;

import com.sketchandcoffee.project.dtos.ProductoRequest;
import com.sketchandcoffee.project.modelo.Categoria;
import com.sketchandcoffee.project.modelo.Producto;
import com.sketchandcoffee.project.repositorio.CategoriaRepository;
import com.sketchandcoffee.project.repositorio.ProductoRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
import java.util.Optional;

/**
 * Capa de servicio de productos.
 *
 * Aqui vive la logica: validar los datos, resolver la categoria y hablar
 * con los repositorios. El controlador solo traduce el resultado a codigos
 * HTTP, como quedo en la regla transversal del contrato
 * (Controller -> Service -> Repository).
 *
 * Usa dos repositorios: el de productos y el de categorias. El segundo es
 * necesario porque `categoria_id` es llave foranea y el contrato pide
 * devolver 404 cuando la categoria no existe; se usa el repositorio y no
 * CategoriaService para no acoplarme a los metodos de otra persona.
 *
 * Responsable: Gonzalo Vargas — Actividad 13
 */
@Service
public class ProductoService {

    /** DECIMAL(10,2) en la tabla: 8 enteros + 2 decimales. */
    private static final BigDecimal PRECIO_MAXIMO = new BigDecimal("99999999.99");

    private final ProductoRepository repository;
    private final CategoriaRepository categoriaRepository;

    public ProductoService(ProductoRepository repository,
                           CategoriaRepository categoriaRepository) {
        this.repository = repository;
        this.categoriaRepository = categoriaRepository;
    }// constructor

    // ------------------------------------------------------------------
    // Consultas
    // ------------------------------------------------------------------

    public List<Producto> listarProductos() {
        return repository.findAll();
    }// listarProductos

    public Optional<Producto> buscarPorId(Integer id) {
        return repository.findById(id);
    }// buscarPorId

    /** Productos de una categoria. Se asume que la categoria ya fue validada. */
    public List<Producto> listarPorCategoria(Integer categoriaId) {
        return repository.findByCategoriaId(categoriaId);
    }// listarPorCategoria

    /** True si existe una categoria con ese id. Se usa para el 404 de la FK. */
    public boolean existeCategoria(Integer categoriaId) {
        if (categoriaId == null) {
            return false;
        }// if
        return categoriaRepository.existsById(categoriaId);
    }// existeCategoria

    /**
     * True si ya hay un producto con ese SKU. Se usa para el 409.
     *
     * El SKU se compara sin espacios de sobra, igual que al guardarlo, para
     * que " CAF-001 " y "CAF-001" no pasen como si fueran distintos.
     */
    public boolean existeSku(String sku) {
        if (sku == null) {
            return false;
        }// if
        return repository.findBySku(sku.trim()).isPresent();
    }// existeSku

    // ------------------------------------------------------------------
    // Validacion
    // ------------------------------------------------------------------

    /**
     * Revisa el cuerpo recibido y devuelve el mensaje de error si algo esta
     * mal, o Optional.empty() si todo esta bien.
     *
     * Devuelve el mensaje en lugar de lanzar una excepcion porque el
     * controlador lo necesita tal cual para armar el cuerpo
     * { "mensaje": "..." } que pide el contrato.
     *
     * Las longitudes se revisan aqui a proposito: la tabla tiene
     * VARCHAR(30) en sku y VARCHAR(100) en nombre, asi que un texto mas
     * largo lo rechazaria MySQL con un error 500. Mejor un 400 claro.
     */
    public Optional<String> validar(ProductoRequest datos) {

        if (datos == null) {
            return Optional.of("El cuerpo de la peticion esta vacio");
        }// if

        // --- nombre ---
        if (datos.getNombre() == null || datos.getNombre().isBlank()) {
            return Optional.of("El campo nombre es obligatorio");
        }// if
        if (datos.getNombre().trim().length() > 100) {
            return Optional.of("El nombre no puede tener mas de 100 caracteres");
        }// if

        // --- sku ---
        if (datos.getSku() == null || datos.getSku().isBlank()) {
            return Optional.of("El campo sku es obligatorio");
        }// if
        if (datos.getSku().trim().length() > 30) {
            return Optional.of("El sku no puede tener mas de 30 caracteres");
        }// if

        // --- precio ---
        if (datos.getPrecio() == null) {
            return Optional.of("El campo precio es obligatorio");
        }// if
        if (datos.getPrecio().signum() < 0) {
            return Optional.of("El precio no puede ser negativo");
        }// if
        if (datos.getPrecio().compareTo(PRECIO_MAXIMO) > 0) {
            return Optional.of("El precio no puede ser mayor a " + PRECIO_MAXIMO);
        }// if

        // --- existencias ---
        // Si no viene, se toma 0 (la columna tiene DEFAULT 0). Solo se
        // rechaza cuando viene con un valor negativo.
        if (datos.getExistencias() != null && datos.getExistencias() < 0) {
            return Optional.of("Las existencias no pueden ser negativas");
        }// if

        // --- imagen ---
        if (datos.getImagen() != null && datos.getImagen().trim().length() > 255) {
            return Optional.of("La ruta de la imagen no puede tener mas de 255 caracteres");
        }// if

        // --- categoriaId ---
        // Solo se revisa que venga. Que exista o no se comprueba aparte,
        // porque eso responde 404 y no 400.
        if (datos.getCategoriaId() == null) {
            return Optional.of("El campo categoriaId es obligatorio");
        }// if

        return Optional.empty();
    }// validar

    // ------------------------------------------------------------------
    // Escritura
    // ------------------------------------------------------------------

    /**
     * Crea un producto nuevo. Se llama cuando ya paso validar(), ya se
     * comprobo que la categoria existe y que el SKU no esta repetido.
     */
    public Producto guardarProducto(ProductoRequest datos) {
        Producto producto = new Producto();
        copiarDatos(producto, datos);
        return repository.save(producto);
    }// guardarProducto

    /** Actualiza un producto que ya existe con los datos recibidos. */
    public Producto actualizarProducto(Producto existente, ProductoRequest cambios) {
        copiarDatos(existente, cambios);
        return repository.save(existente);
    }// actualizarProducto

    public void eliminarProducto(Integer id) {
        repository.deleteById(id);
    }// eliminarProducto

    // ------------------------------------------------------------------
    // Apoyo
    // ------------------------------------------------------------------

    /**
     * Pasa los datos del DTO a la entidad.
     *
     * Lo mismo sirve para crear y para actualizar, asi no se escriben dos
     * veces las mismas reglas y no hay riesgo de que una se olvide.
     */
    private void copiarDatos(Producto producto, ProductoRequest datos) {

        // La categoria se trae de la base, no se arma a mano: asi el objeto
        // que queda en el producto es el real, con su nombre, y el JSON de
        // respuesta puede mostrarlo.
        Categoria categoria = categoriaRepository.findById(datos.getCategoriaId())
                .orElseThrow(() -> new IllegalStateException(
                        "La categoria con id " + datos.getCategoriaId() + " desaparecio"));

        producto.setCategoria(categoria);
        producto.setSku(datos.getSku().trim());
        producto.setNombre(datos.getNombre().trim());
        producto.setDescripcion(datos.getDescripcion());
        producto.setImagen(datos.getImagen());

        // El precio se ajusta a dos decimales porque la columna es
        // DECIMAL(10,2). Si llega 55.999, MySQL lo redondearia solo y el
        // valor guardado no coincidiria con el que devolvimos en el 201.
        producto.setPrecio(datos.getPrecio().setScale(2, RoundingMode.HALF_UP));

        // existencias y activo no aceptan NULL en la tabla, asi que cuando
        // no vienen se usan los mismos valores por omision del CREATE TABLE.
        producto.setExistencias(datos.getExistencias() == null ? 0 : datos.getExistencias());
        producto.setActivo(datos.getActivo() == null ? Boolean.TRUE : datos.getActivo());
    }// copiarDatos

}// class ProductoService
