package backend.admin.serviceimpl;

import backend.admin.dto.OfficeDTO;
import backend.admin.models.Office;
import backend.admin.repository.OfficeRepository;
import backend.admin.services.OfficeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OfficeServiceImpl implements OfficeService {

    private final OfficeRepository officeRepository;

    @Override
    public OfficeDTO createOffice(OfficeDTO officeDTO) {
        Office office = new Office();
        office.setOfficeName(officeDTO.getOfficeName());
        Office savedOffice = officeRepository.save(office);
        return mapToDTO(savedOffice);
    }

    @Override
    public OfficeDTO updateOffice(Long id, OfficeDTO officeDTO) {
        Office office = officeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Office not found"));
        office.setOfficeName(officeDTO.getOfficeName());
        Office updatedOffice = officeRepository.save(office);
        return mapToDTO(updatedOffice);
    }

    @Override
    public void deleteOffice(Long id) {
        officeRepository.deleteById(id);
    }

    @Override
    public Optional<OfficeDTO> getOfficeById(Long id) {
        return officeRepository.findById(id)
                .map(this::mapToDTO);
    }

    @Override
    public List<OfficeDTO> getAllOffices() {
        return officeRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<OfficeDTO> getOfficesByInformationId(Long infoId) {
        return officeRepository.findByInformationId(infoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private OfficeDTO mapToDTO(Office office) {
        return new OfficeDTO(office.getId(), office.getOfficeName());
    }
}