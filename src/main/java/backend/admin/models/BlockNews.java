package backend.admin.models;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "block_news")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlockNews {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "titre", nullable = false)
    private String titre;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "pays")
    private String pays; // optionnel — peut être null

    @Column(name = "date", nullable = false)
    private LocalDate date;

    @Column(name = "image", columnDefinition = "TEXT")
    private String image;
}
