import { Playlist } from "./playlists.js";

export class User {
	static getUsers() {
		const usersData = JSON.parse(Deno.readTextFileSync("./JSON/users.json"));
		const users = [];
		for (const userData of usersData) {
			const userInstance = new User(userData);
			users.push(userInstance);
		}
		return users;
	}

	static updateUsers(usersData) {
		Deno.writeTextFileSync("./JSON/users.json", JSON.stringify(usersData));
	}

	static loginUser(loginData) {
		const currentUsers = User.getUsers();
		for (const user of currentUsers) {
			if (loginData.identifier === user.email || loginData.identifier === user.username) {
				if (loginData.password === user.password) {
					return [200, user];
				}
				return [401, "password"];
			}
		}
		return [401, "email or username"];
	}

	constructor(data) {
		this.email = data.email;
		this.username = data.username;
		this.password = data.password;
		this.sessionId = data.sessionId;
		this.image = data.image;
		this.userId = data.userId;
		this.likedPlaylists = data.likedPlaylists;
		this.playlists = this.checkPlaylistsAccess();
	}

	checkPlaylistsAccess() {
		const foundPlaylists = [];
		const currentPlaylists = Playlist.getPlaylists();
		for (const playlist of currentPlaylists) {
			if (playlist.ownerId == this.userId || playlist.collaboratorIds.includes(this.userId)) {
				foundPlaylists.push(playlist);
			}
		}
		return foundPlaylists;
	}

	save() {
		const REQUIRED_KEYS = ["email", "username", "password", "sessionId"];
		for (const key of REQUIRED_KEYS) {
			if (!this[key]) {
				return 400;
			}
		}
		const currentUsers = User.getUsers();
		let highestUserId = 0;
		if (currentUsers.length != 0) {
			for (const user of currentUsers) {
				if (highestUserId < parseInt(user.userId.split("-")[1])) {
					highestUserId = parseInt(user.userId.split("-")[1]);
				}
				if (user.email === this.email || user.username === this.username) {
					return 409;
				}
			}
		}
		this.userId = "usr-" + (highestUserId +1);
		const PLACEHOLDER_IMAGES = ["./images/users/placeholder_blue.png", "./images/users/placeholder_green.png", "./images/users/placeholder_red.png", "./images/users/placeholder_yellow.png"]
		this.image = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
		this.likedPlaylists = [];
		currentUsers.push(this);
		User.updateUsers(currentUsers);
		return 201;
	}

	delete() {
		const currentUsers = User.getUsers();
		let foundUserIndex;
		for (let i = 0; i < currentUsers.length; i++) {
			if (currentUsers[i].userId == this.userId) {
				foundUserIndex = i;
				break;
			}
		}
		if (foundUserIndex !== undefined) {
			currentUsers.splice(foundUserIndex, 1);
			User.updateUsers(currentUsers);
		}
	}

	update(changedUser) {
		const ALLOWED_KEYS = ["email", "username", "password", "image", "likedPlaylists", "sessionId"];
		const currentUsers = User.getUsers();
		for (const user of currentUsers) {
			if (user.userId == this.userId) {
				for (const key in changedUser) {
					if (ALLOWED_KEYS.includes(key)) {
						user[key] = changedUser[key];
						this[key] = changedUser[key];
					}
				}
				break;
			}
		}
		User.updateUsers(currentUsers);
	}

	editProfile(changedUser) {
		const ALLOWED_KEYS = ["email", "username", "password", "image"];
		let foundKey = false;
		const keysToUpdate = {};
		for (const key in changedUser) {
			if (ALLOWED_KEYS.includes(key)) {
				keysToUpdate[key] = changedUser[key];
				foundKey = true;
			}
		}
		if (!foundKey) {
			return 400;
		}
		if (keysToUpdate.email || keysToUpdate.username) {
			const currentUsers = User.getUsers();
			for (const user of currentUsers) {
				if (user.userId != this.userId) {
					if (keysToUpdate.email && user.email === keysToUpdate.email) {
						return 409;
					}
					if (keysToUpdate.username && user.username === keysToUpdate.username) {
						return 409;
					}
				}
			}
		}
		this.update(keysToUpdate);
		return 204;
	}
}