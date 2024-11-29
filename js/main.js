document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.querySelector("#contenedor-productos");
    const botonesCategorias = document.querySelectorAll(".boton-categoria");
    const tituloPrincipal = document.querySelector("#titulo-principal");
    const numerito = document.querySelector("#numerito");
    let productos = [];
    let productosEnCarrito = JSON.parse(localStorage.getItem("productos-en-carrito")) || [];

    // Cargar los productos desde el archivo JSON
    fetch("./js/productos.json")
        .then(response => {
            if (!response.ok) {
                throw new Error("No se pudo cargar el archivo productos.json");
            }
            return response.json();
        })
        .then(data => {
            productos = data;
            cargarProductos(productos);
            actualizarNumerito();
        })
        .catch(error => {
            console.error(error);
            alert("Ocurrió un error al cargar los productos. Intenta nuevamente más tarde.");
        });

// Función para cargar productos en el DOM
// Función para cargar productos en el DOM
function cargarProductos(productosElegidos) {
    contenedorProductos.innerHTML = "";

    productosElegidos.forEach(({ id, imagen, titulo, precio, descripcion }) => {
        const div = document.createElement("div");
        div.classList.add("producto");
        div.innerHTML = `
            <img class="producto-imagen" src="${imagen}" alt="${titulo}">
            <div class="producto-detalles">
                <h3 class="producto-titulo">${titulo}</h3>
                <p class="producto-descripcion ocultar">${descripcion}</p> <!-- Descripción oculta inicialmente -->
                <button class="mostrar-descripcion">Mostrar más</button>
                <p class="producto-precio">$${precio}</p>
                <button class="producto-agregar" id="${id}">Agregar</button>
            </div>
        `;

        contenedorProductos.appendChild(div);
    });

    actualizarBotonesAgregar();
    actualizarBotonesMostrarDescripcion();
}

// Función para actualizar los botones de mostrar descripción
function actualizarBotonesMostrarDescripcion() {
    const botonesMostrarDescripcion = document.querySelectorAll(".mostrar-descripcion");

    botonesMostrarDescripcion.forEach(boton => {
        boton.addEventListener("click", (e) => {
            const descripcion = e.currentTarget.previousElementSibling; // Buscar la descripción
            descripcion.classList.toggle("ocultar"); // Alternar la visibilidad de la descripción
            e.currentTarget.innerText = descripcion.classList.contains("ocultar") ? "Mostrar más" : "Mostrar menos"; // Cambiar el texto del botón
        });
    });
}



    // Función para actualizar los botones de agregar al carrito
    function actualizarBotonesAgregar() {
        const botonesAgregar = document.querySelectorAll(".producto-agregar");

        botonesAgregar.forEach(boton => {
            boton.addEventListener("click", agregarAlCarrito);
        });
    }

    // Función para agregar productos al carrito
    function agregarAlCarrito(e) {
        const { id } = e.currentTarget;
        const productoAgregado = productos.find(producto => producto.id === id);

        if (productoAgregado) {
            if (productosEnCarrito.some(producto => producto.id === id)) {
                const index = productosEnCarrito.findIndex(producto => producto.id === id);
                productosEnCarrito[index].cantidad++;
            } else {
                productoAgregado.cantidad = 1;
                productosEnCarrito.push(productoAgregado);
            }

            localStorage.setItem("productos-en-carrito", JSON.stringify(productosEnCarrito));

            Toastify({
                text: "Producto agregado",
                duration: 3000,
                close: true,
                gravity: "top",
                position: "right",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #4b33a8, #785ce9)",
                    borderRadius: "2rem",
                    textTransform: "uppercase",
                    fontSize: ".75rem"
                },
                offset: { x: '1.5rem', y: '1.5rem' }
            }).showToast();

            actualizarNumerito();
        }
    }

    // Función para actualizar el número de productos en el carrito
    function actualizarNumerito() {
        const totalCantidad = productosEnCarrito.reduce((acc, producto) => acc + producto.cantidad, 0);
        numerito.innerText = totalCantidad;
    }

    // Función para filtrar productos por categoría
    function filtrarProductosPorCategoria(categoriaId) {
        if (categoriaId !== "todos") {
            const productosFiltrados = productos.filter(producto => producto.categoria.id === categoriaId);
            tituloPrincipal.innerText = productosFiltrados[0]?.categoria.nombre || "Categoría no encontrada";
            cargarProductos(productosFiltrados);
        } else {
            tituloPrincipal.innerText = "Todos los productos";
            cargarProductos(productos);
        }
    }

    // Event listener para categorías
    botonesCategorias.forEach(boton => {
        boton.addEventListener("click", (e) => {
            botonesCategorias.forEach(boton => boton.classList.remove("active"));
            e.currentTarget.classList.add("active");
            filtrarProductosPorCategoria(e.currentTarget.id);
        });
    });

    // Cerrar el "aside" al hacer clic en una categoría
    botonesCategorias.forEach(boton => boton.addEventListener("click", () => {
        aside.classList.remove("aside-visible");
    }));

    // Mejorar la visibilidad del carrito (opcional, si se quiere)
    // const carritoIcono = document.querySelector("#carrito-icono");
    // carritoIcono.addEventListener("click", mostrarCarrito);

    // Función para mostrar un resumen del carrito (opcional)
    // function mostrarCarrito() {
    //     const carritoModal = document.querySelector("#carrito-modal");
    //     carritoModal.classList.add("visible");
    //     // Agregar lógica para mostrar los productos en el carrito en el modal
    // }
});
