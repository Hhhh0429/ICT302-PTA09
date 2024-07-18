import React, { useState } from "react";
import axios from "axios";
import "./Register.css";

const Register: React.FC = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState(""); // Changed from userName to username
  const [password, setPassword] = useState("");
  const [userType, setUserType] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/register", {
        firstName,
        lastName,
        username, // Ensure this matches the backend expected field name
        password,
        userType,
      });
      setMessage("Registration successful. Please log in.");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error("Error response data:", error.response.data);
          setMessage(
            `Error: ${
              error.response.data.message ||
              "An error occurred during registration."
            }`
          );
        } else if (error.request) {
          console.error("Error request:", error.request);
          setMessage("No response received from server.");
        } else {
          console.error("Error message:", error.message);
          setMessage(`Error: ${error.message}`);
        }
      } else {
        console.error("Unexpected error:", error);
        setMessage("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="register">
      <form onSubmit={handleRegister}>
        <h2>Register</h2>
        <input
          type="text"
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Username" // Ensure this is correct
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="User Type"
          value={userType}
          onChange={(e) => setUserType(e.target.value)}
        />
        <button type="submit">Register</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Register;
