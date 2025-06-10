import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, user_details } from '../../../store/auth.store';
import Species, { getSpeciesDisplayName } from '../../../model/Species';
import Breed, { getBreedDisplayName } from '../../../model/Breed';
import '../../../css/shared/common.css';
import '../../../css/admin/petListing.css';

interface Pet {
    id: number;
    name: string;
    species: string;
    breed: string;
    gender: string;
    vaccinated: boolean;
    status: string;
}

// Helper function to convert string to Species enum
const stringToSpecies = (speciesKey: string): Species => {
    return Species[speciesKey as keyof typeof Species];
};

// Helper function to convert string to Breed enum
const stringToBreed = (breedKey: string): Breed => {
    return Breed[breedKey as keyof typeof Breed];
};

const AdminPetListing: React.FC = () => {
    const [pets, setPets] = useState<Pet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { type } = user_details();

    useEffect(() => {
        // If no token, redirect to login
        if (!token) {
            navigate('/login');
            return;
        }

        // If not admin, show error
        if (type !== 'ADMIN') {
            setError('You are not authorized to view this page');
            setIsLoading(false);
            return;
        }

        const fetchPets = async () => {
            try {
                setIsLoading(true);
                setError(null);
                const response = await fetch('http://localhost:8080/pet', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                if (!response.ok) throw new Error('Failed to fetch pets');
                const data = await response.json();
                setPets(data);
            } catch (err) {
                setError('Failed to load pets');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPets();
    }, [token, type, navigate]);

    const createSlug = (petName: string) => {
        return petName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');
    };

    const handleRowClick = (petId: number, petName: string) => {
        const slug = createSlug(petName);
        navigate(`/admin/pet-details/${petId}-${slug}`);
    };

    const getStatusClass = (status: string) => {
        switch (status?.toLowerCase()) {
            case 'active': return 'status-active';
            case 'inactive': return 'status-inactive';
            case 'adopted': return 'status-adopted';
            default: return 'status-active';
        }
    };

    return (
        <div className="pet-listing">
            <div className="title-bar">
                <h2>Pet Listing</h2>
            </div>
            <div className="admin-pet-table-container">
                <div className="table-header">
                    <button
                        className="create-pet-button"
                        onClick={() => navigate('/admin/create-pet')}
                    >
                        Create New Pet
                    </button>
                </div>
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>Loading pets...</span>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : pets.length === 0 ? (
                    <div className="no-data-message">No pets found</div>
                ) : (
                    <table className="pet-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Species</th>
                                <th>Breed</th>
                                <th>Gender</th>
                                <th>Vaccinated</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {pets.map((pet) => (
                                <tr
                                    key={pet.id}
                                    onClick={() => handleRowClick(pet.id, pet.name)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    <td>{pet.id}</td>
                                    <td>{pet.name}</td>
                                    <td>{getSpeciesDisplayName(stringToSpecies(pet.species))}</td>
                                    <td>{getBreedDisplayName(stringToBreed(pet.breed))}</td>
                                    <td>{pet.gender}</td>
                                    <td>{pet.vaccinated ? 'Yes' : 'No'}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(pet.status)}`}>
                                            {pet.status || 'Active'}
                                        </span>
                                    </td>
                                    <td>&gt;</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminPetListing;