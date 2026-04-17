package backend.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
    private Long id;
    
    @NotBlank(message = "Le prénom est requis")
    private String firstName;
    
    @NotBlank(message = "Le nom est requis")
    private String lastName;
    
    @NotBlank(message = "Le téléphone est requis")
    private String phone;
    
    @NotBlank(message = "L'email est requis")
    @Email(message = "Format d'email invalide")
    private String email;
    
    @NotBlank(message = "La ville de départ est requise")
    private String originCity;
    
    @NotBlank(message = "La ville de destination est requise")
    private String distnationCity;
    
    @NotNull(message = "La date est requise")
    private LocalDate date;
    
    private String description;
}