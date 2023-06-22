const socket = io();

socket.on('connect', () => {
    console.log('Cliente Conectado');
});

socket.on('productos', datos => {
    const tbody = document.querySelector('.productTable tbody');
    const products = datos;

    tbody.innerHTML = '';

    products.forEach(p => {
        const fila = document.createElement('tr');
        fila.innerHTML = `
            <td>${p.title}</td>
            <td>${p.description}</td>
            <td>${p.price}</td>
            <td>${p.stock}</td>
            <td>ID: ${p.id}</td>
            <td><img src="/img/${p.thumbnail}" style="width: 10%"></td>
            <td>
                <button class="deleteProduct" data-id="${p.id}">
                    <i>-</i>
                </button>
            </td>
        `;
        tbody.appendChild(fila);


        const btnDelete = fila.querySelector('.deleteProduct');
        btnDelete.addEventListener('click', () => {
            const productId = btnDelete.dataset.id;
            socket.emit('productos', productId);
        });
    });
});

const form = document.getElementById('addForm');
form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtiene los valores del formulario
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const thumbnail = document.getElementById('thumbnail').value;
    const code = document.getElementById('code').value;
    const stock = document.getElementById('stock').value;

    // Verifica que los valores no sean undefined o null
    if (title && description && price && thumbnail && code && stock) {
        // Crea un objeto con los datos del producto
        const productData = {
            title,
            description,
            price,
            thumbnail,
            code,
            stock
        };

        socket.emit('addProduct', JSON.stringify(productData));
    } else {
        console.error('Error: Datos de producto inválidos');
    }
});
