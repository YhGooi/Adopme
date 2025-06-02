import React, { useEffect, useState } from 'react';
import { usePetListingStore } from '../store/petListing.store';
import { useAuthStore } from '../store/auth.store'; 
import '../css/PetListing.css';
import { Pet } from '../store/petListing.store';

const PetListing = () => {
  const { pets, fetchPets } = usePetListingStore();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');

  const isLogin = useAuthStore((state) => state.isLogin);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  // Generate filter options from pets data
  const speciesOptions = Array.from(new Set(pets.map(p => p.species))).sort();
  const genderOptions = Array.from(new Set(pets.map(p => p.gender))).sort();

  const handleAdoptClick = (pet: Pet) => {
    if (!isLogin) {
      alert('Please log in to adopt a pet.');
      window.location.href = '/login';
      return;
    }

    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPet(null);
    setMessage('');
  };

  const handleSubmit = () => {
    alert(`Message sent for ${selectedPet?.name}: ${message}`);
    handleCloseModal();
  };

  return (
    <div className="pet-listing-container">
      <div className="pet-listing-banner">
        <h2 className="title">Pet Listing</h2>
        <div className="filter-bar">
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <select value={speciesFilter} onChange={(e) => setSpeciesFilter(e.target.value)}>
            <option value="">All Species</option>
            {speciesOptions.map((species, idx) => (
              <option key={idx} value={species}>{species}</option>
            ))}
          </select>

          <select value={ageFilter} onChange={(e) => setAgeFilter(e.target.value)}>
            <option value="">All Ages</option>
            <option value="0-1">0 - 1 years</option>
            <option value="1-3">1 - 3 years</option>
            <option value="3+">3+ years</option>
          </select>

          <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="">All Genders</option>
            {genderOptions.map((gender, idx) => (
              <option key={idx} value={gender}>{gender}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pet-cards">
        {pets
          .filter((pet) => {
            const matchesSearch =
              pet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
              pet.species.toLowerCase().includes(searchQuery.toLowerCase()) ||
              pet.breed.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesSpecies = speciesFilter === '' || pet.species === speciesFilter;
            const matchesGender = genderFilter === '' || pet.gender === genderFilter;

            const age = pet.age;
            const matchesAge =
              ageFilter === '' ||
              (ageFilter === '0-1' && age >= 0 && age <= 1) ||
              (ageFilter === '1-3' && age > 1 && age <= 3) ||
              (ageFilter === '3+' && age > 3);

            return matchesSearch && matchesSpecies && matchesGender && matchesAge;
          })
          .map((pet, index) => (
            <div className="pet-card" key={pet.id}>
              <div className={`polaroid ${index % 2 === 0 ? 'rotate-left' : 'rotate-right'}`}>
                <img src={pet.petImageUrl} alt={pet.name} />
                <p className="caption">{pet.name}, {pet.age.toFixed(1)} years old</p>
              </div>

              <div className="pet-info">
                <div className="pet-info-grid">
                  <div><strong>Date of Birth:</strong> {pet.dob}</div>
                  <div><strong>Gender:</strong> {pet.gender}</div>
                  <div><strong>Species:</strong> {pet.species}</div>
                  <div><strong>Weight:</strong> {pet.weight} kg</div>
                  <div><strong>Breed:</strong> {pet.breed}</div>
                  <div><strong>Vaccinated:</strong> {pet.vaccinated ? 'Yes' : 'No'}</div>
                </div>
                <p className="pet-description">{pet.description}</p>
                <div className="adopt-button-wrapper">
                  {!isLogin ? (
                    <div className="tooltip-wrapper">
                      <button className="adopt-button" disabled>
                        ADOPT
                      </button>
                      <span className="tooltip-text">Please log in or sign up to adopt</span>
                    </div>
                  ) : (
                    <button className="adopt-button" onClick={() => handleAdoptClick(pet)}>
                      ADOPT
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>

      {showModal && selectedPet && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseModal}>✕</button>
            <div className="modal-content">
              <img src={selectedPet.petImageUrl} alt={selectedPet.name} />
              <div className="modal-form">
                <h3>Leave a message to the shelter</h3>
                <textarea
                  placeholder="Tell us why you want to adopt this pet."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button className="submit-button" onClick={handleSubmit}>SUBMIT</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetListing;
