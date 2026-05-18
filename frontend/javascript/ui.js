class UI {
    clear(container){
        container.innerHTML = "";
        container.textContent= "";
    }

    showLoading(container){
        this.clear(container);
        container.textContent = "Loading..."
    }

    showError(container, errorMessage){
        this.clear(container);
        container.textContent = errorMessage;
    }

    showMessage(container, message){
        this.clear(container);
        container.textContent = message;
    }

    renderPlaylists(playlists, container) {

        container.innerHTML = "";

        if (playlists.length == 0) {
            container.textContent = "No playlists found";
            return;
        }

        for (let playlist of playlists) {
            this.renderPlaylist(playlist, container);
        }
    }

    renderPlaylist(playlist, container){
        let div = document.createElement("div");
        div.className = "playlist.card";

        let playlistImage = document.createElement("img");
        playlistImage.classList.add = "playlist-image";

        if (playlist.image) {
            playlistImage.src = playlist.image;
        } else {
            playlistImage.src = "../backend/images/playlists/playlistplaceholder.jpeg"
        }


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


        container.append(div);
    }

}