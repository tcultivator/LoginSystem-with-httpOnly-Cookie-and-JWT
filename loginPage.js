const username = document.getElementById('username')
const password = document.getElementById('password')

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault()
    const login = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })
    })

    const data = await login.json()
    if (login.ok) {
        document.getElementById('notif').style = `display:flex;
        background-color:rgb(61, 231, 126)`
        document.getElementById('message').textContent = data.message
        setTimeout(() => {
            document.getElementById('notif').style = `display:none;`
            window.location.replace('index.html');
        }, 500);
    }
    else {
        document.getElementById('notif').style = `display:flex;`
        document.getElementById('message').textContent = data.message
        setTimeout(() => {
            document.getElementById('notif').style = `display:none;`
        }, 2000);
    }
})

document.getElementById('goto').addEventListener('click', () => {
    document.getElementById('loadingBody').style = 'display: flex;'
    setTimeout(() => {
        window.location.replace('registerPage.html')
    }, 1000);
})

document.getElementById('gotogoto').addEventListener('click', () => {
    document.getElementById('loadingBody').style = 'display: flex;'
    setTimeout(() => {
        window.location.replace('registerPage.html')
    }, 1000);
})
