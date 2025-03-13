import React from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import '../styles/Header.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
const Header = () =>{
    const location = useLocation();
    const getTitle = (pathname) => {
        switch (pathname) {
            case '/dashboard':
                return 'Dashboard';
            case '/product':
                return 'Product';
            case '/member':
                return 'Member';
            case '/import':
                return 'Import';
            case '/export':
                return 'Export';
            case '/receipt':
                return 'Receipt';
            case '/contact':
                return 'Contact';
            default:
                return 'Dashboard';
        }
    };
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };
    return (
        <div className="header">
            <nav className="nav_bar">
                <span><h2>{getTitle(location.pathname)}</h2></span>
                <form action="" className='d-flex'>
                    <input type="text" className="search_total" placeholder="Find a function?"/>
                    <button className="search_total_button" type='btton'><i className="fas fa-search"></i></button>
                </form>
                <button className='btn btn-warning' onClick={handleLogout}>Logout</button>
            </nav>
        </div>
    );   
}
export default Header;