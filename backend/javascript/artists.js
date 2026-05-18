import { Album } from "./albums.js";

export class Artist {
	static getArtists(query) {
		const artistsData = JSON.parse(Deno.readTextFileSync("./JSON/artists.json"));
		const artists = [];
		for (const artistData of artistsData) {
			if (query) {
				if (!artistData.name.toLowerCase().includes(query.toLowerCase())) {
					continue;
				}
			}
			const artistInstance = new Artist(artistData);
			artists.push(artistInstance);
		}
		return artists;
	}

	constructor(data) {
		this.artistId = data.artistId;
		this.name = data.name;
		this.albums = this.getArtistAlbums();
	}

	getArtistAlbums() {
		const foundAlbums = [];
		const currentAlbums = Album.getAlbums();
		for (const album of currentAlbums) {
			if (album.artistId == this.artistId) {
				foundAlbums.push(album);
			}
		}
		return foundAlbums;
	}
}