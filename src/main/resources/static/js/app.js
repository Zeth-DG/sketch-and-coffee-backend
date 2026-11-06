const formNuevoProducto = document.querySelector('#form-nuevo-producto'); // ID de tu formulario

if (formNuevoProducto) {
    formNuevoProducto.addEventListener('submit', async (e) => {
        e.preventDefault(); // Evitar recargar la página

        // Crear el objeto con los datos del formulario
        const nuevoArticulo = {
            nombre: document.querySelector('#nombre-producto').value,
            descripcion: document.querySelector('#descripcion-producto').value,
            precio: parseFloat(document.querySelector('#precio-producto').value),
            stock: parseInt(document.querySelector('#stock-producto').value)
        };

        try {
            const response = await fetch('http://localhost:8080/api/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(nuevoArticulo)
            });

            if (!response.ok) {
                throw new Error('No se pudo registrar el artículo en la base de datos');
            }

            const resultado = await response.json();
            console.log('Artículo creado con éxito:', resultado);
            
            //limpiar formulario o recargar catálogo
            formNuevoProducto.reset();
            cargarCatalogo();

        } catch (error) {
            console.error('Hubo un problema con la petición POST:', error);
        }
    });
}
