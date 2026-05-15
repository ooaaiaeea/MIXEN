const api = new API();
const ui = new UI();

let playlists = document.querySelector("#playlists");
let loading = document.querySelector("#loading");

async function getPlaylists() {
    try {
        ui.showLoading(loading, "Loading playlists...");

        const allPlaylists = await api.getPlaylists();

        ui.renderPlaylists(allPlaylists, playlists, loading);

    } catch (error) {
        ui.showError(loading, error.message);
    }
}

getPlaylists();