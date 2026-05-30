import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
    const { user, logout } = useAuth();
    const navLinkStyles = ({ isActive }: { isActive: boolean }) => {
        return isActive 
            ? "text-[#2a4563] border-b-2 border-[#2a4563] px-3 py-2 rounded-t-md font-semibold transition-all"
            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50 border-b-2 border-transparent px-3 py-2 rounded-t-md transition-all";
    };

    return (
        <nav className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-50">
            <div className="flex space-x-2 md:space-x-6 text-sm md:text-base font-medium">
                
                <NavLink to="/" end className={navLinkStyles}>
                    Home
                </NavLink>
                
                <NavLink to="/tracker" className={navLinkStyles}>
                    Daily Tracker
                </NavLink>
                
                <NavLink to="/calendar" className={navLinkStyles}>
                    Calendar
                </NavLink>
                
                <NavLink to="/analysis" className={navLinkStyles}>
                    Analysis
                </NavLink>

            </div>
            
            <div className="flex items-center space-x-3">
                <span className="font-semibold text-slate-800">
                    {user?.username || 'Loading...'}
                </span>
                
                <button 
                    onClick={logout}
                    title="Click to logout"
                    className="w-10 h-10 bg-[#4b749f] hover:bg-[#2a4563] transition-colors rounded-full flex items-center justify-center text-white font-bold shadow-sm"
                >
                    {user?.username?.charAt(0).toUpperCase() || '?'}
                </button>
            </div>
        </nav>
    );
};

export default Navbar;