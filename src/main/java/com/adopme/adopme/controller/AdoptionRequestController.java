package com.adopme.adopme.controller;

import com.adopme.adopme.dto.adoption.AdoptionRequestAdminResponse;
import com.adopme.adopme.dto.adoption.AdoptionRequestUserResponse;
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
    public ResponseEntity<List<AdoptionRequestUserResponse>> getAdoptionRequestsByUserId(
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

            List<AdoptionRequestUserResponse> requests =
                    adoptionRequestService.getAdoptionRequestsByUserId(userId);
            return ResponseEntity.ok(requests);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @GetMapping
    public ResponseEntity<List<AdoptionRequestAdminResponse>> getAllAdoptionRequests(
            @RequestParam(required = false) AdoptionRequestStatus status,
            @RequestParam String startDate,
            @RequestParam String endDate) {
        List<AdoptionRequestAdminResponse> requests =
                adoptionRequestService.getAllAdoptionRequests(status, startDate, endDate);
        return ResponseEntity.ok(requests);
    }
}
