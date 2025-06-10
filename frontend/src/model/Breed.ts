import Species from './Species';

enum Breed {
  // Dog breeds
  LABRADOR = 'LABRADOR',
  POODLE = 'POODLE',
  GOLDEN_RETRIEVER = 'GOLDEN_RETRIEVER',
  GERMAN_SHEPHERD = 'GERMAN_SHEPHERD',
  BULLDOG = 'BULLDOG',
  BEAGLE = 'BEAGLE',
  DACHSHUND = 'DACHSHUND',
  SHIH_TZU = 'SHIH_TZU',
  SIBERIAN_HUSKY = 'SIBERIAN_HUSKY',
  PUG = 'PUG',
  BOXER = 'BOXER',
  ROTTWEILER = 'ROTTWEILER',
  DOBERMAN = 'DOBERMAN',
  GREAT_DANE = 'GREAT_DANE',
  CHIHUAHUA = 'CHIHUAHUA',
  BORDER_COLLIE = 'BORDER_COLLIE',
  AUSTRALIAN_SHEPHERD = 'AUSTRALIAN_SHEPHERD',
  CORGI = 'CORGI',
  AKITA = 'AKITA',
  BASSET_HOUND = 'BASSET_HOUND',
  MALTESE = 'MALTESE',
  FRENCH_BULLDOG = 'FRENCH_BULLDOG',
  JACK_RUSSELL_TERRIER = 'JACK_RUSSELL_TERRIER',
  SHIBA_INU = 'SHIBA_INU',

  // Cat breeds
  PERSIAN = 'PERSIAN',
  SIAMESE = 'SIAMESE',
  MAINE_COON = 'MAINE_COON',
  RAGDOLL = 'RAGDOLL',
  BENGAL = 'BENGAL',
  SPHYNX = 'SPHYNX',
  BRITISH_SHORTHAIR = 'BRITISH_SHORTHAIR',
  SCOTTISH_FOLD = 'SCOTTISH_FOLD',
  BURMESE = 'BURMESE',
  ABYSSINIAN = 'ABYSSINIAN',
  AMERICAN_SHORTHAIR = 'AMERICAN_SHORTHAIR',
  ORIENTAL_SHORTHAIR = 'ORIENTAL_SHORTHAIR',
  DEVON_REX = 'DEVON_REX',
  CORNISH_REX = 'CORNISH_REX',
  RUSSIAN_BLUE = 'RUSSIAN_BLUE',
  NORWEGIAN_FOREST = 'NORWEGIAN_FOREST',
  SAVANNAH = 'SAVANNAH',
  SINGAPURA = 'SINGAPURA',
  TONKINESE = 'TONKINESE',
  TURKISH_ANGORA = 'TURKISH_ANGORA',
  MANX = 'MANX',
  CHARTREUX = 'CHARTREUX',
  EGYPTIAN_MAU = 'EGYPTIAN_MAU',
  HIMALAYAN = 'HIMALAYAN',
  JAPANESE_BOBTAIL = 'JAPANESE_BOBTAIL',

  // Rabbit breeds
  HOLLAND_LOP = 'HOLLAND_LOP',
  NETHERLAND_DWARF = 'NETHERLAND_DWARF',
  MINI_REX = 'MINI_REX',
  FLEMISH_GIANT = 'FLEMISH_GIANT',
  LIONHEAD = 'LIONHEAD',
  ENGLISH_LOP = 'ENGLISH_LOP',
  MINI_LOP = 'MINI_LOP',
  REX = 'REX',
  HARLEQUIN = 'HARLEQUIN'
}

