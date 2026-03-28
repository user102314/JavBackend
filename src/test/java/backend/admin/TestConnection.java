package backend.admin;

import java.sql.*;

public class TestConnection {
    public static void main(String[] args) {
        // Force IPv4
        System.setProperty("java.net.preferIPv4Stack", "true");

        String url      = "jdbc:postgresql://aws-1-eu-central-1.pooler.supabase.com:5432/postgres?sslmode=require";
        String user     = "postgres.kdxswrwcinikvmaquolv";
        String password = "Oussamaoussam";

        try {
            System.out.println("========================================");
            System.out.println("Test de connexion à Supabase (Pooler)");
            System.out.println("========================================");
            System.out.println("URL: " + url);
            System.out.println("User: " + user);
            System.out.println("========================================");

            Connection conn = DriverManager.getConnection(url, user, password);
            System.out.println("✅ CONNEXION RÉUSSIE!");

            Statement stmt = conn.createStatement();
            ResultSet rs = stmt.executeQuery("SELECT version()");
            if (rs.next()) {
                System.out.println("📦 PostgreSQL Version: " + rs.getString(1).split(",")[0]);
            }

            conn.close();
            System.out.println("========================================");
            System.out.println("✅ Test terminé avec succès!");
            System.out.println("========================================");

        } catch (SQLException e) {
            System.err.println("❌ Échec de connexion: " + e.getMessage());
            e.printStackTrace();
        }
    }
}