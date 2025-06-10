enum Species {
  DOG = 'DOG',
  CAT = 'CAT',
  RABBIT = 'RABBIT'
}

// Map of species display names for frontend display
export const SpeciesDisplayNames: Record<Species, string> = {
  [Species.DOG]: 'Dog',
  [Species.CAT]: 'Cat',
  [Species.RABBIT]: 'Rabbit'
};

/**
 * Get display name for a species
 * @param species The species to get the display name for
 * @returns The formatted display name
 */
export const getSpeciesDisplayName = (species: Species): string => {
  return SpeciesDisplayNames[species];
};

export default Species;
