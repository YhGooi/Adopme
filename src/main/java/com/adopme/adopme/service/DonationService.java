package com.adopme.adopme.service;

import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.dto.donation.DonationResponseMapper;
import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.repository.DonationRepository;
import com.adopme.adopme.repository.spec.DonationSpecifications;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
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

    public List<DonationResponse> getAllDonations(
            DonationStatus status, String startDate, String endDate) {
        LocalDateTime start = LocalDateTime.parse(startDate);
        LocalDateTime end = LocalDateTime.parse(endDate);

        Specification<Donation> spec = DonationSpecifications.withFilters(status, start, end);

        Sort sort = Sort.by(Sort.Direction.DESC, "donationDate");
        List<Donation> donations = donationRepository.findAll(spec, sort);

        return donations.stream().map(DonationResponseMapper.INSTANCE::toDonationResponse).toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public DonationResponse updateDonationStatus(Long userId, DonationStatus status) {
        Donation donation =
                donationRepository
                        .findById(userId)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Donation not found with id: " + userId));

        // Validate the new status (only SUCCESS or UNSUCCESS are allowed)
        if (status != DonationStatus.SUCCESS && status != DonationStatus.UNSUCCESS) {
            throw new IllegalArgumentException(
                    "Status can only be updated to SUCCESS or UNSUCCESS");
        }

        donation.setStatus(status);
        Donation updatedDonation = donationRepository.save(donation);

        return DonationResponseMapper.INSTANCE.toDonationResponse(updatedDonation);
    }

    @Transactional(rollbackFor = IOException.class)
    public DonationResponse createDonation(Long userId, BigDecimal amount, MultipartFile receipt)
            throws IOException {

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Donation amount is RM0.");
        }
        if (receipt.isEmpty()) {
            throw new IllegalArgumentException("Receipt must be uploaded.");
        }

        Donation donation =
                Donation.builder()
                        .userId(userId)
                        .amount(amount)
                        .donationDate(LocalDateTime.now())
                        .status(DonationStatus.PROCESSING)
                        .build();

        Donation savedDonation = donationRepository.save(donation);
        return DonationResponseMapper.INSTANCE.toDonationResponse(savedDonation);
    }
}
