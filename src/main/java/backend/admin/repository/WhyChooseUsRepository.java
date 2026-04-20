package backend.admin.repository;

import backend.admin.models.WhyChooseUs;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WhyChooseUsRepository extends JpaRepository<WhyChooseUs, Long> {
}
