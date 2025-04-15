import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { doc, getDoc, collection, getDocs } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';  // Import Firebase Authentication

const EventDetails = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [players, setPlayers] = useState([]);
  const [user, setUser] = useState(null);  // State to hold the authenticated user

  // Fetch the authenticated user on component mount
  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        console.log("User authenticated:", authUser);  // Log the user info
      } else {
        console.log("No user is authenticated.");  // Log if no user is authenticated
      }
      setUser(authUser);  // Set the user when it's available
    });

    return () => unsubscribe(); // Cleanup listener when the component unmounts
  }, []);

  // Fetch event data once user and eventId are available
  useEffect(() => {
    if (!user || !eventId) {
      console.log('User or event ID is not available.');
      return;  // Prevent fetching data if the user is not authenticated or eventId is missing
    }

    const fetchEventData = async () => {
      try {
        console.log("Fetching event data...");

        // Fetch event data
        const eventDocRef = doc(db, 'events', eventId);
        const eventSnap = await getDoc(eventDocRef);

        if (eventSnap.exists()) {
          setEvent({ id: eventSnap.id, ...eventSnap.data() });
          console.log("Event data fetched:", eventSnap.data());  // Log event data
        } else {
          console.log("Event not found.");
        }

        // Fetch players and their timestamps
        const playersRef = collection(db, 'events', eventId, 'players');
        const playersSnap = await getDocs(playersRef);
        const playersList = playersSnap.docs.map(doc => ({
          name: doc.data().name,
          timestamp: doc.data().timestamp?.toDate().toLocaleString() || "Not available"
        }));
        setPlayers(playersList);
      } catch (err) {
        console.error("Error fetching event data:", err);
      }
    };

    fetchEventData();
  }, [eventId, user]);  // Re-run effect when eventId or user changes

  // Show loading message until user is authenticated
  if (!user) {
    return <div>Loading user authentication...</div>;
  }

  // Show loading message until event data is fetched
  if (!eventId) {
    return <div>Event ID is missing...</div>;
  }

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
            <li key={index}>{player.name} - {player.timestamp}</li>
          ))}
        </ul>
      ) : (
        <p>No players have signed up yet.</p>
      )}
    </div>
  );
};

export default EventDetails;
