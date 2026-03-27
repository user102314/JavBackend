package backend.admin.controllers;

import backend.admin.dto.ContactDTO;
import backend.admin.dto.InformationDTO;
import backend.admin.dto.OfficeDTO;
import backend.admin.dto.SponsorDTO;
import backend.admin.services.InformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/informations")
@RequiredArgsConstructor
public class InformationController {

    private final InformationService informationService;

    @PostMapping
    public ResponseEntity<InformationDTO> createInformation(@RequestBody InformationDTO informationDTO) {
        InformationDTO created = informationService.createInformation(informationDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InformationDTO> updateInformation(@PathVariable Long id, @RequestBody InformationDTO informationDTO) {
        InformationDTO updated = informationService.updateInformation(id, informationDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteInformation(@PathVariable Long id) {
        informationService.deleteInformation(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<InformationDTO> getInformationById(@PathVariable Long id) {
        return informationService.getInformationById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<InformationDTO>> getAllInformations() {
        List<InformationDTO> informations = informationService.getAllInformations();
        return ResponseEntity.ok(informations);
    }

    @PostMapping("/{infoId}/offices")
    public ResponseEntity<InformationDTO> addOffice(@PathVariable Long infoId, @RequestBody OfficeDTO officeDTO) {
        InformationDTO updated = informationService.addOfficeToInformation(infoId, officeDTO);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{infoId}/sponsors")
    public ResponseEntity<InformationDTO> addSponsor(@PathVariable Long infoId, @RequestBody SponsorDTO sponsorDTO) {
        InformationDTO updated = informationService.addSponsorToInformation(infoId, sponsorDTO);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{infoId}/contacts")
    public ResponseEntity<InformationDTO> addContact(@PathVariable Long infoId, @RequestBody ContactDTO contactDTO) {
        InformationDTO updated = informationService.addContactToInformation(infoId, contactDTO);
        return ResponseEntity.ok(updated);
    }
}