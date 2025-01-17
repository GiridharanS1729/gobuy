function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    if (username && password) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            window.location.href = './files/home.html';
            localStorage.setItem("userData", JSON.stringify({ username:username,email: user.email, password: user.password }));
        } else {
            alert('Invalid username or password.');
        }
    } else {
        alert('Please enter both username and password.');
    }
}


function handleSignup(event) {
    event.preventDefault();
    const username = document.getElementById('signup-username').value.trim();
    const email = document.getElementById('signup-email').value.trim();
    const password = document.getElementById('signup-password').value.trim();
    if (!username || !email || !password) {
        alert('All fields are required!');
        return;
    }
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.email === email||user.username===username);
    if (userExists) {
        alert('User with this data already exists!');
        return;
    }
    users.push({ username, email, password });
    localStorage.setItem('users', JSON.stringify(users));
    swall();
}

window.onload = function () {
    const user = localStorage.getItem("userData");
    console.log(user);
    if (user) {
        window.location.href = "/files/home.html";
    }
};

function toggleForms(form) {
    const loginForm = document.getElementById("login-form");
    const signupForm = document.getElementById("signup-form");
    const formTitle = document.getElementById("form-title");

    if (form === "signup") {
        loginForm.classList.add("hidden");
        signupForm.classList.remove("hidden");
        formTitle.textContent = "Create Your Account";
    } else {
        signupForm.classList.add("hidden");
        loginForm.classList.remove("hidden");
        formTitle.textContent = "Start Shopping Now";
    }
}

function swall() {
    Swal.fire({
        title: 'Signed Up',
        text: 'Your account has been created successfully!',
        icon: 'success',
        confirmButtonText: 'OK'
    }).then((result) => {
        if (result.isConfirmed) {
            toggleForms("login");
        }
    });

}