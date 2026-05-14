// deno-lint-ignore no-unversioned-import
import { serveFile, serveDir } from "jsr:@std/http/file-server";
import { User } from "./javascript/users.js";
import { Playlist } from "./javascript/playlists.js";
import { Track } from "./javascript/tracks.js";
import { Album } from "./javascript/albums.js";
import { Artist } from "./javascript/artists.js";

async function handler(request) {
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
	const url = new URL(request.url);
	if (url.pathname.startsWith("/api")) {
		if (request.method == "OPTIONS") {
			return new Response(null, options);
		} else if (request.method == "GET") {
			const accept = request.headers.get("Accept");
			if (!accept || !accept.includes("application/json")) {
				options.status = 406;
				return new Response(JSON.stringify("Accept not set to json"), options);
			}
		} else if (request.method == "POST" || request.method == "PATCH") {
			const contentType = request.headers.get("Content-Type");
			if (!contentType || !contentType.includes("application/json")) {
				options.status = 406;
				return new Response(JSON.stringify("Content-Type not set to json"), options);
			}
		}
	}


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

	
	if (url.pathname == "/api/auth/register" && request.method == "POST") {
		const newUser = await request.json();
		newUser.sessionId = createSessionId();
		const userInstance = new User(newUser);
		options.status = userInstance.save();
		if (options.status == 201) {
			return new Response(null, options);
		} else if (options.status == 400) {
			deleteSessionId();
			return new Response(JSON.stringify("Missing keys in user"), options);
		} else if (options.status == 409) {
			deleteSessionId();
			return new Response(JSON.stringify("Email or username already in use"), options);
		}
	}
	if (url.pathname == "/api/auth/login" && request.method == "POST") {
		const loginData = await request.json();
		const response = User.loginUser(loginData);
		if (response[0] == 200) {
			const loggedInUser = response[1];
			loggedInUser.update({ sessionId: createSessionId() });
			options.status = response[0];
			return new Response(JSON.stringify("Logged in"), options);
		} else if (response[0] == 401) {
			options.status = response[0];
			return new Response(JSON.stringify(`Wrong ${response[1]}`), options);
		}
	}
	if (url.pathname == "/api/auth/logout" && request.method == "POST") {
		if (!currentUser) { return new Response(null, options) }
		currentUser.update({ sessionId: null });
		deleteSessionId();
		options.status = 204;
		return new Response(null, options);
	}
	if (url.pathname == "/api/auth/me" && request.method == "GET") {
		if (!currentUser) { return new Response(null, options) }
		const userData = {
			userId: currentUser.userId,
			username: currentUser.username,
			email: currentUser.email,
		};
		options.status = 200;
		return new Response(JSON.stringify(userData), options);
	}
	if (url.pathname == "/api/auth/edit" && request.method == "PATCH") {
		if (!currentUser) { return new Response(null, options) }
		const changedUser = await request.json();
		options.status = currentUser.editProfile(changedUser);
		if (options.status == 409) {
			return new Response(JSON.stringify("Email or username already in use"), options);
		} else if (options.status == 400) {
			return new Response(JSON.stringify("All keys missing in user"), options);
		} else if (options.status == 204) {
			return new Response(null, options);
		}
	}
	if (url.pathname == "/api/auth/delete" && request.method == "DELETE") {
		if (!currentUser) { return new Response(null, options) }
		currentUser.delete();
		deleteSessionId();
		options.status = 204;
		return new Response(null, options);
	}


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