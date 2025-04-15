import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the path if necessary

const SeatingPage = () => {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [seating, setSeating] = useState([]);

  useEffect(() => {
    const fetchEvent = async () => {
      const docRef = doc(db, "events", eventId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        setEvent(docSnap.data());
        if (docSnap.data().generateSeatings) {
          generateRandomSeating();
        }
      } else {
        console.log("No such document!");
      }
    };

    fetchEvent();
  }, [eventId]);

  const generateRandomSeating = () => {
    // Example: Random seating assignment logic
    const participants = ["Player 1", "Player 2", "Player 3", "Player 4"]; // Replace with actual participants
    const shuffledParticipants = participants.sort(() => Math.random() - 0.5);
    setSeating(shuffledParticipants);
  };

  if (!event) return <div>Loading...</div>;

  return (
    <div>
      <h2>Seating for {event.name}</h2>
      {seating.length > 0 ? (
        <table>
          <thead>
            <tr>
              <th>Seat</th>
              <th>Player</th>
            </tr>
          </thead>
          <tbody>
            {seating.map((player, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{player}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No seating available</p>
      )}
    </div>
  );
};

export default SeatingPage;
