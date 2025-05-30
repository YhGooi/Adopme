package com.adopme.adopme.dto.pet;

import com.adopme.adopme.model.PetListing;
import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

@Mapper
public interface PetListingResponseMapper {
    PetListingResponseMapper INSTANCE = Mappers.getMapper(PetListingResponseMapper.class);
    PetListingResponse toPetListingResponse(PetListing petListing);

    class PetListingResponseMapperImpl implements PetListingResponseMapper {
        @Override
        public PetListingResponse toPetListingResponse(PetListing petListing) {
            double age = 0.0;
            if (petListing.getDob() != null) {
                long days = ChronoUnit.DAYS.between(petListing.getDob(), LocalDate.now());
                age = Math.round((days / 365.25) * 10.0) / 10.0; // 1 decimal place
            }
            return new PetListingResponse(
                petListing.getId(),
                petListing.getName(),
                age,
                petListing.getDob(),
                petListing.getGender(),
                petListing.getSpecies() != null ? petListing.getSpecies().getName() : null,
                petListing.getBreed() != null ? petListing.getBreed().getName() : null,
                petListing.getWeight(),
                petListing.getVaccinated(),
                petListing.getDescription(),
                petListing.getPetImageUrl(),
                petListing.getStatus() != null ? petListing.getStatus().name() : null,
                petListing.getCreatedAt(),
                petListing.getUpdatedAt()
            );
        }
    }
}
