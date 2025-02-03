document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('show');

    loadProducts();
    loadActivityLog();

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

    document.getElementById('viewActivityLog').addEventListener('click', function() {
        promptForPassword();
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

function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    document.getElementById('userImage').src = profile.getImageUrl();
    document.getElementById('userName').innerText = profile.getName();
    document.getElementById('googleSignInButton').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';

    logActivity(`User ${profile.getName()} (${profile.getEmail()}) signed in at ${new Date().toLocaleString()}`);
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        document.getElementById('userImage').src = '';
        document.getElementById('userName').innerText = '';
        document.getElementById('googleSignInButton').style.display = 'block';
        document.getElementById('userProfile').style.display = 'none';

        logActivity(`User signed out at ${new Date().toLocaleString()}`);
    });
}

function logActivity(message) {
    let activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
    activityLog.push(message);
    localStorage.setItem('activityLog', JSON.stringify(activityLog));
}

function loadActivityLog() {
    const activityLog = JSON.parse(localStorage.getItem('activityLog')) || [];
    const logContainer = document.getElementById('activityLogContainer');
    logContainer.innerHTML = activityLog.map(log => `<p>${log}</p>`).join('');
}

function promptForPassword() {
    const password = 'your_password'; // Replace with your actual password
    const enteredPassword = prompt('أدخل كلمة المرور للوصول إلى سجل الأحداث:');
    if (enteredPassword === password) {
        window.location.href = 'activity_log.html';
    } else {
        alert('كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.');
    }
}
