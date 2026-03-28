package backend.admin.servicesimpliment;

import backend.admin.dto.BlockDTO;
import backend.admin.models.Block;
import backend.admin.repository.BlockRepository;
import backend.admin.services.BlockService;
import backend.admin.services.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

@Service
@RequiredArgsConstructor
@Transactional
public class BlockServiceImpl implements BlockService {

    private static final String STORAGE_FOLDER = "blocks";

    private final BlockRepository blockRepository;
    private final SupabaseStorageService supabaseStorageService;

    @Override
    public BlockDTO createBlock(String titre, String description, MultipartFile imageFile) throws IOException {
        if (!StringUtils.hasText(titre)) {
            throw new IllegalArgumentException("titre is required");
        }
        if (imageFile == null || imageFile.isEmpty()) {
            throw new IllegalArgumentException("image file is required");
        }

        String publicUrl = supabaseStorageService.uploadPublicFile(imageFile, STORAGE_FOLDER);

        Block block = new Block();
        block.setTitre(titre.trim());
        block.setDescription(description != null ? description : "");
        block.setImage(publicUrl);

        Block saved = blockRepository.save(block);
        return toDto(saved);
    }

    @Override
    public BlockDTO updateBlock(Long id, String titre, String description, MultipartFile imageFile) throws IOException {
        Block block = blockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Block not found"));

        if (StringUtils.hasText(titre)) {
            block.setTitre(titre.trim());
        }
        if (description != null) {
            block.setDescription(description);
        }

        if (imageFile != null && !imageFile.isEmpty()) {
            supabaseStorageService.deleteObjectByPublicUrlIfPresent(block.getImage());
            String publicUrl = supabaseStorageService.uploadPublicFile(imageFile, STORAGE_FOLDER);
            block.setImage(publicUrl);
        }

        Block saved = blockRepository.save(block);
        return toDto(saved);
    }

    @Override
    public void deleteBlock(Long id) {
        Block block = blockRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Block not found"));
        try {
            supabaseStorageService.deleteObjectByPublicUrlIfPresent(block.getImage());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image from storage", e);
        }
        blockRepository.delete(block);
    }

    private BlockDTO toDto(Block block) {
        String img = supabaseStorageService.toBrowserAccessibleImageUrl(block.getImage());
        return new BlockDTO(block.getId(), block.getTitre(), block.getDescription(), img);
    }
}
