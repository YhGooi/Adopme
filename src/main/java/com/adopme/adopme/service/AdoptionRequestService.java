package com.adopme.adopme.service;

import com.adopme.adopme.dto.adoption.AdoptionRequestResponse;
import com.adopme.adopme.dto.adoption.AdoptionRequestResponseMapper;
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
import java.util.Optional;

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

    public List<AdoptionRequestResponse> getAdoptionRequestsByUserId(Long userId) {
        List<AdoptionRequest> adoptionRequests =
                adoptionRequestRepository.findByUserIdOrderBySubmissionDateDesc(userId);
        return adoptionRequests.stream()
                .map(AdoptionRequestResponseMapper.INSTANCE::toAdoptionRequestResponse)
                .toList();
    }

    public List<AdoptionRequestResponse> getAllAdoptionRequests(
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
                            Optional<Pet> petOpt = petRepository.findById(req.getPetId());
                            Optional<User> userOpt = userRepository.findById(req.getUserId());
                            String petName = petOpt.map(Pet::getName).orElse("");
                            String petBreed = petOpt.map(p -> p.getBreed().toString()).orElse("");
                            String userName = userOpt.map(User::getName).orElse("");
                            return new AdoptionRequestResponse(
                                    req.getId(),
                                    req.getPetId(),
                                    req.getUserId(),
                                    petName,
                                    petBreed,
                                    userName,
                                    req.getStatus(),
                                    req.getMessage(),
                                    req.getRemarks(),
                                    req.getSubmissionDate(),
                                    req.getCreatedAt(),
                                    req.getUpdatedAt());
                        })
                .toList();
    }
}
