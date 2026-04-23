package backend.admin.services;

import backend.admin.dto.BlockNewsDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

public interface BlockNewsService {

    /** Retourne tous les block news */
    List<BlockNewsDTO> getAllBlockNews();

    /** Retourne le dernier block news (date la plus récente) */
    BlockNewsDTO getLastBlockNews();

    /** Crée un nouveau block news avec upload de l'image dans Supabase (sponsor/blocks) */
    BlockNewsDTO createBlockNews(String titre, String description, String pays,
                                 LocalDate date, MultipartFile imageFile) throws IOException;

    /** Met à jour un block news existant (l'image est optionnelle) */
    BlockNewsDTO updateBlockNews(Long id, String titre, String description, String pays,
                                 LocalDate date, MultipartFile imageFile) throws IOException;

    /** Supprime un block news et l'image associée dans Supabase */
    void deleteBlockNews(Long id);
}
