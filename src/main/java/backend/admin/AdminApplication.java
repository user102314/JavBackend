package backend.admin;

import backend.admin.config.SupabaseStorageProperties;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.EnableConfigurationProperties;

@SpringBootApplication
@EnableConfigurationProperties(SupabaseStorageProperties.class)
public class AdminApplication {
	public static void main(String[] args) {
		DotEnvLoader.apply();
		SpringApplication.run(AdminApplication.class, args);
	}
}