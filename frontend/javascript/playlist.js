const playlistApi = new API();
const playlistUi = new UI();

async function loadPlaylist() {
    try {
        playlistUi.showLoading(loading, "Loading playlist...");

        const params = new URLSearchParams(window.location.search);
        const playlistId = params.get("id");

        if (!playlistId) {
            throw new Error("No playlist id found in URL");
        }

        const playlist = await playlistApi.getPlaylistById(playlistId);

        playlistUi.clear(loading);
        playlistUi.renderSinglePlaylist(playlist, playlistContainer);

    } catch (error) {
        playlistUi.showError(loading, error.message);
    }
}

let playlistContainer = document.querySelector("#playlist-container");
let loading = document.querySelector("#loading");
loadPlaylist();