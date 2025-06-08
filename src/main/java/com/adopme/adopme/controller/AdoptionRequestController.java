package com.adopme.adopme.controller;

import com.adopme.adopme.dto.adoption.AdoptionRequestResponse;
import com.adopme.adopme.model.AdoptionRequest;
import com.adopme.adopme.model.AdoptionRequestStatus;
import com.adopme.adopme.service.AdoptionRequestService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/adoption-request")
public class AdoptionRequestController {

    private final AdoptionRequestService adoptionRequestService;

    public AdoptionRequestController(AdoptionRequestService adoptionRequestService) {
        this.adoptionRequestService = adoptionRequestService;
    }

    @GetMapping("/user")
    public ResponseEntity<List<AdoptionRequestResponse>> getAdoptionRequestsByUserId(
            @RequestHeader("userId") Long userId) {
        List<AdoptionRequestResponse> requests =
                adoptionRequestService.getAdoptionRequestsByUserId(userId);
        return ResponseEntity.ok(requests);
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

    @PostMapping
    public ResponseEntity<?> createAdoptionRequest(
            @RequestHeader("user-id") Long userId,
            @RequestBody Map<String, String> payload) {
        try {
            System.out.println("Received userId: " + userId);
            System.out.println("Payload: " + payload);
            
            Long petId = Long.parseLong(payload.get("petId"));
            String message = payload.get("message");

            adoptionRequestService.createAdoptionRequest(userId, petId, message);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("Failed to create request: " + e.getMessage());
        }
    }

    @GetMapping("/submitted")
    public ResponseEntity<List<Long>> getSubmittedPetIds(
            @RequestHeader("userId") Long userId) {
        List<Long> submittedPetIds = adoptionRequestService.getPetIdsWithSubmittedRequest(userId);
        return ResponseEntity.ok(submittedPetIds);
    }

}