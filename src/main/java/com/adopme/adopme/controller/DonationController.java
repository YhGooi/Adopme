package com.adopme.adopme.controller;

import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.service.DonationService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/donations")
public class DonationController {

    private final DonationService donationService;

    @Autowired
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
                donationService.getAllDonationsWithFilters(status, startDate, endDate);
        return ResponseEntity.ok(donations);
    }

    @PostMapping("/update")
    public ResponseEntity<DonationResponse> updateDonation(
            @RequestParam Long userId, @RequestParam DonationStatus donationStatus) {
        DonationResponse updatedDonation =
                donationService.updateDonationStatus(userId, donationStatus);
        return ResponseEntity.ok(updatedDonation);
    }
}
