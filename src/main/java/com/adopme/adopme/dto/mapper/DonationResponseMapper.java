package com.adopme.adopme.dto.mapper;

import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.model.Donation;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DonationResponseMapper {
    DonationResponseMapper INSTANCE = Mappers.getMapper(DonationResponseMapper.class);

    DonationResponse toDonationResponse(Donation donation);
}
