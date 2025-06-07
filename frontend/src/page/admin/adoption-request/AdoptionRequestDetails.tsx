import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '../../../store/auth.store';
import '../../../css/common.css';
import '../../../css/adoptionRequestDetails.css';

interface User {
    id: number;
    name: string;
    email: string;
    type: string;
    dateOfBirth: string;
    address: string;
    housingType: string;
    occupation: string;
    pettingExperience: string;
    currentPets: number;
    phoneNo: string;
}

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

interface AdoptionRequestBasic {
    id: number;
    status: 'SUBMITTED' | 'APPROVED' | 'REJECTED';
    message: string;
    remarks: string | null;
    submissionDate: string;
    createdAt: string;
    updatedAt: string;
}

interface AdoptionRequestDetails {
    adoptionRequest: AdoptionRequestBasic;
    pet: Pet;
    user: User;
}

const AdoptionRequestDetailsPage: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { requestId } = useParams<{ requestId: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [details, setDetails] = useState<AdoptionRequestDetails | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [editedStatus, setEditedStatus] = useState<'SUBMITTED' | 'APPROVED' | 'REJECTED'>('SUBMITTED');

    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }

        const id = requestId?.split('-')[0]; // Extract ID from the slug URL
        if (!id) {
            setError('Invalid request ID');
            return;
        }

        fetchRequestDetails(id);
    }, [token, requestId, navigate]);

    const fetchRequestDetails = async (id: string) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`http://localhost:8080/adoption-request/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch request details');
            }

            const data = await response.json();
            setDetails(data);
            setEditedStatus(data.adoptionRequest.status);
        } catch (error) {
            console.error('Error fetching details:', error);
            setError('Failed to load adoption request details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setIsEditing(false);
        // Reset the edited status to original
        if (details) {
            setEditedStatus(details.adoptionRequest.status);
        }
    };

    const handleSave = async () => {
        if (!details) return;

        try {
            const response = await fetch(`http://localhost:8080/adoption-request/${details.adoptionRequest.id}/status`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ status: editedStatus })
            });

            if (!response.ok) {
                throw new Error('Failed to update status');
            }

            // Update local state with new status
            setDetails(prev => prev ? {
                ...prev,
                adoptionRequest: {
                    ...prev.adoptionRequest,
                    status: editedStatus
                }
            } : null);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating status:', error);
            setError('Failed to update status');
        }
    };

    const handleGoBack = () => {
        navigate('/admin/adoption-request-list');
    };

    if (isLoading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>Loading request details...</span>
            </div>
        );
    }

    if (error || !details) {
        return <div className="error-message">{error || 'No data available'}</div>;
    }    return (
        <div className="common_theme">
            <div className="green_container">
                <h3 className="details-title">Pet Details</h3>                <div className="pet-details-block">
                    <div className="pet-info-col">
                        <div className="pet-image-col">
                            <img src={details.pet.petImageUrl} alt={details.pet.name} className="pet-image" />
                        </div>
                        <div className="profile-info-list">
                            <div className="profile-info-item"><div className="profile-info-label">Name:</div><div className="profile-info-value">{details.pet.name}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Age:</div><div className="profile-info-value">{details.pet.age} years</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Date of Birth:</div><div className="profile-info-value">{new Date(details.pet.dob).toLocaleDateString('en-GB')}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Gender:</div><div className="profile-info-value">{details.pet.gender}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Species:</div><div className="profile-info-value">{details.pet.species}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Breed:</div><div className="profile-info-value">{details.pet.breed}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Weight:</div><div className="profile-info-value">{details.pet.weight} kg</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Vaccinated:</div><div className="profile-info-value">{details.pet.vaccinated ? 'Yes' : 'No'}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Description:</div><div className="profile-info-value">{details.pet.description}</div></div>
                        </div>
                    </div>
                </div>
                <hr className="section-divider" />
                <h3 className="details-title">Applicant Details</h3>
                <div className="applicant-details-block">
                    <div className="applicant-info-col">
                        <div className="profile-info-list">
                            <div className="profile-info-item"><div className="profile-info-label">Name:</div><div className="profile-info-value">{details.user.name}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Date of Birth:</div><div className="profile-info-value">{new Date(details.user.dateOfBirth).toLocaleDateString('en-GB')}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Phone Number:</div><div className="profile-info-value">{details.user.phoneNo}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Email:</div><div className="profile-info-value">{details.user.email}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Address:</div><div className="profile-info-value">{details.user.address}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Housing Type:</div><div className="profile-info-value">{details.user.housingType}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Occupation:</div><div className="profile-info-value">{details.user.occupation}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Petting Experience:</div><div className="profile-info-value">{details.user.pettingExperience}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Current Number of Pets at Home:</div><div className="profile-info-value">{details.user.currentPets}</div></div>
                            <div className="profile-info-item"><div className="profile-info-label">Message:</div><div className="profile-info-value">{details.adoptionRequest.message}</div></div>
                        </div>
                    </div>
                </div>
                <hr className="section-divider" />                <div className="status-row">
                    <div className="status-label">Status</div>
                    <div className="status-field">
                        {isEditing ? (
                            <select
                                value={editedStatus}
                                onChange={(e) => setEditedStatus(e.target.value as typeof editedStatus)}
                                className={`status-select status-${editedStatus.toLowerCase()}`}
                            >
                                <option value="SUBMITTED">Submitted</option>
                                <option value="APPROVED">Approved</option>
                                <option value="REJECTED">Rejected</option>
                            </select>
                        ) : (
                            <span className={`status-badge status-${details.adoptionRequest.status.toLowerCase()}`}>
                                {details.adoptionRequest.status}
                            </span>
                        )}
                    </div>
                </div>
                <div className="details-actions-row">
                    <button onClick={handleGoBack} className="back-button">Back to List</button>
                    {!isEditing ? (
                        <button onClick={handleEdit} className="edit-button">Edit</button>
                    ) : (
                        <>
                            <button onClick={handleSave} className="save-button">Save</button>
                            <button onClick={handleCancel} className="cancel-button">Discard</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdoptionRequestDetailsPage;
