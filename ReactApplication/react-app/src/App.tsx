import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import HelpAssistantIcon from "./Components/HelpAssistantIcon";
import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer"; // Import Footer component
import Login from "./Components/Login";
import Register from "./Components/Register";
import Home from "./Components/Home";
import About from "./Components/About";
import Contact from "./Components/Contact";
import Chatbox from "./Components/Chatbox";
import AdminDashboard from "./Components/AdminDashboard";
import UserDashboard from "./Components/UserDashboard";
import UserList from "./Components/UserList"; // Import the new UserList component
import ManageInstruments from "./Components/ManageInstruments";
import StudentInstruments from "./Components/StudentInstruments"; // Import the StudentInstruments component
import InstrumentDetail from "./Components/InstrumentDetail";
import "./App.css";

// Example parseJwt function to decode JWT token
function parseJwt(token: string) {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error parsing JWT:", error);
    return null;
  }
}

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [isStaff, setIsStaff] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showChatbox, setShowChatbox] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      console.log("Token from localStorage:", token);
      try {
        const decodedToken = parseJwt(token);
        console.log("Decoded token:", decodedToken);

        if (decodedToken && decodedToken.exp * 1000 > Date.now()) {
          const { firstName, role, userId } = decodedToken; // Extract userId from token
          setIsAuthenticated(true);
          setFirstName(firstName);
          setIsStaff(role === "staff");
          setIsAdmin(role === "admin");
          setUserId(userId); // Set the user ID (changed from userID to userId)
          setShowChatbox(true);
        } else {
          // Handle invalid or expired token
          localStorage.removeItem("token");
          console.error("Invalid or expired token");
        }
      } catch (error) {
        console.error("Error decoding token:", error);
      }
    } else {
      console.warn("Token not found in localStorage");
    }
  }, []);

  const handleLogin = (
    firstName: string,
    isStaff: boolean,
    isAdmin: boolean,
    token: string
  ) => {
    setIsAuthenticated(true);
    setFirstName(firstName);
    setIsStaff(isStaff);
    setIsAdmin(isAdmin);
    setShowChatbox(true);

    // Store token in localStorage
    localStorage.setItem("token", token);

    // Decode token to get user ID
    const decodedToken = parseJwt(token);
    if (decodedToken && decodedToken.userId) {
      setUserId(decodedToken.userId);
    }

    console.log(`User logged in: ${firstName}, isAdmin: ${isAdmin}`);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        console.log("User logged out successfully");
        setIsAuthenticated(false);
        setFirstName("");
        setIsStaff(false);
        setIsAdmin(false);
        setUserId(null); // Clear the user ID
        localStorage.removeItem("token");
        setShowChatbox(false);
      } else {
        console.log("Logout failed");
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  const toggleChatbox = () => {
    setShowChatbox(!showChatbox);
  };

  return (
    <Router>
      <div className="app">
        <Navbar
          isAuthenticated={isAuthenticated}
          firstName={firstName}
          isStaff={isStaff}
          isAdmin={isAdmin}
          onLogout={handleLogout}
        />
        <div className="container">
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  isAuthenticated={isAuthenticated}
                  firstName={firstName}
                  isStaff={isStaff}
                  isAdmin={isAdmin}
                />
              }
            />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/" replace />
                ) : (
                  <Login onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? <Navigate to="/" replace /> : <Register />
              }
            />
            <Route path="/logout" element={<Navigate to="/home" replace />} />
            {isStaff && (
              <>
                <Route path="/manage-users" element={<UserList />} />
                <Route
                  path="/manage-instruments"
                  element={<ManageInstruments />}
                />
                <Route
                  path="/instrument/:id"
                  element={
                    <InstrumentDetail isStaff={isStaff} isAdmin={isAdmin} />
                  }
                />{" "}
              </>
            )}
            {isAdmin && (
              <>
                <Route path="/staff" element={<AdminDashboard />} />
                <Route path="/manage-users" element={<UserList />} />
                <Route
                  path="/manage-instruments"
                  element={<ManageInstruments />}
                />
                <Route
                  path="/instrument/:id"
                  element={
                    <InstrumentDetail isStaff={isStaff} isAdmin={isAdmin} />
                  }
                />{" "}
              </>
            )}
            {isAuthenticated && (
              <Route
                path="/search"
                element={
                  <StudentInstruments isStaff={isStaff} isAdmin={isAdmin} />
                }
              />
            )}
            {isAuthenticated && (
              <Route
                path="/instrument/:id"
                element={
                  <InstrumentDetail isStaff={isStaff} isAdmin={isAdmin} />
                }
              />
            )}
          </Routes>
        </div>
        <HelpAssistantIcon toggleChatbox={toggleChatbox} />
        {showChatbox && (
          <Chatbox
            isAuthenticated={isAuthenticated}
            firstName={firstName}
            userId={userId} // Pass the user ID here
            onLogout={handleLogout}
          />
        )}
        <Footer /> {/* Include Footer component at the bottom */}
      </div>
    </Router>
  );
};

export default App;
