import { Link, Outlet, useNavigate } from "react-router-dom"
import logo from '../assets/png/Logo.png';
import login_icon from '../assets/png/User_icon.png';
import '/src/css/navbar.css'; // Importing the CSS file
import { useAuthStore } from '../store/auth.store';

const NavBar = () => {
    const authStore = useAuthStore((state) => state) as any
    const navigate = useNavigate()
    const token = authStore.isLogin;
    
    console.log("token:" + token);

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
                        <button onClick={() => navigate("/contact")}>Contact Us</button>

                        <div className="dropdown">
                            <button className="dropdown-toggle">
                            <img src={login_icon} alt="User Icon" className="navbar-user-icon" />
                            </button>
                            <div className="dropdown-menu">
                                {!authStore.isLogin ? (
                                    <>
                                        <button onClick={() => navigate("/login")}>Login</button>
                                        <button onClick={() => navigate("/signup")}>Sign Up</button>
                                    </>
                                ) : (
                                    <>
                                    <button onClick={() => navigate("/profile")}>Profile</button>
                                    <button onClick={() => navigate("/logout")}>logout</button>
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