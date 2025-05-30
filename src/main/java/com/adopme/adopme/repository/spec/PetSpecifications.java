package com.adopme.adopme.repository.spec;

import com.adopme.adopme.model.Breed;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.PetStatus;
import com.adopme.adopme.model.Species;

import org.springframework.data.jpa.domain.Specification;

public class PetSpecifications {
    public static Specification<Pet> hasSpecies(String speciesName) {
        return (root, query, cb) -> cb.equal(root.get("species"), Species.valueOf(speciesName));
    }

    public static Specification<Pet> hasBreed(String breedName) {
        return (root, query, cb) -> cb.equal(root.get("breed"), Breed.valueOf(breedName));
    }

    public static Specification<Pet> hasStatus(String status) {
        return (root, query, cb) -> cb.equal(root.get("status"), PetStatus.valueOf(status));
    }
    // Add more filters as needed
}
