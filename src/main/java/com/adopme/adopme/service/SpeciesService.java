package com.adopme.adopme.service;

import com.adopme.adopme.model.Species;
import com.adopme.adopme.repository.SpeciesRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SpeciesService {
    private final SpeciesRepository speciesRepository;

    public SpeciesService(SpeciesRepository speciesRepository) {
        this.speciesRepository = speciesRepository;
    }

    public List<Species> getAllSpecies() {
        return speciesRepository.findAll();
    }

    public Species createSpecies(Species species) {
        return speciesRepository.save(species);
    }

    public Species updateSpecies(Long id, Species species) {
        Species existing = speciesRepository.findById(id).orElseThrow();
        existing.setName(species.getName());
        return speciesRepository.save(existing);
    }

    public void deleteSpecies(Long id) {
        speciesRepository.deleteById(id);
    }
}
