export class Track {
	static getTracks() {
		const tracksData = JSON.parse(Deno.readTextFileSync("./JSON/tracks.json"));
		const tracks = [];
		for (const trackData of tracksData) {
			const trackInstance = new Track(trackData);
			tracks.push(trackInstance);
		}
		return tracks;
	}

	constructor(data) {
		this.trackId = data.track_id;
		this.albumId = data.album_id;
		this.artistId = data.artist_id;
		this.duration = data.duration;
		this.name = data.name;
		this.positionInAlbum = data.position_in_album;
	}
}