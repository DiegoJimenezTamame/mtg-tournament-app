import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventDocRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventDocRef);

        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() });
        } else {
          console.log("Event not found.");
        }

        const playersRef = collection(db, 'events', eventId, 'players');
        const playersSnap = await getDocs(playersRef);
        const playersList = playersSnap.docs.map(doc => doc.data().name);
        setPlayers(playersList);
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    };

    fetchEventData();
  }, [eventId]);

  if (!event) return <div>Loading event details...</div>;

  const {
    name,
    format,
    type,
    status,
    joinCode,
    createdAt,
    generateSeatings,
    entryFee,
    entryFeeAmount,
    date,
    settings = {}
  } = event;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Event: {name}</h2>

      <h3>General Info</h3>
      <ul>
        <li><strong>Format:</strong> {format}</li>
        <li><strong>Type:</strong> {type}</li>
        <li><strong>Status:</strong> {status}</li>
        <li><strong>Join Code:</strong> {joinCode}</li>
        {createdAt && (
          <li><strong>Created At:</strong> {new Date(createdAt.seconds * 1000).toLocaleString()}</li>
        )}
        {date && (
          <li><strong>Event Date:</strong> {new Date(date.seconds * 1000).toLocaleString()}</li>
        )}
        {entryFee !== undefined && (
          <li><strong>Entry Fee:</strong> {entryFee ? `Yes (€${entryFeeAmount})` : "No"}</li>
        )}
      </ul>

      <h3>Event Settings</h3>
      <ul>
        <li><strong>Max Rounds:</strong> {settings.maxRounds}</li>
        <li><strong>Best Of:</strong> {settings.bestOf}</li>
        <li><strong>Round Time (Countdown):</strong> {settings.countdown} minutes</li>
        {(format === "Draft" || format === "Cube Draft") && (
          <li><strong>Generate Seatings:</strong> {generateSeatings ? "Yes" : "No"}</li>
        )}
      </ul>

      <h3>Players Signed Up</h3>
      {players.length > 0 ? (
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player}</li>
          ))}
        </ul>
      ) : (
        <p>No players have signed up yet.</p>
      )}
    </div>
  );
};

export default EventDetails;
