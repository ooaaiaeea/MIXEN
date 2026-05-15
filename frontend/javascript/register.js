

async function register(event) {
    event.preventDefault();

    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let confirmPassword = document.getElementById("confirm-password");

    if (password.value != confirmPassword.value) {
        loading.textContent = "Passwords do not match";
        return;
    }

    let registerData = {
        username: username.value,
        email: email.value,
        password: password.value
    }

    try {

        loading.textContent = "Creating account. Please wait.";

        const request = new Request("/api/auth/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(registerData),
            credentials: "include"
        });

        const response = await fetch(request);

        if (!response.ok) {
            console.log (`Register failed: response.status`)
            //Man kan aldrig få 400 pga required i html? Ha för säkerhets skull ändå?
            if (response.status == 400) {
                throw new Error ("Missing username, email or password");
            }

            if (response.status == 409) {
                throw new Error("Username or email already exists");
            }

            throw new Error("Something went wrong....")
        }

        loading.textContent = "Account created! Redirecting to login";

        window.location.href = "login.html"
    } catch(error) {
        loading.textContent = `Register failed: ${error.message}`;
    }

}

const registerForm = document.getElementById("register-form");
let loading = document.getElementById("loading");

registerForm.addEventlistener("submit", register)