// Map each breed to its corresponding species
const breedSpeciesMap: Record<Breed, Species> = {
  // Dog breeds
  [Breed.LABRADOR]: Species.DOG,
  [Breed.POODLE]: Species.DOG,
  [Breed.GOLDEN_RETRIEVER]: Species.DOG,
  [Breed.GERMAN_SHEPHERD]: Species.DOG,
  [Breed.BULLDOG]: Species.DOG,
  [Breed.BEAGLE]: Species.DOG,
  [Breed.DACHSHUND]: Species.DOG,
  [Breed.SHIH_TZU]: Species.DOG,
  [Breed.SIBERIAN_HUSKY]: Species.DOG,
  [Breed.PUG]: Species.DOG,
  [Breed.BOXER]: Species.DOG,
  [Breed.ROTTWEILER]: Species.DOG,
  [Breed.DOBERMAN]: Species.DOG,
  [Breed.GREAT_DANE]: Species.DOG,
  [Breed.CHIHUAHUA]: Species.DOG,
  [Breed.BORDER_COLLIE]: Species.DOG,
  [Breed.AUSTRALIAN_SHEPHERD]: Species.DOG,
  [Breed.CORGI]: Species.DOG,
  [Breed.AKITA]: Species.DOG,
  [Breed.BASSET_HOUND]: Species.DOG,
  [Breed.MALTESE]: Species.DOG,
  [Breed.FRENCH_BULLDOG]: Species.DOG,
  [Breed.JACK_RUSSELL_TERRIER]: Species.DOG,
  [Breed.SHIBA_INU]: Species.DOG,

  // Cat breeds
  [Breed.PERSIAN]: Species.CAT,
  [Breed.SIAMESE]: Species.CAT,
  [Breed.MAINE_COON]: Species.CAT,
  [Breed.RAGDOLL]: Species.CAT,
  [Breed.BENGAL]: Species.CAT,
  [Breed.SPHYNX]: Species.CAT,
  [Breed.BRITISH_SHORTHAIR]: Species.CAT,
  [Breed.SCOTTISH_FOLD]: Species.CAT,
  [Breed.BURMESE]: Species.CAT,
  [Breed.ABYSSINIAN]: Species.CAT,
  [Breed.AMERICAN_SHORTHAIR]: Species.CAT,
  [Breed.ORIENTAL_SHORTHAIR]: Species.CAT,
  [Breed.DEVON_REX]: Species.CAT,
  [Breed.CORNISH_REX]: Species.CAT,
  [Breed.RUSSIAN_BLUE]: Species.CAT,
  [Breed.NORWEGIAN_FOREST]: Species.CAT,
  [Breed.SAVANNAH]: Species.CAT,
  [Breed.SINGAPURA]: Species.CAT,
  [Breed.TONKINESE]: Species.CAT,
  [Breed.TURKISH_ANGORA]: Species.CAT,
  [Breed.MANX]: Species.CAT,
  [Breed.CHARTREUX]: Species.CAT,
  [Breed.EGYPTIAN_MAU]: Species.CAT,
  [Breed.HIMALAYAN]: Species.CAT,
  [Breed.JAPANESE_BOBTAIL]: Species.CAT,

  // Rabbit breeds
  [Breed.HOLLAND_LOP]: Species.RABBIT,
  [Breed.NETHERLAND_DWARF]: Species.RABBIT,
  [Breed.MINI_REX]: Species.RABBIT,
  [Breed.FLEMISH_GIANT]: Species.RABBIT,
  [Breed.LIONHEAD]: Species.RABBIT,
  [Breed.ENGLISH_LOP]: Species.RABBIT,
  [Breed.MINI_LOP]: Species.RABBIT,
  [Breed.REX]: Species.RABBIT,
  [Breed.HARLEQUIN]: Species.RABBIT
};

