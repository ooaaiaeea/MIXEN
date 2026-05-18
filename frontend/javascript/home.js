console.count("home.js loaded")
const homeApi = new API();
const homeUi = new UI();

async function loadUserPlaylists(){
    try {
        homeUi.showLoading(loading, "Loading playlists...");

        const currentUser = await homeApi.getCurrentUser();

        const userInfo = await homeApi.getUserById(currentUser.userId)

        const userPlaylists = userInfo.playlists;

        const likedPlaylists = await getLikedPlaylistsById(userInfo.likedPlaylists);

        homeUi.renderPlaylists(userPlaylists, userPlaylistsContainer)
        homeUi.renderPlaylists(likedPlaylists, likedPlaylistsContainer)
        homeUi.clear(loading)

    } catch(error) {
        homeUi.showError(loading, error.message);
    }
}

 async function getLikedPlaylistsById(playlistIds){
    let likedPlaylists = [];
    for (let playlistId of playlistIds) {
        const playlist = await homeApi.getPlaylistById(playlistId);
        likedPlaylists.push(playlist);
    }
    return likedPlaylists;
}


let userPlaylistsContainer = document.querySelector("#user-playlists");
let likedPlaylistsContainer = document.querySelector("#liked-playlists")
let loading = document.querySelector("#loading");

loadUserPlaylists();