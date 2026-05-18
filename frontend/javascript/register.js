const api = new API();
const ui = new UI();

async function register(event) {
    event.preventDefault();

    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirm-password");

    if (password.value != confirmPassword.value) {
        ui.showError(loading, "Passwords do not match");
        return;
    }

    let registerData = {
        username: username.value,
        email: email.value,
        password: password.value
    }

    try {
        ui.showLoading(loading, "Creating account. Please wait.")

        api.register(registerData);

        ui.showMessage(loading, "Account created! Redirecting to login")

        window.location.href = "login.html"
    } catch(error) {
        ui.showError(loading, `Register failed: ${error.message}`)
    }

}

const registerForm = document.getElementById("register-form");
let loading = document.getElementById("loading");

registerForm.addEventListener("submit", register)