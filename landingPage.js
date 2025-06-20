let toggle = false;
let accountBalance;
let userId;
let username;
let transaction;
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
        document.getElementById('user').innerText = data.verifiedUserData.username;
        document.getElementById('accountBalance').textContent = ` ₱ ${data.verifiedUserData.accountBalance}`;
        accountBalance = data.verifiedUserData.accountBalance;
        userId = data.verifiedUserData.id;
        username = data.verifiedUserData.username;
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
    hideWithdraw()
})

document.getElementById('withdrawBtn').addEventListener('click', () => {
    document.getElementById('Withdraw').style = `display:block;`
    hideDeposit()
})
const depositinput = document.getElementById('depositinput');
async function confirmDeposit() {
    let status;
    if (depositinput.value == '') {
        alert('Insert Ammount')
    }
    else {
        const deposit = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/deposit', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ depositAmmount: parseInt(accountBalance) + parseInt(depositinput.value) })
        })
        const data = await deposit.json()
        const date = new Date();
        if (deposit.ok) {
            transaction = `Deposit : ${parseInt(accountBalance)}₱ + ${parseInt(depositinput.value)}₱ `
            status = 'Success';
            document.getElementById('notifDeposit').style = `display:flex;
            background-color: green;`
            document.getElementById('message').textContent = data.message;
            setTimeout(() => {
                getMeData()
                hideDeposit()
                document.getElementById('notifDeposit').style = `display:none;`
                transactionHistory(userId, username, transaction, status, date)
            }, 1000);
        }
        else {
            transaction = `Deposit : ${parseInt(accountBalance), '+', parseInt(depositinput.value)} `
            status = 'Failed';
            document.getElementById('notifDeposit').style = `display:flex;
            background-color: red;`
            document.getElementById('message').textContent = data.message;
            setTimeout(() => {
                document.getElementById('notifDeposit').style = `display:none;`
                transactionHistory(userId, username, transaction, status, date)
            }, 1000);
        }
    }
}
const withdrawInput = document.getElementById('withdrawinput');
async function confirmWithdraw() {
    let status;
    if (parseInt(accountBalance) < parseInt(withdrawInput.value)) {
        alert('insufficient balance ')
    }
    else if (withdrawInput.value == '') {
        alert('Insert Ammount')
    } else {
        const withdraw = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/withdraw', {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ withdrawAmmount: parseInt(accountBalance) - parseInt(withdrawInput.value) })
        })
        const date = new Date();
        const data = await withdraw.json()
        if (withdraw.ok) {
            transaction = `Withdraw : ${parseInt(accountBalance)}₱ - ${parseInt(withdrawInput.value)}₱ `
            document.getElementById('notifWithdraw').style = `display:flex;
            background-color: green;`
            document.getElementById('message1').textContent = data.message;
            status = 'Success';
            setTimeout(() => {
                getMeData()
                hideWithdraw()
                document.getElementById('notifWithdraw').style = `display:none;`
                transactionHistory(userId, username, transaction, status, date)
            }, 1000);
        }
        else {
            status = 'Failed';
            transaction = `Withdraw : ${parseInt(accountBalance)}₱ - ${parseInt(withdrawInput.value)}₱ `
            document.getElementById('notifWithdraw').style = `display:flex;
            background-color: red;`
            document.getElementById('message1').textContent = data.message;
            setTimeout(() => {
                document.getElementById('notifWithdraw').style = `display:none;`
                transactionHistory(userId, username, transaction, status, date)
            }, 1000);
        }
    }
}
function hideWithdraw() {
    document.getElementById('Withdraw').style = `display:none;`
    withdrawInput.value = ''
}
function hideDeposit() {
    document.getElementById('Deposit').style = `display:none;`
    depositinput.value = ''
}
function transactionHistory(userId, username, transaction, status, date) {
    let statusId = '';
    if (status == 'Success') {
        statusId = 'success'
        console.log(statusId)
    } else {
        statusId = 'failed'
    }
    document.getElementById('transactionTable').innerHTML += ` 
                        <td>${userId}</td>
                        <td>${username}</td>
                        <td>${transaction}</td>
                        <td id='${statusId}'>${status}</td>
                        <td>${date}</td>`
}










