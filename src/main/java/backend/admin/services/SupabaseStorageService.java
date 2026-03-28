package backend.admin.services;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface SupabaseStorageService {

    /**
     * Uploads raw bytes to {@code bucket/objectPath} and returns the public URL (public bucket).
     */
    String uploadPublicObject(String objectPath, byte[] data, String contentType) throws IOException;

    /**
     * Uploads a multipart file under a generated path prefixed with {@code folder/}.
     */
    String uploadPublicFile(MultipartFile file, String folder) throws IOException;

    /**
     * Deletes an object if {@code publicUrl} matches this project's public URL pattern; no-op otherwise.
     */
    void deleteObjectByPublicUrlIfPresent(String publicUrl) throws IOException;
}
