function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    if (username && password) {
        window.location.href = './files/home.html';
        localStorage.setItem("userData", JSON.stringify({ username: username, password: password }));
    } else {
        alert('Please enter both username and password.');
    }
}