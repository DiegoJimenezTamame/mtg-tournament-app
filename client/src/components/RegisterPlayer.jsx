import React, { useState } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp
} from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

const RegisterPlayer = ({ user }) => {
  const [eventCode, setEventCode] = useState("");
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (!eventCode || !name || !surname) {
      setErrorMessage("Name, surname, and event code are required.");
      return;
    }

    try {
      const eventsRef = collection(db, "events");
      const q = query(eventsRef, where("joinCode", "==", eventCode));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setErrorMessage("Invalid event code.");
        return;
      }

      const event = querySnapshot.docs[0];
      const eventId = event.id;

      const playersRef = collection(db, "events", eventId, "players");
      const checkQuery = query(
        playersRef,
        where("name", "==", name),
        where("surname", "==", surname)
      );
      const checkSnap = await getDocs(checkQuery);

      if (!checkSnap.empty) {
        setErrorMessage("This name is already registered for this event.");
        return;
      }

      await addDoc(playersRef, {
        name,
        surname,
        fullName: `${name} ${surname}`,
        timestamp: serverTimestamp(),
        uid: user?.uid || null,
      });

      setSuccessMessage("You have joined the event!");
      setTimeout(() => {
        navigate(`/event/${eventId}`);
      }, 2000);
    } catch (err) {
      console.error("Error joining event:", err);
      setErrorMessage("Something went wrong. Please try again.");
    }
  };

  return (
    <div style={styles.container}>
      <h2>Join an Event</h2>
      <form onSubmit={handleRegister} style={styles.form}>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          style={styles.input}
        />
        <input
          type="text"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
          placeholder="Enter your surname"
          style={styles.input}
        />
        <input
          type="text"
          value={eventCode}
          onChange={(e) => setEventCode(e.target.value.toUpperCase())}
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
