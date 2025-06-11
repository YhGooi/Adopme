import { useNavigate } from "react-router-dom"
import { useState, useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import logo from '../assets/png/Logo.png';
import login_icon from '../assets/png/UserIcon.png';
import '/src/css/shared/navbar.css';
import { useAuthStore, user_details } from '../store/auth.store';

const NavBar = () => {
    const authStore = useAuthStore((state) => state) as any;
    const userStore = user_details((state) => state) as any;
    const navigate = useNavigate();
    const [totalUnreadCount, setTotalUnreadCount] = useState(0);
    const [stompClient, setStompClient] = useState<Client | null>(null);

    const fetchTotalUnreadCount = async () => {
        if (!authStore.isLogin || !userStore.email) return;
        
        try {
            const response = await fetch('http://localhost:8080/user/contacts', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${authStore.token}`,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contacts = await response.json();
            if (Array.isArray(contacts)) {
                // Get unread counts for all contacts
                const counts = await Promise.all(contacts.map(async (contact) => {
                    try {
                        const countResponse = await fetch(`http://localhost:8080/messages/unread/${contact}/${userStore.email}`, {
                            headers: {
                                'Authorization': `Bearer ${authStore.token}`,
                                'Content-Type': 'application/json'
                            }
                        });
                        if (countResponse.ok) {
                            return await countResponse.json();
                        }
                        return 0;
                    } catch (error) {
                        console.error(`Error fetching unread count for ${contact}:`, error);
                        return 0;
                    }
                }));
                
                // Sum up all unread messages
                const total = counts.reduce((acc, count) => acc + count, 0);
                setTotalUnreadCount(total);
            }
        } catch (error) {
            console.error('Error fetching total unread count:', error);
        }
    };

    useEffect(() => {
        if (authStore.isLogin && userStore.email) {
            // Initial fetch
            fetchTotalUnreadCount();

            // Set up WebSocket connection
            const client = new Client({
                brokerURL: 'ws://localhost:8080/ws',
                connectHeaders: {
                    Authorization: `Bearer ${authStore.token}`
                },                onConnect: () => {
                    console.log('NavBar connected to WebSocket');
                    client.subscribe(`/user/${userStore.email}/queue/private`, () => {
                        // Refresh unread count when new message arrives
                        fetchTotalUnreadCount();
                    });
                },
                onStompError: (frame) => {
                    console.error('STOMP error:', frame.headers['message']);
                },
                onWebSocketError: (event) => {
                    console.error('WebSocket error:', event);
                }
            });

            client.activate();
            setStompClient(client);

            // Backup periodic refresh
            const interval = setInterval(fetchTotalUnreadCount, 30000);

            return () => {
                clearInterval(interval);
                if (client.active) {
                    client.deactivate();
                }
            };
        }
    }, [authStore.isLogin, userStore.email, authStore.token]);

    return (
        <div>
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo Section */}
                    <img className="navbar-logo" src={logo} alt="Logo" />

                    {/* Navigation Buttons */}
                    <div className="navbar-buttons">
                        <button onClick={() => navigate("/home")}>Home</button>
                        <button onClick={() => navigate("/pet-listing")}>Find a Pet</button>
                        <button onClick={() => navigate("/donation")}>Donation</button>
                        <button onClick={() => navigate("/appointment")}>Appointment</button>
                        
                        {/* Admin Dropdown */}
                        {userStore.type === 'ADMIN' && authStore.isLogin && (
                            <div className="dropdown admin-dropdown">
                                <button className="dropdown-toggle">
                                    Admin
                                </button>
                                <div className="dropdown-menu">
                                    <button onClick={() => navigate("/admin/adoption-request-list")}>
                                        Adoption Requests
                                    </button>
                                    <button onClick={() => navigate("/admin/pet-listing")}>
                                        Pet Listings
                                    </button>
                                    <button onClick={() => navigate("/admin/appointment-request-list")}>
                                        Appointment Requests
                                    </button>
                                    <button onClick={() => navigate("/admin/donation-request-list")}>
                                        Donation Requests
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* User Dropdown */}
                        <div className="dropdown">
                            <button className="dropdown-toggle">
                                <img src={login_icon} alt="User Icon" className={`navbar-user-icon ${!authStore.isLogin ? 'glow-effect' : ''}`} />
                                {authStore.isLogin && (
                                    <div className="navbar-username">
                                        {userStore.name || 'User'}
                                    </div>
                                )}
                            </button>
                            <div className="dropdown-menu">
                                {!authStore.isLogin ? (
                                    <>
                                        <button onClick={() => navigate("/login")}>Login</button>
                                        <button onClick={() => navigate("/signup")}>Sign Up</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => navigate("/messaging")} className="message-button">
                                            Messages
                                            {totalUnreadCount > 0 && (
                                                <span className="navbar-unread-count">{totalUnreadCount}</span>
                                            )}
                                        </button>
                                        <button onClick={() => navigate("/profile")}>My Profile</button>
                                        <button onClick={() => navigate("/updateProfile")}>Update Profile</button>
                                        <button onClick={() => {
                                            if (stompClient?.active) {
                                                stompClient.deactivate();
                                            }
                                            authStore.logout();
                                            navigate("/login");
                                        }}>
                                            Logout
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NavBar;