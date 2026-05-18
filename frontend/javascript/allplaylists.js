const allplaylistsApi = new API();
const allplaylistsUi = new UI();

let playlists = document.querySelector("#playlists");
let loading = document.querySelector("#loading");

async function getPlaylists() {
    try {
        allplaylistsUi.showLoading(loading, "Loading playlists...");

        const allPlaylists = await allplaylistsApi.getPlaylists();

        allplaylistsUi.renderPlaylists(allPlaylists, playlists, loading);

    } catch (error) {
        allplaylistsUi.showError(loading, error.message);
    }
}

getPlaylists();