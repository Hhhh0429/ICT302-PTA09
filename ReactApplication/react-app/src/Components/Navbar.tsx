// src/Components/Navbar.tsx

import React from "react";
import { useNavigate } from "react-router-dom";
import "./Navbar.css";

import logo from "/pictures/murdoch logo.jpg"; // Update with the logo image path

interface NavbarProps {
  isAuthenticated: boolean;
  firstName: string;
  isStaff: boolean; // Add isAdmin prop
  isAdmin: boolean;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  isAuthenticated,
  firstName,
  isStaff,
  isAdmin,
  onLogout,
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onLogout();
    navigate("/"); // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <img src={logo} alt="Logo" className="logo-image" />
      </div>
      ;{" "}
      <div className="navbar-links">
        {isAuthenticated ? (
          <>
            <span className="navbar-username">Welcome, {firstName}!</span>
            {isAdmin ? (
              <>
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/manage-instruments")}>
                  Manage Instruments
                </button>
                <button onClick={() => navigate("/manage-users")}>
                  Manage Users
                </button>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : isStaff ? (
              <>
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/search")}>
                  Search for Instruments
                </button>
                <button onClick={() => navigate("/manage-users")}>
                  Manage Users
                </button>
                <button onClick={handleLogout}>Logout</button>
              </>
            ) : (
              <>
                <button onClick={() => navigate("/")}>Home</button>
                <button onClick={() => navigate("/about")}>About</button>
                <button onClick={() => navigate("/contact")}>Contact</button>
                <button onClick={() => navigate("/search")}>
                  Start Searching
                </button>
                <button onClick={handleLogout}>Logout</button>
              </>
            )}
          </>
        ) : (
          <>
            <button onClick={() => navigate("/")}>Home</button>
            <button onClick={() => navigate("/about")}>About</button>
            <button onClick={() => navigate("/contact")}>Contact</button>
            <button onClick={() => navigate("/login")} className="login-button">
              Login
            </button>
            <button onClick={() => navigate("/register")}>Register</button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
