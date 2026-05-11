async function login(event){
    event.preventDefault();

    let email = document.querySelector("#email");
    let password = document.querySelector("#password");

    let loginData = {
        email: email.value,
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
            throw new Error()
        }

        loading.textContent = "Success! Redirecting..."

        //Ska man hamna i playlists här????????
        window.location.href = "playlists.html";

    } catch(error) {
        //Hur ska jag göra här för att kunna avgöra vad som misslyckats? Serverns svar avgör om användaren
        //skickat fel uppgifter eller om något gått fel?
        loading.textContent = "Login failed."
    }

}

let loginForm = document.querySelector("#login-form");
let loading = document.querySelector("#loading");

loginForm.addEventListener("submit", login);