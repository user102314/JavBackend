package backend.admin.controller;

import backend.admin.dto.WhyChooseUsDTO;
import backend.admin.services.WhyChooseUsService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/why-choose-us")
@RequiredArgsConstructor
public class WhyChooseUsController {

    private final WhyChooseUsService whyChooseUsService;

    @GetMapping
    public ResponseEntity<List<WhyChooseUsDTO>> getAllWhyChooseUs() {
        List<WhyChooseUsDTO> list = whyChooseUsService.getAllWhyChooseUs();
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WhyChooseUsDTO> getWhyChooseUsById(@PathVariable Long id) {
        return whyChooseUsService.getWhyChooseUsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<WhyChooseUsDTO> createWhyChooseUs(@Valid @RequestBody WhyChooseUsDTO dto) {
        WhyChooseUsDTO created = whyChooseUsService.createWhyChooseUs(dto);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<WhyChooseUsDTO> updateWhyChooseUs(@PathVariable Long id, @Valid @RequestBody WhyChooseUsDTO dto) {
        WhyChooseUsDTO updated = whyChooseUsService.updateWhyChooseUs(id, dto);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWhyChooseUs(@PathVariable Long id) {
        whyChooseUsService.deleteWhyChooseUs(id);
        return ResponseEntity.noContent().build();
    }
}
