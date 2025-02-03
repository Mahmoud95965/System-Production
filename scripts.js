// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBqmCUDXVuNirg0a4fIeP9OaXdcPuGySGs",
  authDomain: "sestem-production.firebaseapp.com",
  projectId: "sestem-production",
  storageBucket: "sestem-production.firebasestorage.app",
  messagingSenderId: "344831260064",
  appId: "1:344831260064:web:23ee0da128920d541420c5",
  measurementId: "G-JLJ3JB31MT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function() {
    document.body.classList.add('show');

    loadProducts();
    loadActivityLog();

    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();

        const name = document.getElementById('name').value.trim();
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

            showSuccessMessage('تم إضافة المنتج بنجاح.');

            // Clear form inputs
            document.getElementById('name').value = '';
            document.getElementById('price').value = '';
            document.getElementById('discount').value = '';
        } else {
            showErrorMessage('يرجى تعبئة جميع الحقول بشكل صحيح.');
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
    db.collection('products').add(product)
        .then(() => {
            console.log('Product added successfully');
        })
        .catch((error) => {
            console.error('Error adding product: ', error);
        });
}

function loadProducts() {
    db.collection('products').get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                const product = doc.data();
                addProductToTable(product);
            });
        })
        .catch((error) => {
            console.error('Error getting products: ', error);
        });
}

function deleteProduct(button) {
    const row = button.parentElement.parentElement;
    const name = row.getElementsByTagName('td')[0].innerText;

    db.collection('products').where('name', '==', name).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.delete();
            });
        })
        .then(() => {
            row.remove();
            showSuccessMessage('تم حذف المنتج بنجاح.');
        })
        .catch((error) => {
            console.error('Error deleting product: ', error);
        });
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

        const newName = document.getElementById('name').value.trim();
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
            showSuccessMessage('تم تحديث المنتج بنجاح.');
        } else {
            showErrorMessage('يرجى تعبئة جميع الحقول بشكل صحيح.');
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
    db.collection('products').where('name', '==', oldName).get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
                doc.ref.update(updatedProduct);
            });
        })
        .catch((error) => {
            console.error('Error updating product: ', error);
        });
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
    db.collection('activityLog').add({ message, timestamp: firebase.firestore.FieldValue.serverTimestamp() })
        .then(() => {
            console.log('Activity logged successfully');
        })
        .catch((error) => {
            console.error('Error logging activity: ', error);
        });
}

function loadActivityLog() {
    db.collection('activityLog').orderBy('timestamp', 'desc').get()
        .then((querySnapshot) => {
            const logContainer = document.getElementById('activityLogContainer');
            logContainer.innerHTML = '';
            querySnapshot.forEach((doc) => {
                const log = doc.data().message;
                logContainer.innerHTML += `<p>${log}</p>`;
            });
        })
        .catch((error) => {
            console.error('Error loading activity log: ', error);
        });
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

function filterProducts() {
    const searchInput = document.getElementById('searchInput').value.toLowerCase();
    const rows = document.getElementById('productsTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    for (let i = 0; i < rows.length; i++) {
        const name = rows[i].getElementsByTagName('td')[0].innerText.toLowerCase();
        if (name.includes(searchInput)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
}

function sortProducts() {
    const sortSelect = document.getElementById('sortSelect').value;
    const rows = Array.from(document.getElementById('productsTable').getElementsByTagName('tbody')[0].getElementsByTagName('tr'));

    rows.sort((a, b) => {
        const aVal = a.getElementsByTagName('td')[['name', 'price', 'discount'].indexOf(sortSelect)].innerText;
        const bVal = b.getElementsByTagName('td')[['name', 'price', 'discount'].indexOf(sortSelect)].innerText;
        return aVal.localeCompare(bVal);
    });

    const tbody = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    rows.forEach(row => tbody.appendChild(row));
}

function showSuccessMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert success';
    alertDiv.innerText = message;
    document.getElementById('container').insertBefore(alertDiv, document.getElementById('addProductSection'));

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

function showErrorMessage(message) {
    const alertDiv = document.createElement('div');
    alertDiv.className = 'alert error';
    alertDiv.innerText = message;
    document.getElementById('container').insertBefore(alertDiv, document.getElementById('addProductSection'));

    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}
