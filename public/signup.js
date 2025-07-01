document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const email = document.getElementById('email').value;
    const mobileNumber = document.getElementById('mobileNumber').value;
    const password = document.getElementById('password').value;
    const role = document.getElementById('role').value;
    const errorEl = document.getElementById('error');
    const successEl = document.getElementById('success');

    try {
        const response = await axios.post('http://127.0.0.1:3000/signup', {
            name,
            email,
            mobileNumber,
            password,
            role
        });
        successEl.textContent = response.data.msg;
        errorEl.textContent = '';
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 2000);
    } catch (error) {
        errorEl.textContent = error.response?.data?.error || 'Registration failed';
        successEl.textContent = '';
    }
});