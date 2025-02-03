// بيانات المنتجات (يمكن تخزينها في localStorage)
let products = JSON.parse(localStorage.getItem('products')) || [];

// عرض المنتجات
function displayProducts() {
    const vegetablesTableBody = document.getElementById('vegetablesTable').getElementsByTagName('tbody')[0];
    const fruitsTableBody = document.getElementById('fruitsTable').getElementsByTagName('tbody')[0];
    const otherTableBody = document.getElementById('otherTable').getElementsByTagName('tbody')[0];

    vegetablesTableBody.innerHTML = '';
    fruitsTableBody.innerHTML = '';
    otherTableBody.innerHTML = '';

    products.forEach((product, index) => {
        const row = document.createElement('tr');
        const nameCell = row.insertCell(0);
        const priceCell = row.insertCell(1);
        const discountCell = row.insertCell(2);
        const finalPriceCell = row.insertCell(3);

        nameCell.textContent = product.name;
        priceCell.textContent = product.price + ' دولار';
        discountCell.textContent = product.discount + '%';
        finalPriceCell.textContent = (product.price * (1 - product.discount / 100)).toFixed(2) + ' دولار';

        if (product.category === 'vegetables') {
            vegetablesTableBody.appendChild(row);
        } else if (product.category === 'fruits') {
            fruitsTableBody.appendChild(row);
        } else {
            otherTableBody.appendChild(row);
        }
    });
}

// تسجيل الدخول عبر Google
function onSignIn(googleUser) {
    const profile = googleUser.getBasicProfile();
    document.getElementById('userImage').src = profile.getImageUrl();
    document.getElementById('userName').textContent = profile.getName();
    document.getElementById('googleSignInButton').style.display = 'none';
    document.getElementById('userProfile').style.display = 'flex';
    document.getElementById('admin-link').style.display = 'inline-block';
}

// تسجيل الخروج
function signOut() {
    const auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(() => {
        document.getElementById('googleSignInButton').style.display = 'block';
        document.getElementById('userProfile').style.display = 'none';
        document.getElementById('admin-link').style.display = 'none';
    });
}

// عرض نافذة إدارة المنتجات
function showAdminModal() {
    document.getElementById('admin-modal').style.display = 'block';
}

// تسجيل الدخول إلى لوحة الإدارة
document.getElementById('admin-login-btn').addEventListener('click', () => {
    const password = document.getElementById('admin-password').value;
    if (password === 'Mahmoud5310') {
        window.location.href = 'admin.html';
        document.getElementById('admin-modal').style.display = 'none';
    } else {
        alert('كلمة المرور غير صحيحة!');
    }
});

// تأثير ظهور الموقع ببطء
$(document).ready(function() {
    $('body').css('opacity', 0).animate({ opacity: 1 }, 1000);

    // تأثير التمرير البطيء بين الأقسام
    $('nav ul li a').click(function(e) {
        e.preventDefault();
        const target = $(this).attr('href');
        $('html, body').animate({
            scrollTop: $(target).offset().top
        }, 1000);
    });
});

// تأثير كتابة الكلمة الثابتة ببطء
const text = "مرحبا بك في متجرنا الإلكتروني";
let index = 0;

function typeWriter() {
    if (index < text.length) {
        document.getElementById("dynamic-text").innerHTML += text.charAt(index);
        index++;
        setTimeout(typeWriter, 100);
    } else {
        setTimeout(eraseText, 3000); // بعد 3 ثوانٍ، امسح النص
    }
}

function eraseText() {
    if (index > 0) {
        index--;
        document.getElementById("dynamic-text").innerHTML = text.substring(0, index);
        setTimeout(eraseText, 50);
    } else {
        setTimeout(typeWriter, 1000); // بعد ثانية، ابدأ الكتابة مرة أخرى
    }
}

window.onload = function() {
    typeWriter();
};

// عرض المنتجات عند تحميل الصفحة
displayProducts();
