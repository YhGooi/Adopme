package com.adopme.adopme.dto.adoption;

import com.adopme.adopme.dto.pet.PetResponse;
import com.adopme.adopme.dto.user.UserResponse;

public record AdoptionRequestAdminResponse(
        AdoptionRequestBasicResponse adoptionRequest, PetResponse pet, UserResponse user) {}
