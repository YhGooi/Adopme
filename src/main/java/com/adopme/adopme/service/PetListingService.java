package com.adopme.adopme.service;

import com.adopme.adopme.dto.pet.PetListingResponse;
import com.adopme.adopme.dto.pet.PetListingResponseMapper;
import com.adopme.adopme.model.PetListing;
import com.adopme.adopme.repository.PetListingRepository;
import com.adopme.adopme.repository.spec.PetListingSpecifications;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PetListingService {
    private final PetListingRepository petListingRepository;

    public PetListingService(PetListingRepository petListingRepository) {
        this.petListingRepository = petListingRepository;
    }

    public List<PetListingResponse> getAllPetListings() {
        List<PetListing> petListings = petListingRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return petListings.stream()
                .map(PetListingResponseMapper.INSTANCE::toPetListingResponse)
                .toList();
    }

    public List<PetListingResponse> getActivePetListings() {
        Specification<PetListing> spec = PetListingSpecifications.hasStatus("ACTIVE");
        List<PetListing> petListings = petListingRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));
        return petListings.stream()
                .map(PetListingResponseMapper.INSTANCE::toPetListingResponse)
                .toList();
    }

    public PetListingResponse createPet(PetListing petListing) {
        PetListing saved = petListingRepository.save(petListing);
        return PetListingResponseMapper.INSTANCE.toPetListingResponse(saved);
    }

    public PetListingResponse updatePet(Long id, PetListing petListing) {
        PetListing existing = petListingRepository.findById(id).orElseThrow();
        existing.setName(petListing.getName());
        existing.setDob(petListing.getDob());
        existing.setGender(petListing.getGender());
        existing.setSpecies(petListing.getSpecies());
        existing.setBreed(petListing.getBreed());
        existing.setWeight(petListing.getWeight());
        existing.setVaccinated(petListing.getVaccinated());
        existing.setDescription(petListing.getDescription());
        existing.setPetImageUrl(petListing.getPetImageUrl());
        existing.setStatus(petListing.getStatus());
        PetListing updated = petListingRepository.save(existing);
        return PetListingResponseMapper.INSTANCE.toPetListingResponse(updated);
    }

    public void deletePet(Long id) {
        petListingRepository.deleteById(id);
    }
}
