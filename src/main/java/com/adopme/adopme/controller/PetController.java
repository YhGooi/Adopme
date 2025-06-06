package com.adopme.adopme.controller;

import com.adopme.adopme.dto.pet.PetResponse;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.service.PetService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/pet")
public class PetController {
    private final PetService petService;

    public PetController(PetService petService) {
        this.petService = petService;
    }

    @GetMapping
    public ResponseEntity<List<PetResponse>> getAllPets() {
        List<PetResponse> pets = petService.getAllPets();
        return ResponseEntity.ok(pets);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PetResponse>> getActivePets() {
        List<PetResponse> pets = petService.getActivePets();
        return ResponseEntity.ok(pets);
    }

    @PostMapping
    public ResponseEntity<PetResponse> createPet(@RequestBody Pet pet) {
        PetResponse saved = petService.createPet(pet);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetResponse> updatePet(@PathVariable Long id, @RequestBody Pet pet) {
        PetResponse updated = petService.updatePet(id, pet);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
}
