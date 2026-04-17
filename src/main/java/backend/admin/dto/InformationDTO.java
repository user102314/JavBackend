package backend.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.Email;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InformationDTO {
    private Long id;
    private String moveProfetionelle;
    private String storageSolution;
    private Integer yearsExperience;
    private String phone1;
    private String phone2;
    
    @Email(message = "Format d'email invalide")
    private String email;
    
    private List<OfficeDTO> offices;
    private List<SponsorDTO> sponsors;
    private List<ContactDTO> contacts;
}