package backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminDTO {
    private Long id;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;
}
