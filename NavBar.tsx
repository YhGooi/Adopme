import { Link, Outlet, useNavigate, useLocation } from "react-router-dom";
import logo from '../assets/png/Logo.png';
import login_icon from '../assets/png/User_icon.png';
import '/src/css/navbar.css';
import { useAuthStore } from '../store/auth.store';
import { user_details } from '../store/auth.store';

const NavBar = () => {
    const authStore = useAuthStore((state) => state) as any;
    const userStore = user_details((state) => state) as any;
    const navigate = useNavigate();

    // ✅ 添加以下逻辑
    const location = useLocation();
    const isAppointmentPage =
      location.pathname === '/appointment' || location.pathname === '/appointment/success';

    return (
        <div>
            <div className="navbar-container">
                <div className="navbar-content">
                    {/* Logo Section */}
                    <img className="navbar-logo" src={logo}/>

                    {/* Navigation Buttons */}
                    <div className="navbar-buttons">
                        <button onClick={() => navigate("/home")}>Home</button>
                        <button onClick={() => navigate("/pet_listing")}>Find a Pet</button>
                         <button onClick={() => navigate("/request_adopt")}>Request for Adoption</button>
                        <button onClick={() => navigate("/donation/Donation")}>Donation</button>
                            {/* ✅ 动态渲染按钮 */}
                        {isAppointmentPage ? (
                                <button onClick={() => navigate("/appointment")}>Appointment</button>
                            ) : (
                                <button onClick={() => navigate("/contact")}>Contact Us</button>
                            )}  
                        {/* Admin Dropdown - Only show if user is admin */}
                        {userStore.type === 'ADMIN' && (
                            <div className="dropdown admin-dropdown">
                                <button className="dropdown-toggle">
                                    Admin
                                </button>
                                <div className="dropdown-menu">
                                    <button onClick={() => navigate("/admin/adoption-request-list")}>
                                        Adoption Requests
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