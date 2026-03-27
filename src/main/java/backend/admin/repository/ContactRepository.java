package backend.admin.repository;

import backend.admin.models.Contact;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.time.LocalDate;

@Repository
public interface ContactRepository extends JpaRepository<Contact, Long> {
    List<Contact> findByInformationId(Long informationId);
    List<Contact> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<Contact> findByEmail(String email);
    void deleteByInformationId(Long informationId);
}