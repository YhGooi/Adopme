package com.adopme.adopme.repository;

import com.adopme.adopme.model.PetListing;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface PetListingRepository extends JpaRepository<PetListing, Long>, JpaSpecificationExecutor<PetListing> {
}
