package org.usfirst.frc.team1557.webcontrol;

import fi.iki.elonen.NanoHTTPD;

import java.io.InputStream;

public class FileServer extends NanoHTTPD {
    public FileServer(String host, int port) {
        super(host, port);
    }

    @Override
    public Response serve(IHTTPSession session) {
        String uri = session.getUri();


        if (uri.equals("/")) {
            uri += "index.html";
        }

        // Serve resources from inside the http package bundled with the jar.
        uri = "/http" + uri;

        InputStream stream = getClass().getResourceAsStream(uri);

        if (stream == null) {
            return new Response(Response.Status.NOT_FOUND, MIME_PLAINTEXT, "Not Found: " + uri);
        }

        return new Response(Response.Status.OK, MIME_HTML, stream);
    }
}
