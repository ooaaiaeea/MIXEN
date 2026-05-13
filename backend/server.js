// deno-lint-ignore no-unversioned-import
import { serveFile, serveDir } from "jsr:@std/http/file-server";
import { User } from "./javascript/users.js";
import { Playlist } from "./javascript/playlists.js";
import { Track } from "./javascript/tracks.js";
import { Album } from "./javascript/albums.js";
import { Artist } from "./javascript/artists.js";

function handler(request) {
	const options = {
		headers: {
			"Content-Type": "application/json",
			"Accept": "application/json",
			"Access-Control-Allow-Origin": "http://localhost:8000",
			"Access-Control-Allow-Credentials": "true",
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
		options.headers["Set-Cookie"] = `sessionId=${randomId}; max-age=86400; HttpOnly; SameSite=Strict`;
		return randomId;
	}
	function deleteSessionId () {
		options.headers["Set-Cookie"] = `sessionId=deleted; max-age=0; HttpOnly; SameSite=Strict`;
	}
	function checkSessionId () {
		const cookies = request.headers.get("cookie");
		if (!cookies) {
			options.status = 401;
			return null;
		}
		const allUsers = User.getUsers();
		for (const user of allUsers) {
			if (cookies.includes(`sessionId=${user.sessionId}`)) {
				return user;
			}
		}
		options.status = 401;
		return null;
	}
	const currentUser = checkSessionId();

	
	// if (url.pathname == "/api/auth/login" && request.method == "POST") {
		
	// }


	if (url.pathname == "/themix" && request.method == "GET") {
		if (currentUser) {
			return serveFile(request, "./../frontend/home.html")
		} else {
			return serveFile(request, "./../frontend/index.html")
		}
	}
	return serveDir(request, {fsRoot: "./../frontend"});
}

Deno.serve(handler);