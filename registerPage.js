const username = document.getElementById('username');
const password = document.getElementById('password');
const confirmpassword = document.getElementById('confirmpassword');
const message = document.getElementById('message');

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (password.value != confirmpassword.value) {
        console.log('error')
    } else {
        signupFunc();
    }
})


async function signupFunc() {
    const signup = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: username.value, password: password.value })
    })

    const data = await signup.json()
    if (signup.ok) {
        console.log('ok')
        console.log(data)
        document.getElementById('notification').style = ' display: flex;';
        message.textContent = data.message;
        setTimeout(() => {
            window.location.replace('loginPage.html')
        }, 2000);
    }
    else {
        console.log('errr')
        console.log(data)
    }
}






document.getElementById('goto').addEventListener('click', goto)


function goto() {
    document.getElementById('loadingBody').style = 'display: flex;'
    setTimeout(() => {
        window.location.replace('loginPage.html')
    }, 1000);

}
