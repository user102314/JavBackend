package backend.admin.repository;

import backend.admin.models.BlockNews;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BlockNewsRepository extends JpaRepository<BlockNews, Long> {

    // Retourne le dernier block news selon la date la plus récente
    Optional<BlockNews> findTopByOrderByDateDescIdDesc();
}
