// scripts.js

// بيانات المنتجات (يمكن تخزينها في localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [];

// عرض المنتجات
function displayProducts() {
  const productsTableBody = document.getElementById('productsTable').getElementsByTagName('tbody')[0];
  productsTableBody.innerHTML = '';

  products.forEach((product, index) => {
    const row = productsTableBody.insertRow();
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

// تسجيل الدخول عبر Google
function onSignIn(googleUser) {
  const profile = googleUser.getBasicProfile();
  document.getElementById('userImage').src = profile.getImageUrl();
  document.getElementById('userName').textContent = profile.getName();
  document.getElementById('googleSignInButton').style.display = 'none';
  document.getElementById('userProfile').style.display = 'flex';
  document.getElementById('admin-btn').style.display = 'inline-block';
}

// تسجيل الخروج
function signOut() {
  const auth2 = gapi.auth2.getAuthInstance();
  auth2.signOut().then(() => {
    document.getElementById('googleSignInButton').style.display = 'block';
    document.getElementById('userProfile').style.display = 'none';
    document.getElementById('admin-btn').style.display = 'none';
  });
}

// عرض صفحة إدارة المنتجات
function showAdminPage() {
  const password = prompt('أدخل كلمة المرور:');
  if (password === 'your_password') {
    window.location.href = 'admin.html';
  } else {
    alert('كلمة المرور غير صحيحة!');
  }
}

// العودة إلى الصفحة الرئيسية
function goBack() {
  window.location.href = 'index.html';
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
    displayProducts();
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
    displayProducts();
    alert('تم تعديل المنتج بنجاح!');
  } else {
    alert('يرجى ملء جميع الحقول.');
  }
}

// حذف منتج
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  displayProducts();
  alert('تم حذف المنتج بنجاح!');
}

// عرض المنتجات عند تحميل الصفحة
displayProducts();
