package com.adopme.adopme.seeder;

import com.adopme.adopme.model.AdoptionRequest;
import com.adopme.adopme.model.AdoptionRequestStatus;
import com.adopme.adopme.model.Appointment;
import com.adopme.adopme.model.AppointmentStatus;
import com.adopme.adopme.model.Breed;
import com.adopme.adopme.model.Donation;
import com.adopme.adopme.model.DonationStatus;
import com.adopme.adopme.model.HousingType;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.PetStatus;
import com.adopme.adopme.model.PettingExperience;
import com.adopme.adopme.model.Species;
import com.adopme.adopme.model.User;
import com.adopme.adopme.model.UserType;
import com.adopme.adopme.repository.AdoptionRequestRepository;
import com.adopme.adopme.repository.AppointmentRepository;
import com.adopme.adopme.repository.DonationRepository;
import com.adopme.adopme.repository.PetRepository;
import com.adopme.adopme.repository.UserRepository;
import com.adopme.adopme.service.AppConfigService;
import com.github.javafaker.Faker;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.math.BigDecimal;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Arrays;
import java.util.List;
import java.util.Random;

@Component
public class FabricateData implements CommandLineRunner {
    @Autowired private UserRepository userRepository;
    @Autowired private PetRepository petRepository;
    @Autowired private AppointmentRepository appointmentRepository;
    @Autowired private DonationRepository donationRepository;
    @Autowired private AdoptionRequestRepository adoptionRequestRepository;

    private final Random random = new Random();
    private final Boolean fabricateEnabled;

    public FabricateData(AppConfigService appConfigService) {
        this.fabricateEnabled = appConfigService.getAppConfig().isFabricateEnabled();
    }

    @Override
    public void run(String... args) {
        Faker faker = new Faker();
        if (!fabricateEnabled) {
            System.out.println("[FabricateData]: Fabrication of data is disabled.");
            return;
        }

        fabricateUser(faker);
        fabricatePet(faker);
        fabricateAppointments(faker);
        fabricateDonations(faker);
        fabricateAdoptionRequests(faker);
        fabricateDemoUser(faker);
    }

