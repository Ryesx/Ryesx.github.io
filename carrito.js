document.addEventListener("DOMContentLoaded", function() {
    const botonesAgregarCarrito = document.querySelectorAll('.agregar-carrito');
    const carritoContainer = document.getElementById('carrito-container');
    const totalContainer = document.getElementById('total-container'); // Contenedor para mostrar el total
    let carrito = JSON.parse(localStorage.getItem('carrito')) || []; // Recuperar el carrito del localStorage o inicializarlo si está vacío

    // Función para agregar productos al carrito
    function agregarAlCarrito(event) {
        const boton = event.target;
        const productoId = boton.getAttribute('data-id');
        const productoNombre = boton.getAttribute('data-nombre');
        const productoPrecio = boton.getAttribute('data-precio');
        const productoImagen = boton.getAttribute('data-imagen'); // Obtener la URL de la imagen

        const producto = {
            id: productoId,
            nombre: productoNombre,
            precio: parseFloat(productoPrecio),
            imagen: productoImagen // Añadir la URL de la imagen
        };

        carrito.push(producto);
        actualizarLocalStorage(); // Guardar el carrito actualizado en localStorage
        actualizarCarrito(); // Actualizar el carrito en la página principal
    }

    // Función para calcular el total de todos los productos en el carrito
    function calcularTotal() {
        return carrito.reduce((total, producto) => total + producto.precio, 0).toFixed(2);
    }

    // Función para actualizar el contenido del carrito en `index.html`
    function actualizarCarrito() {
        if (carritoContainer) { // Solo si estamos en una página que tiene el contenedor del carrito
            carritoContainer.innerHTML = '';

            if (carrito.length === 0) {
                carritoContainer.innerHTML = '<p>El carrito está vacío</p>';
                totalContainer.textContent = ''; // Limpiar el total cuando el carrito esté vacío
                return;
            }

            carrito.forEach(producto => {
                const itemCarrito = document.createElement('div');
                itemCarrito.classList.add('item-carrito', 'flex', 'gap-4', 'bg-white', 'px-4', 'py-3', 'justify-between', 'items-center');
                itemCarrito.innerHTML = `
                    <div class="flex items-start gap-4">
                        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-[70px] h-[70px]" style='background-image: url(${producto.imagen});'></div>
                        <div class="flex flex-1 flex-col justify-center">
                            <p class="text-[#111418] text-base font-medium leading-normal">${producto.nombre}</p>
                            <p class="text-[#617189] text-sm font-normal leading-normal">$${producto.precio.toFixed(2)}</p>
                        </div>
                        <div class="flex justify-stretch">
                            <div class="flex flex-1 gap-3 flex-wrap px-4 py-3 justify-end">
                                <button class="guardar-btn" data-product-id="${producto.id}">Guardar para más tarde</button>
                                <button class="eliminar-btn" data-product-id="${producto.id}">Eliminar</button>
                            </div>
                        </div>
                    </div>
                `;
                carritoContainer.appendChild(itemCarrito);
            });

            totalContainer.textContent = `Total a pagar: $${calcularTotal()}`; // Mostrar el total actualizado
        }
        asignarEventos(); // Reasignar eventos después de actualizar el DOM
    }

    // Función para mostrar productos en `carrito.html` (si esta página tiene el contenedor)
    function mostrarCarrito() {
        if (carritoContainer) { // Solo si estamos en la página de carrito.html
            carritoContainer.innerHTML = '';

            if (carrito.length === 0) {
                carritoContainer.innerHTML = '<p>El carrito está vacío</p>';
                totalContainer.textContent = ''; // Limpiar el total cuando el carrito esté vacío
                return;
            }

            carrito.forEach(producto => {
                const itemCarrito = document.createElement('div');
                itemCarrito.classList.add('item-carrito', 'flex', 'gap-4', 'bg-white', 'px-4', 'py-3', 'justify-between', 'items-center');
                itemCarrito.innerHTML = `
                    <div class="flex items-start gap-4">
                        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-lg w-[70px] h-[70px]" style='background-image: url(${producto.imagen});'></div>
                        <div class="flex flex-1 flex-col justify-center">
                            <p class="text-[#111418] text-base font-medium leading-normal">${producto.nombre}</p>
                            <p class="text-[#617189] text-sm font-normal leading-normal">$${producto.precio.toFixed(2)}</p>
                        </div>
                    </div>
                `;
                carritoContainer.appendChild(itemCarrito);
            });

            totalContainer.textContent = `Total a pagar: $${calcularTotal()}`; // Mostrar el total actualizado
        }
        asignarEventos(); // Reasignar eventos después de actualizar el DOM
    }

    // Asociar eventos de click a los botones de agregar al carrito
    if (botonesAgregarCarrito) {
        botonesAgregarCarrito.forEach(boton => {
            boton.addEventListener('click', agregarAlCarrito);
        });
    }

    // Mostrar el carrito en `carrito.html`
    mostrarCarrito();

    // Función para reasignar eventos a los botones de eliminar y guardar después de actualizar el DOM
    function asignarEventos() {
        // Eliminar producto del carrito
        document.querySelectorAll('.eliminar-btn').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                carrito = carrito.filter(product => product.id !== productId);
                actualizarLocalStorage();  // Guardar cambios en localStorage
                actualizarCarrito();  // Actualizar la visualización del carrito
            });
        });

        // Guardar producto para más tarde
        document.querySelectorAll('.guardar-btn').forEach(button => {
            button.addEventListener('click', function () {
                const productId = this.getAttribute('data-product-id');
                const product = carrito.find(product => product.id === productId);
                if (product) {
                    carrito = carrito.filter(product => product.id !== productId);  // Eliminar del carrito
                    actualizarLocalStorage();  // Guardar cambios en localStorage
                    actualizarCarrito();  // Actualizar la visualización del carrito
                }
            });
        });
    }

    // Actualizar el localStorage cada vez que se modifique el carrito
    function actualizarLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(carrito));
    }

    // Realizar el pago
    const botonPagar = document.querySelector('.pagar-btn');
    if (botonPagar) {
        botonPagar.addEventListener('click', function () {
            if (carrito.length > 0) {
               
                carrito = []; // Vaciar el carrito
                actualizarLocalStorage();  // Vaciar también el localStorage
                actualizarCarrito();
            } else {
                alert('El carrito está vacío.');
            }
        });
    }

    // Inicializar carrito al cargar la página
    actualizarCarrito();
});
document.getElementById('pagar-btn').addEventListener('click', function() {
    const carrito = JSON.parse(localStorage.getItem('carrito')); // Obtener el carrito del localStorage

    // Pasar el carrito como un campo oculto en el formulario de pago
    const carritoInput = document.createElement('input');
    carritoInput.type = 'hidden';
    carritoInput.name = 'carrito';
    carritoInput.value = JSON.stringify(carrito); // Convertir el carrito a string
    document.getElementById('formulario-pago').appendChild(carritoInput);
});
