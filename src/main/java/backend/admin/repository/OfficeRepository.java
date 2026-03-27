package backend.admin.repository;

import backend.admin.models.Office;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OfficeRepository extends JpaRepository<Office, Long> {
    List<Office> findByInformationId(Long informationId);
    void deleteByInformationId(Long informationId);
}