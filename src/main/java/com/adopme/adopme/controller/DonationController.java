package com.adopme.adopme.controller;

import com.adopme.adopme.dto.donation.DonationAdminResponse;
import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.service.DonationService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
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
            @RequestHeader(value = "userId") String userIdStr) {
        try {
            if (userIdStr == null || userIdStr.isEmpty()) {
                throw new IllegalArgumentException("User ID is required");
            }

            Long userId;
            try {
                userId = Long.parseLong(userIdStr);
            } catch (NumberFormatException e) {
                throw new IllegalArgumentException("Invalid user ID format: " + userIdStr);
            }

            List<DonationResponse> donations = donationService.getDonationsByUserId(userId);
            return ResponseEntity.ok(donations);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DonationAdminResponse>> getAllDonations(
            @RequestParam(required = false) DonationStatus status,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate) {
        List<DonationAdminResponse> donations =
                donationService.getAllDonations(status, startDate, endDate);
        return ResponseEntity.ok(donations);
    }

    @PostMapping("/update")
    public ResponseEntity<Void> updateDonation(
            @RequestParam Long donationId, @RequestParam DonationStatus donationStatus) {
        donationService.updateDonationStatus(donationId, donationStatus);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{donationId}/receipt")
    public ResponseEntity<byte[]> getReceipt(@PathVariable Long donationId) {
        byte[] receipt = donationService.getReceipt(donationId);
        return ResponseEntity.ok()
                .header("Content-Type", "image/jpeg")
                .header("Content-Disposition", "inline; filename=\"receipt.jpg\"")
                .body(receipt);
    }

    @PostMapping
    public ResponseEntity<DonationResponse> createDonation(
            @RequestParam Long userId,
            @RequestParam BigDecimal amount,
            @RequestPart MultipartFile receipt)
            throws IOException {

        DonationResponse response = donationService.createDonation(userId, amount, receipt);

        return ResponseEntity.ok(response);
    }
}
