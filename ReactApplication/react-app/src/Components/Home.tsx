// src/Components/Home.tsx

import React, { useState, useEffect } from "react";
import "./Home.css";
import { Link } from "react-router-dom";
import styled from "styled-components";

interface HomeProps {
  isAuthenticated: boolean;
  firstName: string;
  isStaff: boolean; // Add isAdmin prop
  isAdmin: boolean;
}

const Home: React.FC<HomeProps> = ({ isAuthenticated, firstName }) => {
  const testimonials = [
    { id: 1, text: '"This is the best app ever!" - User 1' },
    { id: 2, text: '"Amazing features and great support!" - User 2' },
    { id: 3, text: '"I love using this application every day!" - User 3' },
    { id: 4, text: '"Fantastic user experience and support." - User 4' },
    { id: 5, text: '"Highly recommend this app to everyone." - User 5' },
  ];

  const imageUrls = [
    "/pictures/home1.jpg",
    "/pictures/home2.jpg",
    "/pictures/home3.jpg",
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((currentSlide) => (currentSlide + 1) % imageUrls.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="home">
      <div className="hero-banner">
        <div className="banner-slides">
          {imageUrls.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Banner Image ${index + 1}`}
              className={`banner-image ${
                index === currentSlide ? "active" : ""
              }`}
            />
          ))}
        </div>
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Welcome to Our Application</h1>
          <p>Discover our features and services</p>
        </div>
      </div>

      <div className="testimonials">
        <h2>Testimonials</h2>
        {testimonials.map((testimonial) => (
          <p key={testimonial.id}>"{testimonial.text}"</p>
        ))}
      </div>
    </div>
  );
};

export default Home;
