package backend.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SponsorDTO {
    private Long id;
    private String image;  // Simple string, pas de MultipartFile
}