package com.adopme.adopme.seeder;

import com.adopme.adopme.model.HousingType;
import com.adopme.adopme.model.PettingExperience;
import com.adopme.adopme.model.User;
import com.adopme.adopme.model.UserType;
import com.adopme.adopme.repository.UserRepository;
import com.github.javafaker.Faker;
import com.github.javafaker.service.FakeValuesService;
import com.github.javafaker.service.RandomService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.ZoneId;
import java.util.Locale;
import java.util.Random;

@Component
public class FabricateData implements CommandLineRunner {
    @Autowired private UserRepository userRepository;
    private final Random random = new Random();

    @Value("${FABRICATE_USER:false}")
    private Boolean fabricateUser;

    @Override
    public void run(String... args) {
        Faker faker = new Faker();
        FakeValuesService fakeValuesService =
                new FakeValuesService(Locale.ENGLISH, new RandomService());

        System.out.println("[USER]: " + fabricateUser);

        if (userRepository.count() == 0 && fabricateUser) {
            for (int i = 0; i < 30; i++) {
                String passwordHash = faker.internet().password();
                UserType type = UserType.USER;
                String name = faker.name().fullName();
                LocalDate dateOfBirth =
                        LocalDate.ofInstant(
                                faker.date().birthday(20, 30).toInstant(),
                                ZoneId.of("Asia/Kuala_Lumpur"));
                String address = faker.address().streetAddress();
                String postCode = fakeValuesService.regexify("[1-9][0-9]{4}");
                HousingType housingType =
                        random.nextBoolean() ? HousingType.LANDED : HousingType.CONDO;
                String occupation = faker.job().title();
                PettingExperience pettingExperience =
                        PettingExperience.values()[
                                random.nextInt(PettingExperience.values().length)];
                int currentPets = random.nextInt(5);
                String email = faker.internet().emailAddress();
                String phoneNo = "+60" + faker.number().digits(9);

                User user =
                        new User(
                                passwordHash,
                                type,
                                name,
                                dateOfBirth,
                                address,
                                postCode,
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
