package backend.admin.servicesimpliment;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import backend.admin.config.SupabaseStorageProperties;
import backend.admin.services.SupabaseStorageService;
import backend.admin.services.SupabaseStorageException;
import lombok.RequiredArgsConstructor;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLEncoder;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SupabaseStorageServiceImpl implements SupabaseStorageService {

    private static final Logger log = LoggerFactory.getLogger(SupabaseStorageServiceImpl.class);
    private static final MediaType JSON = MediaType.get("application/json; charset=utf-8");

    private final SupabaseStorageProperties properties;
    private final ObjectMapper objectMapper;
    private final OkHttpClient httpClient = new OkHttpClient();

    private void ensureConfigured() {
        if (!StringUtils.hasText(properties.getProjectUrl()) || !StringUtils.hasText(properties.getServiceRoleKey())) {
            throw new IllegalStateException(
                    "Supabase Storage is not configured: set supabase.storage.project-url and supabase.storage.service-role-key (or SUPABASE_SERVICE_ROLE_KEY).");
        }
        if (!StringUtils.hasText(properties.getBucket())) {
            throw new IllegalStateException("supabase.storage.bucket must be set.");
        }
    }

    private String normalizeBaseUrl() {
        String url = properties.getProjectUrl().trim();
        return url.endsWith("/") ? url.substring(0, url.length() - 1) : url;
    }

    @Override
    public String uploadPublicObject(String objectPath, byte[] data, String contentType) throws IOException {
        ensureConfigured();
        String base = normalizeBaseUrl();
        String bucket = properties.getBucket().trim();
        String encodedPath = encodePathSegments(objectPath);
        String endpoint = base + "/storage/v1/object/" + bucket + "/" + encodedPath;

        String ct = StringUtils.hasText(contentType) ? contentType : "application/octet-stream";
        RequestBody body = RequestBody.create(MediaType.parse(ct), data);
        Request request = new Request.Builder()
                .url(endpoint)
                .addHeader("Authorization", "Bearer " + properties.getServiceRoleKey())
                .addHeader("apikey", properties.getServiceRoleKey())
                .addHeader("x-upsert", "true")
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                String err = response.body() != null ? response.body().string() : "";
                throw new IOException("Supabase upload failed: HTTP " + response.code() + " " + err);
            }
        }

        return publicUrlFor(objectPath);
    }

    @Override
    public String uploadPublicFile(MultipartFile file, String folder) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("File is required");
        }
        String original = file.getOriginalFilename();
        String ext = "";
        if (StringUtils.hasText(original) && original.contains(".")) {
            ext = original.substring(original.lastIndexOf('.'));
            if (ext.length() > 10) {
                ext = "";
            }
        }
        String safeFolder = folder == null ? "uploads" : folder.replaceAll("^/+|/+$", "");
        String objectPath = safeFolder + "/" + UUID.randomUUID() + ext;
        byte[] bytes = file.getBytes();
        String ct = file.getContentType();
        return uploadPublicObject(objectPath, bytes, ct);
    }

    @Override
    public void deleteObjectByPublicUrlIfPresent(String publicUrl) throws IOException {
        if (!StringUtils.hasText(publicUrl)) {
            return;
        }
        ensureConfigured();
        String bucket = properties.getBucket().trim();
        String marker = "/object/public/" + bucket + "/";
        int idx = publicUrl.indexOf(marker);
        if (idx < 0) {
            return;
        }
        String objectPath = publicUrl.substring(idx + marker.length());
        if (!StringUtils.hasText(objectPath)) {
            return;
        }

        String base = normalizeBaseUrl();
        String endpoint = base + "/storage/v1/object/" + bucket + "/" + encodePathSegments(objectPath);

        Request request = new Request.Builder()
                .url(endpoint)
                .addHeader("Authorization", "Bearer " + properties.getServiceRoleKey())
                .addHeader("apikey", properties.getServiceRoleKey())
                .delete()
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful() && response.code() != 404) {
                String err = response.body() != null ? response.body().string() : "";
                throw new IOException("Supabase delete failed: HTTP " + response.code() + " " + err);
            }
        }
    }

    @Override
    public String toBrowserAccessibleImageUrl(String image) {
        if (!StringUtils.hasText(image)) return "";

        try {
            ensureConfigured();

            // If it's already an absolute URL, try to extract the storage object path and sign it.
            // This is important when the bucket is private: /object/public is not readable from browser.
            if (image.startsWith("http://") || image.startsWith("https://")) {
                String objectPath = extractObjectPath(image);
                if (!StringUtils.hasText(objectPath)) {
                    return image; // can't extract: return as-is
                }
                return createSignedUrl(objectPath);
            }

            // Otherwise treat it as a raw object path inside the bucket.
            return createSignedUrl(image);
        } catch (Exception e) {
            // Fail safe: don't break the UI completely.
            log.warn("Failed to build signed image URL: {}", e.getMessage());
            return image;
        }
    }

    private String publicUrlFor(String objectPath) {
        String base = normalizeBaseUrl();
        String bucket = properties.getBucket().trim();
        return base + "/storage/v1/object/public/" + bucket + "/" + encodePathSegments(objectPath);
    }

    private String extractObjectPath(String storedUrl) {
        String bucket = properties.getBucket().trim();
        String markerPublic = "/storage/v1/object/public/" + bucket + "/";
        String markerAuth = "/storage/v1/object/authenticated/" + bucket + "/";

        int idx = storedUrl.indexOf(markerPublic);
        if (idx >= 0) {
            String enc = storedUrl.substring(idx + markerPublic.length());
            return URLDecoder.decode(enc, StandardCharsets.UTF_8);
        }

        idx = storedUrl.indexOf(markerAuth);
        if (idx >= 0) {
            String enc = storedUrl.substring(idx + markerAuth.length());
            return URLDecoder.decode(enc, StandardCharsets.UTF_8);
        }

        return null;
    }

    private String createSignedUrl(String objectPath) throws IOException {
        String bucket = properties.getBucket().trim();
        String projectBase = normalizeBaseUrl();
        String signPath = bucket + "/" + objectPath;

        String encodedSignPath = encodePathSegments(signPath);
        String endpoint = projectBase + "/storage/v1/object/sign/" + encodedSignPath;

        Map<String, Object> bodyMap = new LinkedHashMap<>();
        bodyMap.put("expiresIn", 7200); // 2h

        String json = objectMapper.writeValueAsString(bodyMap);
        RequestBody body = RequestBody.create(json, JSON);

        Request request = new Request.Builder()
                .url(endpoint)
                .addHeader("Authorization", "Bearer " + properties.getServiceRoleKey())
                .addHeader("apikey", properties.getServiceRoleKey())
                .post(body)
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            String respText = response.body() != null ? response.body().string() : "";
            if (!response.isSuccessful()) {
                throw new SupabaseStorageException("Supabase sign URL failed (HTTP " + response.code() + "): " + respText);
            }

            JsonNode root = objectMapper.readTree(respText);
            String rel = null;
            if (root.has("signedURL")) rel = root.get("signedURL").asText();
            else if (root.has("signedUrl")) rel = root.get("signedUrl").asText();

            if (!StringUtils.hasText(rel)) return publicUrlFor(objectPath);

            if (rel.startsWith("http://") || rel.startsWith("https://")) return rel;

            // Match supabase-js storage-js behaviour: `${this.url}${data.signedURL}` where this.url ends with `/storage/v1`.
            String prefix = projectBase + "/storage/v1";
            if (rel.startsWith("/")) return prefix + rel;
            return prefix + "/" + rel;
        }
    }

    /** Encode each path segment; keep slashes between segments. */
    private String encodePathSegments(String path) {
        return Arrays.stream(path.split("/"))
                .filter(StringUtils::hasText)
                .map(s -> URLEncoder.encode(s, StandardCharsets.UTF_8).replace("+", "%20"))
                .collect(Collectors.joining("/"));
    }
}
