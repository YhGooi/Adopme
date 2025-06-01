import React, { useEffect, useState } from 'react';
import { usePetListingStore } from '../store/petListing.store';
import '../css/PetListing.css';

import { Pet } from '../store/petListing.store';

const PetListing = () => {
  const { pets, fetchPets } = usePetListingStore();
  const [selectedPet, setSelectedPet] = useState(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const handleAdoptClick = (pet) => {
    setSelectedPet(pet);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPet(null);
    setMessage('');
  };

  const handleSubmit = () => {
    alert(`Message sent for ${selectedPet.name}: ${message}`);
    handleCloseModal();
  };

  // const { pets } = usePetListingStore();

  type PetListingState = {
    pets: Pet[];
    fetchPets: () => Promise<void>;
  };
  

  return (
    <div className="pet-listing-container">
      <h2 className="title">Pet Listing</h2>
      <div className="filter-bar">
        <input type="text" placeholder="Search..." />
        <select><option>Species</option></select>
        <select><option>Age</option></select>
        <select><option>Gender</option></select>
      </div>
      <div className="pet-cards">
        {pets.map((pet) => (
          <div className="pet-card" key={pet.id}>
            <div className="polaroid">
              <img src={pet.petImageUrl} alt={pet.name} />
              <p className="caption">{pet.name}, {pet.age}</p>
            </div>
            <div className="pet-info">
              <p><strong>Date of Birth:</strong> {pet.dob}</p>
              <p><strong>Gender:</strong> {pet.gender}</p>
              <p><strong>Species:</strong> {pet.species}</p>
              <p><strong>Breed:</strong> {pet.breed}</p>
              <p><strong>Weight:</strong> {pet.weight} kg</p>
              <p><strong>Vaccinated:</strong> {pet.vaccinated ? 'Yes' : 'No'}</p>
              <p>{pet.description}</p>
              <button className="adopt-button" onClick={() => handleAdoptClick(pet)}>Adopt</button>
            </div>
          </div>
        ))}
      </div>

      {showModal && selectedPet && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseModal}>✕</button>
            <div className="modal-content">
            {selectedPet && (
              <img src={selectedPet.petImageUrl} alt={selectedPet.name} />
            )}

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
