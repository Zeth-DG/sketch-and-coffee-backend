## Validaciones v3 – Formulario "Sketch & coffee"

Conjunto de pruebas unitarias con **Jest** para validar los campos de un formulario de contacto de nuestra cafetería.

### Funciones validadas

- `validarCorreo`
- `validarNombre`
- `validarTelefono`
- `validarMensaje`
- `validarAsunto`
- `validarPrivacidad`

***

## Ejecutar pruebas

```bash
npm test
```

**Resultado actual de la ejecución:**

```
Test Suites: 1 passed, 1 total
Tests:       59 passed, 59 total
Snapshots:   0 total
Time:        0.793 s
```

***

## Cómo usar cada función

Todas las funciones devuelven un objeto con la estructura:

```js
{ valido: boolean, mensaje: string }
```

### 1. `validarCorreo(email)`

Valida formato de correo electrónico mediante expresiones regulares.

**Casos probados exitosamente:**
- Correos estándar: `usuario@dominio.com`
- Subdominios: `usuario@sub.dominio.com`
- Con símbolo `+`: `usuario+cafe@dominio.com`
- TLDs largos: `.restaurant`, `.mx`

**Casos rechazados correctamente:**
- Correos vacíos o solo espacios
- Sin `@` o sin TLD
- Espacios intermedios inválidos

***

### 2. `validarNombre(nombre)`

Valida nombre propio del cliente.

**Casos probados exitosamente:**
- Nombres compuestos: `"Ana María de los Ángeles"`
- Con acentos y tildes: `"María Jóse Alcantára"`
- Caracteres especiales permitidos: `"Iñaki Ibáñez"` (ñ, guiones)
- Nombres muy largos: `"María del Carmen Guadalupe de los Ángeles Rodríguez Hernández-Villamil Martínez"`

**Reglas de validación:**
- Mínimo 3 caracteres
- Máximo 100 caracteres
- Solo letras, espacios, acentos y guiones

***

### 3. `validarTelefono(telefono)`

Valida número telefónico de 10 dígitos (México).

**Casos probados exitosamente:**
- 10 dígitos limpios: `5512345678`
- Con espacios: `722 170 1202`
- Con guiones: `722-170-1202`
- Con paréntesis: `(722) 170-1202`

**Casos rechazados correctamente:**
- Números vacíos o solo espacios
- Con letras o caracteres especiales
- 9 dígitos o más de 10
- Empiezan con `0`: `0551234567`
- Todos los dígitos iguales: `0000000000`, `1111111111`

**Reglas de validación:**
- Exactamente 10 dígitos (después de limpiar espacios, guiones y paréntesis)
- Primer dígito entre 2-9
- No todos los dígitos iguales

***

### 4. `validarMensaje(mensaje)`

Valida el contenido del mensaje del cliente.

**Casos probados exitosamente:**
- Mensajes entre 10 y 1000 caracteres
- Exactamente 10 caracteres: `"Lorem ipsu"`
- Exactamente 1000 caracteres
- Con emojis: `"☕☕☕"`
- Párrafos múltiples con saltos de línea (`\n`)

**Casos rechazados correctamente:**
- Mensajes vacíos o solo espacios
- Menos de 10 caracteres
- Más de 1000 caracteres

***

### 5. `validarAsunto(asunto)`

Valida selección de asunto en la lista desplegable.

**Casos probados:**
- Campo vacío → inválido
- Debe seleccionar una opción válida de la lista

**Opciones típicas:**
- `"Reserva"`
- `"Pedido"`
- `"Queja"`
- `"Sugerencia"`
- `"Otro"`

***

### 6. `validarPrivacidad(aceptado)`

Valida el checkbox de términos y condiciones.

**Casos probados exitosamente:**
- `true` → válido
- `false` → inválido
- `null` → inválido
- `undefined` → inválido

**Regla de validación:**
- Debe ser exactamente `true` (booleano)

***

## Sugerencias de mejora y cosas nuevas por probar

Basado en los resultados de las pruebas unitarias, se sugieren los siguientes ajustes:

### 1. **Validación de XSS / HTML en `validarNombre` y `validarMensaje`**
- Probar campos con etiquetas maliciosas: `"<script>alert('hola')</script>"`
- Verificar si las validaciones rechazan o escapan código ejecutable

### 2. **Validación de correos con puntos consecutivos**
- Ej: `"usuario..correo@dominio.com"` → ¿válido o inválido?

### 3. **Validación de teléfonos con extensiones**
- Ej: `"5512345678 ext. 123"` → ¿aceptar o rechazar?


***

## Estructura del proyecto

```
proyecto/
├── validaciones.js       # Funciones de validación
├── validaciones.test.js  # Pruebas unitarias con Jest
├── package.json
└── README.md             # Este archivo
```

***

## 🛠️ Instalación y Ejecución

```bash
npm install
npm test
```

***

## 📌 Notas adicionales

- **Versión:** v2 (59 pruebas pasando)
- **Framework:** Jest
- **Entorno:** Node.js
- **Última actualización:** 06 octubre 2026