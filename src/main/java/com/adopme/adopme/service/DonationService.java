package com.adopme.adopme.service;

import com.adopme.adopme.dto.donation.DonationAdminResponse;
import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.dto.donation.DonationResponseMapper;
import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.model.User;
import com.adopme.adopme.repository.DonationRepository;
import com.adopme.adopme.repository.UserRepository;
import com.adopme.adopme.repository.spec.DonationSpecifications;

import jakarta.persistence.EntityNotFoundException;

import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;

@Service
public class DonationService {

    private final DonationRepository donationRepository;
    private final UserRepository userRepository;

    public DonationService(DonationRepository donationRepository, UserRepository userRepository) {
        this.donationRepository = donationRepository;
        this.userRepository = userRepository;
    }

    public List<DonationResponse> getDonationsByUserId(Long userId) {
        List<Donation> donations = donationRepository.findByUserIdOrderByDonationDateDesc(userId);
        return donations.stream().map(DonationResponseMapper.INSTANCE::toDonationResponse).toList();
    }

    public List<DonationAdminResponse> getAllDonations(
            DonationStatus status, String startDate, String endDate) {

        LocalDateTime start =
                startDate != null
                        ? LocalDateTime.ofInstant(Instant.parse(startDate), ZoneId.systemDefault())
                        : LocalDateTime.now().minusYears(1);

        LocalDateTime end =
                endDate != null
                        ? LocalDateTime.ofInstant(Instant.parse(endDate), ZoneId.systemDefault())
                        : LocalDateTime.now();

        Specification<Donation> spec = DonationSpecifications.withFilters(status, start, end);

        Sort sort = Sort.by(Sort.Direction.DESC, "donationDate");
        List<Donation> donations = donationRepository.findAll(spec, sort);

        return donations.stream()
                .map(
                        req -> {
                            User user = userRepository.findById(req.getUserId()).get();
                            return DonationResponseMapper.INSTANCE.toDonationAdminResponse(
                                    req, user);
                        })
                .toList();
    }

    @Transactional(rollbackFor = Exception.class)
    public void updateDonationStatus(Long donationId, DonationStatus status) {
        Donation donation =
                donationRepository
                        .findById(donationId)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Donation not found with id: " + donationId));

        // Validate the new status (only SUCCESS or UNSUCCESS are allowed)
        if (status != DonationStatus.SUCCESS && status != DonationStatus.UNSUCCESS) {
            throw new IllegalArgumentException(
                    "Status can only be updated to SUCCESS or UNSUCCESS");
        }

        donation.setStatus(status);
        donationRepository.save(donation);
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
                        .receipt(receipt.getBytes())
                        .build();

        Donation savedDonation = donationRepository.save(donation);
        return DonationResponseMapper.INSTANCE.toDonationResponse(savedDonation);
    }

    public byte[] getReceipt(Long donationId) {
        Donation donation =
                donationRepository
                        .findById(donationId)
                        .orElseThrow(
                                () ->
                                        new EntityNotFoundException(
                                                "Donation not found with id: " + donationId));

        if (donation.getReceipt() == null || donation.getReceipt().length == 0) {
            throw new EntityNotFoundException("Receipt not found for donation id: " + donationId);
        }

        return donation.getReceipt();
    }
}
