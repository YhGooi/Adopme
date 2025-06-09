import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore, user_details } from '../../../store/auth.store';
import '../../../css/shared/common.css';
import '../../../css/petDetails.css';

interface Pet {
    id: number;
    name: string;
    age: number;
    dob: string;
    gender: string;
    species: string;
    breed: string;
    weight: number;
    vaccinated: boolean;
    description: string;
    petImageUrl: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

const PetDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { type } = user_details();
    const { petId } = useParams<{ petId: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pet, setPet] = useState<Pet | null>(null);

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        if (type !== 'ADMIN') {
            setError('You are not authorized to view this page');
            setIsLoading(false);
            return;
        }
        const id = petId?.split('-')[0];
        if (!id) {
            setError('Invalid pet ID');
            setIsLoading(false);
            return;
        }
        fetchPetDetails(id);
    }, [token, type, petId, navigate]);

    const fetchPetDetails = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch(`http://localhost:8080/pet/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            if (!response.ok) throw new Error('Failed to fetch pet details');
            const data = await response.json();
            setPet(data);
        } catch (error) {
            setError('Failed to load pet details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoBack = () => {
        navigate('/admin/pet-listing');
    };

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) {
            return `http://localhost:8080${url}`;
        }
        return url;
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>Loading pet details...</span>
            </div>
        );
    }
    if (error || !pet) {
        return <div className="error-message">{error || 'No data available'}</div>;
    }
    return (
        <div className="common_theme">
            <div className="green_container">
                <div className="back-link-row">
                    <span className="back-link" onClick={handleGoBack}>&lt; Back to List</span>
                    <span className="edit-link" onClick={() => navigate(`/admin/edit-pet/${pet.id}-${pet.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`)}>
                        Edit
                    </span>
                </div>
                <h3 className="details-title">Pet Details</h3>
                <div className="pet-details-block">
                    <div className="pet-info-col">
                        <div className="pet-image-col">
                            <img src={getImageUrl(pet.petImageUrl)} alt={pet.name} className="pet-image" />
                        </div>
                        <div className="pet-details-list">
                            <div className="pet-details-item"><div className="pet-details-label">Name:</div><div className="pet-details-value">{pet.name}</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Age:</div><div className="pet-details-value">{pet.age} years</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Date of Birth:</div><div className="pet-details-value">{new Date(pet.dob).toLocaleDateString('en-GB')}</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Gender:</div><div className="pet-details-value">{pet.gender}</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Species:</div><div className="pet-details-value">{pet.species}</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Breed:</div><div className="pet-details-value">{pet.breed}</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Weight:</div><div className="pet-details-value">{pet.weight} kg</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Vaccinated:</div><div className="pet-details-value">{pet.vaccinated ? 'Yes' : 'No'}</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Description:</div><div className="pet-details-value">{pet.description}</div></div>
                            <div className="pet-details-item"><div className="pet-details-label">Status:</div><div className="pet-details-value">{pet.status}</div></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PetDetailsPage;
