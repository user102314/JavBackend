package backend.admin.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

@Data
@Component
@ConfigurationProperties(prefix = "supabase.storage")
public class SupabaseStorageProperties {

    /**
     * Project URL without trailing slash, e.g. https://xxxxx.supabase.co
     */
    private String projectUrl = "";

    /**
     * Service role key (server-side). Prefer env var SUPABASE_SERVICE_ROLE_KEY.
     */
    private String serviceRoleKey = "";

    /**
     * Storage bucket name (must exist in Supabase; use a public bucket for public URLs).
     */
    private String bucket = "sponsors";
}
