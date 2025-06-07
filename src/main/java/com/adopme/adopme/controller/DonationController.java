package com.adopme.adopme.controller;

import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.dto.donation.DonationResponseMapper;
import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.service.DonationService;
import com.adopme.adopme.repository.DonationRepository;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.multipart.MultipartFile;


import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/donation")
public class DonationController {

    private final DonationService donationService;

    public DonationController(DonationService donationService) {
        this.donationService = donationService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<DonationResponse>> getDonationsByUserId(
            @RequestHeader("userId") Long userId) {
        List<DonationResponse> donations = donationService.getDonationsByUserId(userId);
        return ResponseEntity.ok(donations);
    }

    @GetMapping
    public ResponseEntity<List<DonationResponse>> getAllDonations(
            @RequestParam(required = false) DonationStatus status,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<DonationResponse> donations =
                donationService.getAllDonations(status, startDate, endDate);
        return ResponseEntity.ok(donations);
    }

    @PostMapping("/update")
    public ResponseEntity<DonationResponse> updateDonation(
            @RequestParam Long userId, @RequestParam DonationStatus donationStatus) {
        DonationResponse updatedDonation =
                donationService.updateDonationStatus(userId, donationStatus);
        return ResponseEntity.ok(updatedDonation);
    }

    @PostMapping
   
    public ResponseEntity<DonationResponse> createDonation(
            @RequestParam Long userId,
            @RequestParam BigDecimal amount,
            
            @RequestPart MultipartFile receipt) throws IOException {
        
        // 调用Service层处理
        DonationResponse response = donationService.createDonation(
            userId, amount, receipt
        );
        
        return ResponseEntity.ok(response);
    }
}
