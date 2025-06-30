const loginForm = document.getElementById('loginForm');

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3000/login', {
            email,
            password
        });

        if (response.data.success) {            alert('Login successful');
            const token = response.data.token;
            localStorage.setItem('token', token); // Store token in localStorage
            window.location.href='./project.html'; // Redirect to projects page on successful login
            // Redirect or perform other actions

        } else {
            alert('Login failed');
        }
    } catch (error) {
        console.error(error);
        alert('Error logging in');
    }
});
