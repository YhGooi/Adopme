package com.adopme.adopme.seeder;

import com.adopme.adopme.model.Account;
import com.adopme.adopme.repository.AccountRepository;
import com.github.javafaker.Faker;
import java.time.LocalDateTime;
import java.util.Random;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class FabricateData implements CommandLineRunner {
  @Autowired private AccountRepository accountRepository;
  private final Random random = new Random();

  @Value("${FABRICATE_ACCOUNT:false}")
  private Boolean fabricateAccount;

  @Override
  public void run(String... args) {
    Faker faker = new Faker();

    System.out.println("[ACCOUNT]: " + fabricateAccount);

    if (accountRepository.count() == 0 && fabricateAccount) {
      for (int i = 0; i < 30; i++) {
        String passwordHash = faker.internet().password();
        String type = faker.options().option("USER");
        String name = faker.name().fullName();
        Integer age = random.nextInt(50) + 18;
        String address = faker.address().streetAddress();
        String postCode = faker.address().zipCode();
        String email = faker.internet().emailAddress();
        String phoneNo = faker.phoneNumber().cellPhone();
        LocalDateTime now = LocalDateTime.now();
        String updatedBy = faker.name().username();

        Account account =
            new Account(
                passwordHash,
                type,
                name,
                age,
                address,
                postCode,
                email,
                phoneNo,
                now.minusDays(random.nextInt(10)),
                now.minusDays(30),
                updatedBy,
                now);

        accountRepository.save(account);
      }
      System.out.println("[ACCOUNT]: Fabricated 30 fake accounts.");
    } else {
      System.out.println("[ACCOUNT]: Already exist - skipped fabricating.");
    }
  }
}
