import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, user_details } from '../../store/auth.store';
import '../../css/profile/adoptionRequests.css';
import '../../css/profile/profileComponents.css';
import Breed, { getBreedDisplayName } from '../../model/Breed';

interface PetResponse {
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

interface AdoptionRequestBasicResponse {
    id: number;
    status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    message: string;
    remarks: string | null;
    submissionDate: string;
    createdAt: string;
    updatedAt: string;
}

export interface AdoptionRequestResponse {
    adoptionRequest: AdoptionRequestBasicResponse;
    pet: PetResponse;
}

// Helper function to convert string to Breed enum
const stringToBreed = (breedKey: string): Breed => {
    return Breed[breedKey as keyof typeof Breed];
};

const AdoptionRequests = () => {
    const [adoptionRequests, setAdoptionRequests] = useState<AdoptionRequestResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const navigate = useNavigate();
    const authStore = useAuthStore();
    const userStore = user_details(state => state);

    const getImageUrl = (url: string | null | undefined) => {
        if (!url) return null;
        if (url.startsWith('/uploads/')) {
            return `http://localhost:8080${url}`;
        }
        return url;
    };

    useEffect(() => {
        fetchUserAdoptionRequests();
    }, [authStore.token, userStore.id]);

    // Fetch user adoption requests
    const fetchUserAdoptionRequests = async () => {
        try {
            setLoading(true);
            if (!userStore.id) {
                throw new Error('User ID is missing. Please log in again.');
            }
            
            const response = await fetch(`http://localhost:8080/adoption-request/user`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'userId': String(userStore.id),
                    'Authorization': `Bearer ${authStore.token}`
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(errorText || `HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            console.log('Adoption requests fetched:', data);
            setAdoptionRequests(data);
        } catch (err: any) {
            console.error('Error fetching adoption requests:', err);
            setError(err.message || 'Failed to load adoption requests');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666' }}>
                    Loading adoption requests...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#e74c3c', marginBottom: '20px' }}>
                    Error loading adoption requests
                </div>
                <div style={{ fontSize: '14px', color: '#666' }}>
                    {error}
                </div>
                <button 
                    className="profile-action-button" 
                    style={{ marginTop: '20px' }}
                    onClick={() => window.location.reload()}
                >
                    Try Again
                </button>
            </div>
        );
    }

    if (adoptionRequests.length === 0) {
        return (
            <div className="tab-content">
                <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                        No adoption requests found
                    </div>
                    <p style={{ color: '#888', marginBottom: '30px' }}>
                        Browse our pets and submit an adoption request
                    </p>
                    <button 
                        className="profile-action-button"
                        onClick={() => navigate('/pet-listing')}
                    >
                        Find a Pet
                    </button>
                </div>
            </div>
        );
    }
    
    return (
        <div className="tab-content">
            <div className="adoption-requests-list">
                {adoptionRequests.map((request) => {
                    // Map status to appropriate class
                    let statusClass = '';
                    let statusText = '';
                    
                    switch(request.adoptionRequest.status) {
                        case 'APPROVED':
                            statusClass = 'approved';
                            statusText = 'Approved';
                            break;
                        case 'SUBMITTED':
                            statusClass = 'processing';
                            statusText = 'Processing';
                            break;
                        case 'REJECTED':
                            statusClass = 'rejected';
                            statusText = 'Rejected';
                            break;
                    }
                    
                    return (
                        <div 
                            key={request.adoptionRequest.id} 
                            className="adoption-request-item"
                        >
                            <div className="profile-pet-image-container">
                                <img 
                                    src={getImageUrl(request.pet.petImageUrl) || undefined} 
                                    alt={request.pet.name} 
                                    className="profile-pet-image"
                                />
                            </div>
                            
                            <div className="adoption-request-details">
                                <div className="profile-pet-name">{request.pet.name}</div>
                                <div className="profile-pet-info">
                                    {request.pet.age} year old, {request.pet.gender}, {getBreedDisplayName(stringToBreed(request.pet.breed))}
                                </div>
                            </div>
                            
                            <div className={`adoption-request-status ${statusClass}`}>
                                {statusText}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default AdoptionRequests;
