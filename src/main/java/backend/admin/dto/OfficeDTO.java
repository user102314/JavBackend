package backend.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OfficeDTO {
    private Long id;
    
    @NotBlank(message = "Le nom de l'office est requis")
    private String officeName;
}