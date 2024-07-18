import React from "react";
import styled from "styled-components";

const DashboardContainer = styled.div`
  margin: 20px;
  padding: 20px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  border-radius: 8px;
`;

const UserDashboard: React.FC = () => {
  return (
    <DashboardContainer>
      <h2>User Dashboard</h2>
      <p>Welcome to your dashboard! Here you can:</p>
      <ul>
        <li>View your profile information</li>
        <li>Manage your settings</li>
        <li>Access user-specific features</li>
      </ul>
    </DashboardContainer>
  );
};

export default UserDashboard;
