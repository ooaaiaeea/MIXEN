console.log("auth.check.js")
const authcheckApi = new API();
const authcheckUi = new UI();

async function authenticationCheck(){
    try {
        await authcheckApi.authenticationCheck();
    } catch (error) {
        console.log(error.message);
        window.location.href = "index.html"
    }
}


authenticationCheck();