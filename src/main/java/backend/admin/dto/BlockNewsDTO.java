package backend.admin.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockNewsDTO {

    private Long id;

    @NotBlank(message = "Le titre est requis")
    private String titre;

    private String description;

    private String pays; // optionnel

    @NotNull(message = "La date est requise")
    private LocalDate date;

    private String image;
}
