package com.adopme.adopme.controller;

import com.adopme.adopme.dto.adoption.AdoptionRequestResponse;
import com.adopme.adopme.model.AdoptionRequestStatus;
import com.adopme.adopme.service.AdoptionRequestService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/adoption-request")
public class AdoptionRequestController {

    private final AdoptionRequestService adoptionRequestService;

    public AdoptionRequestController(AdoptionRequestService adoptionRequestService) {
        this.adoptionRequestService = adoptionRequestService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<AdoptionRequestResponse>> getAdoptionRequestsByUserId(
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

            List<AdoptionRequestResponse> requests =
                    adoptionRequestService.getAdoptionRequestsByUserId(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<AdoptionRequestResponse>> getAllAdoptionRequests(
            @RequestParam(required = false) AdoptionRequestStatus status,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<AdoptionRequestResponse> requests =
                adoptionRequestService.getAllAdoptionRequests(status, startDate, endDate);
        return ResponseEntity.ok(requests);
    }
}
