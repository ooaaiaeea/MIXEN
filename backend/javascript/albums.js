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
		this.totalTracks = data.total_tracks;
		this.image = data.image;
		this.name = data.name;
		this.releaseDate = data.release_date;
		this.artistId = data.artist_id;
		this.genre = data.genre;
		this.tracks = this.getAlbumTracks();
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
}