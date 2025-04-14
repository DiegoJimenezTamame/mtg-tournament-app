// client/src/pages/Events.jsx
import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  serverTimestamp,
} from "firebase/firestore";

const Events = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [name, setName] = useState("");
  const [format, setFormat] = useState("");
  const [type, setType] = useState("");

  // Fetch events created by current user
  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("createdBy", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
    };

    fetchEvents();
  }, [user]);

  const handleCreateEvent = async () => {
    if (!name || !format || !type) return;

    const newEvent = {
      name,
      format,
      type,
      players: [],
      rounds: [],
      settings: {
        maxRounds: 4,
        bestOf: 3,
        countdown: 50,
      },
      status: "waiting",
      joinCode: Math.random().toString(36).substring(2, 8).toUpperCase(),
      createdBy: user.uid,
      createdAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, "events"), newEvent);
    setEvents(prev => [...prev, { id: docRef.id, ...newEvent }]);
    setName("");
    setFormat("");
    setType("");
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create New Event</h2>
      <input
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />
      <input
        placeholder="Format"
        value={format}
        onChange={(e) => setFormat(e.target.value)}
      /><br />
      <input
        placeholder="Type"
        value={type}
        onChange={(e) => setType(e.target.value)}
      /><br />
      <button onClick={handleCreateEvent}>Create Event</button>

      <h3>Your Events</h3>
      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <ul>
          {events.map(event => (
            <li key={event.id}>
              <strong>{event.name}</strong> – {event.format} ({event.type}) | Code: {event.joinCode}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Events;
