package com.adopme.adopme.controller;

import com.adopme.adopme.dto.pet.PetResponse;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.PetStatus;
import com.adopme.adopme.service.PetService;

import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Arrays;
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

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PetResponse> createPet(
            @RequestPart("pet") Pet pet,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        PetResponse saved = petService.createPetWithImage(pet, image);
        return ResponseEntity.ok(saved);
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<PetResponse> updatePet(
            @PathVariable Long id,
            @RequestPart("pet") Pet pet,
            @RequestPart(value = "image", required = false) MultipartFile image) {
        PetResponse updated = petService.updatePetWithImage(id, pet, image);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petService.deletePet(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{id}")
    public ResponseEntity<PetResponse> getPetById(@PathVariable Long id) {
        PetResponse pet = petService.getPetById(id);
        return ResponseEntity.ok(pet);
    }

    @GetMapping("/status")
    public ResponseEntity<List<String>> getPetStatusEnum() {
        return ResponseEntity.ok(Arrays.stream(PetStatus.values()).map(Enum::name).toList());
    }
}
