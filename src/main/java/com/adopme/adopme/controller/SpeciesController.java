package com.adopme.adopme.controller;

import com.adopme.adopme.model.Species;
import com.adopme.adopme.service.SpeciesService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/species")
public class SpeciesController {
    private final SpeciesService speciesService;

    public SpeciesController(SpeciesService speciesService) {
        this.speciesService = speciesService;
    }

    @GetMapping
    public ResponseEntity<List<Species>> getAllSpecies() {
        return ResponseEntity.ok(speciesService.getAllSpecies());
    }

    @PostMapping
    public ResponseEntity<Species> createSpecies(@RequestBody Species species) {
        Species saved = speciesService.createSpecies(species);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Species> updateSpecies(@PathVariable Long id, @RequestBody Species species) {
        Species updated = speciesService.updateSpecies(id, species);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSpecies(@PathVariable Long id) {
        speciesService.deleteSpecies(id);
        return ResponseEntity.noContent().build();
    }
}
