package com.adopme.adopme.controller;

import com.adopme.adopme.dto.pet.PetListingResponse;
import com.adopme.adopme.model.PetListing;
import com.adopme.adopme.service.PetListingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/pet-listings")
public class PetListingController {
    private final PetListingService petListingService;

    public PetListingController(PetListingService petListingService) {
        this.petListingService = petListingService;
    }

    @GetMapping
    public ResponseEntity<List<PetListingResponse>> getAllPetListings() {
        List<PetListingResponse> listings = petListingService.getAllPetListings();
        return ResponseEntity.ok(listings);
    }

    @GetMapping("/active")
    public ResponseEntity<List<PetListingResponse>> getActivePetListings() {
        List<PetListingResponse> listings = petListingService.getActivePetListings();
        return ResponseEntity.ok(listings);
    }

    @PostMapping
    public ResponseEntity<PetListingResponse> createPet(@RequestBody PetListing petListing) {
        PetListingResponse saved = petListingService.createPet(petListing);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PetListingResponse> updatePet(@PathVariable Long id, @RequestBody PetListing petListing) {
        PetListingResponse updated = petListingService.updatePet(id, petListing);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePet(@PathVariable Long id) {
        petListingService.deletePet(id);
        return ResponseEntity.noContent().build();
    }
}
