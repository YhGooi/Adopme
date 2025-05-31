package com.adopme.adopme.service;

import com.adopme.adopme.dto.pet.PetResponse;
import com.adopme.adopme.dto.pet.PetResponseMapper;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.PetStatus;
import com.adopme.adopme.repository.PetRepository;
import com.adopme.adopme.repository.spec.PetSpecifications;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PetService {
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<PetResponse> getAllPets() {
        List<Pet> pets = petRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return pets.stream().map(PetResponseMapper.INSTANCE::toPetResponse).toList();
    }

    public List<PetResponse> getActivePets() {
        Specification<Pet> spec = PetSpecifications.hasStatus(PetStatus.ACTIVE.name());
        List<Pet> pets = petRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));
        return pets.stream().map(PetResponseMapper.INSTANCE::toPetResponse).toList();
    }

    public PetResponse createPet(Pet pet) {
        Pet saved = petRepository.save(pet);
        return PetResponseMapper.INSTANCE.toPetResponse(saved);
    }

    public PetResponse updatePet(Long id, Pet pet) {
        Pet existing = petRepository.findById(id).orElseThrow();
        existing.setName(pet.getName());
        existing.setDob(pet.getDob());
        existing.setGender(pet.getGender());
        existing.setSpecies(pet.getSpecies());
        existing.setBreed(pet.getBreed());
        existing.setWeight(pet.getWeight());
        existing.setVaccinated(pet.getVaccinated());
        existing.setDescription(pet.getDescription());
        existing.setPetImageUrl(pet.getPetImageUrl());
        existing.setStatus(pet.getStatus());
        Pet updated = petRepository.save(existing);
        return PetResponseMapper.INSTANCE.toPetResponse(updated);
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }
}