    private void fabricateUser(Faker faker) {
        if (userRepository.count() == 0) {
            PettingExperience pettingExperience = PettingExperience.valueOf("NONE");
            LocalDate dateOfBirth =
                    LocalDate.ofInstant(
                            faker.date().birthday(20, 30).toInstant(),
                            ZoneId.of("Asia/Kuala_Lumpur"));
            User user =
                    new User(
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
                dateOfBirth =
                        LocalDate.ofInstant(
                                faker.date().birthday(20, 30).toInstant(),
                                ZoneId.of("Asia/Kuala_Lumpur"));
                String address = faker.address().streetAddress();
                HousingType housingType =
                        random.nextBoolean() ? HousingType.LANDED : HousingType.CONDO;
                String occupation = faker.job().title();
                pettingExperience =
                        PettingExperience.values()[
                                random.nextInt(PettingExperience.values().length)];
                int currentPets = random.nextInt(5);
                String email = faker.internet().emailAddress();
                String phoneNo = "+60" + faker.number().digits(9);

                user =
                        new User(
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

    private void fabricatePet(Faker faker) {
        if (petRepository.count() == 0) {
            for (int i = 0; i < 10; i++) {
                Species species = faker.options().option(Species.DOG, Species.CAT, Species.RABBIT);
                Breed breed = getRandomBreedForSpecies(species);
                LocalDate dob =
                        LocalDate.ofInstant(
                                faker.date().birthday(1, 10).toInstant(),
                                ZoneId.of("Asia/Kuala_Lumpur"));

                Pet pet =
                        new Pet(
                                faker.animal().name(),
                                dob,
                                faker.options().option("Male", "Female"),
                                species,
                                breed,
                                faker.number().randomDouble(1, 2, 15),
                                faker.bool().bool(),
                                faker.lorem().sentence(),
                                species == Species.CAT
                                        ? "https://placekitten.com/200/200"
                                        : species == Species.DOG
                                                ? "https://placedog.net/400?id=" + i
                                                : "https://upload.wikimedia.org/wikipedia/commons/thumb/7/70/Rabbit_in_montana.jpg/320px-Rabbit_in_montana.jpg",
                                PetStatus.ACTIVE);

                petRepository.save(pet);
            }
            System.out.println("[PET]: Fabricated 10 fake pets.");
        } else {
            System.out.println("[PET]: Already exist - skipped fabricating.");
        }
    }

    private void fabricateAppointments(Faker faker) {
        if (appointmentRepository.count() == 0) {
            // Get all non-admin users
            List<User> users =
                    userRepository.findAll().stream()
                            .filter(user -> user.getType() != UserType.ADMIN)
                            .toList();

            List<Pet> pets = petRepository.findAll();

            if (users.isEmpty() || pets.isEmpty()) {
                System.out.println(
                        "[APPOINTMENT]: Skipped fabricating - no users or pets available.");
                return;
            }

            for (int i = 0; i < 20; i++) {
                User user = users.get(random.nextInt(users.size()));
                Pet pet = pets.get(random.nextInt(pets.size()));

                // Create an appointment between now and 30 days in the future
                LocalDateTime appointmentDateTime =
                        LocalDateTime.now()
                                .plusDays(random.nextInt(30))
                                .plusHours(random.nextInt(8) + 9); // 9 AM to 5 PM

                AppointmentStatus status =
                        AppointmentStatus.values()[
                                random.nextInt(AppointmentStatus.values().length)];

                Appointment appointment =
                        new Appointment(user.getId(), appointmentDateTime, pet.getId(), status);

                appointmentRepository.save(appointment);
            }
            System.out.println("[APPOINTMENT]: Fabricated 20 fake appointments.");
        } else {
            System.out.println("[APPOINTMENT]: Already exist - skipped fabricating.");
        }
    }

    private void fabricateDonations(Faker faker) {
        if (donationRepository.count() == 0) {
            // Get all non-admin users
            List<User> users =
                    userRepository.findAll().stream()
                            .filter(user -> user.getType() != UserType.ADMIN)
                            .toList();

            if (users.isEmpty()) {
                System.out.println("[DONATION]: Skipped fabricating - no users available.");
                return;
            }

            byte[] receiptImage = getReceiptImage();

            for (int i = 0; i < 15; i++) {
                User user = users.get(random.nextInt(users.size()));
                BigDecimal amount = BigDecimal.valueOf(faker.number().randomDouble(2, 10, 1000));

                // Create a donation date within the past year
                LocalDateTime donationDate = LocalDateTime.now().minusDays(random.nextInt(365));

                DonationStatus status =
                        DonationStatus.values()[random.nextInt(DonationStatus.values().length)];

                Donation donation =
                        new Donation(user.getId(), amount, donationDate, status, receiptImage);

                donationRepository.save(donation);
            }
            System.out.println("[DONATION]: Fabricated 15 fake donations with receipt images.");
        } else {
            System.out.println("[DONATION]: Already exist - skipped fabricating.");
        }
    }

    private void fabricateAdoptionRequests(Faker faker) {
        if (adoptionRequestRepository.count() == 0) {
            // Get all non-admin users
            List<User> users =
                    userRepository.findAll().stream()
                            .filter(user -> user.getType() != UserType.ADMIN)
                            .toList();

            List<Pet> pets = petRepository.findAll();

            if (users.isEmpty() || pets.isEmpty()) {
                System.out.println(
                        "[ADOPTION REQUEST]: Skipped fabricating - no users or pets available.");
                return;
            }

            for (int i = 0; i < 25; i++) {
                User user = users.get(random.nextInt(users.size()));
                Pet pet = pets.get(random.nextInt(pets.size()));

                // Create a submission date between 30 days ago and now
                LocalDateTime submissionDate = LocalDateTime.now().minusDays(random.nextInt(30));

                // Random status
                AdoptionRequestStatus status =
                        AdoptionRequestStatus.values()[
                                random.nextInt(AdoptionRequestStatus.values().length)];

                // Create a message and remarks
                String message = faker.lorem().paragraph(1 + random.nextInt(3));
                String remarks =
                        status != AdoptionRequestStatus.SUBMITTED ? faker.lorem().paragraph(1) : "";

                AdoptionRequest adoptionRequest =
                        new AdoptionRequest(
                                pet.getId(),
                                user.getId(),
                                status,
                                message,
                                remarks,
                                submissionDate);

                adoptionRequestRepository.save(adoptionRequest);
            }
            System.out.println("[ADOPTION REQUEST]: Fabricated 25 fake adoption requests.");
        } else {
            System.out.println("[ADOPTION REQUEST]: Already exist - skipped fabricating.");
        }
    }

    private void fabricateDemoUser(Faker faker) {
        // Get all non-admin users
        List<User> nonAdminUsers =
                userRepository.findAll().stream()
                        .filter(user -> user.getType() != UserType.ADMIN)
                        .toList();

        // Get the first non-admin user to use as demo
        User demoUser = nonAdminUsers.get(0);
        System.out.println("[DEMO USER]: Selected user " + demoUser.getName() + " as demo user.");

        // Get all pets
        List<Pet> pets = petRepository.findAll();
        if (pets.isEmpty()) {
            System.out.println("[DEMO USER]: Skipped fabricating - no pets available.");
            return;
        }

        // Generate 2-3 appointments for demo user
        int appointmentCount = random.nextInt(2) + 2; // Random number between 2-3
        for (int i = 0; i < appointmentCount; i++) {
            Pet pet = pets.get(random.nextInt(pets.size()));

            // Create an appointment between now and 14 days in the future
            LocalDateTime appointmentDateTime =
                    LocalDateTime.now()
                            .plusDays(random.nextInt(14) + 1)
                            .plusHours(random.nextInt(8) + 9); // 9 AM to 5 PM

            // Set status - make at least one CONFIRMED for better demo experience
            AppointmentStatus status =
                    (i == 0)
                            ? AppointmentStatus.CONFIRMED
                            : AppointmentStatus.values()[
                                    random.nextInt(AppointmentStatus.values().length)];

            Appointment appointment =
                    new Appointment(demoUser.getId(), appointmentDateTime, pet.getId(), status);

            appointmentRepository.save(appointment);
        }
        System.out.println(
                "[DEMO USER]: Fabricated " + appointmentCount + " appointments for demo user.");

        // Generate 2-3 donations for demo user
        int donationCount = random.nextInt(2) + 2; // Random number between 2-3
        for (int i = 0; i < donationCount; i++) {
            BigDecimal amount = BigDecimal.valueOf(faker.number().randomDouble(2, 50, 500));

            // Create donation dates with good distribution (recent, medium, older)
            LocalDateTime donationDate = LocalDateTime.now().minusDays(i * 30 + random.nextInt(10));

            // Set status - make at least one SUCCESS for better demo experience
            DonationStatus status =
                    (i == 0)
                            ? DonationStatus.SUCCESS
                            : DonationStatus.values()[
                                    random.nextInt(DonationStatus.values().length)];

            // Create empty receipt byte array for now
            byte[] receipt = getReceiptImage();

            Donation donation =
                    new Donation(demoUser.getId(), amount, donationDate, status, receipt);

            donationRepository.save(donation);
        }
        System.out.println(
                "[DEMO USER]: Fabricated " + donationCount + " donations for demo user.");

        // Generate 2-3 adoption requests for demo user
        int adoptionRequestCount = random.nextInt(2) + 2; // Random number between 2-3
        for (int i = 0; i < adoptionRequestCount; i++) {
            Pet pet = pets.get(random.nextInt(pets.size()));

            // Create submissions with good distribution (recent, medium, older)
            LocalDateTime submissionDate =
                    LocalDateTime.now().minusDays(i * 15 + random.nextInt(5));

            // Set varied statuses for a good demo experience
            AdoptionRequestStatus status;
            if (i == 0) {
                status = AdoptionRequestStatus.APPROVED;
            } else if (i == 1) {
                status = AdoptionRequestStatus.SUBMITTED;
            } else {
                status =
                        AdoptionRequestStatus.values()[
                                random.nextInt(AdoptionRequestStatus.values().length)];
            }

            // Create a message and remarks
            String message = faker.lorem().paragraph(1 + random.nextInt(2));
            String remarks =
                    status != AdoptionRequestStatus.SUBMITTED ? faker.lorem().paragraph(1) : "";

            AdoptionRequest adoptionRequest =
                    new AdoptionRequest(
                            pet.getId(),
                            demoUser.getId(),
                            status,
                            message,
                            remarks,
                            submissionDate);

            adoptionRequestRepository.save(adoptionRequest);
        }
        System.out.println(
                "[DEMO USER]: Fabricated "
                        + adoptionRequestCount
                        + " adoption requests for demo user.");
    }

    private Breed getRandomBreedForSpecies(Species species) {
        List<Breed> matchingBreeds =
                Arrays.stream(Breed.values())
                        .filter(breed -> breed.getSpecies() == species)
                        .toList();
        return matchingBreeds.get(random.nextInt(matchingBreeds.size()));
    }

    private static byte[] getReceiptImage() {
        byte[] receiptImage;
        try {
            Path receiptPath =
                    Paths.get(
                            System.getProperty("user.dir"),
                            "frontend",
                            "src",
                            "assets",
                            "png",
                            "DuitnowQR.png");
            receiptImage = Files.readAllBytes(receiptPath);
            System.out.println(
                    "[DONATION]: Successfully read DuitnowQR.png receipt image ("
                            + receiptImage.length
                            + " bytes)");
        } catch (IOException e) {
            System.err.println("[DONATION]: Failed to read receipt image: " + e.getMessage());
            receiptImage = new byte[0]; // Fallback to empty array if file can't be read
        }
        return receiptImage;
    }
}
