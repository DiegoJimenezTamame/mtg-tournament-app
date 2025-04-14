import React from 'react';
import Player from './Player';  // Assuming Player component is in the same directory

const Round = ({ round }) => {
  const { _id, eventId, roundNumber, pairings, startedAt, endedAt } = round;

  return (
    <div className="round-details">
      <h2>Round {roundNumber} - Event ID: {eventId}</h2>
      <p>Start Time: {new Date(startedAt).toLocaleString()}</p>
      <p>End Time: {new Date(endedAt).toLocaleString()}</p>

      <div className="pairings">
        <h3>Pairings:</h3>
        {pairings.map((pairing, index) => (
          <div key={index} className="pairing">
            <h4>Match {index + 1}</h4>
            <div className="matchup">
              <Player player={{ _id: pairing.player1 }} />
              <span>vs</span>
              <Player player={{ _id: pairing.player2 }} />
            </div>
            <div className="result">
              <p>Player 1 Wins: {pairing.result.player1Wins}</p>
              <p>Player 2 Wins: {pairing.result.player2Wins}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Round;
