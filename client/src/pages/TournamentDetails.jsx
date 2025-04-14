import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';  // For route parameters like tournament ID
import axios from 'axios';

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const [tournament, setTournament] = useState(null);

  useEffect(() => {
    const fetchTournamentDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/tournaments/${tournamentId}`);
        setTournament(response.data);
      } catch (error) {
        console.error("Error fetching tournament details:", error);
      }
    };

    fetchTournamentDetails();
  }, [tournamentId]);

  if (!tournament) {
    return <p>Loading tournament details...</p>;
  }

  return (
    <div className="tournament-details">
      <h2>{tournament.name}</h2>
      <p>{tournament.description}</p>

      <h3>Rounds</h3>
      {tournament.rounds && tournament.rounds.length > 0 ? (
        <ul>
          {tournament.rounds.map((round, index) => (
            <li key={index}>
              <h4>Round {round.roundNumber}</h4>
              <p>Start: {new Date(round.startedAt).toLocaleString()}</p>
              <p>End: {new Date(round.endedAt).toLocaleString()}</p>
              {/* Render pairings and other round info here */}
            </li>
          ))}
        </ul>
      ) : (
        <p>No rounds yet.</p>
      )}
    </div>
  );
};

export default TournamentDetails;
