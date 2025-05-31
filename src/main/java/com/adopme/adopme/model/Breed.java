package com.adopme.adopme.model;

public enum Breed {
    // Dog breeds
    LABRADOR(Species.DOG),
    POODLE(Species.DOG),
    GOLDEN_RETRIEVER(Species.DOG),
    GERMAN_SHEPHERD(Species.DOG),
    BULLDOG(Species.DOG),
    BEAGLE(Species.DOG),
    DACHSHUND(Species.DOG),
    SHIH_TZU(Species.DOG),
    SIBERIAN_HUSKY(Species.DOG),
    PUG(Species.DOG),
    BOXER(Species.DOG),
    ROTTWEILER(Species.DOG),
    DOBERMAN(Species.DOG),
    GREAT_DANE(Species.DOG),
    CHIHUAHUA(Species.DOG),
    BORDER_COLLIE(Species.DOG),
    AUSTRALIAN_SHEPHERD(Species.DOG),
    CORGI(Species.DOG),
    AKITA(Species.DOG),
    BASSET_HOUND(Species.DOG),
    MALTESE(Species.DOG),
    FRENCH_BULLDOG(Species.DOG),
    JACK_RUSSELL_TERRIER(Species.DOG),
    SHIBA_INU(Species.DOG),

    // Cat breeds
    PERSIAN(Species.CAT),
    SIAMESE(Species.CAT),
    MAINE_COON(Species.CAT),
    RAGDOLL(Species.CAT),
    BENGAL(Species.CAT),
    SPHYNX(Species.CAT),
    BRITISH_SHORTHAIR(Species.CAT),
    SCOTTISH_FOLD(Species.CAT),
    BURMESE(Species.CAT),
    ABYSSINIAN(Species.CAT),
    AMERICAN_SHORTHAIR(Species.CAT),
    ORIENTAL_SHORTHAIR(Species.CAT),
    DEVON_REX(Species.CAT),
    CORNISH_REX(Species.CAT),
    RUSSIAN_BLUE(Species.CAT),
    NORWEGIAN_FOREST(Species.CAT),
    SAVANNAH(Species.CAT),
    SINGAPURA(Species.CAT),
    TONKINESE(Species.CAT),
    TURKISH_ANGORA(Species.CAT),
    MANX(Species.CAT),
    CHARTREUX(Species.CAT),
    EGYPTIAN_MAU(Species.CAT),
    HIMALAYAN(Species.CAT),
    JAPANESE_BOBTAIL(Species.CAT),

    // Rabbit breeds
    HOLLAND_LOP(Species.RABBIT),
    NETHERLAND_DWARF(Species.RABBIT),
    MINI_REX(Species.RABBIT),
    FLEMISH_GIANT(Species.RABBIT),
    LIONHEAD(Species.RABBIT),
    ENGLISH_LOP(Species.RABBIT),
    MINI_LOP(Species.RABBIT),
    REX(Species.RABBIT),
    HARLEQUIN(Species.RABBIT);

    private final Species species;

    Breed(Species species) {
        this.species = species;
    }

    public Species getSpecies() {
        return species;
    }
}
