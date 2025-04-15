import React, { useState } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase";

const generateCode = (length = 6) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const EventForm = ({ user, onClose, onEventCreated }) => {
  const [name, setName] = useState("");
  const [format, setFormat] = useState("Standard");
  const [customFormat, setCustomFormat] = useState("");
  const [type, setType] = useState("Swiss");
  const [maxRounds, setMaxRounds] = useState(4);
  const [bestOf, setBestOf] = useState(3);
  const [countdown, setCountdown] = useState(50);
  const [generateSeatings, setGenerateSeatings] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [entryFee, setEntryFee] = useState(false);
  const [entryAmount, setEntryAmount] = useState(0);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isDraftFormat = format === "Draft" || format === "Cube Draft";
  const isOtherFormat = format === "Other...";

  const handleSubmit = async () => {
    if (!name.trim()) return setError("Event name is required.");
    if (!eventDate) return setError("Event date is required.");
    if (isOtherFormat && !customFormat.trim()) return setError("Custom format name is required.");

    const eventData = {
      name,
      format: isOtherFormat ? customFormat.trim() : format,
      type,
      settings: { maxRounds, bestOf, countdown },
      generateSeatings: isDraftFormat ? generateSeatings : false,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      status: "waiting",
      joinCode: generateCode(),
      eventDate,
      entryFee,
      entryAmount: entryFee ? entryAmount : 0,
    };

    try {
      setLoading(true);
      await addDoc(collection(db, "events"), eventData);
      onEventCreated(); // Refresh event list
      onClose(); // Close modal
    } catch {
      setError("Failed to create event.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: "50%", left: "50%",
      transform: "translate(-50%, -50%)",
      backgroundColor: "white", padding: "2rem", borderRadius: "8px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.2)", zIndex: 1000
    }}>
      <h2>Create New Event</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>}

      <input placeholder="Event Name" value={name} onChange={(e) => setName(e.target.value)} /><br />

      <label>Format:</label>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option>Standard</option>
        <option>Pioneer</option>
        <option>Modern</option>
        <option>Legacy</option>
        <option>Commander</option>
        <option>Draft</option>
        <option>Cube Draft</option>
        <option>Limited</option>
        <option>Pauper</option>
        <option>Other...</option>
      </select><br />

      {isOtherFormat && (
        <>
          <label>Custom Format:</label>
          <input
            type="text"
            placeholder="Enter custom format"
            value={customFormat}
            onChange={(e) => setCustomFormat(e.target.value)}
          /><br />
        </>
      )}

      <label>Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option>Swiss</option>
        <option>Single Elimination</option>
        <option>Swiss + Top 8</option>
      </select><br />

      <label>Max Rounds:</label>
      <input type="number" value={maxRounds} onChange={(e) => setMaxRounds(+e.target.value)} /><br />

      <label>Best Of:</label>
      <input type="number" value={bestOf} onChange={(e) => setBestOf(+e.target.value)} /><br />

      <label>Countdown (minutes):</label>
      <input type="number" value={countdown} onChange={(e) => setCountdown(+e.target.value)} /><br />

      {isDraftFormat && (
        <>
          <label>Generate Seatings:</label>
          <input
            type="checkbox"
            checked={generateSeatings}
            onChange={(e) => setGenerateSeatings(e.target.checked)}
          /><br />
        </>
      )}

      <label>Event Date:</label>
      <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} /><br />

      <label>Entry Fee:</label>
      <select value={entryFee ? "Yes" : "No"} onChange={(e) => setEntryFee(e.target.value === "Yes")}>
        <option>No</option>
        <option>Yes</option>
      </select><br />

      {entryFee && (
        <>
          <label>Amount (€):</label>
          <input type="number" value={entryAmount} onChange={(e) => setEntryAmount(+e.target.value)} /><br />
        </>
      )}

      <div style={{ marginTop: "1rem" }}>
        <button onClick={handleSubmit} style={{ marginRight: "1rem" }}>Submit</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default EventForm;
