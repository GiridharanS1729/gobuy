document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData) {
        const username = userData.username.split('@')[0].replace(/[^a-zA-Z0-9]/g, '');      
        document.getElementById("username").innerText = `Username: ${username}`;
        document.getElementById("mailid").innerText = `Email: ${userData.username}`;
        document.getElementById("password").innerText = `Password: ${userData.password}`;
    } else {
        document.getElementById("user-info").innerText = "No user data found.";
    }
});
