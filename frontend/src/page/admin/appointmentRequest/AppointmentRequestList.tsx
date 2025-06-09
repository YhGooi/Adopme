import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import { useNavigate } from 'react-router-dom';
import '../../../css/shared/common.css';
import '../../../css/table.css';
import '../../../css/admin/appointmentList.css';

interface AppointmentDetail {
    id: number;
    appointmentDateTime: string;
    createdAt: string;
    petName: string;
    status: 'REQUESTED' | 'CONFIRMED' | 'DECLINED';
    userName: string;
}

const AppointmentRequestList: React.FC = () => {
    const [appointments, setAppointments] = useState<AppointmentDetail[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState(
        new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [selectedStatus, setSelectedStatus] = useState<string>('REQUESTED'); // Default to show REQUESTED appointments
    const authStore = useAuthStore();
    const navigate = useNavigate();

    // Check if user is logged in and is admin
    useEffect(() => {
        const checkAuth = async () => {
            if (!authStore.isLogin) {
                navigate('/');
                return;
            }
        };

        checkAuth();
    }, [authStore.isLogin, authStore.token, navigate]);

    const fetchAppointments = async () => {
        try {
            setLoading(true);            
            let url = `http://localhost:8080/appointment/filter/details?startDate=${startDate}&endDate=${endDate}`;
            if (selectedStatus) {
                url += `&status=${selectedStatus}`;
            }
            
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setAppointments(data);
            setError(null);
        } catch (error) {
            console.error('Error fetching appointments:', error);
            setError('Failed to load appointments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAppointments();
    }, [authStore.token, startDate, endDate, selectedStatus]);    const handleStatusUpdate = async (appointmentId: number, newStatus: string) => {
        try {
            const response = await fetch(`http://localhost:8080/appointment/update?appointmentId=${appointmentId}&status=${newStatus}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            fetchAppointments();
        } catch (error) {
            console.error('Error updating appointment:', error);
            setError('Failed to update appointment status');
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString();
    };

    if (loading) {
        return <div className="common_theme">Loading appointments...</div>;
    }

    if (error) {
        return <div className="common_theme">Error: {error}</div>;
    }

    return (
        <div className="common_theme">
            <div>
                <h2>APPOINTMENT REQUEST</h2>
                <div className="title-bar">
                    <div className="filters">
                        <div className="date-filters">
                            <div className="filter-group">
                                <label>From: </label>
                                <input
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="filter-group">
                                <label>To: </label>
                                <input
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <div className="status-filter">
                                <label>Status: </label>
                                <select
                                    value={selectedStatus}
                                    onChange={(e) => setSelectedStatus(e.target.value)}
                                    style={{ padding: '5px', borderRadius: '4px' }}
                                >
                                    <option value="">All</option>
                                    <option value="REQUESTED">Requested</option>
                                    <option value="CONFIRMED">Confirmed</option>
                                    <option value="DECLINED">Declined</option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="table-container">
                    <table className="custom-table">
                        <thead>
                            <tr>
                                <th>Requested Date</th>
                                <th>User Name</th>
                                <th>Appointment Time</th>
                                <th>Pet Name</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment, index) => (
                                <tr key={index}>
                                    <td>{formatDate(appointment.createdAt)}</td>
                                    <td>{appointment.userName}</td>
                                    <td>{formatDate(appointment.appointmentDateTime)}</td>
                                    <td>{appointment.petName}</td>
                                    <td>
                                        <span className={`status-${appointment.status.toLowerCase()}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td>
                                        {appointment.status === 'REQUESTED' && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment.id, 'CONFIRMED')}
                                                    className="action-button confirm"
                                                >
                                                    Confirm
                                                </button>
                                                <button
                                                    onClick={() => handleStatusUpdate(appointment.id, 'DECLINED')}
                                                    className="action-button decline"
                                                >
                                                    Decline
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                            {appointments.length === 0 && (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: '20px' }}>
                                        No appointments found
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AppointmentRequestList;
