import { useNavigate } from "react-router-dom"
import logo from '../assets/png/Logo.png';
import login_icon from '../assets/png/User_icon.png';
import '/src/css/shared/navbar.css';
import { useAuthStore } from '../store/auth.store';
import { user_details } from '../store/auth.store';

const NavBar = () => {
    const authStore = useAuthStore((state) => state) as any;
    const userStore = user_details((state) => state) as any;
    const navigate = useNavigate();

    return (
        <div>
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo Section */}
                    <img className="navbar-logo" src={logo} />

                    {/* Navigation Buttons */}
                    <div className="navbar-buttons">
                        <button onClick={() => navigate("/home")}>Home</button>
                        <button onClick={() => navigate("/pet-listing")}>Find a Pet</button>
                        <button onClick={() => navigate("/donation")}>Donation</button>
                        <button onClick={() => navigate("/appointment")}>Appointment</button>
                        {/* Admin Dropdown - Only show if user is admin */}
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
                                        <button onClick={() => navigate("/messaging")}>Messages</button>
                                        <button onClick={() => navigate("/profile")}>My Profile</button>
                                        <button onClick={() => navigate("/signup")}>Update Profile</button>
                                        <button onClick={() => {
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
    )
}

export default NavBar