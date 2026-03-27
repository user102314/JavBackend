package backend.admin.repository;

import backend.admin.models.Information;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface InformationRepository extends JpaRepository<Information, Long> {
    Optional<Information> findByEmail(String email);
    boolean existsByEmail(String email);
}