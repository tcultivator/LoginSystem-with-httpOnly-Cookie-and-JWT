let toggle = false;
let accountBalance;

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
        document.getElementById('accountBalance').textContent = data.verifiedUserData.accountBalance;
        accountBalance = data.verifiedUserData.accountBalance;
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


document.getElementById('depositBtn').addEventListener('click', () => {
    document.getElementById('Deposit').style = `display:block;`
})

document.getElementById('withdrawBtn').addEventListener('click', () => {
    document.getElementById('Withdraw').style = `display:block;`
})


const depositinput = document.getElementById('depositinput');
async function confirmDeposit() {
    console.log('na click ung deposit')
    const deposit = await fetch('http://127.0.0.1:8080/deposit', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ depositAmmount: parseInt(accountBalance) + parseInt(depositinput.value) })
    })

    const data = await deposit.json()
    if (deposit.ok) {
        console.log('success')
        getMeData()
    }
    else {
        console.log('error')
    }
}





const withdrawInput = document.getElementById('withdrawinput');
async function confirmWithdraw() {
    const withdraw = await fetch('http://127.0.0.1:8080/withdraw', {
        method: 'PUT',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ withdrawAmmount: parseInt(accountBalance) - parseInt(withdrawInput.value) })
    })

    const data = await withdraw.json()
    if (withdraw.ok) {
        console.log('success')
        getMeData()
    }
    else {
        console.log('error')
    }
}

