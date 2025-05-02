import { Link, Outlet, useNavigate } from "react-router-dom"
import logo from '../assets/png/Logo.png';
import login_icon from '../assets/png/User_icon.png';
import '/src/css/navbar.css'; // Importing the CSS file

const NavBar = () => {

    const navigate = useNavigate()

    const handleNavigate = (path: string) => {
        console.log("path: " + path)
        navigate(path)
    }

    return (
        <div>
            <div className="navbar">
                <div className="navbar-content">
                    {/* Logo Section */}
                    <div className="navbar-logo">
                        <img
                            src={logo}
                            alt="Logo"
                            height={40}
                        />
                    </div>

                    {/* Navigation Buttons */}
                    <div className="navbar-buttons">
                        <button onClick={() => handleNavigate("/home")}>Home</button>
                        <button onClick={() => handleNavigate("/pet_listing")}>Find a Pet</button>
                        <button onClick={() => handleNavigate("/request_adopt")}>Request for Adoption</button>
                        <button onClick={() => handleNavigate("/donation/Donation")}>Donation</button>
                        <button onClick={() => handleNavigate("/contact")}>Contact Us</button>
                        <button onClick={() => navigate("/login")} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded text-white">
                            <img src={login_icon} alt="User Icon" className="rounded-full w-5 h-5"/>
                        </button>
                    </div>
                </div>
            </div>

            {/* Page content */}
            <div className="page-content">
                <Outlet />
            </div>
        </div>
    )
}

export default NavBar