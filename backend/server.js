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
		options.headers["Set-Cookie"] = `sessionId=${randomId}; max-age=86400; HttpOnly; SameSite=Strict; Path=/`;
		return randomId;
	}
	function deleteSessionId () {
		options.headers["Set-Cookie"] = `sessionId=deleted; max-age=0; HttpOnly; SameSite=Strict; Path=/`;
	}
	function checkSessionId () {
		const cookies = request.headers.get("cookie");
		if (!cookies) {
			options.status = 401;
			return null;
		}
		const allUsers = User.getUsers();
		for (const user of allUsers) {
			if (user.sessionId !== null && cookies.includes(`sessionId=${user.sessionId}`)) {
				return user;
			}
		}
		options.status = 401;
		return null;
	}
	const currentUser = checkSessionId();


	if (url.pathname == "/api/auth/register" && request.method == "POST") {
		let newUser;
		try {
			newUser = await request.json();
		// deno-lint-ignore no-unused-vars
		} catch (error) {
			options.status = 400;
			return new Response(JSON.stringify("Invalid JSON format"), options);
		}
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
		let loginData;
		try {
			loginData = await request.json();
		// deno-lint-ignore no-unused-vars
		} catch (error) {
			options.status = 400;
			return new Response(JSON.stringify("Invalid JSON format"), options);
		}
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
			image: currentUser.image,
		};
		options.status = 200;
		return new Response(JSON.stringify(userData), options);
	}
	if (url.pathname == "/api/auth/edit" && request.method == "PATCH") {
		if (!currentUser) { return new Response(null, options) }
		let changedUser;
		try {
			changedUser = await request.json();
		// deno-lint-ignore no-unused-vars
		} catch (error) {
			options.status = 400;
			return new Response(JSON.stringify("Invalid JSON format"), options);
		}
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


	if (url.pathname == "/api/users" && request.method == "GET") {
		if (!currentUser) { return new Response(null, options) }
		const allUsers = User.getUsers();
		const filteredUsers = [];
		for (const user of allUsers) {
			filteredUsers.push({
				userId: user.userId,
				username: user.username,
				image: user.image,
			});
		}
		options.status = 200;
		return new Response(JSON.stringify(filteredUsers), options);
	}
	const userRoute = new URLPattern({ pathname: "/api/users/:id" })
	if (userRoute.test(url) && request.method == "GET") {
		if (!currentUser) { return new Response(null, options) }
		const id = userRoute.exec(url).pathname.groups.id;
		const foundUser = User.getUserById(id);
		if (!foundUser) {
			options.status = 404;
			return new Response(JSON.stringify("User not found"), options);
		} else {
			options.status = 200;
			const filteredUser = {
				userId: foundUser.userId,
				username: foundUser.username,
				image: foundUser.image,
				likedPlaylists: foundUser.likedPlaylists,
				playlists: foundUser.playlists,
			};
			return new Response(JSON.stringify(filteredUser), options);
		}
	}


	if (url.pathname == "/api/playlists" && request.method == "GET") {
		if (!currentUser) { return new Response(null, options) }
		const query = url.searchParams.get("q");
		const allPlaylists = Playlist.getPlaylists(query);
		const filteredPlaylists = [];
		for (const playlist of allPlaylists) {
			filteredPlaylists.push({
				playlistId: playlist.playlistId,
				ownerId: playlist.ownerId,
				collaboratorIds: playlist.collaboratorIds,
				image: playlist.image,
				name: playlist.name,
				description: playlist.description,
				tracksInfo: playlist.tracksInfo,
			});
		}
		options.status = 200;
		return new Response(JSON.stringify(filteredPlaylists), options);
	}
	if (url.pathname == "/api/playlists" && request.method == "POST") {
		if (!currentUser) { return new Response(null, options) }
		let newPlaylist;
		try {
			newPlaylist = await request.json();
		// deno-lint-ignore no-unused-vars
		} catch (error) {
			options.status = 400;
			return new Response(JSON.stringify("Invalid JSON format"), options);
		}
		newPlaylist.ownerId = currentUser.userId;
		newPlaylist.collaboratorIds = [];
		newPlaylist.tracksInfo = [];
		const playlistInstance = new Playlist(newPlaylist);
		options.status = playlistInstance.save();
		if (options.status == 201) {
			return new Response(null, options);
		} else if (options.status == 400) {
			return new Response(JSON.stringify("Missing keys in playlist"), options);
		}
	}
	const playlistRoute = new URLPattern({ pathname: "/api/playlists/:id" });
	if (playlistRoute.test(url) && request.method == "GET") {
		if (!currentUser) { return new Response(null, options) }
		const id = playlistRoute.exec(url).pathname.groups.id;
		const foundPlaylist = Playlist.getPlaylistById(id);
		if (!foundPlaylist) {
			options.status = 404;
			return new Response(JSON.stringify("Playlist not found"), options);
		} else {
			options.status = 200;
			return new Response(JSON.stringify(foundPlaylist), options);
		}
	}
	if (playlistRoute.test(url) && request.method == "DELETE") {
		if (!currentUser) { return new Response(null, options) }
		const id = playlistRoute.exec(url).pathname.groups.id;
		for (const playlist of currentUser.playlists) {
			if (playlist.playlistId == id) {
				options.status = playlist.delete(currentUser.userId)
				if (options.status == 403) {
					return new Response(JSON.stringify("User isn't owner of playlist"), options);
				} else if (options.status == 204) {
					return new Response(null, options);
				}
			}
		}
		options.status = 404;
		return new Response(JSON.stringify("User not associated with playlist"), options);
	}
	if (playlistRoute.test(url) && request.method == "PATCH") {
		if (!currentUser) { return new Response(null, options) }
		const id = playlistRoute.exec(url).pathname.groups.id;
		let changedPlaylist;
		for (const playlist of currentUser.playlists) {
			if (playlist.playlistId == id) {
				try {
					changedPlaylist = await request.json();
					// deno-lint-ignore no-unused-vars
				} catch (error) {
					options.status = 400;
					return new Response(JSON.stringify("Invalid JSON format"), options);
				}
				const status = playlist.update(changedPlaylist, currentUser.userId);
				options.status = status[0];
				if (options.status == 204) {
					return new Response(null, options);
				} else if (options.status == 403) {
					return new Response(JSON.stringify("Only owner of playlist is allowed to change collaborators"), options);
				} else if (options.status == 400 && status[1] == "keys") {
					return new Response(JSON.stringify("No allowed keys in playlist"), options);
				} else if (options.status == 400 && status[1] == "positionInPlaylistDuplicate") {
					return new Response(JSON.stringify("positionInPlaylist has double entries"), options);
				} else if (options.status == 400 && status[1] == "positionInPlaylistGap") {
					return new Response(JSON.stringify("positionInPlaylist has gaps"), options);
				}
			}
		}
		options.status = 404;
		return new Response(JSON.stringify("User not associated with playlist"), options);
	}


	if (url.pathname == "/themix" && request.method == "GET") {
		if (currentUser) {
			return serveFile(request, "./../frontend/home.html")
		} else {
			return serveFile(request, "./../frontend/index.html")
		}
	}
	const addTracksRoute = new URLPattern({ pathname: "/playlist/:id/add" })
	if (addTracksRoute.test(url)){
		return serveFile(request, "./../frontend/addtracks.html")
	}
	return serveDir(request, {fsRoot: "./../frontend"});
}

Deno.serve(handler);