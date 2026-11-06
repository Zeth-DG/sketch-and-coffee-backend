// menu-productos.js
import { detallesPersonalizados } from './menu-detalles.js';

const descripcionesBreves = {
  "croissant salado": "Croissant hojaldrado con relleno salado.",
  "chai latte": "Té especiado con leche cremosa.",
  "chocolate caliente": "Chocolate caliente, espeso y reconfortante.",
  "tisana pink blossom": "Infusión frutal con notas florales.",
  "enchiladas": "Tortillas con pollo, salsa y crema.",
  "chilaquiles": "Totopos con salsa, crema y queso.",
  "capuchino": "Espresso con leche y espuma cremosa.",
  "americano": "Café espresso de sabor suave y tostado.",
  "latte frio": "Espresso con leche fría y hielo.",
  "latte caliente": "Espresso mezclado con leche vaporizada.",
  "crepa": "Crepa dulce con crema de avellana y queso."
};

export async function cargarProductosCatalogo() {
  const productosCatalogo = [];

  // 1. Cargar productos desde el Backend de Spring Boot (API REST / MySQL)
  try {
    const response = await fetch("http://localhost:8080/sketchcoffee/productos", {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    if (response.ok) {
      const productosBackend = await response.json();

      // Mapear la estructura del backend al formato que lee tu frontend y filtros
      const productosMapeados = productosBackend.map(prod => {
        const nombreLower = (prod.nombre || "").toLowerCase();

        // Extraer de forma segura el nombre de la categoría del objeto anidado
        const nombreCategoria = prod.categoria?.nombre || "General";

        const claveEncontrada = Object.keys(descripcionesBreves).find(termino => nombreLower.includes(termino));
        const infoExtra = claveEncontrada ? detallesPersonalizados[claveEncontrada] : null;

        return {
          id: prod.id,
          nombre: prod.nombre || "Sin nombre",
          departamento: nombreCategoria, // Utilizado por menu-filtros.js para categorizar
          categoria: nombreCategoria,
          precio: Number(prod.precio) || 0.00,
          sku: prod.sku || `sku-${prod.id}`,
          disponible: prod.activo ?? true, // Traduce el "activo" del backend a disponibilidad
          existencias: prod.existencias || 0,
          descripcion: prod.descripcion || infoExtra?.descripcion || descripcionesBreves[claveEncontrada] || "Una opción deliciosa para disfrutar en Sketch & Coffee.",
          imagen: infoExtra ? infoExtra.imagen : (prod.imagen || "./img/default.jpg")
        };
      });

      productosCatalogo.push(...productosMapeados);
    } else {
      console.warn("El servidor respondió con un estado no exitoso al obtener productos.");
    }
  } catch (error) {
    console.error("Error de red al conectar con el backend de Spring Boot para el catálogo:", error);
  }

  // 2. Cargar los productos creados localmente (LocalStorage / Panel CRUD)
  try {
    const productosGuardados = JSON.parse(localStorage.getItem("productos_agregados") || "[]");
    const productosNuevos = productosGuardados.map(producto => ({
      id: producto.id || `local-${Date.now()}`,
      nombre: producto.nombre,
      departamento: producto.categoria || "General",
      categoria: producto.categoria || "General",
      precio: Number(producto.precio) || 0.00,
      sku: `local-${producto.id}`,
      disponible: true,
      existencias: 10,
      descripcion: producto.descripcion || "Una opción deliciosa para disfrutar en Sketch & Coffee.",
      imagen: producto.imagen || "./img/default.jpg"
    }));

    productosCatalogo.push(...productosNuevos);
  } catch (error) {
    console.error("No se pudieron cargar los productos guardados en LocalStorage:", error);
  }

  console.info(`Catálogo cargado exitosamente con ${productosCatalogo.length} productos.`);
  return productosCatalogo;
}