const api = new API();
const ui = new UI();

async function logout(){
    try{
        await api.logout();

        window.location.href = "index.html";
    } catch (error) {
        console.log("Logout failed:", error)
    }
}


const logoutButton = document.getElementById("logout");

if (logoutButton != null) {
    logoutButton.addEventListener("click", logout)
}