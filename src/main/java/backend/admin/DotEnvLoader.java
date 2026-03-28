package backend.admin;

import java.io.BufferedReader;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

/**
 * Lit un fichier .env avant Spring (racine du projet ou {@code src/main/resources/.env}).
 * Accepte les lignes {@code KEY=val} ou {@code export KEY="val"} comme dans votre fichier actuel.
 */
final class DotEnvLoader {

    private DotEnvLoader() {
    }

    static void apply() {
        Path envPath = resolveEnvFile();
        if (envPath == null || !Files.isRegularFile(envPath)) {
            return;
        }
        try (BufferedReader r = Files.newBufferedReader(envPath, StandardCharsets.UTF_8)) {
            String line;
            while ((line = r.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) {
                    continue;
                }
                if (line.startsWith("export ")) {
                    line = line.substring(7).trim();
                }
                int eq = line.indexOf('=');
                if (eq < 0) {
                    continue;
                }
                String key = line.substring(0, eq).trim();
                String val = line.substring(eq + 1).trim();
                if (val.length() >= 2 && val.startsWith("\"") && val.endsWith("\"")) {
                    val = val.substring(1, val.length() - 1);
                }
                if (key.isEmpty()) {
                    continue;
                }
                if (System.getenv(key) != null) {
                    continue;
                }
                if (System.getProperty(key) != null) {
                    continue;
                }
                if (!val.isEmpty()) {
                    System.setProperty(key, val);
                }
            }
        } catch (Exception ignored) {
            // Environnement classique uniquement
        }
    }

    private static Path resolveEnvFile() {
        Path cwd = Paths.get("").toAbsolutePath();
        Path a = cwd.resolve(".env");
        if (Files.isRegularFile(a)) {
            return a;
        }
        Path b = cwd.resolve("src/main/resources/.env");
        if (Files.isRegularFile(b)) {
            return b;
        }
        return null;
    }
}
