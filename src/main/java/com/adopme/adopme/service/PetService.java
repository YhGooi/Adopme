package com.adopme.adopme.service;

import com.adopme.adopme.dto.pet.PetResponse;
import com.adopme.adopme.dto.pet.PetResponseMapper;
import com.adopme.adopme.model.Pet;
import com.adopme.adopme.model.PetStatus;
import com.adopme.adopme.repository.PetRepository;
import com.adopme.adopme.repository.spec.PetSpecifications;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;

@Service
public class PetService {
    private final PetRepository petRepository;

    public PetService(PetRepository petRepository) {
        this.petRepository = petRepository;
    }

    public List<PetResponse> getAllPets() {
        List<Pet> pets = petRepository.findAll(Sort.by(Sort.Direction.DESC, "createdAt"));
        return pets.stream().map(PetResponseMapper.INSTANCE::toPetResponse).toList();
    }

    public List<PetResponse> getActivePets() {
        Specification<Pet> spec = PetSpecifications.hasStatus(PetStatus.ACTIVE.name());
        List<Pet> pets = petRepository.findAll(spec, Sort.by(Sort.Direction.DESC, "createdAt"));
        return pets.stream().map(PetResponseMapper.INSTANCE::toPetResponse).toList();
    }

    public PetResponse createPet(Pet pet) {
        Pet saved = petRepository.save(pet);
        return PetResponseMapper.INSTANCE.toPetResponse(saved);
    }

    public PetResponse updatePet(Long id, Pet pet) {
        Pet existing = petRepository.findById(id).orElseThrow();
        existing.setName(pet.getName());
        existing.setDob(pet.getDob());
        existing.setGender(pet.getGender());
        existing.setSpecies(pet.getSpecies());
        existing.setBreed(pet.getBreed());
        existing.setWeight(pet.getWeight());
        existing.setVaccinated(pet.getVaccinated());
        existing.setDescription(pet.getDescription());
        existing.setPetImageUrl(pet.getPetImageUrl());
        existing.setStatus(pet.getStatus());
        Pet updated = petRepository.save(existing);
        return PetResponseMapper.INSTANCE.toPetResponse(updated);
    }

    public PetResponse getPetById(Long id) {
        Pet pet =
                petRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new IllegalArgumentException("Pet not found with ID: " + id));
        return PetResponseMapper.INSTANCE.toPetResponse(pet);
    }

    public void deletePet(Long id) {
        petRepository.deleteById(id);
    }

    @Value("${pet.image.upload-dir:uploads/pet-images}")
    private String uploadDir;

    public PetResponse createPetWithImage(Pet pet, MultipartFile image) {
        if (image != null && !image.isEmpty()) {
            try {
                String originalFilename = StringUtils.cleanPath(image.getOriginalFilename());
                String extension = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0) {
                    extension = originalFilename.substring(dotIndex);
                }
                String filename =
                        System.currentTimeMillis()
                                + "-"
                                + pet.getName().replaceAll("[^a-zA-Z0-9]", "_")
                                + extension;
                // Always use absolute path for upload directory
                Path uploadPath = Paths.get(System.getProperty("user.dir"), uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(filename);
                image.transferTo(filePath.toFile());
                // Set the image URL (assuming static resource mapping)
                pet.setPetImageUrl("/uploads/pet-images/" + filename);
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image file", e);
            }
        }
        Pet saved = petRepository.save(pet);
        return PetResponseMapper.INSTANCE.toPetResponse(saved);
    }

    public PetResponse updatePetWithImage(Long id, Pet pet, MultipartFile image) {
        Pet existing = petRepository.findById(id).orElseThrow();
        String oldImageUrl = existing.getPetImageUrl();
        if (image != null && !image.isEmpty()) {
            try {
                String originalFilename = StringUtils.cleanPath(image.getOriginalFilename());
                String extension = "";
                int dotIndex = originalFilename.lastIndexOf('.');
                if (dotIndex > 0) {
                    extension = originalFilename.substring(dotIndex);
                }
                String filename =
                        System.currentTimeMillis()
                                + "-"
                                + pet.getName().replaceAll("[^a-zA-Z0-9]", "_")
                                + extension;
                Path uploadPath = Paths.get(System.getProperty("user.dir"), uploadDir);
                if (!Files.exists(uploadPath)) {
                    Files.createDirectories(uploadPath);
                }
                Path filePath = uploadPath.resolve(filename);
                image.transferTo(filePath.toFile());
                pet.setPetImageUrl("/uploads/pet-images/" + filename);
                if (oldImageUrl != null
                        && !oldImageUrl.isBlank()
                        && !oldImageUrl.equals(pet.getPetImageUrl())) {
                    Path oldFile =
                            Paths.get(
                                    System.getProperty("user.dir"),
                                    oldImageUrl.replaceFirst("/", ""));
                    try {
                        Files.deleteIfExists(oldFile);
                    } catch (Exception ignored) {
                    }
                }
            } catch (IOException e) {
                throw new RuntimeException("Failed to save image file", e);
            }
        } else {
            pet.setPetImageUrl(oldImageUrl);
        }
        existing.setName(pet.getName());
        existing.setDob(pet.getDob());
        existing.setGender(pet.getGender());
        existing.setSpecies(pet.getSpecies());
        existing.setBreed(pet.getBreed());
        existing.setWeight(pet.getWeight());
        existing.setVaccinated(pet.getVaccinated());
        existing.setDescription(pet.getDescription());
        existing.setPetImageUrl(pet.getPetImageUrl());
        existing.setStatus(pet.getStatus());
        Pet updated = petRepository.save(existing);
        return PetResponseMapper.INSTANCE.toPetResponse(updated);
    }
}
