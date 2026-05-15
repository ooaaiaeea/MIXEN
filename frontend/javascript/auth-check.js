const api = new API();
const ui = new UI();

async function authenticationCheck(){
    try {
        await api.authenticationCheck();
    } catch (error) {
        console.log(error.message);
        window.location.href = "index.html"
    }
}


authenticationCheck();