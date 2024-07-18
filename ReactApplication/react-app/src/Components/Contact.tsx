// src/Components/Contact.tsx

import React from "react";
import './Contact.css'; // Import the CSS file for styling

import emailIcon from '/pictures/email logo.jpg';
import phoneIcon from '/pictures/phone logo.jpg';
import locationIcon from '/pictures/location logo.jpg';

const Contact: React.FC = () => {
  return (
    <div className="section" id="contact">
      <h2>Contact Us</h2>
      <p>
      If you have any questions or feedback, please don't hesitate to contact us using the information provided below.
      </p>
      <div className="contact-details">
        <div className="contact-item">
          <img src={emailIcon} alt="Email Icon" className="contact-icon" />
          <h3>Email</h3>
          <p>murdoch@email.com</p>
          <p className="description">For any academic inquiries, students and staff can email us at the above address.</p>
        </div>
        <div className="contact-item">
          <img src={phoneIcon} alt="Phone Icon" className="contact-icon" />
          <h3>Phone</h3>
          <p>+(65) 12345678</p>
          <p className="description">Contact us via phone for urgent matters or immediate assistance during office hours.</p>
        </div>
        <div className="contact-item">
          <img src={locationIcon} alt="Location Icon" className="contact-icon" />
          <h3>Location</h3>
          <p>8 Wilkie Rd, #02-01 Wilkie Edge, Singapore 228095</p>
          <p className="description">Visit our office for in-person consultations or administrative support.</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;