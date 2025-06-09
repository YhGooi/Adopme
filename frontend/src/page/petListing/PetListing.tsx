import React, { useEffect, useState } from 'react';
import { usePetListingStore } from '../../store/petListing.store';
import { useAuthStore } from '../../store/auth.store';
import { Pet } from '../../store/petListing.store';
import { useNavigate } from 'react-router-dom';
import { user_details } from '../../store/auth.store';
import '../../css/petListing/petListing.css';
import ChatIcon from '../../assets/png/Chat.png';

const PetListing = () => {
  const { pets, fetchPets } = usePetListingStore();
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [message, setMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [ageFilter, setAgeFilter] = useState('');
  const [genderFilter, setGenderFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [submittedPetIds, setSubmittedPetIds] = useState<number[]>([]);

  const userId = user_details.getState().id;

  const petsPerPage = 5;

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;

  const filteredPets = pets
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
    });

  const paginatedPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  const isLogin = useAuthStore((state) => state.isLogin);

  const navigate = useNavigate();

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  useEffect(() => {
    const fetchSubmittedPetIds = async () => {
      const token = useAuthStore.getState().token;
      const userId = user_details.getState().id; // or wherever you're storing user info

      if (!token || !userId) return;

      const response = await fetch("http://localhost:8080/adoption-request/submitted", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          userId: userId.toString(),
        },
      });

      if (response.ok) {
        const data = await response.json();
        setSubmittedPetIds(data); // e.g. [10, 12, 15]
      }
    };

    fetchSubmittedPetIds();
  }, []);

  // Generate filter options from pets data
  const speciesOptions = Array.from(new Set(pets.map(p => p.species))).sort();
  const genderOptions = Array.from(new Set(pets.map(p => p.gender))).sort();

  const handleAdoptClick = (pet: Pet) => {
    if (!isLogin) {
      alert('Please log in to adopt a pet.');
      navigate('/login');
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

  const handleSubmit = async () => {
    try {
      const token = useAuthStore.getState().token;
      const userId = user_details.getState().id;

      console.log("Sending userId:", userId);

      const response = await fetch('http://localhost:8080/adoption-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'user-id': userId.toString(), // Send userId in header
        },
        body: JSON.stringify({
          petId: selectedPet?.id,
          message: message,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit adoption request');
      }

      alert('Your adoption request has been submitted.');

      if (selectedPet) {
        setSubmittedPetIds((prev) => [...prev, selectedPet.id]);
      }

      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert('Something went wrong. Please try again.');
    }
  };

  const getImageUrl = (url: string) => {
    if (!url) return '';
    if (url.startsWith('/uploads/')) {
      return `http://localhost:8080${url}`;
    }
    return url;
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
        {paginatedPets
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
                <img src={getImageUrl(pet.petImageUrl)} alt={pet.name} />
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
                  <button
                    className="adopt-button"
                    onClick={() => handleAdoptClick(pet)}
                    disabled={submittedPetIds.includes(pet.id)}
                  >
                    {submittedPetIds.includes(pet.id) ? "REQUESTED" : "ADOPT"}
                  </button>
                  {isLogin && (
                    <div className="chat-icon-wrapper">
                      <img
                        src={ChatIcon}
                        alt="Chat"
                        className="chat-icon"
                        onClick={() => navigate('/messaging')}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            className={`page-button ${currentPage === i + 1 ? 'active' : ''}`}
            onClick={() => setCurrentPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>


      {showModal && selectedPet && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-button" onClick={handleCloseModal}>✕</button>
            <div className="modal-content">
              <img src={getImageUrl(selectedPet.petImageUrl)} alt={selectedPet.name} />
              <div className="modal-form">
                <h3>Leave a message to the shelter</h3>
                <textarea
                  placeholder="Tell us why you want to adopt this pet."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <button
                  className="submit-button"
                  onClick={handleSubmit}
                  disabled={submittedPetIds.includes(selectedPet.id)}
                >
                  SUBMIT
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PetListing;