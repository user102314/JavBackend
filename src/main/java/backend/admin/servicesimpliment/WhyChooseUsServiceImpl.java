package backend.admin.servicesimpliment;

import backend.admin.dto.WhyChooseUsDTO;
import backend.admin.models.WhyChooseUs;
import backend.admin.repository.WhyChooseUsRepository;
import backend.admin.services.WhyChooseUsService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class WhyChooseUsServiceImpl implements WhyChooseUsService {

    private final WhyChooseUsRepository whyChooseUsRepository;

    @Override
    public WhyChooseUsDTO createWhyChooseUs(WhyChooseUsDTO dto) {
        WhyChooseUs entity = new WhyChooseUs();
        entity.setMovesCompleted(dto.getMovesCompleted());
        entity.setSecureStorageSpace(dto.getSecureStorageSpace());
        entity.setYearsOfExperience(dto.getYearsOfExperience());
        WhyChooseUs saved = whyChooseUsRepository.save(entity);
        return mapToDTO(saved);
    }

    @Override
    public WhyChooseUsDTO updateWhyChooseUs(Long id, WhyChooseUsDTO dto) {
        WhyChooseUs entity = whyChooseUsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("WhyChooseUs not found"));
        entity.setMovesCompleted(dto.getMovesCompleted());
        entity.setSecureStorageSpace(dto.getSecureStorageSpace());
        entity.setYearsOfExperience(dto.getYearsOfExperience());
        WhyChooseUs updated = whyChooseUsRepository.save(entity);
        return mapToDTO(updated);
    }

    @Override
    public void deleteWhyChooseUs(Long id) {
        whyChooseUsRepository.deleteById(id);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<WhyChooseUsDTO> getWhyChooseUsById(Long id) {
        return whyChooseUsRepository.findById(id)
                .map(this::mapToDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WhyChooseUsDTO> getAllWhyChooseUs() {
        return whyChooseUsRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private WhyChooseUsDTO mapToDTO(WhyChooseUs entity) {
        return new WhyChooseUsDTO(
                entity.getId(),
                entity.getMovesCompleted(),
                entity.getSecureStorageSpace(),
                entity.getYearsOfExperience()
        );
    }
}
