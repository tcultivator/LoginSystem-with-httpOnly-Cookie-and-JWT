let accountBalance;
let userId;
let username;
let transaction;

/**
 * 1. NAVIGATION & SIDEBAR LOGIC
 */
const menuIcon = document.getElementById('menuIcon');
const rightSide = document.getElementById('rightSide');

const toggleMenu = (isOpen) => {
    if (isOpen) {
        rightSide.classList.add('active');
        menuIcon.querySelector('i').classList.replace('fa-bars-staggered', 'fa-xmark');
        document.body.style.overflow = 'hidden';
    } else {
        rightSide.classList.remove('active');
        menuIcon.querySelector('i').classList.replace('fa-xmark', 'fa-bars-staggered');
        document.body.style.overflow = 'auto';
    }
};

menuIcon.addEventListener('click', () => {
    const isOpened = rightSide.classList.contains('active');
    toggleMenu(!isOpened);
});

document.querySelectorAll('#rightSide a').forEach(link => {
    link.addEventListener('click', () => toggleMenu(false));
});


/**
 * 2. MODERN PROFILE DROPDOWN & LOGOUT
 */
const profileBtn = document.getElementById('user');
const logoutMenu = document.getElementById('logout-menu'); // Matches your HTML ID

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isVisible = logoutMenu.style.display === 'block';
    logoutMenu.style.display = isVisible ? 'none' : 'block';
});

// Close dropdown if clicking anywhere else
document.addEventListener('click', () => {
    logoutMenu.style.display = 'none';
});

// Show the Logout Confirmation Modal
document.getElementById('logout-trigger').addEventListener('click', () => {
    document.getElementById('modalBody').style.display = 'flex';
});

function cancelLogout() {
    document.getElementById('modalBody').style.display = 'none';
}

async function logout() {
    const res = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/userLogout', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
    });

    if (res.ok) {
        document.getElementById('loadingBody').style.display = 'flex';
        document.getElementById('modalBody').style.display = 'none';
        setTimeout(() => window.location.replace('loginPage.html'), 2000);
    }
}


/**
 * 3. DATA FETCHING
 */
async function getMeData() {
    try {
        const getme = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/getme', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
        });
        const data = await getme.json();

        if (getme.ok) {
            // Update the display username inside the profile button
            document.getElementById('username-display').textContent = data.verifiedUserData.username;
            document.getElementById('accountBalance').textContent = `₱ ${data.verifiedUserData.accountBalance.toLocaleString()}`;

            accountBalance = data.verifiedUserData.accountBalance;
            userId = data.verifiedUserData.id;
            username = data.verifiedUserData.username;
        } else {
            window.location.replace('loginPage.html');
        }
    } catch (err) {
        console.error("Failed to fetch user data", err);
    }
}
document.addEventListener('DOMContentLoaded', getMeData);


/**
 * 4. DEPOSIT & WITHDRAW LOGIC
 */
document.getElementById('depositBtn').addEventListener('click', () => {
    document.getElementById('Deposit').style.display = 'flex';
    hideWithdraw();
});

document.getElementById('withdrawBtn').addEventListener('click', () => {
    document.getElementById('Withdraw').style.display = 'flex';
    hideDeposit();
});

function hideWithdraw() {
    document.getElementById('Withdraw').style.display = 'none';
    document.getElementById('withdrawinput').value = '';
}

function hideDeposit() {
    document.getElementById('Deposit').style.display = 'none';
    document.getElementById('depositinput').value = '';
}

async function confirmDeposit() {
    const amount = document.getElementById('depositinput').value;
    if (!amount || amount <= 0) return alert('Please enter a valid amount');

    const res = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/deposit', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositAmmount: parseInt(accountBalance) + parseInt(amount) })
    });

    const data = await res.json();
    handleTransactionResponse(res.ok, data.message, 'Deposit', amount, 'notifDeposit', 'message');
}

async function confirmWithdraw() {
    const amount = document.getElementById('withdrawinput').value;
    if (!amount || amount <= 0) return alert('Please enter a valid amount');
    if (parseInt(accountBalance) < parseInt(amount)) return alert('Insufficient balance');

    const res = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/withdraw', {
        method: 'PUT',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawAmmount: parseInt(accountBalance) - parseInt(amount) })
    });

    const data = await res.json();
    handleTransactionResponse(res.ok, data.message, 'Withdraw', amount, 'notifWithdraw', 'message1');
}

/**
 * 5. MODERN UI UTILITIES (SUCCESS/FAIL FEEDBACK)
 */
function handleTransactionResponse(isOk, msg, type, amount, notifId, msgId) {
    const date = new Date();
    const status = isOk ? 'Success' : 'Failed';
    const symbol = type === 'Deposit' ? '+' : '-';
    const transactionText = `${type}: ₱${accountBalance} ${symbol} ₱${amount}`;

    const notifEl = document.getElementById(notifId);
    const msgEl = document.getElementById(msgId);

    // Set message with Icon
    msgEl.innerHTML = `<i class="fa-solid ${isOk ? 'fa-circle-check' : 'fa-circle-exclamation'}"></i> ${msg}`;

    // Apply dynamic success/error styling
    notifEl.style.display = 'flex';
    notifEl.className = isOk ? 'notif-bar notif-success' : 'notif-bar notif-error';

    setTimeout(() => {
        if (isOk) {
            getMeData();
            type === 'Deposit' ? hideDeposit() : hideWithdraw();
        }
        notifEl.style.display = 'none';
        transactionHistory(userId, username, transactionText, status, date);
    }, 2000);
}

function transactionHistory(userId, username, transaction, status, date) {
    const statusClass = (status === 'Success') ? 'success' : 'failed';
    const row = `
        <tr>
            <td>${userId}</td>
            <td>${username}</td>
            <td>${transaction}</td>
            <td><span id="${statusClass}">${status}</span></td>
            <td>${new Date(date).toLocaleString()}</td>
        </tr>`;
    const container = document.getElementById('transactionValue');
    container.innerHTML = row + container.innerHTML;
}