import React from 'react';

const Player = ({ player }) => {
  // Destructure player data from props
  const { _id, name, email, isGuest, joinedEvents, stats } = player;

  return (
    <div className="player-card">
      <h2>{name}</h2>
      <p>Email: {email}</p>
      <p>Guest Status: {isGuest ? 'Yes' : 'No'}</p>
      <p>Joined Events: {joinedEvents.length}</p>

      <div className="player-stats">
        <h3>Player Stats:</h3>
        <p>Win Rate: {(stats.winRate * 100).toFixed(2)}%</p>
        <p>Matches Played: {stats.matchesPlayed}</p>
        <p>Matches Won: {stats.matchesWon}</p>
      </div>
    </div>
  );
};

export default Player;
