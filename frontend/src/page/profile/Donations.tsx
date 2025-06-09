import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuthStore, user_details } from '../../store/auth.store';
import '../../css/profile/donations.css';
import '../../css/profile/profileComponents.css';

interface DonationResponse {
    id: number;
    userId: number;
    amount: number;
    donationDate: string;
    status: 'PROCESSING' | 'SUCCESS' | 'UNSUCCESS';
    createdAt: string;
    updatedAt: string;
}

const Donations = () => {
    const navigate = useNavigate();
    const [donations, setDonations] = useState<DonationResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const authStore = useAuthStore();
    const userStore = user_details(state => state);
    
    useEffect(() => {
        const fetchDonations = async () => {
            try {
                setLoading(true);
                if (!userStore.id) {
                    throw new Error('User ID is missing. Please log in again.');
                }
                
                const response = await fetch('http://localhost:8080/donation/user', {
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
                setDonations(data);
            } catch (err: any) {
                console.error('Error fetching donations:', err);
                setError(err.message || 'Failed to load donations');
            } finally {
                setLoading(false);
            }
        };
        
        fetchDonations();
    }, [authStore.token, userStore.id]);
    
    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666' }}>
                    Loading donations...
                </div>
            </div>
        );
    }
    
    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#e74c3c', marginBottom: '20px' }}>
                    Error loading donations
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
    
    if (donations.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                    No donation history found
                </div>
                <p style={{ color: '#888', marginBottom: '30px' }}>
                    Your contributions help animals find their forever homes
                </p>
                <button 
                    className="profile-action-button"
                    onClick={() => navigate('/donation/Donation')}
                >
                    Make a Donation
                </button>
            </div>
        );
    }
    
    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };
    
    return (
        <div className="tab-content">
            <table className="donation-table">
                <tbody>
                    {donations.map((donation) => (
                        <tr className="donation-row" key={donation.id}>
                            <td className="donation-date">{formatDate(donation.donationDate)}</td>
                            <td className="donation-amount">MYR {donation.amount.toFixed(2)}</td>
                            <td className="donation-status">
                                {donation.status === 'PROCESSING' ? 'Processing' : 
                                     donation.status === 'SUCCESS' ? 'Received' : 'Failed'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            
            <div className="donation-message">
                <p>Thank you for being a hero to our furry friends! Your support helps us provide love, 
                care, and a second chance to animals in need. We couldn't do it without you!</p>
            </div>
        </div>
    );
}

export default Donations;
