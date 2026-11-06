// menu-detalles.js
// Descripciones e imágenes de los productos destacados.

// Ruta local: funciona mientras desarrollas, sin depender de GitHub.
const IMG = "./imagenes/alimentos-menu";

// Cuando el sitio esté publicado y las imágenes ya estén subidas al repo,
// se puede cambiar por el CDN:
// const IMG = "https://cdn.jsdelivr.net/gh/Zeth-DG/sketch-and-coffee@develop/imagenes/alimentos-menu";

export const detallesPersonalizados = {
  "croissant salado": {
    descripcion: "Láminas doradas y crujientes de fino hojaldre artesanal, horneadas a la perfección para lograr una textura ligera, suave y esponjosa por dentro.",
    imagen: "./imagenes/fotosComidaTop10/Sketch&Coffee_croissant%20salado.png"
  },
  "americano": {
    descripcion: "Extracción limpia de grano recién molido con notas tostadas, aroma envolvente y un perfil suave pero con carácter.",
    imagen: `${IMG}/americano.jpeg`
  },
  "chai latte": {
    descripcion: "Infusión aromática de tés negros con cardamomo, canela y jengibre, matizada con leche cremosa para un perfil dulce y reconfortante.",
    imagen: `${IMG}/chai-latte.jpeg`
  },
  "chocolate caliente": {
    descripcion: "Cacao puro fundido en leche entera, logrando una bebida rica, espesa y con el dulzor perfecto para reconfortar el alma.",
    imagen: `${IMG}/chocolate-caliente.jpeg`
  },
  "tisana pink blossom": {
    descripcion: "Infusión frutal de notas florales y matices rosados vibrantes; un elixir fresco, ligero y naturalmente dulce.",
    imagen: `${IMG}/tisana-pink-blossom.jpeg`
  },
  "capuchino": {
    descripcion: "Espresso de altura coronado con una densa capa de microespuma de leche de tu preferencia.",
    imagen: `${IMG}/capuchino.jpeg`
  },
  "latte frio": {
    descripcion: "Espresso de especialidad sobre hielo, con leche fría que suaviza su intensidad y deja un final limpio y refrescante.",
    imagen: `${IMG}/latte-frio.jpeg`
  },
  "latte caliente": {
    descripcion: "Un balance armonioso entre la intensidad del espresso de especialidad y una nube de leche al vapor suave y cremosa.",
    imagen: "./imagenes/fotosComidaTop10/Sketch&Coffe_Latte.jpg"
  },
  "chilaquiles": {
    descripcion: "Totopos crujientes bañados con salsa especiada, enriquecidos con crema ácida, queso espolvoreado y el punto exacto de picor.",
    imagen: `${IMG}/chilaquiles.jpeg`
  },
  "enchiladas": {
    descripcion: "Tortillas artesanales con pechuga de pollo bañadas en deliciosa crema y salsa de la casa, queso, cebolla fresca y cilantro recién cortado, listas para deleitar tu paladar.",
    imagen: `${IMG}/enchiladas.jpeg`
  },
  "crepa": {
    descripcion: "Fina crepa artesanal dorada a la plancha, rebosante de suave queso crema y abundante crema de avellana y cacao.",
    imagen: `${IMG}/crepa-nutella-philadelphia.jpeg`
  }
};