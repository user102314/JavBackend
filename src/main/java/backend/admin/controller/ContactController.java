package backend.admin.controller;

import backend.admin.dto.ContactDTO;
import backend.admin.services.ContactService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/contacts")
@RequiredArgsConstructor
public class ContactController {

    private final ContactService contactService;

    @PostMapping
    public ResponseEntity<ContactDTO> createContact(@Valid @RequestBody ContactDTO contactDTO) {
        ContactDTO created = contactService.createContact(contactDTO);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ContactDTO> updateContact(@PathVariable Long id, @Valid @RequestBody ContactDTO contactDTO) {
        ContactDTO updated = contactService.updateContact(id, contactDTO);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteContact(@PathVariable Long id) {
        contactService.deleteContact(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ContactDTO> getContactById(@PathVariable Long id) {
        return contactService.getContactById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping
    public ResponseEntity<List<ContactDTO>> getAllContacts() {
        List<ContactDTO> contacts = contactService.getAllContacts();
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/information/{infoId}")
    public ResponseEntity<List<ContactDTO>> getContactsByInformationId(@PathVariable Long infoId) {
        List<ContactDTO> contacts = contactService.getContactsByInformationId(infoId);
        return ResponseEntity.ok(contacts);
    }

    @GetMapping("/date-range")
    public ResponseEntity<List<ContactDTO>> getContactsByDateRange(
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<ContactDTO> contacts = contactService.getContactsByDateRange(startDate, endDate);
        return ResponseEntity.ok(contacts);
    }
}