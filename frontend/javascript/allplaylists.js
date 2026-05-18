const allplaylistsApi = new API();
const allplaylistsui = new UI();

async function loadPlaylists(){
    try {
        allplaylistsui.showLoading(loading, "Loading playlists...");

        allplaylistsApi.getPlaylists()

        const allPlaylists = await allplaylistsApi.getPlaylists();

        allplaylistsui.renderPlaylists(allPlaylists, playlistsContainer)
        allplaylistsui.clear(loading)

    } catch(error) {
        allplaylistsui.showError(loading, error.message);
    }
}


let playlistsContainer = document.querySelector("#playlists");
let loading = document.querySelector("#loading");

loadPlaylists();