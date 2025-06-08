import { useEffect, useState } from 'react';
import { useAuthStore, user_details } from '../../store/auth.store';
import '../../css/profile.css';
import '../../css/appointments.css';
import '../../css/profileComponents.css';

export interface AppointmentResponse {
    id: number;
    userId: number;
    petId: number;
    appointmentDateTime: string;
    status: 'REQUESTED' | 'CONFIRMED' | 'DECLINED';
    createdAt: string;
    updatedAt: string;
}

const Appointments = () => {
    const [appointments, setAppointments] = useState<AppointmentResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    const authStore = useAuthStore();
    const userStore = user_details(state => state);

    useEffect(() => {
        fetchUserAppointments();
    }, [authStore.token, userStore.id]);

    // Fetch user appointments
    const fetchUserAppointments = async () => {
        try {
            setLoading(true);
            if (!userStore.id) {
                throw new Error('User ID is missing. Please log in again.');
            }
            
            const response = await fetch(`http://localhost:8080/appointment/user`, {
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
            console.log('Appointments fetched:', data);
            setAppointments(data);
        } catch (err: any) {
            console.error('Error fetching appointments:', err);
            setError(err.message || 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666' }}>
                    Loading appointments...
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#e74c3c', marginBottom: '20px' }}>
                    Error loading appointments
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

    if (appointments.length === 0) {
        return (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ fontSize: '18px', color: '#666', marginBottom: '20px' }}>
                    No appointments scheduled yet
                </div>
                <p style={{ color: '#888', marginBottom: '30px' }}>
                    Schedule a visit to meet your future pet today!
                </p>
                <button className="profile-action-button">
                    Schedule Visit
                </button>
            </div>
        );
    }

    return (
        <div className="tab-content">
            <div className="appointments-list">
                {appointments.map((appointment) => {
                    const date = new Date(appointment.appointmentDateTime);
                    const day = date.getDate();
                    const month = date.toLocaleString('default', { month: 'short' });
                    const time = date.toLocaleString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: true 
                    });
                    
                    // Calculate end time (1 hour later)
                    const endDate = new Date(date);
                    endDate.setHours(endDate.getHours() + 1);
                    const endTime = endDate.toLocaleString('en-US', { 
                        hour: '2-digit', 
                        minute: '2-digit', 
                        hour12: true 
                    });
                    
                    // Map status to appropriate class
                    let statusClass = '';
                    switch(appointment.status) {
                        case 'CONFIRMED':
                            statusClass = 'confirmed';
                            break;
                        case 'REQUESTED':
                            statusClass = 'pending';
                            break;
                        case 'DECLINED':
                            statusClass = 'declined';
                            break;
                        default:
                            statusClass = '';
                    }
                    
                    // Format full date
                    const fullDate = date.toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                    });
                    
                    return (
                        <div 
                            key={appointment.id} 
                            className={`appointment-item ${statusClass}`}
                        >
                            <div className="appointment-date-container">
                                <div className="appointment-date-day">{day}</div>
                                <div className="appointment-date-month">{month}</div>
                            </div>
                            
                            <div className="appointment-details">
                                <div className="appointment-full-date"><strong>{fullDate}</strong></div>
                                <div className="appointment-time">{time} - {endTime}</div>
                            </div>
                            
                            <div className={`appointment-status ${statusClass}`}>
                                {appointment.status === 'CONFIRMED' ? 'Confirmed' :
                                  appointment.status === 'REQUESTED' ? 'Pending' :
                                  appointment.status === 'DECLINED' ? 'Declined' : 'Cancelled'}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Appointments;
