package backend.admin.services;

import backend.admin.dto.BlockDTO;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

public interface BlockService {

    List<BlockDTO> getAllBlocks();

    BlockDTO createBlock(String titre, String description, MultipartFile imageFile) throws IOException;

    BlockDTO updateBlock(Long id, String titre, String description, MultipartFile imageFile) throws IOException;

    void deleteBlock(Long id);
}
