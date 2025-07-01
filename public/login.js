document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const errorEl = document.getElementById('error');
    const successEl = document.getElementById('success');

    try {
        const response = await axios.post('http://127.0.0.1:3000/login', {
            email,
            password
        });
        const { token, userData } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        successEl.textContent = response.data.message;
        errorEl.textContent = '';
        setTimeout(() => {
            window.location.href = 'project.html';
        }, 2000);
    } catch (error) {
        errorEl.textContent = error.response?.data?.message || 'Login failed';
        successEl.textContent = '';
    }
});