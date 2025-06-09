import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuthStore, user_details } from '../../../store/auth.store';
import '../../../css/common.css';
import '../../../css/createEditPet.css';

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

const EditPet: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { type } = user_details();
    const { petId } = useParams<{ petId: string }>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [pet, setPet] = useState<Pet | null>(null);
    const [formData, setFormData] = useState<any>(null);
    const [selectedImage, setSelectedImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [statusOptions, setStatusOptions] = useState<string[]>([]);
    const [speciesOptions, setSpeciesOptions] = useState<string[]>([]);
    const [breedOptions, setBreedOptions] = useState<string[]>([]);
    const [allBreeds, setAllBreeds] = useState<{ [species: string]: string[] }>({});

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
        fetchEnums();
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
            setFormData({
                name: data.name,
                dateOfBirth: data.dob,
                gender: data.gender,
                weight: data.weight,
                vaccinated: data.vaccinated,
                species: data.species,
                breed: data.breed,
                description: data.description,
                status: data.status
            });
            setImagePreview(getImageUrl(data.petImageUrl));
        } catch (error) {
            setError('Failed to load pet details');
        } finally {
            setIsLoading(false);
        }
    };

    const fetchEnums = () => {
        fetch('http://localhost:8080/pet/status', { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
            .then(res => res.json())
            .then(setStatusOptions)
            .catch(() => setStatusOptions(['ACTIVE', 'INACTIVE', 'ADOPTED']));
        fetch('http://localhost:8080/pet/species', { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
            .then(res => res.json())
            .then(setSpeciesOptions)
            .catch(() => setSpeciesOptions([]));
        fetch('http://localhost:8080/pet/breed', { headers: token ? { 'Authorization': `Bearer ${token}` } : {} })
            .then(res => res.json())
            .then(setAllBreeds)
            .catch(() => setAllBreeds({}));
    };

    useEffect(() => {
        if (formData && formData.species && allBreeds) {
            const key = formData.species.toUpperCase();
            setBreedOptions(allBreeds[key] || []);
        } else {
            setBreedOptions([]);
        }
    }, [formData?.species, allBreeds]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            setFormData((prev: any) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
        } else {
            setFormData((prev: any) => ({ ...prev, [name]: value }));
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedImage(file);
            const reader = new FileReader();
            reader.onload = e => setImagePreview(e.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!pet) return;
        try {
            const form = new FormData();
            form.append('pet', new Blob([JSON.stringify(formData)], { type: 'application/json' }));
            if (selectedImage) form.append('image', selectedImage);
            const response = await fetch(`http://localhost:8080/pet/${pet.id}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
                body: form as any
            } as any);
            if (!response.ok) {
                let errorMsg = 'Failed to update pet';
                try {
                    const errorData = await response.json();
                    errorMsg = errorData?.message || errorData?.error || errorMsg;
                } catch { }
                throw new Error(errorMsg);
            }
            navigate(`/admin/pet-details/${pet.id}-${pet.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`);
        } catch (err: any) {
            setError(err.message || 'Failed to update pet');
        }
    };

    const handleCancel = () => navigate(`/admin/pet-details/${petId}`);

    const getImageUrl = (url: string) => {
        if (!url) return '';
        if (url.startsWith('/uploads/')) {
            return `http://localhost:8080${url}`;
        }
        return url;
    };

    if (isLoading || !formData) {
        return (
            <div className="loading-container">
                <div className="loading-spinner"></div>
                <span>Loading pet details...</span>
            </div>
        );
    }
    if (error) {
        return <div className="error-message">{error}</div>;
    }
    return (
        <div className="edit-pet-page">
            <div className="common_theme">
                <div className="green_container">
                    <div className="edit-pet-header">
                        <h2>Edit Pet</h2>
                    </div>
                    <form onSubmit={handleSubmit} className="edit-pet-form">
                        <div className="form-content">
                            {/* Image Upload Section */}
                            <div className="image-upload-section">
                                <div className="image-preview-container">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Pet preview" className="image-preview" />
                                    ) : (
                                        <div className="image-placeholder">
                                            <span>No image selected</span>
                                        </div>
                                    )}
                                </div>
                                <input
                                    type="file"
                                    id="petImage"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    style={{ display: 'none' }}
                                />
                                <label htmlFor="petImage" className="upload-button">
                                    Upload Image
                                </label>
                            </div>
                            {/* Form Fields */}
                            <div className="form-fields">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="name">Name</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="status">Status</label>
                                        <select
                                            id="status"
                                            name="status"
                                            value={formData.status}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Status</option>
                                            {statusOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="dateOfBirth">Date of Birth</label>
                                        <input
                                            type="date"
                                            id="dateOfBirth"
                                            name="dateOfBirth"
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="gender">Gender</label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="weight">Weight</label>
                                        <input
                                            type="number"
                                            id="weight"
                                            name="weight"
                                            value={formData.weight}
                                            onChange={handleInputChange}
                                            placeholder="kg"
                                            step="0.1"
                                            required
                                        />
                                    </div>
                                    <div className="form-group checkbox-group">
                                        <label htmlFor="vaccinated">Vaccinated</label>
                                        <div className="checkbox-label">
                                            <input
                                                type="checkbox"
                                                id="vaccinated"
                                                name="vaccinated"
                                                checked={formData.vaccinated}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="species">Species</label>
                                        <select
                                            id="species"
                                            name="species"
                                            value={formData.species}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Select Species</option>
                                            {speciesOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt.charAt(0) + opt.slice(1).toLowerCase()}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="breed">Breed</label>
                                        <select
                                            id="breed"
                                            name="breed"
                                            value={formData.breed}
                                            onChange={handleInputChange}
                                            required
                                            disabled={!formData.species}
                                        >
                                            <option value="">{formData.species ? 'Select Breed' : 'Select species first'}</option>
                                            {breedOptions.map(opt => (
                                                <option key={opt} value={opt}>{opt.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="form-row">
                                    <div className="form-group full-width">
                                        <label htmlFor="description">Description</label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            value={formData.description}
                                            onChange={handleInputChange}
                                            rows={4}
                                            placeholder="Enter pet description..."
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="form-actions">
                            <button type="button" onClick={handleCancel} className="cancel-button">
                                Cancel
                            </button>
                            <button type="submit" className="submit-button">
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditPet;
