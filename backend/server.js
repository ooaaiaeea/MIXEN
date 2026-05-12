// deno-lint-ignore no-unversioned-import
import { serveFile, serveDir } from "jsr:@std/http/file-server";
import { User } from "./javascript/users.js";
import { Playlist } from "./javascript/playlists.js";
import { Track } from "./javascript/tracks.js";
import { Album } from "./javascript/albums.js";
import { Artist } from "./javascript/artists.js";

// Make placeholders (Null och Empty array) for JSON files
// Update data files, check for errors in JS files
// Make images
// Make placeholder users and playlists
function handler(request) {
	const options = {
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"Access-Control-Allow-Origin": "*",
			"Access-Control-Allow-Headers": "Content-Type",
			"Access-Control-Allow-Methods": "GET,POST,PATCH,DELETE",
		}
	}
	if (request.method == "OPTIONS") {
		return new Response(null, options)
	}
	const url = new URL(request.url)


	function createSessionId () {
		const randomId = crypto.randomUUID();
		options.headers["Set-Cookie"] = `sessionId=${randomId}, max-age=86400, httpOnly, sameSite=strict`;
		return randomId;
	}
	function deleteSessionId () {
		options.headers["Set-Cookie"] = `sessionId=; max-age=0, httpOnly, sameSite=strict`;
	}
	function checkAuth () {
		const cookie = request.headers.get("cookie");
		if (!cookie) {
			return null
		}
		sessionId = cookie.split("=")[1]
		const allUsers = User.getUsers();
		for (const user of allUsers) {
			if (user.sessionId == sessionId) {
				return user;
			}
		}
		return null;
	}

	
	// if (url.pathname == "/api/auth/login" && request.method == "POST") {
		
	// }

	if (url.pathname == "/themix" && request.method == "GET") {
		return serveFile(request, "./../frontend/index.html")
		// CheckAuth, true = playlists, false = stay on index
	}
	return serveDir(request, {fsRoot: "./../frontend"});
}

Deno.serve(handler);