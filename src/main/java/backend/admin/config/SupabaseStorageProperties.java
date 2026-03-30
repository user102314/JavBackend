package backend.admin.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;

@Data
@ConfigurationProperties(prefix = "supabase.storage")
public class SupabaseStorageProperties {

    private String projectUrl = "";
    private String serviceRoleKey = "";
    private String bucket = "sponsors";
}