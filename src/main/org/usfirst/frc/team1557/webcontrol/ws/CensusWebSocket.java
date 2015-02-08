package org.usfirst.frc.team1557.webcontrol.ws;

import fi.iki.elonen.NanoHTTPD;
import fi.iki.elonen.WebSocket;
import fi.iki.elonen.WebSocketFrame;
import org.usfirst.frc.team1557.webcontrol.WebSocketUser;

import java.io.IOException;
import java.util.List;

/**
 * A WebSocket that manages itself within a provided census list of users.
 * An class overriding this class's methods (with the exception of onMessage) must call the super-method to ensure the census is updated.
 */
public abstract class CensusWebSocket extends WebSocket {
    /**
     * Reference to the creating handler's list of users.
     * This WebSocket must add and remove itself from that list.
     */
    private List<WebSocketUser> users;

    private WebSocketUser user;

    public CensusWebSocket(List<WebSocketUser> users, NanoHTTPD.IHTTPSession handshakeRequest) {
        super(handshakeRequest);

        this.users = users;

        user = new WebSocketUser(this);
        users.add(user);
    }

    @Override
    protected void onPong(WebSocketFrame pongFrame) {
    }

    /**
     * Gets whether the message is a blank string, or a "ping"
     * @param frame The frame to examine
     * @return Whether the message is a zero-length string.
     */
    public boolean isMessagePing(WebSocketFrame frame) {
        return frame.getTextPayload().isEmpty();
    }

    @Override
    protected void onClose(WebSocketFrame.CloseCode code, String reason, boolean initiatedByRemote) {
        users.remove(user);
    }

    @Override
    protected void onException(IOException e) {
        System.err.println(e.getMessage());
        users.remove(user);
    }
}
