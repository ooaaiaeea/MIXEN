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
        div.classList.add("playlist-card");

        let playlistImage = document.createElement("img");
        playlistImage.classList.add("playlist-image");
        playlistImage.src = playlist.image;


        let title = document.createElement("h2");
        title.textContent = playlist.name;

        let description = document.createElement("p");
        description.textContent = playlist.description;

        let trackPreview = this.previewTracks(playlist);

        let playlistLink = document.createElement("a");
        playlistLink.href = `playlist.html?id=${playlist.playlistId}`
        playlistLink.textContent = "view playlist";



        let textDiv = document.createElement("div");
        textDiv.classList.add("playlist-text");

        textDiv.append(title);
        textDiv.append(description);
        textDiv.append(trackPreview);
        textDiv.append(playlistLink);

        div.append(playlistImage);
        div.append(textDiv);

        container.append(div);


        container.append(div);
    }

    previewTracks(playlist){
        let trackPreview = document.createElement("div");
        trackPreview.className = "track-preview";

        if (!playlist.tracks || playlist.tracks.length == 0) {
            let trackText = document.createElement("p");
            trackText.textContent = "No tracks yet...";
            trackPreview.append(trackText);
            return trackPreview;
        }

        let previewTracks = playlist.tracks.slice(0,3);

        for (let track of previewTracks) {
            let trackText = document.createElement("p");

            trackText.textContent = `${track.title} - ${track.artist}`;

            trackPreview.append(trackText);
        }

        return trackPreview;
    }

    renderSinglePlaylist(playlist, container){
        container.innerHTML = "";

        container.classList.add("single-playlist");

        let playlistImage = document.createElement("img");
        playlistImage.classList.add("single-playlist-image");
        playlistImage.src = playlist.image;

        let title = document.createElement("h2");
        title.textContent = playlist.name;

        let description = document.createElement("p");
        description.textContent = playlist.description;

        let tracksContainer = document.createElement("ul");
        tracksContainer.classList.add("tracks-container");

        if (!playlist.tracks || playlist.tracks.length == 0) {
            let noTracks = document.createElement("li");
            noTracks.textContent = "No tracks in this playlist yet...";
            tracksContainer.append(noTracks);
        } else {
            //SORT TRACKS

            for (let track of playlist.tracks) {
                let trackDiv = document.createElement("li");
                trackDiv.classList.add("track-row");

                let trackName = document.createElement("span");
                trackName.textContent = track.name;

                let trackArtist = document.createElement("span");
                trackArtist.textContent = "Artist Placeholder";

                let trackAlbum = document.createElement("span");
                trackAlbum.textContent = "Album Placeholder"

                let trackDuration = document.createElement("span");
                trackDuration.textContent = track.duration;

                trackDiv.append(trackName);
                trackDiv.append(trackArtist);
                trackDiv.append(trackAlbum);
                trackDiv.append(trackDuration);

                tracksContainer.append(trackDiv);
            }
        }

        
        container.append(playlistImage);
        container.append(title);
        container.append(description);
        container.append(tracksContainer);
    }

}