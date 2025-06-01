package com.adopme.adopme.service;

import com.adopme.adopme.dto.adoption.AdoptionRequestResponse;
import com.adopme.adopme.dto.adoption.AdoptionRequestResponseMapper;
import com.adopme.adopme.model.AdoptionRequest;
import com.adopme.adopme.model.AdoptionRequestStatus;
import com.adopme.adopme.repository.AdoptionRequestRepository;
import com.adopme.adopme.repository.spec.AdoptionRequestSpecifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AdoptionRequestService {

    private final AdoptionRequestRepository adoptionRequestRepository;

    @Autowired
    public AdoptionRequestService(AdoptionRequestRepository adoptionRequestRepository) {
        this.adoptionRequestRepository = adoptionRequestRepository;
    }

    public List<AdoptionRequestResponse> getAdoptionRequestsByUserId(Long userId) {
        List<AdoptionRequest> adoptionRequests =
                adoptionRequestRepository.findByUserIdOrderBySubmissionDateDesc(userId);
        return adoptionRequests.stream()
                .map(AdoptionRequestResponseMapper.INSTANCE::toAdoptionRequestResponse)
                .toList();
    }

    public List<AdoptionRequestResponse> getAllAdoptionRequests(
            AdoptionRequestStatus status, String startDate, String endDate) {

        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);

        Specification<AdoptionRequest> spec =
                AdoptionRequestSpecifications.withFilters(status, start, end);

        Sort sort = Sort.by(Sort.Direction.DESC, "submissionDate");
        List<AdoptionRequest> adoptionRequests = adoptionRequestRepository.findAll(spec, sort);

        return adoptionRequests.stream()
                .map(AdoptionRequestResponseMapper.INSTANCE::toAdoptionRequestResponse)
                .toList();
    }
}
