export function mostrarError(elemento, resultado){
    if (resultado.valido){
        elemento.textContent = "";
    } else {
        elemento.textContent = resultado.mensaje; 
    }//else
}//funcion mostrar error


export function actualizarErrorCampo(
  campo,
  elementoError,
  funcionValidacion
) {
  const resultado = funcionValidacion(campo.value);

  mostrarError(elementoError, resultado);

  return resultado;
}//funcion actaulizarError


export function actualizarErrorPrivacidad(
  elementoPrivacidad,
  elementoError,
  funcionValidacion
) {
  const resultado =
    funcionValidacion(elementoPrivacidad.checked);

  mostrarError(elementoError, resultado);

  return resultado;
}//funcion para privacidad

export function configurarValidacionCampo(
  campo,
  elementoError,
  funcionValidacion
) {
  let tocado = false;

  const actualizar = () => {
    actualizarErrorCampo(
      campo,
      elementoError,
      funcionValidacion
    );
  };

  campo.addEventListener("blur", () => {
    tocado = true;
    actualizar();
  });

  campo.addEventListener("input", () => {
    if (tocado) {
      actualizar();
    }
  });
}