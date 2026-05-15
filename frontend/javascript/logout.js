async function logout(){
    try{
        const response = await fetch("api/auth/logout", {
            method = "POST",
            credentials: "indluce"
        });

        if (!response.ok) {
            throw new Error("logout failed");
        }

        window.location.href = "index.html";
    } catch (error) {
        console.log("Logout failed:", error)
    }
}


const logoutButton = document.getElementById("#logout");

if (logoutButton != null) {
    logoutButton.addEventListener("click", logout)
}