// src/Components/About.tsx

import React from "react";
import universityImage from '/pictures/sch.jpg'; // Import image
import "./About.css"; // Import custom CSS for About page styling

const About: React.FC = () => {
  return (
    <div className="about-section">
      <div className="main-content">
        <img src={universityImage} alt="University Building" className="university-image" />
        <div className="description">
          <div className="description-section">
            <h3>Welcome to Our University</h3>
            <p>
              Where we are committed to excellence in education and governance. Our university is dedicated to providing a comprehensive learning environment that fosters academic growth and personal development.
            </p>
          </div>
          <div className="description-section">
            <h3>University Governance</h3>
            <p>
              The governance of our university is supported by a robust framework of documents known as Instruments. These documents ensure that our operations are conducted in compliance with legal and regulatory requirements. The Instruments include a hierarchy of documents such as Acts, By-laws, Statutes, Regulations, Rules, Codes, Policies, Procedures, Standards, Guidelines, Local Area Business Processes, and Frameworks. Additionally, Charters, Terms of Reference documents, Plans, and Statements contribute to our governance structure.
            </p>
          </div>
          <div className="description-section">
            <h3>Our Mission</h3>
            <p>
              Our mission is to develop a software solution that streamlines the organization, association, and search of university governance documents (Instruments). This solution aims to enhance operational efficiency and ensure compliant operations across all facets of our university.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
