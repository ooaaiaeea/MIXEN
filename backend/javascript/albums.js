import { Track } from "./tracks.js";

export class Album {
	static getAlbums(query) {
		const albumsData = JSON.parse(Deno.readTextFileSync("./JSON/albums.json"));
		const albums = [];
		for (const albumData of albumsData) {
			if (query) {
				if (!albumData.name.toLowerCase().includes(query.toLowerCase()) && !albumData.genre.toLowerCase().includes(query.toLowerCase())) {
					continue;
				}
			}
			const albumInstance = new Album(albumData);
			albums.push(albumInstance);
		}
		return albums;
	}

	constructor(data) {
		this.albumId = data.albumId;
		this.totalTracks = data.totalTracks;
		this.image = data.image;
		this.name = data.name;
		this.releaseDate = data.releaseDate;
		this.artistId = data.artistId;
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