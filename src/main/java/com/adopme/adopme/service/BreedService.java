package com.adopme.adopme.service;

import com.adopme.adopme.model.Breed;
import com.adopme.adopme.repository.BreedRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class BreedService {
    private final BreedRepository breedRepository;

    public BreedService(BreedRepository breedRepository) {
        this.breedRepository = breedRepository;
    }

    public List<Breed> getAllBreeds() {
        return breedRepository.findAll();
    }

    public List<Breed> getBreedsBySpecies(Long speciesId) {
        return breedRepository.findAll().stream()
                .filter(breed -> breed.getSpecies().getId().equals(speciesId))
                .toList();
    }

    public Breed createBreed(Breed breed) {
        return breedRepository.save(breed);
    }

    public Breed updateBreed(Long id, Breed breed) {
        Breed existing = breedRepository.findById(id).orElseThrow();
        existing.setName(breed.getName());
        existing.setSpecies(breed.getSpecies());
        return breedRepository.save(existing);
    }

    public void deleteBreed(Long id) {
        breedRepository.deleteById(id);
    }
}
