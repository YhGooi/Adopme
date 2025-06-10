import React, { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import '../../../css/admin/adminList.css';
import '../../../css/admin/appointmentRequestList.css';

interface Appointment {
    id: number;
    appointmentDateTime: string;
    createdAt: string;
    petName: string;
    status: 'REQUESTED' | 'CONFIRMED' | 'DECLINED';
    userName: string;
}

const AppointmentRequestList: React.FC = () => {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<'REQUESTED' | 'CONFIRMED' | 'DECLINED' | ''>('REQUESTED'); // Default to show REQUESTED appointments
    const authStore = useAuthStore();

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedStatus('');
        fetchAppointments();
    };
    
    const fetchAppointments = useCallback(async () => {
        if (!authStore.token) return;

        try {
            setLoading(true);
            setError(null);

            setLoading(true);            
            const url = new URL(`http://localhost:8080/appointment`);

            if (startDate) {
                const formattedStartDate = new Date(startDate).toISOString();
                url.searchParams.append('startDate', formattedStartDate);
            }

            if (endDate) {
                const formattedEndDate = new Date(endDate).toISOString();
                url.searchParams.append('endDate', formattedEndDate);
            }

            // Status is optional
            if (selectedStatus) {
                url.searchParams.append('status', selectedStatus);
            }

            const response = await fetch(url.toString(), {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setAppointments(data);
        } catch (err: any) {
            console.error('Error fetching appointments:', err);
            setError(err.message || 'Failed to load appointments');
        } finally {
            setLoading(false);
        }
    }, [authStore.token, startDate, endDate, selectedStatus]);

    useEffect(() => {
        fetchAppointments();
    }, [fetchAppointments]);


    const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value);
        fetchAppointments;
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value as 'REQUESTED' | 'CONFIRMED' | 'DECLINED' | '');
        fetchAppointments;
    };

    // Format date to match the design
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    const getStatusClass = (status: Appointment['status']) => {
        switch (status) {
            case 'REQUESTED': return 'admin-status-requested';
            case 'CONFIRMED': return 'admin-status-confirmed';
            case 'DECLINED': return 'admin-status-declined';
            default: return '';
        }
    };

    const handleUpdateStatus = async (appointmentId: number, newStatus: 'CONFIRMED' | 'DECLINED') => {
        try {
            setLoading(true);
            // Create URLSearchParams to match the controller's @RequestParam format
            const params = new URLSearchParams();
            params.append('appointmentId', appointmentId.toString());
            params.append('status', newStatus);
            
            const response = await fetch(`http://localhost:8080/appointment/update`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                },
                body: params
            });
            
            if (!response.ok) {
                throw new Error(`Failed to update status: ${response.status}`);
            }
            
            // Update local state to reflect the change
            setAppointments(appointments.map(appointment => 
                appointment.id === appointmentId ? { ...appointment, status: newStatus } : appointment
            ));
        } catch (err: any) {
            console.error('Error updating donation status:', err);
            setError(err.message || 'Failed to update donation status');
        } finally {
            setLoading(false);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    return (
        <div className="admin-list-container">
            <div className="admin-title-bar">
                <h2>APPOINTMENT REQUEST</h2>
                <div className="admin-filters">
                    <div className="admin-date-filters">
                        <div className="admin-filter-group">
                            <label htmlFor="startDate">From:</label>
                            <input
                                type="date"
                                id="startDate"
                                value={startDate}
                                max={endDate ? endDate : todayStr}
                                onChange={handleDateChange(setStartDate)}
                            />
                        </div>
                        <div className="admin-filter-group">
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
                    <div className="admin-status-filter">
                        <label htmlFor="status">Status:</label>
                        <select
                            id="status"
                            value={selectedStatus}
                            onChange={handleStatusChange}
                        >
                            <option value="">All</option>
                            <option value="REQUESTED">Requested</option>
                            <option value="CONFIRMED">Confirmed</option>
                            <option value="DECLINED">Declined</option>
                        </select>
                    </div>
                    <button className="admin-clear-button" onClick={clearFilters}>Clear Filters</button>
                </div>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>Loading appointments...</span>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : appointments.length === 0 ? (
                    <div className="no-data-message">No appointments found</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className={"admin-date-column"}>Date</th>
                                <th>User Name</th>
                                <th>Pet Name</th>
                                <th className={"admin-status-column"}>Status</th>
                                <th className="appointment-action-column"></th>
                                <th className="appointment-action-column"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {appointments.map((appointment) => (
                                <tr key={appointment.id} style={{ position: 'relative' }}>
                                    <td  className={"admin-date-column"}>{formatDate(appointment.appointmentDateTime)}</td>
                                    <td>{appointment.userName}</td>
                                    <td>{appointment.petName}</td>
                                    <td className={"admin-status-column"}>
                                        <span className={`admin-status-badge ${getStatusClass(appointment.status)}`}>
                                            {appointment.status}
                                        </span>
                                    </td>
                                    <td className="appointment-action-column">
                                        {appointment.status === 'REQUESTED' && (
                                            <button 
                                                className="appointment-action approve"
                                                onClick={() => handleUpdateStatus(appointment.id, 'CONFIRMED')}
                                            >
                                                ✓
                                            </button>
                                        )}
                                    </td>
                                    <td className="appointment-action-column">
                                        {appointment.status === 'REQUESTED' && (
                                            <button 
                                                className="appointment-action reject"
                                                onClick={() => handleUpdateStatus(appointment.id, 'DECLINED')}
                                            >
                                                X
                                            </button>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AppointmentRequestList;
