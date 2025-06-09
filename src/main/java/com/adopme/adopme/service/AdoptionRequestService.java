package com.adopme.adopme.service;

import com.adopme.adopme.dto.adoption.AdoptionRequestAdminResponse;
import com.adopme.adopme.dto.adoption.AdoptionRequestResponseMapper;
import com.adopme.adopme.dto.adoption.AdoptionRequestUserResponse;
import com.adopme.adopme.model.AdoptionRequest;
import com.adopme.adopme.model.AdoptionRequestStatus;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.User;
import com.adopme.adopme.repository.AdoptionRequestRepository;
import com.adopme.adopme.repository.PetRepository;
import com.adopme.adopme.repository.UserRepository;
import com.adopme.adopme.repository.spec.AdoptionRequestSpecifications;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class AdoptionRequestService {

    private final AdoptionRequestRepository adoptionRequestRepository;
    private final PetRepository petRepository;
    private final UserRepository userRepository;

    @Autowired
    public AdoptionRequestService(
            AdoptionRequestRepository adoptionRequestRepository,
            PetRepository petRepository,
            UserRepository userRepository) {
        this.adoptionRequestRepository = adoptionRequestRepository;
        this.petRepository = petRepository;
        this.userRepository = userRepository;
    }

    public List<AdoptionRequestUserResponse> getAdoptionRequestsByUserId(Long userId) {
        List<AdoptionRequest> adoptionRequests =
                adoptionRequestRepository.findByUserIdOrderBySubmissionDateDesc(userId);
        return adoptionRequests.stream()
                .map(
                        req -> {
                            Pet pet = petRepository.findById(req.getPetId()).get();
                            return AdoptionRequestResponseMapper.INSTANCE
                                    .toAdoptionRequestUserResponse(req, pet);
                        })
                .toList();
    }

    public List<AdoptionRequestAdminResponse> getAllAdoptionRequests(
            AdoptionRequestStatus status, String startDate, String endDate) {

        LocalDateTime start =
                LocalDateTime.ofInstant(Instant.parse(startDate), ZoneId.systemDefault());
        LocalDateTime end = LocalDateTime.ofInstant(Instant.parse(endDate), ZoneId.systemDefault());

        Specification<AdoptionRequest> spec =
                AdoptionRequestSpecifications.withFilters(status, start, end);

        Sort sort = Sort.by(Sort.Direction.DESC, "submissionDate");
        List<AdoptionRequest> adoptionRequests = adoptionRequestRepository.findAll(spec, sort);

        return adoptionRequests.stream()
                .map(
                        req -> {
                            Pet pet = petRepository.findById(req.getPetId()).get();
                            User user = userRepository.findById(req.getUserId()).get();
                            return AdoptionRequestResponseMapper.INSTANCE
                                    .toAdoptionRequestAdminResponse(req, pet, user);
                        })
                .toList();
    }

    public AdoptionRequestAdminResponse getAdoptionRequestById(Long id) {
        return adoptionRequestRepository
                .findById(id)
                .map(
                        req -> {
                            Pet pet = petRepository.findById(req.getPetId()).orElse(null);
                            User user = userRepository.findById(req.getUserId()).orElse(null);
                            if (pet == null || user == null) return null;
                            return AdoptionRequestResponseMapper.INSTANCE
                                    .toAdoptionRequestAdminResponse(req, pet, user);
                        })
                .orElse(null);
    }

    public boolean updateAdoptionRequestStatus(Long id, String statusStr) {
        return adoptionRequestRepository
                .findById(id)
                .map(
                        request -> {
                            try {
                                AdoptionRequestStatus status =
                                        AdoptionRequestStatus.valueOf(statusStr);
                                request.setStatus(status);
                                adoptionRequestRepository.save(request);
                                return true;
                            } catch (IllegalArgumentException e) {
                                return false;
                            }
                        })
                .orElse(false);
    }

    public void createAdoptionRequest(Long userId, Long petId, String message) {
        // Validate pet exists
        petRepository
                .findById(petId)
                .orElseThrow(() -> new IllegalArgumentException("Pet not found"));

        // Validate user exists
        userRepository
                .findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));

        AdoptionRequest newRequest =
                AdoptionRequest.builder()
                        .userId(userId)
                        .petId(petId)
                        .status(AdoptionRequestStatus.SUBMITTED)
                        .message(message)
                        .remarks("") // optional
                        .submissionDate(LocalDateTime.now())
                        .build();

        adoptionRequestRepository.save(newRequest);
    }

    public List<Long> getPetIdsWithSubmittedRequest(Long userId) {
        List<AdoptionRequest> requests =
                adoptionRequestRepository.findByUserIdOrderBySubmissionDateDesc(userId);
        return requests.stream().map(AdoptionRequest::getPetId).distinct().toList();
    }
}
