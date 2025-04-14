import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
    // Fetch the tournaments data from your API
    const fetchTournaments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/tournaments');
        setTournaments(response.data);
      } catch (error) {
        console.error("Error fetching tournaments:", error);
      }
    };

    fetchTournaments();
  }, []);

  return (
    <div className="tournaments-list">
      <h2>Ongoing Tournaments</h2>
      {tournaments.length === 0 ? (
        <p>No tournaments available at the moment.</p>
      ) : (
        <ul>
          {tournaments.map((tournament) => (
            <li key={tournament._id}>
              <h3>{tournament.name}</h3>
              <p>{tournament.description}</p>
              <button onClick={() => {/* Navigate to tournament details */}}>Join Tournament</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tournaments;
