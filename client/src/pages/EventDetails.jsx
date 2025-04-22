import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        setUser(authUser);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user || !eventId) return;

    const fetchEventData = async () => {
      try {
        const eventDocRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventDocRef);

        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() });
        }

        const playersRef = collection(db, 'events', eventId, 'players');
        const playersSnap = await getDocs(playersRef);
        const playersList = playersSnap.docs.map(doc => ({
          name: `${doc.data().firstName} ${doc.data().surname}`,
          timestamp: doc.data().timestamp?.toDate().toLocaleString() || "Not available"
        }));
        setPlayers(playersList);
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    };

    fetchEventData();
  }, [eventId, user]);

  const handleGeneratePairings = async () => {
    try {
      const round = 1;  // Example round, you may need to dynamically calculate it
      await axios.post(`http://localhost:5000/api/tournaments/pairings/${eventId}`, { round });
      alert('Pairings generated successfully!');
    } catch (error) {
      console.error('Error generating pairings:', error);
      alert('Failed to generate pairings.');
    }
  };

  if (!user) {
    return <div>Loading user authentication...</div>;
  }

  if (!eventId || !event) return <div>Loading event details...</div>;

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Event: {event.name}</h2>

      <h3>General Info</h3>
      <ul>
        <li><strong>Format:</strong> {event.format}</li>
        <li><strong>Type:</strong> {event.type}</li>
        <li><strong>Status:</strong> {event.status}</li>
        <li><strong>Join Code:</strong> {event.joinCode}</li>
      </ul>

      <h3>Players Signed Up</h3>
      {players.length > 0 ? (
        <ul>
          {players.map((player, index) => (
            <li key={index}>{player.name} - {player.timestamp}</li>
          ))}
        </ul>
      ) : (
        <p>No players have signed up yet.</p>
      )}

      {event.status === 'waiting' && (
        <div>
          <button onClick={handleGeneratePairings}>Generate Pairings</button>
        </div>
      )}
    </div>
  );
};

export default EventDetails;
