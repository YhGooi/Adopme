package com.adopme.adopme.seeder;

import com.adopme.adopme.model.HousingType;
import com.adopme.adopme.model.PettingExperience;
import com.adopme.adopme.model.User;
import com.adopme.adopme.model.UserType;
import com.adopme.adopme.repository.UserRepository;
import com.adopme.adopme.service.AppConfigService;
import com.github.javafaker.Faker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Random;

@Component
public class FabricateData implements CommandLineRunner {
    @Autowired
    private UserRepository userRepository;
    private final Random random = new Random();
    private final AppConfigService appConfigService;
    private final Boolean fabricateUser;

    public FabricateData(AppConfigService appConfigService) {
        this.appConfigService = appConfigService;
        this.fabricateUser = appConfigService.getAppConfig().isFabricateAccount();
    }

    @Override
    public void run(String... args) {
        Faker faker = new Faker();
        if (userRepository.count() == 0 && fabricateUser) {
            PettingExperience pettingExperience = PettingExperience.valueOf("NONE");
            LocalDate dateOfBirth = LocalDate.ofInstant(
                    faker.date().birthday(20, 30).toInstant(),
                    ZoneId.of("Asia/Kuala_Lumpur"));
            User user = new User(
                    "ADMIN",
                    UserType.ADMIN,
                    "ADMIN",
                    dateOfBirth,
                    "TEST, ADDRESS",
                    HousingType.LANDED,
                    "ADMIN",
                    pettingExperience,
                    1,
                    "admin@admin.com",
                    "1234567890");

            userRepository.save(user);
            for (int i = 0; i < 30; i++) {
                String passwordHash = faker.internet().password();
                UserType type = UserType.USER;
                String name = faker.name().fullName();
                dateOfBirth = LocalDate.ofInstant(
                        faker.date().birthday(20, 30).toInstant(),
                        ZoneId.of("Asia/Kuala_Lumpur"));
                String address = faker.address().streetAddress();
                HousingType housingType = random.nextBoolean() ? HousingType.LANDED : HousingType.CONDO;
                String occupation = faker.job().title();
                pettingExperience = PettingExperience.values()[random
                        .nextInt(PettingExperience.values().length)];
                int currentPets = random.nextInt(5);
                String email = faker.internet().emailAddress();
                String phoneNo = "+60" + faker.number().digits(9);

                user = new User(
                        passwordHash,
                        type,
                        name,
                        dateOfBirth,
                        address,
                        housingType,
                        occupation,
                        pettingExperience,
                        currentPets,
                        email,
                        phoneNo);

                userRepository.save(user);
            }
            System.out.println("[USER]: Fabricated 30 fake users.");
        } else {
            System.out.println("[USER]: Already exist - skipped fabricating.");
        }
    }
}
