package com.sketchandcoffee.project.modelo;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

public enum EstadoPedido {
    PENDIENTE,
    PAGADO,
    EN_PREPARACION,
    ENTREGADO,
    CANCELADO
}

/**
 * Guarda el estado del pedido y lo recupera en MINUSCULAS, que es como lo
 * define el ENUM de la tabla `pedidos` en el script oficial:
 *
 *   estado ENUM('pendiente','pagado','en_preparacion','entregado','cancelado')
 *
 * Sin este convertidor, Hibernate escribe y espera los valores del enum de
 * Java en MAYUSCULAS (PENDIENTE, ...), y la lectura de cualquier fila vieja
 * lanza "No enum constant EstadoPedido.entregado" -> error 500 en Postman.
 */
@Converter(autoApply = true)
class EstadoPedidoConverter implements AttributeConverter<EstadoPedido, String> {

    @Override
    public String convertToDatabaseColumn(EstadoPedido estado) {
        return estado == null ? null : estado.name().toLowerCase();
    }//convertToDatabaseColumn

    @Override
    public EstadoPedido convertToEntityAttribute(String valor) {
        return valor == null ? null : EstadoPedido.valueOf(valor.toUpperCase());
    }//convertToEntityAttribute

}//class EstadoPedidoConverter
