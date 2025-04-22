import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Tournaments = () => {
  const [tournaments, setTournaments] = useState([]);

  useEffect(() => {
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

  const handleGeneratePairings = async (tournamentId) => {
    try {
      const round = 1; // You can dynamically calculate the round if needed
      await axios.post(`http://localhost:5000/api/tournaments/pairings/${tournamentId}`, { round });
      alert('Pairings generated successfully!');
    } catch (error) {
      console.error('Error generating pairings:', error);
      alert('Failed to generate pairings.');
    }
  };

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
              <button onClick={() => handleGeneratePairings(tournament._id)}>
                Generate Pairings
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Tournaments;
