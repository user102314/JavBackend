package backend.admin;

import java.sql.*;

public class TestConnection {
    public static void main(String[] args) {
        // Force IPv4
        System.setProperty("java.net.preferIPv4Stack", "true");

        String url = firstNonBlank(System.getenv("DB_URL"), System.getProperty("DB_URL"));
        String user = firstNonBlank(System.getenv("DB_USERNAME"), System.getProperty("DB_USERNAME"));
        String password = firstNonBlank(System.getenv("DB_PASSWORD"), System.getProperty("DB_PASSWORD"));

        if (isBlank(url) || isBlank(user) || isBlank(password)) {
            System.err.println("Missing DB_URL / DB_USERNAME / DB_PASSWORD in environment.");
            System.exit(1);
        }

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

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }

    private static String firstNonBlank(String a, String b) {
        if (!isBlank(a)) return a;
        if (!isBlank(b)) return b;
        return null;
    }
}