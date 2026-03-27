package backend.admin.services;

import backend.admin.dto.ContactDTO;
import backend.admin.dto.InformationDTO;
import backend.admin.dto.OfficeDTO;
import backend.admin.dto.SponsorDTO;

import java.util.List;
import java.util.Optional;

public interface InformationService {
    InformationDTO createInformation(InformationDTO informationDTO);
    InformationDTO updateInformation(Long id, InformationDTO informationDTO);
    void deleteInformation(Long id);
    Optional<InformationDTO> getInformationById(Long id);
    List<InformationDTO> getAllInformations();
    InformationDTO addOfficeToInformation(Long infoId, OfficeDTO officeDTO);
    InformationDTO addSponsorToInformation(Long infoId, SponsorDTO sponsorDTO);
    InformationDTO addContactToInformation(Long infoId, ContactDTO contactDTO);
}