async function login(event){
    event.preventDefault();

    let identifier = document.querySelector("#identifier");
    let password = document.querySelector("#password");

    let loginData = {
        identifier: identifier.value,
        password: password.value
    }

    try {
        loading.textContent = "Logging in. Loading..."
        const request = new Request("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "Application/json"
            },
            body: JSON.stringify(loginData),
            credentials: "include"
        })
        const response = await fetch(request);

        if (!response.ok){
            console.log(`Login failed: ${response.status}`)
            if (response.status == 401) {
                throw new Error("Wrong username/email or password")
            }
            if (response.status == 400) {
                throw new Error("Missing username/email or password");
            }
            throw new Error("Something went wrong......")
        }

        loading.textContent = "Success! Redirecting..."

        window.location.href = "home.html";

    } catch(error) {
        loading.textContent = `Login failed: ${error.message}`
    }

}

let loginForm = document.querySelector("#login-form");
let loading = document.querySelector("#loading");

loginForm.addEventListener("submit", login);