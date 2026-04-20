package backend.admin.services;

import backend.admin.dto.WhyChooseUsDTO;
import java.util.List;
import java.util.Optional;

public interface WhyChooseUsService {
    WhyChooseUsDTO createWhyChooseUs(WhyChooseUsDTO dto);
    WhyChooseUsDTO updateWhyChooseUs(Long id, WhyChooseUsDTO dto);
    void deleteWhyChooseUs(Long id);
    Optional<WhyChooseUsDTO> getWhyChooseUsById(Long id);
    List<WhyChooseUsDTO> getAllWhyChooseUs();
}
