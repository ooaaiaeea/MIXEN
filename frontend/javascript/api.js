class API {
    async login(loginData) {
        const request = new Request("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
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
            throw new Error("Unknown error, try again")
        }
        return response;
    }

    async logout() {
        const response = await fetch("api/auth/logout", {
            method: "POST",
            credentials: "include"
        });

        if (!response.ok) {
            throw new Error("Logout failed");
        }
        return response;
    }

    async register(registerData) {
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
    }

    async authenticationCheck(){
        const response = await fetch("/api/auth/me", {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        });

        if (response.status == 401){
            throw new Error("Unauthorized: User not logged in")
        }

        if (!response.ok) {
            throw new Error("Something went wrong")
        }

        return response;
    }

    async getPlaylists() {
        const request = new Request("/api/playlists", {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        });

        const response = await fetch(request)

        if (!response.ok) {
            throw new Error("Could not fetch playlists")
        }

        const playlists = await response.json();

        return playlists;
    }
}