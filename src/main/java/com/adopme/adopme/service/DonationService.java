package com.adopme.adopme.service;

import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.dto.donation.DonationUpdateRequest;
import com.adopme.adopme.dto.mapper.DonationResponseMapper;
import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.repository.DonationRepository;
import com.adopme.adopme.repository.spec.DonationSpecifications;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;

    public DonationService(DonationRepository donationRepository) {
        this.donationRepository = donationRepository;
    }

    public List<DonationResponse> getDonationsByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUserIdOrderByDonationDateDesc(userId);
        return donations.stream().map(DonationResponseMapper.INSTANCE::toDonationResponse).toList();
    }

    public List<DonationResponse> getAllDonationsWithFilters(
            DonationStatus status, String startDate, String endDate) {
        // Convert String to LocalDateTime
        LocalDateTime start = startDate != null ? LocalDateTime.parse(startDate) : null;
        LocalDateTime end = endDate != null ? LocalDateTime.parse(endDate) : null;

        // Create specification using the utility class
        Specification<Donation> spec = DonationSpecifications.withFilters(status, start, end);

        // Use specification with sorting
        Sort sort = Sort.by(Sort.Direction.DESC, "donationDate");
        List<Donation> donations = donationRepository.findAll(spec, sort);

        return donations.stream().map(DonationResponseMapper.INSTANCE::toDonationResponse).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public DonationResponse updateDonationStatus(DonationUpdateRequest updateRequest) {
        Donation donation =
                donationRepository
                        .findById(updateRequest.id())
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Donation not found with id: "
                                                        + updateRequest.id()));

        // Validate the new status (only SUCCESS or UNSUCCESS are allowed)
        if (updateRequest.status() != DonationStatus.SUCCESS
                && updateRequest.status() != DonationStatus.UNSUCCESS) {
            throw new IllegalArgumentException(
                    "Status can only be updated to SUCCESS or UNSUCCESS");
        }

        donation.setStatus(updateRequest.status());
        Donation updatedDonation = donationRepository.save(donation);

        return DonationResponseMapper.INSTANCE.toDonationResponse(updatedDonation);
    }
}
