package backend.admin.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Entity
@Table(name = "why_choose_us")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WhyChooseUs {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "moves_completed", nullable = false)
    private Integer movesCompleted;

    @Column(name = "secure_storage_space", nullable = false)
    private Integer secureStorageSpace;

    @Column(name = "years_of_experience", nullable = false)
    private Integer yearsOfExperience;
}
