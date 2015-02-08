package org.usfirst.frc.team1557.webcontrol;

import edu.wpi.first.wpilibj.networktables.NetworkTable;
import edu.wpi.first.wpilibj.networktables.NetworkTableProvider;
import edu.wpi.first.wpilibj.networktables2.NetworkTableEntry;
import fi.iki.elonen.*;
import org.usfirst.frc.team1557.webcontrol.ws.CensusWebSocket;

import java.io.IOException;
import java.lang.reflect.Field;
import java.util.List;
import java.util.Vector;

public class NetworkTableWSHandler extends WebSocketResponseHandler {

    /**
     * Census list of connected clients.
     */
    private List<WebSocketUser> users = new Vector<WebSocketUser>();

    public NetworkTableWSHandler() {
        super(new Factory());
        ((Factory) this.getWebSocketFactory()).users = users;
    }

    /**
     * Sends a message to all connected clients
     *
     * @param message Message to send to the clients.
     */
    public void sendToAll(String message) {
        for (WebSocketUser user : users) {
            try {
                user.send(message);
            } catch (IOException ignored) {
            }
        }
    }

    static class Factory implements IWebSocketFactory {
        public List<WebSocketUser> users;

        @Override
        public WebSocket openWebSocket(NanoHTTPD.IHTTPSession handshake) {
            return new Ws(users, handshake);
        }
    }

    public static String createUpdateMessage(String key, boolean isNew, Object value) {
        return "NetworkTable:" +
                key + ";" +
                isNew + ";" +
                value.getClass().getName() + ";" +
                value.toString();
    }

    static class Ws extends CensusWebSocket {
        public Ws(List<WebSocketUser> users, NanoHTTPD.IHTTPSession handshakeRequest) {
            super(users, handshakeRequest);

            System.out.println("WS Connect: " + handshakeRequest.getUri());
        }

        @Override
        protected void onMessage(WebSocketFrame messageFrame) {
            // Ignore ping messages
            if (isMessagePing(messageFrame)) {
                return;
            }

            String text = messageFrame.getTextPayload();

            if (text.indexOf(':') != -1) {
                String namespace = text.substring(0, text.indexOf(':'));
                String message = text.substring(text.indexOf(':') + 1);

                if (namespace.equals("FullUpdate")) {
                    try {
                        Field field = NetworkTable.class.getDeclaredField("staticProvider");
                        field.setAccessible(true);
                        NetworkTableProvider staticProvider = (NetworkTableProvider) field.get(null);
                        edu.wpi.first.wpilibj.networktables2.util.List keys = staticProvider.getNode().getEntryStore().keys();
                        for (int i = 0; i < keys.size(); i++) {
                            System.out.println("KEY: " + keys.get(i));
                            NetworkTableEntry entry = staticProvider.getNode().getEntryStore().getEntry((String) keys.get(i));

                            send(createUpdateMessage((String) keys.get(i), true, entry.getValue()));
                        }
                    } catch (Exception e) {
                        e.printStackTrace();
                    }
                }
            }

            System.out.println("Message : " + text);
            try {
                send("Response:" + text);
            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        @Override
        protected void onClose(WebSocketFrame.CloseCode code, String reason, boolean initiatedByRemote) {
            super.onClose(code, reason, initiatedByRemote);

            System.out.println("WS Disconnected: " + code.name() + " : " + code.getValue() + " because " + reason);
        }
    }
}
