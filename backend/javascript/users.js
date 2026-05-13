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

	static addUser(newUser) {
		const REQUIRED_KEYS = ["email", "username", "password", "sessionId"];
		for (const key of REQUIRED_KEYS) {
			if (!newUser[key]) {
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
				if (user.email == newUser.email || user.username == newUser.username) {
					return 409;
				}
			}
		}
		newUser.userId = "usr-" + (highestUserId +1);
		const PLACEHOLDER_IMAGES = ["./images/users/placeholder_blue.png", "./images/users/placeholder_green.png", "./images/users/placeholder_red.png", "./images/users/placeholder_yellow.png"]
		newUser.image = PLACEHOLDER_IMAGES[Math.floor(Math.random() * PLACEHOLDER_IMAGES.length)];
		newUser.likedPlaylists = [];
		currentUsers.push(newUser);
		User.updateUsers(currentUsers);
		return 201;
	}

	static deleteUserById (userId) {
		const currentUsers = User.getUsers();
		let foundUserIndex;
		for (let i = 0; i < currentUsers.length; i++) {
			if (currentUsers[i].userId == userId) {
				foundUserIndex = i;
				break;
			}
		}
		if (foundUserIndex !== undefined) {
			currentUsers.splice(foundUserIndex, 1);
			User.updateUsers(currentUsers);
		}
	}

	static updateUserById (userId, changedUser) {
		const currentUsers = User.getUsers();
		const ALLOWED_KEYS = ["email", "username", "password", "image"];
		for (const user of currentUsers) {
			if (user.userId == userId) {
				for (const key in changedUser) {
					if (ALLOWED_KEYS.includes(key)) {
						user[key] = changedUser[key];
					}
				}
				break;
			}
		}
		User.updateUsers(currentUsers);
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
}