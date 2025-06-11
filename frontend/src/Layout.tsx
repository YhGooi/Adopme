import { Outlet } from 'react-router-dom';

import Footer from './component/Footer';
import NavBar from './component/NavBar';
import ScrollToTop from './component/ScrollToTop';

import '/src/css/shared/layout.css'; // Importing the CSS file

const Layout = () => {
    return (
        <div className="layout-container">
            <ScrollToTop />
            <NavBar />
            <div className="layout-content">
                    <Outlet />
            </div>
            <Footer />
        </div>
    );
};

export default Layout;