document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('show');

    loadProducts();

    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value;
        const price = parseFloat(document.getElementById('price').value);
        const discount = parseFloat(document.getElementById('discount').value);

        if (name && !isNaN(price) && !isNaN(discount)) {
            const discountedPrice = price * (1 - discount / 100);

            const product = {
                name,
                price,
                discount,
                discountedPrice
            };

            addProductToTable(product);
            saveProduct(product);

            // Clear form inputs
            document.getElementById('name').value = '';
            document.getElementById('price').value = '';
            document.getElementById('discount').value = '';
        } else {
            alert('يرجى تعبئة جميع الحقول بشكل صحيح.');
        }
    });
});

function addProductToTable(product) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td>${product.name}</td>
        <td>${product.price.toFixed(2)}</td>
        <td>${product.discount.toFixed(2)}</td>
        <td>${product.discountedPrice.toFixed(2)}</td>
        <td>
            <button onclick="editProduct(this)">تعديل</button>
            <button onclick="deleteProduct(this)">حذف</button>
        </td>
    `;
    document.getElementById('productsTable').getElementsByTagName('tbody')[0].appendChild(row);
}

function saveProduct(product) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products.push(product);
    localStorage.setItem('products', JSON.stringify(products));
}

function loadProducts() {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    products.forEach(product => addProductToTable(product));
}

function deleteProduct(button) {
    const row = button.parentElement.parentElement;
    const name = row.getElementsByTagName('td')[0].innerText;

    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.filter(p => p.name !== name);
    localStorage.setItem('products', JSON.stringify(products));

    row.remove();
}

function editProduct(button) {
    const row = button.parentElement.parentElement;
    const name = row.getElementsByTagName('td')[0].innerText;
    const price = parseFloat(row.getElementsByTagName('td')[1].innerText);
    const discount = parseFloat(row.getElementsByTagName('td')[2].innerText);

    document.getElementById('name').value = name;
    document.getElementById('price').value = price;
    document.getElementById('discount').value = discount;

    row.style.display = 'none';

    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const newName = document.getElementById('name').value;
        const newPrice = parseFloat(document.getElementById('price').value);
        const newDiscount = parseFloat(document.getElementById('discount').value);

        if (newName && !isNaN(newPrice) && !isNaN(newDiscount)) {
            const newDiscountedPrice = newPrice * (1 - newDiscount / 100);

            const updatedProduct = {
                name: newName,
                price: newPrice,
                discount: newDiscount,
                discountedPrice: newDiscountedPrice
            };

            updateProductInTable(row, updatedProduct);
            updateProductInStorage(name, updatedProduct);

            // Clear form inputs
            document.getElementById('name').value = '';
            document.getElementById('price').value = '';
            document.getElementById('discount').value = '';

            row.style.display = '';
        } else {
            alert('يرجى تعبئة جميع الحقول بشكل صحيح.');
        }
    });
}

function updateProductInTable(row, product) {
    row.getElementsByTagName('td')[0].innerText = product.name;
    row.getElementsByTagName('td')[1].innerText = product.price.toFixed(2);
    row.getElementsByTagName('td')[2].innerText = product.discount.toFixed(2);
    row.getElementsByTagName('td')[3].innerText = product.discountedPrice.toFixed(2);
}

function updateProductInStorage(oldName, updatedProduct) {
    let products = JSON.parse(localStorage.getItem('products')) || [];
    products = products.map(p => p.name === oldName ? updatedProduct : p);
    localStorage.setItem('products', JSON.stringify(products));
}