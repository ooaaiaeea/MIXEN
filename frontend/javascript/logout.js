async function logout(){
    try{
        const response = await fetch("api/auth/logout", {
            method = "POST",
            credentials: "indluce"
        });

        if (!response.ok) {
            throw new Error("logout failed");
            //Vad ska hända här? Hur förmedlar man det
        }

        window.location.href = "index.html";
    } catch (error) {
        console.log("Logout failed", reponse)
    }
}


const logoutButton = document.getElementById("#logout");

if (logoutButton != null) {
    logoutButton.addEventListener("click", logout)
}