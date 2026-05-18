const logoutApi = new API();
const logoutUi = new UI();

async function logout(){
    try{
        await logoutApi.logout();

        window.location.href = "index.html";
    } catch (error) {
        console.log("Logout failed:", error)
    }
}


const logoutButton = document.getElementById("logout");

if (logoutButton != null) {
    logoutButton.addEventListener("click", logout)
}