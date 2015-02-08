package org.usfirst.frc.team1557.webcontrol;

import fi.iki.elonen.WebSocket;

import java.io.IOException;

public class WebSocketUser {
    public WebSocketUser(WebSocket webSocket) {
        this.webSocket = webSocket;
    }

    /**
     * @return The WebSocket associated with this user.
     */
    public WebSocket getWebSocket() {
        return webSocket;
    }

    /**
     * Sends a message to this user's associated WebSocket.
     * @param message The message to send to the user.
     * @throws IOException
     */
    public void send(String message) throws IOException {
        webSocket.send(message);
    }

    /**
     * Sends a message to this user's associated WebSocket.
     * @param message The message to send to the user.
     * @throws IOException
     */
    public void send(byte[] message) throws IOException {
        webSocket.send(message);
    }

    WebSocket webSocket;
}
