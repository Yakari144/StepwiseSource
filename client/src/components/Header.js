import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css'; // External CSS for custom styles

const Header = ({ pages }) => {
    return (
        <header className="header">
            <nav className="navbar">
                <ul className="nav-logo">
                    <Link to="/" className="nav-item">
                        <img className="header-img" src="/logo192.png" alt="home-image" />
                        StepwiseSource
                    </Link>
                </ul>
                <ul className="nav-links">
                    {pages.map((page, index) => (
                        <li key={index}>
                            <Link to={page === "Home" ? "/" : "/" + page.toLowerCase()} className="nav-item">
                                {page}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
