import React from 'react';
import { Link } from 'react-router-dom';  // For navigation to other pages

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Magic: The Gathering Tournament Organizer</h1>
      <p>Select an option to proceed</p>

      <div className="home-actions">
        <Link to="/login" className="btn">Login / Register</Link>
        <Link to="/tournaments" className="btn">View Tournaments</Link>
      </div>
    </div>
  );
};

export default Home;
