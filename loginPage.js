const username = document.getElementById('username');
const password = document.getElementById('password');
const notif = document.getElementById('notif');
const message = document.getElementById('message');

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault();

    const login = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/login', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username.value, password: password.value })
    });

    const data = await login.json();

    if (login.ok) {
        // Success State
        notif.style.display = 'flex';
        notif.className = 'notif-bar notif-success';
        message.textContent = data.message;

        setTimeout(() => {
            notif.style.display = 'none';
            window.location.replace('index.html');
        }, 800);
    } else {
        // Error State
        notif.style.display = 'flex';
        notif.className = 'notif-bar notif-error';
        message.textContent = data.message;

        setTimeout(() => {
            notif.style.display = 'none';
        }, 3000);
    }
});

/**
 * Navigation to Register
 */
const goToRegister = () => {
    document.getElementById('loadingBody').style.display = 'flex';
    setTimeout(() => {
        window.location.replace('registerPage.html');
    }, 1000);
};

document.getElementById('goto').addEventListener('click', goToRegister);
document.getElementById('gotogoto').addEventListener('click', goToRegister);