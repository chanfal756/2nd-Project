// --- CONFIGURATION ---
const API_URL = '/api/auth';

// --- DOM ELEMENTS ---
const authSection = document.getElementById('auth-section');
const dashboardSection = document.getElementById('dashboard-section');
const loginFormDiv = document.getElementById('login-form');
const registerFormDiv = document.getElementById('register-form');

const loginForm = document.getElementById('form-login');
const registerForm = document.getElementById('form-register');

const btnLogout = document.getElementById('btn-logout');
const showRegister = document.getElementById('show-register');
const showLogin = document.getElementById('show-login');

const userDisplayName = document.getElementById('user-display-name');
const welcomeText = document.getElementById('welcome-text');

// --- AUTH LOGIC ---

// Check login status on load
window.addEventListener('load', () => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    if (token && user) {
        showDashboard(user);
    } else {
        showAuth();
    }
});

// Switch between Login/Register forms
showRegister.onclick = (e) => {
    e.preventDefault();
    loginFormDiv.classList.add('hidden');
    registerFormDiv.classList.remove('hidden');
};

showLogin.onclick = (e) => {
    e.preventDefault();
    registerFormDiv.classList.add('hidden');
    loginFormDiv.classList.remove('hidden');
};

// Handle Registration
registerForm.onsubmit = async (e) => {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            Swal.fire('Welcome Board!', 'Registration successful.', 'success');
            showDashboard(data.user);
        } else {
            Swal.fire('Registration Failed', data.message, 'error');
        }
    } catch (err) {
        Swal.fire('Server Error', 'Could not reach the command center.', 'error');
    }
};

// Handle Login
loginForm.onsubmit = async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (data.success) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            Swal.fire({
                icon: 'success',
                title: 'Authorized',
                text: `Welcome back, Captain ${data.user.name}`,
                timer: 1500,
                showConfirmButton: false
            });
            showDashboard(data.user);
        } else {
            Swal.fire('Access Denied', data.message, 'error');
        }
    } catch (err) {
        Swal.fire('Server Error', 'Login system unavailable.', 'error');
    }
};

// Logout
btnLogout.onclick = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    showAuth();
};

// UI Toggles
function showDashboard(user) {
    authSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    userDisplayName.innerText = user.name;
    welcomeText.innerText = `Fleet Dashboard - Captain ${user.name}`;
}

function showAuth() {
    dashboardSection.classList.add('hidden');
    authSection.classList.remove('hidden');
}

// Interactivity for Dashboard Buttons
document.querySelectorAll('.check-btn').forEach(btn => {
    btn.onclick = () => {
        const system = btn.getAttribute('data-system');
        Swal.fire(`${system} Check`, 'Diagnostics complete. All parameters nominal.', 'success');
    };
});
