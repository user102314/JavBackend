package backend.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Min;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class WhyChooseUsDTO {
    private Long id;

    @NotNull(message = "Le nombre de déménagements complétés est requis")
    @Min(value = 0, message = "Le nombre de déménagements doit être positif")
    private Integer movesCompleted;

    @NotNull(message = "L'espace de stockage sécurisé est requis")
    @Min(value = 0, message = "L'espace de stockage doit être positif")
    private Integer secureStorageSpace;

    @NotNull(message = "Les années d'expérience sont requises")
    @Min(value = 0, message = "Les années d'expérience doivent être positives")
    private Integer yearsOfExperience;
}
