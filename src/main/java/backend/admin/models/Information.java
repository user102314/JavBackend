package backend.admin.models;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "informations")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Information {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "move_professionelle")
    private String moveProfetionelle;

    @Column(name = "storage_solution")
    private String storageSolution;

    @Column(name = "years_experience")
    private Integer yearsExperience;

    @Column(name = "phone1")
    private String phone1;

    @Column(name = "phone2")
    private String phone2;

    @Column(name = "email")
    private String email;

    @OneToMany(mappedBy = "information", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Office> offices = new ArrayList<>();

    @OneToMany(mappedBy = "information", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Sponsor> sponsors = new ArrayList<>();

    @OneToMany(mappedBy = "information", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Contact> contacts = new ArrayList<>();
}