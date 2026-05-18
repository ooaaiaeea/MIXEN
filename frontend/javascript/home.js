console.count("home.js loaded")
const homeApi = new API();
const homeUi = new UI();

async function loadPlaylists(){
    try {
        homeUi.showLoading(loading, "Loading playlists...");

        homeApi.getPlaylists()

        //BYT TILL USER PLAYLISTS
        const allPlaylists = await homeApi.getPlaylists();

        homeUi.renderPlaylists(allPlaylists, playlistsContainer)

    } catch(error) {
        homeUi.showError(loading, error.message);
    }
}


let playlistsContainer = document.querySelector("#playlists");
let loading = document.querySelector("#loading");

loadPlaylists();