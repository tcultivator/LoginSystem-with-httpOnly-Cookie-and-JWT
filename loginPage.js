const username = document.getElementById('username')
const password = document.getElementById('password')

document.getElementById('loginForm').addEventListener('submit', async function (e) {
    e.preventDefault()
    const login = await fetch('http://127.0.0.1:8080/login', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })
    })

    const data = await login.json()
    if (login.ok) {
        console.log(data.message)
        window.location.replace('index.html')
    }
    else {
        console.log(data.message)
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
