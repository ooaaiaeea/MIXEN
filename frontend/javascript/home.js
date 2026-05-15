const api = new API();
const ui = new UI();

async function getPlaylists(){
    try {
        ui.showLoading(loading, "Loading playlists...");

        api.getPlaylists()

        //BYT TILL USER PLAYLISTS
        const allPlaylists = await getPaylists();

        ui.renderPlaylists(allPlaylists, playlistsContainer)

    } catch(error) {
        ui.showError(loading, error.message);
    }
}


let playlistsContainer = document.querySelector("#playlists");
let loading = document.querySelector("#loading");

getPlaylists();