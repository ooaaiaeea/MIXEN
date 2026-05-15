class UI {
    clear(container){
        container.innerHTML = "";
        container.textMessage= "";
    }

    showLoading(container){
        clear(container);
        container.textContent = "Loading..."
    }

    showError(container, errorMessage){
        clear(container);
        container.textContent = errorMessage;
    }

    showMessage(container, message){
        clear(container);
        container.textContent = message;
    }

    renderPlaylists(playlists, container) {

        playlistList.innerHTML = "";

        if (playlists.length == 0) {
            container.textContent = "No playlists found";
            return;
        }

        for (let playlist of playlists) {
            renderPlaylist(playlist, container);
        }
    }

    renderPlaylist(playlist, container){
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

}