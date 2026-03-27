package backend.admin.services;

import backend.admin.dto.OfficeDTO;
import java.util.List;
import java.util.Optional;

public interface OfficeService {
    OfficeDTO createOffice(OfficeDTO officeDTO);
    OfficeDTO updateOffice(Long id, OfficeDTO officeDTO);
    void deleteOffice(Long id);
    Optional<OfficeDTO> getOfficeById(Long id);
    List<OfficeDTO> getAllOffices();
    List<OfficeDTO> getOfficesByInformationId(Long infoId);
}