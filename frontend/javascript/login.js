console.log("Login.js")
const loginApi = new API();
const loginUi = new UI();

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
        loginUi.showLoading(loading);

        await loginApi.login(loginData);

        loginUi.showMessage(loading, "Success! Redirecting...")

        window.location.href = "home.html";

    } catch(error) {
        loginUi.showError(container, error.message)
    }

}

let loginForm = document.querySelector("#login-form");
let loading = document.querySelector("#loading");

loginForm.addEventListener("submit", login);