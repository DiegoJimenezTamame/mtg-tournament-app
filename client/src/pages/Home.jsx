import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const Home = () => {
  const [activeEvents, setActiveEvents] = useState([]);

  useEffect(() => {
    const fetchActiveEvents = async () => {
      try {
        const q = query(collection(db, 'events'), where('status', '==', 'waiting'));
        const querySnapshot = await getDocs(q);
        const events = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setActiveEvents(events);
      } catch (err) {
        console.error('Error fetching active events:', err);
      }
    };

    fetchActiveEvents();
  }, []);

  return (
    <div className="home-container" style={{ padding: '2rem' }}>
      <h1>Welcome to Magic: The Gathering Tournament Organizer</h1>
      <p>Browse currently active tournaments below:</p>

      {activeEvents.length === 0 ? (
        <p>No active events available at the moment.</p>
      ) : (
        <ul>
          {activeEvents.map(event => (
            <li key={event.id}>
              <Link to={`/event/${event.id}`}>
                <strong>{event.name}</strong> – {event.format} ({event.type}) | Code: {event.joinCode}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Home;
