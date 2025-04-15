import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { collection, addDoc, doc, updateDoc, getDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../firebase"; // Your Firebase config

const generateCode = (length = 6) => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const CreateEvent = ({ user }) => {
  const [name, setName] = useState("");
  const [format, setFormat] = useState("Standard");
  const [type, setType] = useState("Swiss");
  const [maxRounds, setMaxRounds] = useState(4);
  const [bestOf, setBestOf] = useState(3);
  const [countdown, setCountdown] = useState(50);
  const [generateSeatings, setGenerateSeatings] = useState(false);
  const [eventDate, setEventDate] = useState("");
  const [entryFee, setEntryFee] = useState(false);
  const [entryAmount, setEntryAmount] = useState(0);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [eventId, setEventId] = useState(null);
  const [loading, setLoading] = useState(false); // New loading state
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const edit = queryParams.get("edit");
    const id = queryParams.get("id");

    if (edit && id) {
      setIsEditing(true);
      setEventId(id);
      const fetchEventData = async () => {
        setLoading(true); // Start loading
        try {
          const eventRef = doc(db, "events", id);
          const eventDoc = await getDoc(eventRef);

          if (eventDoc.exists()) {
            const eventData = eventDoc.data();
            setName(eventData.name);
            setFormat(eventData.format);
            setType(eventData.type);
            setMaxRounds(eventData.settings.maxRounds);
            setBestOf(eventData.settings.bestOf);
            setCountdown(eventData.settings.countdown);
            setGenerateSeatings(eventData.generateSeatings);
            setEventDate(eventData.eventDate);
            setEntryFee(eventData.entryFee);
            setEntryAmount(eventData.entryAmount);
          } else {
            setError("Event not found.");
          }
        } catch (err) {
          setError("Failed to fetch event data.");
        } finally {
          setLoading(false); // End loading
        }
      };

      fetchEventData();
    }
  }, [location]);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Event name is required.");
      return;
    }

    if (maxRounds <= 0) {
      setError("Max rounds must be a positive number.");
      return;
    }

    if (bestOf <= 0) {
      setError("Best of must be a positive number.");
      return;
    }

    if (countdown <= 0) {
      setError("Countdown must be a positive number.");
      return;
    }

    if (!eventDate) {
      setError("Event date is required.");
      return;
    }

    if (!user || !user.uid) {
      setError("You must be logged in to create or edit an event.");
      return;
    }

    const eventData = {
      name,
      format,
      type,
      settings: { maxRounds, bestOf, countdown },
      generateSeatings,
      createdBy: user.uid,
      createdAt: serverTimestamp(),
      status: "waiting",
      joinCode: generateCode(), // This will generate a unique event code
      eventDate,
      entryFee,
      entryAmount: entryFee ? entryAmount : 0,
    };


    try {
      setLoading(true); // Start loading
      if (isEditing && eventId) {
        const eventRef = doc(db, "events", eventId);
        await updateDoc(eventRef, eventData);
        navigate(`/event/${eventId}`);
      } else {
        const docRef = await addDoc(collection(db, "events"), eventData);
        navigate(`/event/${docRef.id}`);
      }
    } catch (err) {
      setError("Failed to create or update event");
    } finally {
      setLoading(false); // End loading
    }
  };

  return (
    <div>
      <h2>{isEditing ? "Edit Event" : "Create New Event"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {loading && <p>Loading...</p>} {/* Loading indicator */}

      <input
        placeholder="Event Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br />

      <label>Format:</label>
      <select value={format} onChange={(e) => setFormat(e.target.value)}>
        <option value="Standard">Standard</option>
        <option value="Pioneer">Pioneer</option>
        <option value="Modern">Modern</option>
        <option value="Legacy">Legacy</option>
        <option value="Commander">Commander</option>
        <option value="Draft">Draft</option>
        <option value="Cube Draft">Cube Draft</option>
        <option value="Limited">Limited</option>
      </select><br />

      <label>Type:</label>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="Swiss">Swiss</option>
        <option value="Single Elimination">Single Elimination</option>
      </select><br />

      <label>Max Rounds:</label>
      <input
        type="number"
        value={maxRounds}
        onChange={(e) => setMaxRounds(Number(e.target.value))}
      /><br />

      <label>Best Of:</label>
      <input
        type="number"
        value={bestOf}
        onChange={(e) => setBestOf(Number(e.target.value))}
      /><br />

      <label>Countdown (minutes):</label>
      <input
        type="number"
        value={countdown}
        onChange={(e) => setCountdown(Number(e.target.value))}
      /><br />

      <label>Event Date:</label>
      <input
        type="date"
        value={eventDate}
        onChange={(e) => setEventDate(e.target.value)}
      /><br />

      <label>Entry Fee:</label>
      <select value={entryFee ? "Yes" : "No"} onChange={(e) => setEntryFee(e.target.value === "Yes")}>
        <option value="No">No</option>
        <option value="Yes">Yes</option>
      </select><br />

      {entryFee && (
        <>
          <label>Amount (€):</label>
          <input
            type="number"
            value={entryAmount}
            onChange={(e) => setEntryAmount(Number(e.target.value))}
          /><br />
        </>
      )}

      <button onClick={handleSubmit} disabled={loading}>{isEditing ? "Update Event" : "Create Event"}</button>
    </div>
  );
};

export default CreateEvent;
