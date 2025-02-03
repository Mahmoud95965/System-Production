// script.js

// بيانات المنتجات (يمكن تخزينها في localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [];

// عرض المنتجات
function displayProducts() {
  const productList = document.getElementById('products-list');
  productList.innerHTML = '';

  products.forEach((product, index) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <div>
        <h2>${product.name}</h2>
        <p>السعر: ${product.price} دولار</p>
        <p>الخصم: ${product.discount}%</p>
      </div>
    `;
    productList.appendChild(li);
  });
}

// تسجيل الدخول عبر Google
const googleClientId = '997635938104-06o8a6coujsh0tg8skjpa2d0m7kr4pqe.apps.googleusercontent.com';

document.getElementById('login-btn').addEventListener('click', () => {
  window.gapi.load('auth2', () => {
    window.gapi.auth2.init({ client_id: googleClientId }).then(() => {
      const auth2 = window.gapi.auth2.getAuthInstance();
      auth2.signIn().then(user => {
        const profile = user.getBasicProfile();
        document.getElementById('user-info').innerHTML = `
          <img src="${profile.getImageUrl()}">
          <p>مرحبًا، ${profile.getName()}!</p>
        `;
        document.getElementById('login-btn').style.display = 'none';
        document.getElementById('admin-btn').style.display = 'inline-block';
      });
    });
  });
});

// إدارة المنتجات
document.getElementById('admin-btn').addEventListener('click', () => {
  const password = prompt('أدخل كلمة المرور:');
  if (password === 'Mahmoud5310') {
    showAdminPanel();
  } else {
    alert('كلمة المرور غير صحيحة!');
  }
});

// عرض لوحة الإدارة
function showAdminPanel() {
  const adminPanel = `
    <h2>إدارة المنتجات</h2>
    <input type="text" id="product-name" placeholder="اسم المنتج">
    <input type="number" id="product-price" placeholder="السعر">
    <input type="number" id="product-discount" placeholder="الخصم">
    <button id="add-product-btn">إضافة منتج</button>
    <ul id="admin-products-list" class="admin-panel"></ul>
  `;

  const main = document.querySelector('main');
  main.innerHTML += adminPanel;

  // إضافة منتج
  document.getElementById('add-product-btn').addEventListener('click', () => {
    const name = document.getElementById('product-name').value;
    const price = document.getElementById('product-price').value;
    const discount = document.getElementById('product-discount').value;

    if (name && price && discount) {
      products.push({ name, price, discount });
      localStorage.setItem('products', JSON.stringify(products));
      displayProducts();
      displayAdminProducts();
      alert('تمت إضافة المنتج بنجاح!');
    } else {
      alert('يرجى ملء جميع الحقول.');
    }
  });

  // عرض المنتجات في لوحة الإدارة
  function displayAdminProducts() {
    const adminProductList = document.getElementById('admin-products-list');
    adminProductList.innerHTML = '';

    products.forEach((product, index) => {
      const li = document.createElement('li');
      li.innerHTML = `
        <div>
          <h2>${product.name}</h2>
          <p>السعر: ${product.price} دولار</p>
          <p>الخصم: ${product.discount}%</p>
        </div>
        <button onclick="deleteProduct(${index})">حذف</button>
      `;
      adminProductList.appendChild(li);
    });
  }

  displayAdminProducts();
}

// حذف منتج
function deleteProduct(index) {
  products.splice(index, 1);
  localStorage.setItem('products', JSON.stringify(products));
  displayProducts();
  displayAdminProducts();
}

// عرض المنتجات عند تحميل الصفحة
displayProducts();
