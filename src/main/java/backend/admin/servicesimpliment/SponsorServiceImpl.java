package backend.admin.servicesimpliment;

import backend.admin.dto.SponsorDTO;
import backend.admin.models.Sponsor;
import backend.admin.repository.SponsorRepository;
import backend.admin.services.SponsorService;
import backend.admin.services.SupabaseStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class SponsorServiceImpl implements SponsorService {

    private final SponsorRepository sponsorRepository;
    private final SupabaseStorageService supabaseStorageService;

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
        Sponsor sponsor = sponsorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Sponsor not found"));
        try {
            supabaseStorageService.deleteObjectByPublicUrlIfPresent(sponsor.getImage());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete file from storage", e);
        }
        sponsorRepository.delete(sponsor);
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
        String image = supabaseStorageService.toBrowserAccessibleImageUrl(sponsor.getImage());
        return new SponsorDTO(sponsor.getId(), image);
    }
}