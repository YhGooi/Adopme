import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, user_details } from '../../../store/auth.store';
import '../../../css/common.css';
import '../../../css/adoptionRequestList.css';

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

interface AdoptionRequestAdminResponse {
    adoptionRequest: AdoptionRequestBasic;
    pet: Pet;
    user: User;
}

const AdoptionRequestList: React.FC = () => {
    const [requests, setRequests] = useState<AdoptionRequestAdminResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<'SUBMITTED' | 'APPROVED' | 'REJECTED' | ''>('');
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { type } = user_details();

    const formatDisplayDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-GB');
    };

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedStatus('');
        fetchRequests();
    };

    const fetchRequests = useCallback(async () => {
        if (!token || type !== 'ADMIN') return;

        try {
            setIsLoading(true);
            setError(null);

            const url = new URL('http://localhost:8080/adoption-request');

            // Set start date to beginning of the day
            const formattedStartDate = startDate
                ? new Date(startDate).toISOString()
                : new Date('1990-01-01').toISOString();
            url.searchParams.append('startDate', formattedStartDate);

            // Set end date to end of the selected day or current day
            const formattedEndDate = endDate
                ? (() => {
                    const d = new Date(endDate);
                    d.setHours(23, 59, 59, 999);
                    return d.toISOString();
                })()
                : (() => {
                    const d = new Date();
                    d.setHours(23, 59, 59, 999);
                    return d.toISOString();
                })();
            url.searchParams.append('endDate', formattedEndDate);

            // Status is optional
            if (selectedStatus) {
                url.searchParams.append('status', selectedStatus);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setRequests(data);
        } catch (error) {
            console.error('Error fetching adoption requests:', error);
            setError('Failed to load adoption requests');
        } finally {
            setIsLoading(false);
        }
    }, [token, type, startDate, endDate, selectedStatus]);

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

        fetchRequests();
    }, [token, type, navigate, fetchRequests]);

    const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value);
        fetchRequests();
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value as 'SUBMITTED' | 'APPROVED' | 'REJECTED' | '');
        fetchRequests();
    };

    const createSlug = (petName: string) => {
        return petName.toLowerCase()
            .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
            .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
    };

    const handleRowClick = (requestId: number, petName: string) => {
        const slug = createSlug(petName);
        navigate(`/admin/adoption-request-details/${requestId}-${slug}`);
    };

    const getStatusClass = (status: AdoptionRequestBasic['status']) => {
        switch (status) {
            case 'SUBMITTED': return 'status-submitted';
            case 'APPROVED': return 'status-approved';
            case 'REJECTED': return 'status-rejected';
            default: return '';
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="common_theme adoption-request-list">
            <div className="title-bar">
                <h2>PET ADOPTION REQUEST</h2>
                <div className="filters">
                    <div className="date-filters">
                        <div className="filter-group">
                            <label htmlFor="startDate">From:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                max={endDate ? endDate : todayStr}
                                onChange={handleDateChange(setStartDate)}
                            />
                        </div>
                        <div className="filter-group">
                            <label htmlFor="endDate">To:</label>
                            <input
                                type="date"
                                id="endDate"
                                value={endDate}
                                min={startDate || ''}
                                max={todayStr}
                                onChange={handleDateChange(setEndDate)}
                            />
                        </div>
                    </div>
                    <div className="status-filter">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="">All</option>
                            <option value="SUBMITTED">Submitted</option>
                            <option value="APPROVED">Approved</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>
                    <button className="clear-button" onClick={clearFilters}>Clear Filters</button>
                </div>
            </div>
            <div className="adoption-request-table-container">
                {isLoading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>Loading adoption requests...</span>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : requests.length === 0 ? (
                    <div className="no-data-message">No adoption requests found</div>
                ) : (
                    <table className="request-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Date</th>
                                <th>Pet Name</th>
                                <th>Breed</th>
                                <th>Applicant Name</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((req) => (
                                <tr key={req.adoptionRequest.id}
                                    onClick={() => handleRowClick(req.adoptionRequest.id, req.pet.name)}
                                    title="See details"
                                    style={{ position: 'relative' }}
                                >
                                    <td>{req.adoptionRequest.id}</td>
                                    <td>{formatDisplayDate(req.adoptionRequest.submissionDate)}</td>
                                    <td>{req.pet.name}</td>
                                    <td>{req.pet.breed}</td>
                                    <td>{req.user.name}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(req.adoptionRequest.status)}`}>
                                            {req.adoptionRequest.status}
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

export default AdoptionRequestList;
