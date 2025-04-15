import React, { useState } from "react";
import { db } from "../firebase";
import { collection, query, where, getDocs, updateDoc, doc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";  // Updated import
import { FaCheckCircle } from "react-icons/fa"; // For the check icon

const RegisterPlayer = ({ user }) => {
  const [eventCode, setEventCode] = useState("");
  const [playerName, setPlayerName] = useState(""); // To store player's name
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // To store success message
  const navigate = useNavigate();  // Use navigate instead of history

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!eventCode || !playerName) {
      setErrorMessage("Both name and event code are required");
      return;
    }

    const eventsRef = collection(db, "events");
    const q = query(eventsRef, where("joinCode", "==", eventCode));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const event = querySnapshot.docs[0];
      // Register the player by adding their name to the event's players list
      const eventRef = doc(db, "events", event.id);
      await updateDoc(eventRef, {
        players: [
          ...(event.data().players || []),
          { uid: user.uid, name: playerName, timestamp: new Date() } // Save player's name along with UID and timestamp
        ],
      });

      // Set the success message and display the notification
      setSuccessMessage("You have joined the event!");
      setTimeout(() => {
        navigate(`/event/${event.id}`);  // Redirect to event details page
      }, 2000); // Delay before redirecting to show the success message
    } else {
      setErrorMessage("Invalid event code");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Join an Event</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          placeholder="Enter your name"
          style={styles.input}
        />
        <input
          type="text"
          value={eventCode}
          onChange={(e) => setEventCode(e.target.value)}
          placeholder="Enter Event Code"
          style={styles.input}
        />
        <button type="submit" style={styles.button}>Register</button>
      </form>

      {errorMessage && <p style={styles.errorMessage}>{errorMessage}</p>}
      {successMessage && (
        <div style={styles.successMessage}>
          <FaCheckCircle style={styles.checkIcon} />
          {successMessage}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "2rem",
    maxWidth: "400px",
    margin: "0 auto",
    backgroundColor: "#f4f4f9",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
  },
  input: {
    padding: "0.8rem",
    border: "1px solid #ccc",
    borderRadius: "4px",
    fontSize: "1rem",
  },
  button: {
    padding: "0.8rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "1rem",
  },
  errorMessage: {
    color: "#ef4444",
    fontSize: "1rem",
    marginTop: "1rem",
  },
  successMessage: {
    color: "#10b981",
    display: "flex",
    alignItems: "center",
    fontSize: "1.2rem",
    marginTop: "1rem",
  },
  checkIcon: {
    marginRight: "0.5rem",
    fontSize: "1.5rem",
  },
};

export default RegisterPlayer;
