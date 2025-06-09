package com.adopme.adopme.dto.donation;

import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.User;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.factory.Mappers;

@Mapper
public interface DonationResponseMapper {
    DonationResponseMapper INSTANCE = Mappers.getMapper(DonationResponseMapper.class);

    DonationResponse toDonationResponse(Donation donation);

    @Mapping(target = "id", source = "donation.id")
    @Mapping(target = "userName", source = "user.name")
    @Mapping(
            target = "hasReceipt",
            source = "donation.receipt",
            qualifiedByName = "checkHasReceipt")
    DonationAdminResponse toDonationAdminResponse(Donation donation, User user);

    @Named("checkHasReceipt")
    default boolean checkHasReceipt(byte[] receipt) {
        return receipt != null && receipt.length > 0;
    }
}
