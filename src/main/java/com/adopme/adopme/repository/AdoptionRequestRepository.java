package com.adopme.adopme.repository;

import com.adopme.adopme.model.AdoptionRequest;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdoptionRequestRepository
        extends JpaRepository<AdoptionRequest, Long>, JpaSpecificationExecutor<AdoptionRequest> {

    List<AdoptionRequest> findByUserIdOrderBySubmissionDateDesc(Long userId);
}
