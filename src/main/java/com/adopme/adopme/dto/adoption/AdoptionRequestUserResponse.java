package com.adopme.adopme.dto.adoption;

import com.adopme.adopme.dto.pet.PetResponse;

public record AdoptionRequestUserResponse(
        AdoptionRequestBasicResponse adoptionRequest, PetResponse pet) {}
