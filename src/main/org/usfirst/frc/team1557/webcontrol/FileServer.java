package org.usfirst.frc.team1557.webcontrol;

import fi.iki.elonen.*;

import java.io.IOException;
import java.io.InputStream;

public class FileServer extends NanoHTTPD {

    WebSocketResponseHandler responseHandler;

    public FileServer(String host, int port) {
        super(host, port);

        responseHandler = new WebSocketResponseHandler(webSocketFactory);
    }

    @Override
    public Response serve(IHTTPSession session) {
        Response ws = responseHandler.serve(session);

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

    IWebSocketFactory webSocketFactory = new IWebSocketFactory() {
        @Override
        public WebSocket openWebSocket(IHTTPSession handshake) {
            return new Ws(handshake);
        }
    };

    class Ws extends WebSocket {
        public Ws(IHTTPSession handshakeRequest) {
            super(handshakeRequest);
            System.out.println("WS Connect: " + handshakeRequest.getUri());
        }

        @Override
        protected void onPong(WebSocketFrame pongFrame) {

        }

        @Override
        protected void onMessage(WebSocketFrame messageFrame) {
            // Ignore ping messages
            if (messageFrame.getTextPayload().length() == 0) {
                return;
            }

            System.out.println("Message : " + messageFrame.getTextPayload());
            try {
                send("Response to " + messageFrame.getTextPayload());
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onClose(WebSocketFrame.CloseCode code, String reason, boolean initiatedByRemote) {
            System.out.println("WS Disconnected: " + code.name() + " : " + code.getValue() + " because " + reason);
        }

        @Override
        protected void onException(IOException e) {
            System.out.println(e.getMessage());
        }
    }
}
