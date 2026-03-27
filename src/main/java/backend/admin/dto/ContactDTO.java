package backend.admin.dto;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDate;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ContactDTO {
    private Long id;
    private String firstName;
    private String lastName;
    private String phone;
    private String email;
    private String originCity;
    private String distnationCity;
    private LocalDate date;
    private String description;
}