package backend.admin.servicesimpliment;

import backend.admin.config.SupabaseStorageProperties;
import backend.admin.services.SupabaseStorageException;
import backend.admin.services.SupabaseStorageService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
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
import java.net.URLDecoder;
import java.net.URLEncoder;
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

    private String storageV1Base() {
        return normalizeBaseUrl() + "/storage/v1";
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
                log.warn("Supabase upload failed: {} {} — {}", response.code(), endpoint, err);
                throw new SupabaseStorageException(
                        "Supabase upload failed (HTTP " + response.code() + "). Verifiez bucket '" + bucket
                                + "', cle service_role, politiques Storage. Reponse: "
                                + err);
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
        String objectPathEnc = publicUrl.substring(idx + marker.length());
        if (!StringUtils.hasText(objectPathEnc)) {
            return;
        }
        String objectPath = URLDecoder.decode(objectPathEnc, StandardCharsets.UTF_8);

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
                throw new SupabaseStorageException("Supabase delete failed: HTTP " + response.code() + " " + err);
            }
        }
    }

    @Override
    public String toBrowserAccessibleImageUrl(String storedUrl) {
        if (!StringUtils.hasText(storedUrl)) {
            return storedUrl;
        }
        try {
            ensureConfigured();
        } catch (IllegalStateException e) {
            return storedUrl;
        }
        String bucket = properties.getBucket().trim();
        String marker = "/object/public/" + bucket + "/";
        int idx = storedUrl.indexOf(marker);
        if (idx < 0) {
            return storedUrl;
        }
        String objectPathEnc = storedUrl.substring(idx + marker.length());
        if (!StringUtils.hasText(objectPathEnc)) {
            return storedUrl;
        }
        String objectPath = URLDecoder.decode(objectPathEnc, StandardCharsets.UTF_8);

        String signPath = bucket + "/" + objectPath;
        String encodedSignPath = encodePathSegments(signPath);
        String endpoint = storageV1Base() + "/object/sign/" + encodedSignPath;

        try {
            Map<String, Object> bodyMap = new LinkedHashMap<>();
            bodyMap.put("expiresIn", 7200);
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
                    log.warn("Supabase sign URL failed: {} {} — {}", response.code(), endpoint, respText);
                    return storedUrl;
                }
                JsonNode root = objectMapper.readTree(respText);
                String rel = null;
                if (root.has("signedURL")) {
                    rel = root.get("signedURL").asText();
                } else if (root.has("signedUrl")) {
                    rel = root.get("signedUrl").asText();
                }
                if (!StringUtils.hasText(rel)) {
                    log.warn("Supabase sign URL: pas de signedURL dans: {}", respText);
                    return storedUrl;
                }
                String projectBase = normalizeBaseUrl();
                if (rel.startsWith("http://") || rel.startsWith("https://")) {
                    return rel;
                }
                if (rel.startsWith("/storage/v1/")) {
                    return projectBase + rel;
                }
                return storageV1Base() + rel;
            }
        } catch (Exception e) {
            log.warn("Supabase sign URL exception: {}", e.getMessage());
            return storedUrl;
        }
    }

    private String publicUrlFor(String objectPath) {
        String base = normalizeBaseUrl();
        String bucket = properties.getBucket().trim();
        return base + "/storage/v1/object/public/" + bucket + "/" + encodePathSegments(objectPath);
    }

    /** Encode each path segment; keep slashes between segments. */
    private String encodePathSegments(String path) {
        return Arrays.stream(path.split("/"))
                .filter(StringUtils::hasText)
                .map(s -> URLEncoder.encode(s, StandardCharsets.UTF_8).replace("+", "%20"))
                .collect(Collectors.joining("/"));
    }
}
