export class Track {
	static getTracks(query) {
		const tracksData = JSON.parse(Deno.readTextFileSync("./JSON/tracks.json"));
		const tracks = [];
		for (const trackData of tracksData) {
			if (query) {
				if (!trackData.name.toLowerCase().includes(query.toLowerCase())) {
					continue;
				}
			}
			const trackInstance = new Track(trackData);
			tracks.push(trackInstance);
		}
		return tracks;
	}

	static getTrackById(id) {
		const currentTracks = Track.getTracks();
		for (const track of currentTracks) {
			if (track.trackId == id) {
				return track;
			}
		}
		return null;
	}

	constructor(data) {
		this.trackId = data.trackId;
		this.albumId = data.albumId;
		this.artistId = data.artistId;
		this.duration = data.duration;
		this.name = data.name;
		this.positionInAlbum = data.positionInAlbum;
	}
}