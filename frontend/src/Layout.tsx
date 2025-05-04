import { Outlet } from 'react-router-dom';

import Footer from './component/Footer';
import NavBar from './component/NavBar';

import { useEffect } from 'react';

const Layout = () => {
    return (
        <div className="flex flex-col h-screen">
            <main className="flex-grow">
                <Outlet />
            </main>
            
            <Footer />
        </div>
    );
};

export default Layout;