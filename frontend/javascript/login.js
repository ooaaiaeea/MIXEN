const api = new API();
const ui = new UI();

async function login(event){
    event.preventDefault();

    let identifier = document.querySelector("#identifier");
    let password = document.querySelector("#password");

    let loginData = {
        identifier: identifier.value,
        password: password.value
    }

    loading.textContent = "Logging in. Loading...";

    try {
        ui.showLoading(loading);

        await api.login(loginData);

        ui.showMessage(loading, "Success! Redirecting...")

        window.location.href = "home.html";

    } catch(error) {
        ui.showError(container, error.message)
    }

}

let loginForm = document.querySelector("#login-form");
let loading = document.querySelector("#loading");

loginForm.addEventListener("submit", login);