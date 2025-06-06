package com.adopme.adopme.service;

import com.adopme.adopme.dto.donation.DonationResponse;
import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.repository.DonationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class UserDonationService {

    private final DonationRepository donationRepository;

    /**
     * 创建捐赠记录
     */
    @Transactional
    public DonationResponse createDonation(
            Long userId,
            BigDecimal amount,
            String note,
            MultipartFile receipt) throws IOException {

        // 1. 验证金额有效性
        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("捐赠金额必须大于0");
        }

        // 2. 构建 Donation 实体
        Donation donation = Donation.builder()
                .userId(userId)
                .amount(amount)
                .donationDate(LocalDateTime.now())
                .status(DonationStatus.PROCESSING) // 默认状态
                .receipt(receipt.getBytes())   
                .build();

        // 3. 保存到数据库
        Donation savedDonation = donationRepository.save(donation);

        // 4. 转换为 Record 类型 DTO
        return new DonationResponse(
                savedDonation.getId(),
                savedDonation.getUserId(),
                savedDonation.getAmount(),
                savedDonation.getDonationDate(),
                savedDonation.getStatus(),
                savedDonation.getCreatedAt(),
                savedDonation.getUpdatedAt()
        );
    }
}