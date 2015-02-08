package org.usfirst.frc.team1557.webcontrol;

import fi.iki.elonen.*;

import java.io.InputStream;

public class FileServer extends NanoHTTPD {

    NetworkTableWSHandler wsResponse;

    public FileServer(String host, int port) {
        super(host, port);

        wsResponse = new NetworkTableWSHandler();
    }

    /**
     * Sends a message to all clients listening to NetworkTable websockets.
     * @param message Message to send to each client
     */
    public void sendNetworkTableToAll(String message) {
        wsResponse.sendToAll(message);
    }

    @Override
    public Response serve(IHTTPSession session) {
        Response ws = wsResponse.serve(session);

        // If ws is null, then request is not Websocket related, otherwise it is a WebSocket object.
        if (ws == null) {
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

            return new Response(Response.Status.OK, SimpleWebServer.getMimeTypeForFile(uri), stream);
        }

        return ws;
    }
}
