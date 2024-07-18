import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Login.css";

interface LoginProps {
  onLogin: (
    firstName: string,
    isStaff: boolean,
    isAdmin: boolean,
    token: string
  ) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Create a navigate instance

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3000/auth/login", {
        username,
        password,
      });

      const { token, firstName, role } = response.data;
      const isStaff = role === "staff";
      const isAdmin = role === "admin";

      localStorage.setItem("token", token);
      setMessage("Login successful");

      // Call onLogin with firstName, isStaff, and token
      onLogin(firstName, isStaff, isAdmin, token);

      // Log token to console for debugging
      console.log("Token stored in localStorage:", token);
      console.log(`Logged in as ${firstName}, Role: ${role}`);

      // Redirect to home page after successful login
      navigate("/");
    } catch (error) {
      setMessage("Invalid credentials");
      console.error("Login error:", error);
    }
  };

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};

export default Login;
