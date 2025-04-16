import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

const Home = ({ user }) => {
  const [activeEvents, setActiveEvents] = useState([]);
  const [userEvents, setUserEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch all active events for non-logged-in users
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

    // Fetch the user's events (if logged in)
    const fetchUserEvents = async () => {
      if (user) {
        try {
          const q = query(collection(db, 'events'), where('createdBy', '==', user.email));
          const querySnapshot = await getDocs(q);
          const userEvents = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setUserEvents(userEvents);
        } catch (err) {
          console.error('Error fetching user events:', err);
        }
      }
    };

    // Execute the fetch functions
    fetchActiveEvents();
    fetchUserEvents();
    setLoading(false);
  }, [user]);

  if (loading) return <p>Loading...</p>;

  const formatDate = (date) => {
    if (date && date.seconds) {
      return new Date(date.seconds * 1000).toLocaleDateString();
    }
    return "Date not available";  // Fallback if date is not valid
  };

  return (
    <div className="home-container" style={{ padding: '2rem' }}>
      <h1>Welcome to Magic: The Gathering Tournament Organizer</h1>

      {/* If the user is logged in */}
      {user ? (
        <div>
          <p>You are logged in as {user.email}</p>
          <h2>Your Events</h2>
          {userEvents.length === 0 ? (
            <p>You have not created any events yet.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Join Code</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {userEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{formatDate(event.date)}</td> {/* Use the formatDate function here */}
                    <td>{event.joinCode}</td>
                    <td>
                      <Link to={`/event/${event.id}`} style={styles.link}>View Details</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      ) : (
        // If the user is not logged in, show open events with join codes
        <div>
          <h2>Open Events</h2>
          {activeEvents.length === 0 ? (
            <p>No active events available at the moment.</p>
          ) : (
            <table style={styles.table}>
              <thead>
                <tr>
                  <th>Event Name</th>
                  <th>Event Date</th>
                  <th>Organizer</th>
                  <th>Join Code</th>
                  <th>Join Event</th>
                </tr>
              </thead>
              <tbody>
                {activeEvents.map((event) => (
                  <tr key={event.id}>
                    <td>{event.name}</td>
                    <td>{formatDate(event.date)}</td> {/* Use the formatDate function here */}
                    <td>{event.createdBy}</td>
                    <td>{event.joinCode}</td>
                    <td>
                      <Link to={`/register?eventCode=${event.joinCode}`} style={styles.link}>Join</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    marginTop: '20px',
  },
  th: {
    padding: '10px',
    backgroundColor: '#f4f4f9',
    textAlign: 'left',
    borderBottom: '1px solid #ccc',
  },
  td: {
    padding: '10px',
    borderBottom: '1px solid #ccc',
  },
  link: {
    textDecoration: 'none',
    color: '#4CAF50',
    fontWeight: 'bold',
  },
};

export default Home;
