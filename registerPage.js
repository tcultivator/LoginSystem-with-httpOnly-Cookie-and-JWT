const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const confirmPasswordInput = document.getElementById('confirmpassword');
const notification = document.getElementById('notification');
const message = document.getElementById('message');

document.getElementById('registerForm').addEventListener('submit', function (e) {
    e.preventDefault();

    if (passwordInput.value !== confirmPasswordInput.value) {
        showNotification("Passwords do not match!", true);
    } else {
        signupFunc();
    }
});

async function signupFunc() {
    try {
        const signup = await fetch('https://loginsystem-with-httponly-cookie-and-jwt.onrender.com/signup', {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                username: usernameInput.value,
                password: passwordInput.value
            })
        });

        const data = await signup.json();

        if (signup.ok) {
            showNotification(data.message, false);
            setTimeout(() => {
                window.location.replace('loginPage.html');
            }, 2000);
        } else {
            showNotification(data.message || "Registration failed", true);
        }
    } catch (err) {
        showNotification("Server error. Please try again later.", true);
    }
}

/**
 * Helper to show the notification bar
 */
function showNotification(text, isError) {
    message.textContent = text;
    notification.style.display = 'flex';

    // Switch between Success and Error colors
    if (isError) {
        notification.classList.add('notif-error');
        document.getElementById('loader').style.display = 'none'; // Hide spinner on error
    } else {
        notification.classList.remove('notif-error');
        document.getElementById('loader').style.display = 'block';
    }

    // Auto-hide if it's an error after 3 seconds
    if (isError) {
        setTimeout(() => {
            notification.style.display = 'none';
        }, 3000);
    }
}

// Global Navigation
function goto() {
    document.getElementById('loadingBody').style.display = 'flex';
    setTimeout(() => {
        window.location.replace('loginPage.html');
    }, 800);
}

document.getElementById('goto').addEventListener('click', goto);