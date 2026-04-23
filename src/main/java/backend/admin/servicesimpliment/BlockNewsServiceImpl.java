package backend.admin.servicesimpliment;

import backend.admin.dto.BlockNewsDTO;
import backend.admin.models.BlockNews;
import backend.admin.repository.BlockNewsRepository;
import backend.admin.services.BlockNewsService;
import backend.admin.services.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class BlockNewsServiceImpl implements BlockNewsService {

    /**
     * Dossier cible dans le bucket Supabase : sponsor > blocks
     * L'image sera uploadée sous  blocks/<uuid>.<ext>
     */
    private static final String STORAGE_FOLDER = "blocks";

    private final BlockNewsRepository blockNewsRepository;
    private final SupabaseStorageService supabaseStorageService;

    // ------------------------------------------------------------------ //
    //  READ                                                                //
    // ------------------------------------------------------------------ //

    @Override
    @Transactional(readOnly = true)
    public List<BlockNewsDTO> getAllBlockNews() {
        return blockNewsRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public BlockNewsDTO getLastBlockNews() {
        BlockNews last = blockNewsRepository.findTopByOrderByDateDescIdDesc()
                .orElseThrow(() -> new RuntimeException("Aucun block news trouvé"));
        return toDto(last);
    }

    // ------------------------------------------------------------------ //
    //  CREATE                                                              //
    // ------------------------------------------------------------------ //

    @Override
    public BlockNewsDTO createBlockNews(String titre, String description, String pays,
                                        LocalDate date, MultipartFile imageFile) throws IOException {
        if (!StringUtils.hasText(titre)) {
            throw new IllegalArgumentException("Le titre est requis");
        }
        if (date == null) {
            throw new IllegalArgumentException("La date est requise");
        }
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("L'image est requise");
        }

        String publicUrl = supabaseStorageService.uploadPublicFile(imageFile, STORAGE_FOLDER);

        BlockNews entity = new BlockNews();
        entity.setTitre(titre.trim());
        entity.setDescription(description != null ? description : "");
        entity.setPays(StringUtils.hasText(pays) ? pays.trim() : null); // pays optionnel
        entity.setDate(date);
        entity.setImage(publicUrl);

        return toDto(blockNewsRepository.save(entity));
    }

    // ------------------------------------------------------------------ //
    //  UPDATE                                                              //
    // ------------------------------------------------------------------ //

    @Override
    public BlockNewsDTO updateBlockNews(Long id, String titre, String description, String pays,
                                        LocalDate date, MultipartFile imageFile) throws IOException {
        BlockNews entity = blockNewsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BlockNews non trouvé avec l'id : " + id));

        if (StringUtils.hasText(titre)) {
            entity.setTitre(titre.trim());
        }
        if (description != null) {
            entity.setDescription(description);
        }
        // pays peut être mis à null explicitement (suppression de valeur)
        if (pays != null) {
            entity.setPays(pays.isBlank() ? null : pays.trim());
        }
        if (date != null) {
            entity.setDate(date);
        }

        // Remplacement de l'image si un nouveau fichier est fourni
        if (imageFile != null && !imageFile.isEmpty()) {
            supabaseStorageService.deleteObjectByPublicUrlIfPresent(entity.getImage());
            String publicUrl = supabaseStorageService.uploadPublicFile(imageFile, STORAGE_FOLDER);
            entity.setImage(publicUrl);
        }

        return toDto(blockNewsRepository.save(entity));
    }

    // ------------------------------------------------------------------ //
    //  DELETE                                                              //
    // ------------------------------------------------------------------ //

    @Override
    public void deleteBlockNews(Long id) {
        BlockNews entity = blockNewsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("BlockNews non trouvé avec l'id : " + id));
        try {
            supabaseStorageService.deleteObjectByPublicUrlIfPresent(entity.getImage());
        } catch (IOException e) {
            throw new RuntimeException("Échec de la suppression de l'image dans Supabase", e);
        }
        blockNewsRepository.delete(entity);
    }

    // ------------------------------------------------------------------ //
    //  MAPPER                                                              //
    // ------------------------------------------------------------------ //

    private BlockNewsDTO toDto(BlockNews entity) {
        String img = supabaseStorageService.toBrowserAccessibleImageUrl(entity.getImage());
        return new BlockNewsDTO(
                entity.getId(),
                entity.getTitre(),
                entity.getDescription(),
                entity.getPays(),
                entity.getDate(),
                img
        );
    }
}
