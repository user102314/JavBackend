package backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockDTO {
    private Long id;
    
    @NotBlank(message = "Le titre est requis")
    private String titre;
    
    private String description;
    private String image;
}
