 export function cargarFooter() {
  fetch("componentes/footer.html")
    .then(res => res.text())
    .then(data => {
      document.getElementById("footer-global").innerHTML = data;

      // Botón Subir
      const btn = document.getElementById("btnSubir");
      if (btn) {
        window.onscroll = function() {
         // console.log(document.documentElement.scrollTop);
          if (document.documentElement.scrollTop > 100 || document.body.scrollTop > 100) {
            btn.style.display = "flex";
          } else {
            btn.style.display = "none";
          }
        };
        btn.onclick = function() {
          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });
        };
      }
    })
    .catch(err => console.error("Error cargando el footer:", err));
}