// Map each breed to its display name for frontend display
export const BreedDisplayNames: Record<Breed, string> = {
  // Dog breeds
  [Breed.LABRADOR]: 'Labrador',
  [Breed.POODLE]: 'Poodle',
  [Breed.GOLDEN_RETRIEVER]: 'Golden Retriever',
  [Breed.GERMAN_SHEPHERD]: 'German Shepherd',
  [Breed.BULLDOG]: 'Bulldog',
  [Breed.BEAGLE]: 'Beagle',
  [Breed.DACHSHUND]: 'Dachshund',
  [Breed.SHIH_TZU]: 'Shih Tzu',
  [Breed.SIBERIAN_HUSKY]: 'Siberian Husky',
  [Breed.PUG]: 'Pug',
  [Breed.BOXER]: 'Boxer',
  [Breed.ROTTWEILER]: 'Rottweiler',
  [Breed.DOBERMAN]: 'Doberman',
  [Breed.GREAT_DANE]: 'Great Dane',
  [Breed.CHIHUAHUA]: 'Chihuahua',
  [Breed.BORDER_COLLIE]: 'Border Collie',
  [Breed.AUSTRALIAN_SHEPHERD]: 'Australian Shepherd',
  [Breed.CORGI]: 'Corgi',
  [Breed.AKITA]: 'Akita',
  [Breed.BASSET_HOUND]: 'Basset Hound',
  [Breed.MALTESE]: 'Maltese',
  [Breed.FRENCH_BULLDOG]: 'French Bulldog',
  [Breed.JACK_RUSSELL_TERRIER]: 'Jack Russell Terrier',
  [Breed.SHIBA_INU]: 'Shiba Inu',

  // Cat breeds
  [Breed.PERSIAN]: 'Persian',
  [Breed.SIAMESE]: 'Siamese',
  [Breed.MAINE_COON]: 'Maine Coon',
  [Breed.RAGDOLL]: 'Ragdoll',
  [Breed.BENGAL]: 'Bengal',
  [Breed.SPHYNX]: 'Sphynx',
  [Breed.BRITISH_SHORTHAIR]: 'British Shorthair',
  [Breed.SCOTTISH_FOLD]: 'Scottish Fold',
  [Breed.BURMESE]: 'Burmese',
  [Breed.ABYSSINIAN]: 'Abyssinian',
  [Breed.AMERICAN_SHORTHAIR]: 'American Shorthair',
  [Breed.ORIENTAL_SHORTHAIR]: 'Oriental Shorthair',
  [Breed.DEVON_REX]: 'Devon Rex',
  [Breed.CORNISH_REX]: 'Cornish Rex',
  [Breed.RUSSIAN_BLUE]: 'Russian Blue',
  [Breed.NORWEGIAN_FOREST]: 'Norwegian Forest',
  [Breed.SAVANNAH]: 'Savannah',
  [Breed.SINGAPURA]: 'Singapura',
  [Breed.TONKINESE]: 'Tonkinese',
  [Breed.TURKISH_ANGORA]: 'Turkish Angora',
  [Breed.MANX]: 'Manx',
  [Breed.CHARTREUX]: 'Chartreux',
  [Breed.EGYPTIAN_MAU]: 'Egyptian Mau',
  [Breed.HIMALAYAN]: 'Himalayan',
  [Breed.JAPANESE_BOBTAIL]: 'Japanese Bobtail',

  // Rabbit breeds
  [Breed.HOLLAND_LOP]: 'Holland Lop',
  [Breed.NETHERLAND_DWARF]: 'Netherland Dwarf',
  [Breed.MINI_REX]: 'Mini Rex',
  [Breed.FLEMISH_GIANT]: 'Flemish Giant',
  [Breed.LIONHEAD]: 'Lionhead',
  [Breed.ENGLISH_LOP]: 'English Lop',
  [Breed.MINI_LOP]: 'Mini Lop',
  [Breed.REX]: 'Rex',
  [Breed.HARLEQUIN]: 'Harlequin'
};

/**
 * Get the species for a particular breed
 * @param breed The breed to get the species for
 * @returns The species of the breed
 */
export const getSpeciesForBreed = (breed: Breed): Species => {
  return breedSpeciesMap[breed];
};

/**
 * Get all breeds for a particular species
 * @param species The species to get breeds for
 * @returns Array of breeds for the specified species
 */
export const getBreedsForSpecies = (species: Species): Breed[] => {
  return Object.entries(breedSpeciesMap)
    .filter(([_, breedSpecies]) => breedSpecies === species)
    .map(([breed]) => breed as Breed);
};

/**
 * Get display name for a breed
 * @param breed The breed to get the display name for
 * @returns The formatted display name
 */
export const getBreedDisplayName = (breed: Breed): string => {
  return BreedDisplayNames[breed];
};

export default Breed;
