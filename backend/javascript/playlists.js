import { Track } from "./tracks.js";

export class Playlist {
	static getPlaylists() {
		const playlistsData = JSON.parse(Deno.readTextFileSync("./JSON/playlists.json"));
		const playlists = [];
		for (const playlistData of playlistsData) {
			const playlistInstance = new Playlist(playlistData);
			playlists.push(playlistInstance);
		}
		return playlists;
	}

	static updatePlaylists(playlistsData) {
		Deno.writeTextFileSync("./JSON/playlists.json", JSON.stringify(playlistsData));
	}

	static addPlaylist(newPlaylist) {
		const currentPlaylists = Playlist.getPlaylists();
		let highestPlaylistId = 0;
		for (const playlist of currentPlaylists) {
			if (highestPlaylistId < parseInt(playlist.playlistId.split("-")[1])) {
				highestPlaylistId = parseInt(playlist.playlistId.split("-")[1]);
			}
		}
		newPlaylist.playlistId = "pl-" + (highestPlaylistId +1);
		newPlaylist.tracksInfo = [];
		currentPlaylists.push(newPlaylist);
		Playlist.updatePlaylists(currentPlaylists);
	}

	static deletePlaylistById (playlistId) {
		const currentPlaylists = Playlist.getPlaylists();
		let foundPlaylistIndex;
		for (let i = 0; i < currentPlaylists.length; i++) {
			if (currentPlaylists[i].playlistId == playlistId) {
				foundPlaylistIndex = i;
				break;
			}
		}
		if (foundPlaylistIndex !== undefined) {
			currentPlaylists.splice(foundPlaylistIndex, 1);
			Playlist.updatePlaylists(currentPlaylists);
		}
	}

	static updatePlaylistById (playlistId, changedPlaylist) {
		const currentPlaylists = Playlist.getPlaylists();
		const ALLOWED_KEYS = ["collaboratorIds", "image", "playlistName", "description", "trackInfo"];
		for (const playlist of currentPlaylists) {
			if (playlist.playlistId == playlistId) {
				for (const key in changedPlaylist) {
					if (ALLOWED_KEYS.includes(key)) {
						playlist[key] = changedPlaylist[key];
					}
				}
				break;
			}
		}
		Playlist.updatePlaylists(currentPlaylists);
	}
	
	constructor(data) {
		this.playlistId = data.playlistId;
		this.ownerId = data.ownerId;
		this.collaboratorIds = data.collaboratorIds;
		this.image = data.image;
		this.playlistName = data.playlistName;
		this.description = data.description;
		this.tracksInfo = data.tracksInfo;
		this.tracks = this.getPlaylistTracks();
	}

	getPlaylistTracks() {
		const foundTracks = [];
		const currentTracks = Track.getTracks();
		for (const trackInfo of this.tracksInfo) {
			for (const track of currentTracks) {
				if (track.trackId == trackInfo.trackId) {
					foundTracks.push(track);
					break;
				}
			}
		}
		return foundTracks;
	}
}