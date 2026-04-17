package backend.admin.controller;

import backend.admin.dto.ContactDTO;
import backend.admin.dto.InformationDTO;
import backend.admin.dto.OfficeDTO;
import backend.admin.dto.SponsorDTO;
import backend.admin.services.InformationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.Valid;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/informations")
@RequiredArgsConstructor
public class InformationController {

    private final InformationService informationService;

    @PostMapping
    public ResponseEntity<InformationDTO> createInformation(@Valid @RequestBody InformationDTO informationDTO) {
        InformationDTO created = informationService.createInformation(informationDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<InformationDTO> updateInformation(@PathVariable Long id, @Valid @RequestBody InformationDTO informationDTO) {
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
    public ResponseEntity<InformationDTO> addOffice(@PathVariable Long infoId, @Valid @RequestBody OfficeDTO officeDTO) {
        InformationDTO updated = informationService.addOfficeToInformation(infoId, officeDTO);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{infoId}/sponsors")
    public ResponseEntity<InformationDTO> addSponsor(@PathVariable Long infoId, @Valid @RequestBody SponsorDTO sponsorDTO) {
        InformationDTO updated = informationService.addSponsorToInformation(infoId, sponsorDTO);
        return ResponseEntity.ok(updated);
    }

    /**
     * Uploads the image to Supabase Storage and attaches the public URL to a new sponsor.
     */
    @PostMapping(value = "/{infoId}/sponsors/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<InformationDTO> addSponsorWithUpload(
            @PathVariable Long infoId,
            @RequestPart("file") MultipartFile file) throws IOException {
        InformationDTO updated = informationService.addSponsorImageToInformation(infoId, file);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{infoId}/contacts")
    public ResponseEntity<InformationDTO> addContact(@PathVariable Long infoId, @Valid @RequestBody ContactDTO contactDTO) {
        InformationDTO updated = informationService.addContactToInformation(infoId, contactDTO);
        return ResponseEntity.ok(updated);
    }
}