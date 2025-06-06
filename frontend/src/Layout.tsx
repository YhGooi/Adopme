import { Outlet } from 'react-router-dom';

import Footer from './component/Footer';
import NavBar from './component/NavBar';

import '/src/css/layout.css'; // Importing the CSS file

const Layout = () => {
    return (
        <div className="layout-container">
            <NavBar />
            <div className="layout-content">
                    <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;