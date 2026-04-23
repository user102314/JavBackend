package backend.admin.controller;

import backend.admin.dto.BlockNewsDTO;
import backend.admin.services.BlockNewsService;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/block-news")
@RequiredArgsConstructor
public class BlockNewsController {

    private final BlockNewsService blockNewsService;

    // ------------------------------------------------------------------ //
    //  GET ALL   –  GET /block-news                                        //
    // ------------------------------------------------------------------ //

    @GetMapping
    public ResponseEntity<List<BlockNewsDTO>> getAllBlockNews() {
        return ResponseEntity.ok(blockNewsService.getAllBlockNews());
    }

    // ------------------------------------------------------------------ //
    //  GET LAST  –  GET /block-news/last                                   //
    // ------------------------------------------------------------------ //

    @GetMapping("/last")
    public ResponseEntity<BlockNewsDTO> getLastBlockNews() {
        return ResponseEntity.ok(blockNewsService.getLastBlockNews());
    }

    // ------------------------------------------------------------------ //
    //  CREATE    –  POST /block-news                                       //
    //  Content-Type: multipart/form-data                                   //
    //  Params   : titre (required), description, pays (optional),          //
    //             date (required, format yyyy-MM-dd), file (required)      //
    // ------------------------------------------------------------------ //

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlockNewsDTO> createBlockNews(
            @RequestParam("titre") String titre,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "pays", required = false) String pays,
            @RequestParam("date") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestPart("file") MultipartFile file) throws IOException {

        BlockNewsDTO created = blockNewsService.createBlockNews(titre, description, pays, date, file);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // ------------------------------------------------------------------ //
    //  UPDATE    –  PUT /block-news/{id}                                   //
    //  Content-Type: multipart/form-data                                   //
    //  Tous les champs sont optionnels sauf l'id                           //
    // ------------------------------------------------------------------ //

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlockNewsDTO> updateBlockNews(
            @PathVariable Long id,
            @RequestParam(value = "titre", required = false) String titre,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam(value = "pays", required = false) String pays,
            @RequestParam(value = "date", required = false)
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date,
            @RequestPart(value = "file", required = false) MultipartFile file) throws IOException {

        BlockNewsDTO updated = blockNewsService.updateBlockNews(id, titre, description, pays, date, file);
        return ResponseEntity.ok(updated);
    }

    // ------------------------------------------------------------------ //
    //  DELETE    –  DELETE /block-news/{id}                                //
    // ------------------------------------------------------------------ //

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBlockNews(@PathVariable Long id) {
        blockNewsService.deleteBlockNews(id);
        return ResponseEntity.noContent().build();
    }
}
