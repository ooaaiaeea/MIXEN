async function authenticationCheck(){
    try {
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

        if (response.status == 200){
            return;
        }

        throw new Error("Something went wrong")
    } catch (error) {
        window.location.href = "index.html"
    }
}


authenticationCheck();