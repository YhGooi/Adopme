package com.adopme.adopme.repository.spec;

import com.adopme.adopme.model.PetListing;
import org.springframework.data.jpa.domain.Specification;

public class PetListingSpecifications {
    public static Specification<PetListing> hasSpecies(String speciesName) {
        return (root, query, cb) -> cb.equal(root.get("species").get("name"), speciesName);
    }
    public static Specification<PetListing> hasBreed(String breedName) {
        return (root, query, cb) -> cb.equal(root.get("breed").get("name"), breedName);
    }
    public static Specification<PetListing> hasStatus(String status) {
        return (root, query, cb) -> cb.equal(root.get("status"), status);
    }
    // Add more filters as needed
}
