package com.adopme.adopme.controller;

import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.service.UserDonationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/user/donations")
@RequiredArgsConstructor
public class UserDonationController {

    private final UserDonationService userDonationService;

    /**
     * 提交捐赠
     */
    @PostMapping(consumes = "multipart/form-data")
    public ResponseEntity<DonationResponse> createDonation(
            @RequestParam Long userId,
            @RequestParam BigDecimal amount,
            @RequestParam(required = false) String note, 
            @RequestParam MultipartFile receipt) throws IOException {

        DonationResponse response = userDonationService.createDonation(
                userId, amount, note, receipt
        );
        return ResponseEntity.ok(response);
    }
}