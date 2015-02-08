package org.usfirst.frc.team1557.webcontrol;

import java.io.IOException;

public class Main {
    public static void main(String[] args) throws IOException {
        // TODO: allow bind to other IPs, for intentional access from other computers.
        FileServer fs = new FileServer("localhost", 8888);
        fs.start();
        fs.join();
    }
}
