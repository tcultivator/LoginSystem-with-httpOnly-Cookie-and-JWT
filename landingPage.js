let toggle = false;


document.getElementById('menuIcon').addEventListener('click', () => {
    toggle = !toggle;
    toggle ? (document.getElementById('rightSide').style = `right: 0;`) : (document.getElementById('rightSide').style = `right:-350px`)
})




async function getMeData() {
    const getme = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/getme', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
    })

    const data = await getme.json()
    if (getme.ok) {
        console.log(data)

        document.getElementById('user').innerText = data.verifiedUserData.username;
    }
    else {
        alert(data.message)
        window.location.replace('loginPage.html')
    }

}


document.addEventListener('DOMContentLoaded', getMeData);



let profileToggle = false;
document.getElementById('user').addEventListener('click', () => {
    profileToggle = !profileToggle;
    profileToggle ? (document.getElementById('logout').style = `display:block`) : (document.getElementById('logout').style = `display:none`)
})

document.getElementById('logout').addEventListener('click', () => {
    profileToggle = !profileToggle;
    document.getElementById('logout').style = `display:none`
    document.getElementById('modalBody').style = `display:flex;`
})

function logout() {
    console.log('test logout')
    document.getElementById('loadingBody').style = `display:flex;`
    document.getElementById('modalBody').style = `display:none;`
    setTimeout(() => {
        window.location.replace('loginPage.html')
    }, 2000);
}
function cancelLogout() {
    document.getElementById('modalBody').style = `display:none;`
}
