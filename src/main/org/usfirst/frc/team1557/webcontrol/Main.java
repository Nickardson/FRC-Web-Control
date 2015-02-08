package org.usfirst.frc.team1557.webcontrol;

import edu.wpi.first.wpilibj.networktables.NetworkTable;
import edu.wpi.first.wpilibj.networktables.NetworkTableProvider;
import edu.wpi.first.wpilibj.networktables2.NetworkTableEntry;
import edu.wpi.first.wpilibj.networktables2.client.NetworkTableClient;
import edu.wpi.first.wpilibj.networktables2.type.ComplexData;
import edu.wpi.first.wpilibj.networktables2.type.NumberArray;
import edu.wpi.first.wpilibj.networktables2.util.List;
import edu.wpi.first.wpilibj.tables.ITable;
import edu.wpi.first.wpilibj.tables.ITableListener;

import javax.swing.*;
import java.io.IOException;
import java.lang.reflect.Field;
import java.util.Date;
import java.util.prefs.Preferences;

public class Main {
    public static void main(String[] args) throws IOException {
        Preferences preferences = Preferences.userNodeForPackage(Main.class);

        // Prompt for NetworkTable hostname
        String host = JOptionPane.showInputDialog(
                "What hostname is the NetworkTable under?\n\n" +
                "Robots will likely use a host name similar to 'roboRIO-1234.local' where 1234 is your team number.\n" +
                "Local NetworkTable servers can be accessed with 'localhost'\n" +
                "An IP can also be provided.",
                preferences.get("host", "roboRIO-1234.local"));

        // Quit if cancelled or no host provided
        if (host == null || host.length() == 0) {
            return;
        } else {
            // If host is provided, store in preferences
            preferences.put("host", host);
        }

        // Initialize NetworkTable
        NetworkTable.setClientMode();
        NetworkTable.setIPAddress(host);

        final String TABLE_NAME = "SmartDashboard";

        NetworkTable table = NetworkTable.getTable(TABLE_NAME);

        // Start file server
        // TODO: allow bind to other IPs, for intentional access from other computers.
        final FileServer fs = new FileServer("localhost", 8888);
        fs.start();

        // Send a message to everybody when table is updated
        table.addTableListener(new ITableListener() {
            @Override
            public void valueChanged(ITable source, String key, Object value, boolean isNew) {
                fs.sendNetworkTableToAll(NetworkTableWSHandler.createUpdateMessage("/" + TABLE_NAME  + "/" + key, isNew, value));
            }
        });

        // Put Start time
        table.putString("FRCwc-Start", new Date().toString());

        fs.join();
    }
}
