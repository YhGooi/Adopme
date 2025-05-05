import { Link, Outlet, useNavigate } from "react-router-dom"
import logo from '../assets/png/Logo.png';
import login_icon from '../assets/png/User_icon.png';
import '/src/css/navbar.css'; // Importing the CSS file

const NavBar = () => {
    const navigate = useNavigate()

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
                        <button onClick={() => navigate("/login")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                            <img src={login_icon} alt="User Icon" className="navbar-user-icon"/>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NavBar