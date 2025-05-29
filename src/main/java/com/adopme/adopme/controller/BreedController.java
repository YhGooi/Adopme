package com.adopme.adopme.controller;

import com.adopme.adopme.model.Breed;
import com.adopme.adopme.service.BreedService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/breeds")
public class BreedController {
    private final BreedService breedService;

    public BreedController(BreedService breedService) {
        this.breedService = breedService;
    }

    @GetMapping
    public ResponseEntity<List<Breed>> getAllBreeds() {
        return ResponseEntity.ok(breedService.getAllBreeds());
    }

    @GetMapping("/by-species/{speciesId}")
    public ResponseEntity<List<Breed>> getBreedsBySpecies(@PathVariable Long speciesId) {
        List<Breed> breeds = breedService.getBreedsBySpecies(speciesId);
        return ResponseEntity.ok(breeds);
    }

    @PostMapping
    public ResponseEntity<Breed> createBreed(@RequestBody Breed breed) {
        Breed saved = breedService.createBreed(breed);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Breed> updateBreed(@PathVariable Long id, @RequestBody Breed breed) {
        Breed updated = breedService.updateBreed(id, breed);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteBreed(@PathVariable Long id) {
        breedService.deleteBreed(id);
        return ResponseEntity.noContent().build();
    }
}
