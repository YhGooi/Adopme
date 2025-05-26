package com.adopme.adopme.dto.adoption;

import com.adopme.adopme.model.AdoptionRequest;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface AdoptionRequestResponseMapper {

    AdoptionRequestResponseMapper INSTANCE = Mappers.getMapper(AdoptionRequestResponseMapper.class);

    AdoptionRequestResponse toAdoptionRequestResponse(AdoptionRequest adoptionRequest);
}
