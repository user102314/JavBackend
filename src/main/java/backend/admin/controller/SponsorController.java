package backend.admin.controller;

import backend.admin.dto.SponsorDTO;
import backend.admin.services.SponsorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sponsors")
@RequiredArgsConstructor
public class SponsorController {

    private final SponsorService sponsorService;

    @GetMapping
    public ResponseEntity<List<SponsorDTO>> getAllSponsors() {
        return ResponseEntity.ok(sponsorService.getAllSponsors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SponsorDTO> getSponsorById(@PathVariable Long id) {
        return sponsorService.getSponsorById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/information/{infoId}")
    public ResponseEntity<List<SponsorDTO>> getSponsorsByInformation(@PathVariable Long infoId) {
        return ResponseEntity.ok(sponsorService.getSponsorsByInformationId(infoId));
    }

    /**
     * Deletes the sponsor row and removes the file from Supabase Storage when the stored URL matches this project.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSponsor(@PathVariable Long id) {
        sponsorService.deleteSponsor(id);
        return ResponseEntity.noContent().build();
    }
}
