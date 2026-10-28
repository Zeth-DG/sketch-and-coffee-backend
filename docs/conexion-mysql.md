# Configuración de Conexión MySQL - Sketch & Coffee

## Variables de Entorno
Para ejecutar la aplicación localmente sin exponer credenciales en el código, se utilizan las siguientes variables de entorno:

- `DB_URL`: `jdbc:mysql://localhost:3306/sketch_coffee`
- `DB_USER`: Nombre de usuario de MySQL (por defecto: `root`)
- `DB_PASSWORD`: Contraseña local de MySQL

## Ejecución
El backend valida automáticamente la estructura de la base de datos `sketch_coffee` heredada de la Actividad 11 mediante `spring.jpa.hibernate.ddl-auto=validate`.