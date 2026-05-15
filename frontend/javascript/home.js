

async function getPlaylists(){
    try {
        loading.textContent = "Loading playlists...";

        const request = new Request("/api/playlists", {
            method: "GET",
            credentials: "include",
            headers: {
                "Accept": "application/json"
            }
        });

        const response = await fetch(request)

        if (!response.ok) {
            throw new Error("Could not load playlists")
        }

        const playlists = await response.json();

        playlistList.innerHTML = "";
        loading.textContent = "";

        if (playlists.length == 0) {
            loading.textContent = "No playlists found.";
            return;
        }

        for (let playlist of playlists) {
            renderPlaylist(playlist);
        }

    } catch(error) {
        loading.textContent = error.message;
    }
}

function renderPlaylist(playlist){

    let div = document.createElement("div");

    let title = document.createElement("h2");
    title.textContent = playlist.name;

    let description = document.createElement("p");
    description.textContent = playlist.description;

    let playlistLink = document.createElement("a");
    playlistLink.href = `playlist.html?id=${playlist.playlist_id}`
    playlistLink.textContent = "view playlist";

    div.append(title);
    div.append(description);
    div.append(playlistLink);

    playlists.append(div);
}

let playlists = document.querySelector("#playlists");
let loading = document.querySelector("#loading");

getPlaylists();