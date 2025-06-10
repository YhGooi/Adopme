import { useEffect, useState, useCallback } from 'react';
import { useAuthStore } from '../../../store/auth.store';
import '../../../css/admin/adminList.css';
import '../../../css/admin/donationRequestList.css';

// Define interface for donation data based on DonationAdminResponse from backend
interface DonationAdminResponse {
    id: number;
    userId: number;
    userName: string;
    amount: number;
    donationDate: string;
    status: 'PROCESSING' | 'SUCCESS' | 'UNSUCCESS';
    hasReceipt: boolean;
}

const DonationRequestList = () => {
    const [donations, setDonations] = useState<DonationAdminResponse[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [startDate, setStartDate] = useState<string>('');
    const [endDate, setEndDate] = useState<string>('');
    const [selectedStatus, setSelectedStatus] = useState<'PROCESSING' | 'SUCCESS' | 'UNSUCCESS' | ''>('');
    const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);

    const authStore = useAuthStore();

    const clearFilters = () => {
        setStartDate('');
        setEndDate('');
        setSelectedStatus('');
        fetchDonations();
    };

    const fetchDonations = useCallback(async () => {
        if (!authStore.token) return;

        try {
            setLoading(true);
            setError(null);

            const url = new URL('http://localhost:8080/donation');

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
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            
            const data = await response.json();
            setDonations(data);
        } catch (err: any) {
            console.error('Error fetching donations:', err);
            setError(err.message || 'Failed to load donations');
        } finally {
            setLoading(false);
        }
    }, [authStore.token, startDate, endDate, selectedStatus]);

    useEffect(() => {
        fetchDonations();
    }, [fetchDonations]);

    // Add event listener to close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (openDropdownId !== null && 
                !(event.target as Element).closest('.dropdown-container')) {
                setOpenDropdownId(null);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [openDropdownId]);

    const handleDateChange = (setter: React.Dispatch<React.SetStateAction<string>>) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setter(value);
        fetchDonations;
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedStatus(e.target.value as 'PROCESSING' | 'SUCCESS' | 'UNSUCCESS' | '');
        fetchDonations;
    };

    // Format date to match the design
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const day = date.getDate();
        const month = date.toLocaleString('default', { month: 'short' });
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
    };

    // Format amount to include RM prefix and 2 decimal places
    const formatAmount = (amount: number) => {
        return `RM ${amount.toFixed(2)}`;
    };

    const getStatusClass = (status: DonationAdminResponse['status']) => {
        switch (status) {
            case 'PROCESSING': return 'admin-status-pending';
            case 'SUCCESS': return 'admin-status-approved';
            case 'UNSUCCESS': return 'admin-status-rejected';
            default: return '';
        }
    };

    // View receipt handler - downloads the receipt file
    const handleViewReceipt = async (donationId: number) => {
        try {
            // Fetch the receipt with authorization
            const response = await fetch(`http://localhost:8080/donation/${donationId}/receipt`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`
                }
            });
            
            if (!response.ok) {
                throw new Error(`Failed to fetch receipt: ${response.status}`);
            }
            
            // Get the receipt data as blob
            const receiptBlob = await response.blob();
            
            // Create a URL for the blob
            const downloadUrl = window.URL.createObjectURL(receiptBlob);
            
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = `receipt-${donationId}.jpg`; // Name the downloaded file
            
            // Append to the document, click it, and remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Clean up the blob URL
            window.URL.revokeObjectURL(downloadUrl);
        } catch (error) {
            console.error('Error downloading receipt:', error);
            alert('Failed to download receipt. Please try again.');
        }
    };
    
    // Handle donation status update
    const handleUpdateStatus = async (donationId: number, newStatus: 'SUCCESS' | 'UNSUCCESS') => {
        try {
            setLoading(true);
            // Create URLSearchParams to match the controller's @RequestParam format
            const params = new URLSearchParams();
            params.append('donationId', donationId.toString());
            params.append('donationStatus', newStatus);
            
            const response = await fetch(`http://localhost:8080/donation/update`, {
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
            setDonations(donations.map(donation => 
                donation.id === donationId ? { ...donation, status: newStatus } : donation
            ));
        } catch (err: any) {
            console.error('Error updating donation status:', err);
            setError(err.message || 'Failed to update donation status');
        } finally {
            setLoading(false);
        }
    };

    const todayStr = new Date().toISOString().split('T')[0];

    // Loading and error states are now handled as part of the main render
    return (
        <div className="admin-list-container">
            <div className="admin-title-bar">
                <h2>DONATION REQUEST</h2>
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
                            <option value="PROCESSING">Processing</option>
                            <option value="SUCCESS">Success</option>
                            <option value="UNSUCCESS">Unsuccess</option>
                        </select>
                    </div>
                    <button className="admin-clear-button" onClick={clearFilters}>Clear Filters</button>
                </div>
            </div>

            <div className="admin-table-container">
                {loading ? (
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <span>Loading donations...</span>
                    </div>
                ) : error ? (
                    <div className="error-message">{error}</div>
                ) : donations.length === 0 ? (
                    <div className="no-data-message">No donations found</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th className={"admin-date-column"}>Date</th>
                                <th>Donor Name</th>
                                <th>Amount</th>
                                <th className={"admin-status-column"}>Status</th>
                                <th className="donation-action-column">Receipt</th>
                                <th className="donation-action-column"></th>
                                <th className="donation-action-column"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => (
                                <tr key={donation.id} style={{ position: 'relative' }}>
                                    <td  className={"admin-date-column"}>{formatDate(donation.donationDate)}</td>
                                    <td>{donation.userName}</td>
                                    <td>{formatAmount(donation.amount)}</td>
                                    <td className={"admin-status-column"}>
                                        <span className={`admin-status-badge ${getStatusClass(donation.status)}`}>
                                            {donation.status}
                                        </span>
                                    </td>
                                    <td className="donation-action-column">
                                        {donation.hasReceipt && (
                                            <button 
                                                onClick={() => handleViewReceipt(donation.id)}
                                                className="donation-receipt-button"
                                            >
                                                View
                                            </button>
                                        )}
                                    </td>
                                    <td className="donation-action-column">
                                        {donation.status === 'PROCESSING' && (
                                            <button 
                                                className="dropdown-option approve"
                                                onClick={() => handleUpdateStatus(donation.id, 'SUCCESS')}
                                            >
                                                ✓
                                            </button>
                                        )}
                                    </td>
                                    <td className="donation-action-column">
                                        {donation.status === 'PROCESSING' && (
                                            <button 
                                                className="dropdown-option reject"
                                                onClick={() => handleUpdateStatus(donation.id, 'UNSUCCESS')}
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

export default DonationRequestList;