import { Track } from "./tracks.js";

export class Album {
	static getAlbums() {
		const albumsData = JSON.parse(Deno.readTextFileSync("./JSON/albums.json"));
		const albums = [];
		for (const albumData of albumsData) {
			const albumInstance = new Album(albumData);
			albums.push(albumInstance);
		}
		return albums;
	}

	constructor(data) {
		this.albumId = data.album_id;
		this.albumType = data.album_type;
		this.totalTracks = data.total_tracks;
		this.image = data.image;
		this.name = data.name;
		this.releaseDate = data.release_date;
		this.artistId = data.artist_id;
		this.genre = data.genre;
		this.tracks = this.getAlbumTracks();
		this.totalDuration = this.calculateAlbumDuration();
	}

	getAlbumTracks() {
		const foundTracks = [];
		let nFoundTracks = 0;
		const currentTracks = Track.getTracks();
		for (const track of currentTracks) {
			if (track.albumId == this.albumId) {
				foundTracks.push(track);
				nFoundTracks++;
			}
			if (nFoundTracks == this.totalTracks) {
				break;
			}
		}
		return foundTracks;
	}

	calculateAlbumDuration() {
		let totalHours = 0;
		let totalMinutes = 0;
		let totalSeconds = 0;
		for (const track of this.tracks) {
			const durationSplit = track.duration.split(":");
			totalMinutes += parseInt(durationSplit[0]);
			totalSeconds += parseInt(durationSplit[1]);
		}
		if (totalSeconds >= 60) {
			totalMinutes += Math.floor(totalSeconds / 60);
			totalSeconds = totalSeconds % 60;
		}
		if (totalMinutes >= 60) {
			totalHours += Math.floor(totalMinutes / 60);
			totalMinutes = totalMinutes % 60;
		}
		const durationArray = [totalHours, totalMinutes, totalSeconds];
		for (let i = 0; i < durationArray.length; i++) {
			if (durationArray[i] < 10) {
				durationArray[i] = "0" + durationArray[i];
			}
		}
		return durationArray.join(":");
	}
}