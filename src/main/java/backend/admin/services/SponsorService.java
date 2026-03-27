package backend.admin.services;

import backend.admin.dto.SponsorDTO;
import java.util.List;
import java.util.Optional;

public interface SponsorService {
    SponsorDTO createSponsor(SponsorDTO sponsorDTO);
    SponsorDTO updateSponsor(Long id, SponsorDTO sponsorDTO);
    void deleteSponsor(Long id);
    Optional<SponsorDTO> getSponsorById(Long id);
    List<SponsorDTO> getAllSponsors();
    List<SponsorDTO> getSponsorsByInformationId(Long infoId);
}