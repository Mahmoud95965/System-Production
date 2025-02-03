// بيانات المنتجات (يمكن تخزينها في localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [];

// عرض المنتجات في لوحة الإدارة
function displayAdminProducts() {
    const productsTableBodyAdmin = document.getElementById('productsTableAdmin').getElementsByTagName('tbody')[0];
    productsTableBodyAdmin.innerHTML = '';

    products.forEach((product, index) => {
        const row = productsTableBodyAdmin.insertRow();
        const nameCell = row.insertCell(0);
        const priceCell = row.insertCell(1);
        const discountCell = row.insertCell(2);
        const finalPriceCell = row.insertCell(3);
        const actionsCell = row.insertCell(4);

        nameCell.textContent = product.name;
        priceCell.textContent = product.price + ' دولار';
        discountCell.textContent = product.discount + '%';
        finalPriceCell.textContent = (product.price * (1 - product.discount / 100)).toFixed(2) + ' دولار';

        const editButton = document.createElement('button');
        editButton.textContent = 'تعديل';
        editButton.onclick = () => editProduct(index);
        actionsCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'حذف';
        deleteButton.onclick = () => deleteProduct(index);
        actionsCell.appendChild(deleteButton);
    });
}

// إضافة منتج
document.getElementById('productForm').addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const price = document.getElementById('price').value;
    const discount = document.getElementById('discount').value;

    if (name && price) {
        products.push({ name, price, discount: discount || 0 });
        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
        document.getElementById('productForm').reset();
        alert('تمت إضافة المنتج بنجاح!');
    } else {
        alert('يرجى ملء جميع الحقول.');
    }
});

// تعديل منتج
function editProduct(index) {
    const product = products[index];
    const name = prompt('أدخل اسم المنتج الجديد:', product.name);
    const price = prompt('أدخل السعر الجديد:', product.price);
    const discount = prompt('أدخل الخصم الجديد:', product.discount);

    if (name && price) {
        products[index] = { name, price, discount: discount || 0 };
        localStorage.setItem('products', JSON.stringify(products));
        displayAdminProducts();
        alert('تم تعديل المنتج بنجاح!');
    } else {
        alert('يرجى ملء جميع الحقول.');
    }
}

// حذف منتج
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    displayAdminProducts();
    alert('تم حذف المنتج بنجاح!');
}

// العودة إلى الصفحة الرئيسية
function goBack() {
    window.location.href = 'index.html';
}

// عرض المنتجات عند تحميل الصفحة
displayAdminProducts();
