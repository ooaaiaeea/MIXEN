import { Track } from "./tracks.js";
import { User } from "./users.js";

export class Playlist {
	static getPlaylists(query) {
		const playlistsData = JSON.parse(Deno.readTextFileSync("./JSON/playlists.json"));
		const playlists = [];
		for (const playlistData of playlistsData) {
			if (query) {
				if (!playlistData.name.toLowerCase().includes(query.toLowerCase()) && !playlistData.description.toLowerCase().includes(query.toLowerCase()) && !User.getUserById(playlistData.ownerId).username.toLowerCase().includes(query.toLowerCase())) {
					continue;
				}
			}
			const playlistInstance = new Playlist(playlistData);
			playlists.push(playlistInstance);
		}
		return playlists;
	}

	static updatePlaylists(playlistsData) {
		Deno.writeTextFileSync("./JSON/playlists.json", JSON.stringify(playlistsData, null, "\t"));
	}

	constructor(data) {
		this.playlistId = data.playlistId;
		this.ownerId = data.ownerId;
		this.collaboratorIds = data.collaboratorIds;
		this.image = data.image;
		this.name = data.name;
		this.description = data.description;
		this.tracksInfo = data.tracksInfo;
		this.tracks = this.getPlaylistTracks();
	}

	getPlaylistTracks() {
		const foundTracks = [];
		if (this.tracksInfo.length != 0) {
			const currentTracks = Track.getTracks();
			let highestPosition = 0;
			for (const trackInfo of this.tracksInfo) {
				if (highestPosition < trackInfo.positionInPlaylist) {
					highestPosition = trackInfo.positionInPlaylist;
				}
			}
			for (let i = 1; i <= highestPosition; i++) {
				for (const trackInfo of this.tracksInfo) {
					if (i == trackInfo.positionInPlaylist) {
						for (const track of currentTracks) {
							if (track.trackId == trackInfo.trackId) {
								foundTracks.push(track);
								break;
							}
						}
						break;
					}
				}
			}
		}
		return foundTracks;
	}

	save() {
		const currentPlaylists = Playlist.getPlaylists();
		let highestPlaylistId = 0;
		for (const playlist of currentPlaylists) {
			if (highestPlaylistId < parseInt(playlist.playlistId.split("-")[1])) {
				highestPlaylistId = parseInt(playlist.playlistId.split("-")[1]);
			}
		}
		this.playlistId = "pl-" + (highestPlaylistId + 1);
		this.tracksInfo = [];
		currentPlaylists.push(this);
		Playlist.updatePlaylists(currentPlaylists);
	}

	delete() {
		const currentPlaylists = Playlist.getPlaylists();
		let foundPlaylistIndex;
		for (let i = 0; i < currentPlaylists.length; i++) {
			if (currentPlaylists[i].playlistId == this.playlistId) {
				foundPlaylistIndex = i;
				break;
			}
		}
		currentPlaylists.splice(foundPlaylistIndex, 1);
		Playlist.updatePlaylists(currentPlaylists);
	}

	update(changedPlaylist) {
		const currentPlaylists = Playlist.getPlaylists();
		const allowedKeys = ["collaboratorIds", "image", "name", "description", "tracksInfo"];
		for (const playlist of currentPlaylists) {
			if (playlist.playlistId == this.playlistId) {
				for (const key in changedPlaylist) {
					if (allowedKeys.includes(key)) {
						playlist[key] = changedPlaylist[key];
						this[key] = changedPlaylist[key];
					}
				}
				break;
			}
		}
		Playlist.updatePlaylists(currentPlaylists);
	}
}