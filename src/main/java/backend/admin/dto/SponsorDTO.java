package backend.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SponsorDTO {
    private Long id;
    
    @NotBlank(message = "L'image est requise")
    private String image;  // Simple string, pas de MultipartFile
}