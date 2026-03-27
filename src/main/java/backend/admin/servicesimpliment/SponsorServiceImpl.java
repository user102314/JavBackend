package backend.admin.serviceimpl;

import backend.admin.dto.SponsorDTO;
import backend.admin.models.Sponsor;
import backend.admin.repository.SponsorRepository;
import backend.admin.services.SponsorService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SponsorServiceImpl implements SponsorService {

    private final SponsorRepository sponsorRepository;

    @Override
    public SponsorDTO createSponsor(SponsorDTO sponsorDTO) {
        Sponsor sponsor = new Sponsor();
        sponsor.setImage(sponsorDTO.getImage());
        Sponsor savedSponsor = sponsorRepository.save(sponsor);
        return mapToDTO(savedSponsor);
    }

    @Override
    public SponsorDTO updateSponsor(Long id, SponsorDTO sponsorDTO) {
        Sponsor sponsor = sponsorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sponsor not found"));
        sponsor.setImage(sponsorDTO.getImage());
        Sponsor updatedSponsor = sponsorRepository.save(sponsor);
        return mapToDTO(updatedSponsor);
    }

    @Override
    public void deleteSponsor(Long id) {
        sponsorRepository.deleteById(id);
    }

    @Override
    public Optional<SponsorDTO> getSponsorById(Long id) {
        return sponsorRepository.findById(id)
                .map(this::mapToDTO);
    }

    @Override
    public List<SponsorDTO> getAllSponsors() {
        return sponsorRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public List<SponsorDTO> getSponsorsByInformationId(Long infoId) {
        return sponsorRepository.findByInformationId(infoId).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private SponsorDTO mapToDTO(Sponsor sponsor) {
        return new SponsorDTO(sponsor.getId(), sponsor.getImage());
    }
}