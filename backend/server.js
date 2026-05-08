import { serveFile, serveDir } from "jsr:@std/http/file-server";

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
	const url = new URL(request.url)
	if (request.method == "OPTIONS") {
		return new Response(null, options)
	}
	
	// ! Add check for cookies and headers !
	// Auto run no matter what?
	// Always require authentication otherwise home page?


	if (url.pathname == "/themix" && request.method == "GET") {
		return serveFile(request, "./../frontend/index.html")
	}
	return serveDir(request, {fsRoot: "./../frontend"});
}

Deno.serve(handler);