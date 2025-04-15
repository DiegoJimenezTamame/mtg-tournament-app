import { useState, useEffect } from "react";
import { db } from "../firebase";  // Assuming Firebase is imported here
import { collection, query, where, getDocs, doc, deleteDoc } from "firebase/firestore";  // Firebase Firestore methods
import { Link } from "react-router-dom";  // Link for navigation

const Events = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [sortField, setSortField] = useState("name"); // Default sort by name
  const [sortDirection, setSortDirection] = useState("asc"); // Default sort direction is ascending
  const [visibleColumns, setVisibleColumns] = useState({
    name: true,
    format: true,
    type: true,
    eventDate: true,
    entryAmount: true,
    rounds: true,
    roundTime: true,
    eventCode: true,  // Added to display eventCode
    actions: true
  });

  // Sorting function
  const sortData = (data, field, direction) => {
    return data.sort((a, b) => {
      const aValue = a[field];
      const bValue = b[field];

      if (aValue < bValue) return direction === "asc" ? -1 : 1;
      if (aValue > bValue) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  useEffect(() => {
    if (!user) return;

    const fetchEvents = async () => {
      const q = query(collection(db, "events"), where("createdBy", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const eventsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      // Sort events based on selected sort field and direction
      const sortedEvents = sortData(eventsData, sortField, sortDirection);
      setEvents(sortedEvents);
    };

    fetchEvents();
  }, [user, sortField, sortDirection]);

  const handleDeleteEvent = async () => {
    if (!eventToDelete) return;
    try {
      const eventRef = doc(db, "events", eventToDelete);
      await deleteDoc(eventRef);
      setEvents(prev => prev.filter(event => event.id !== eventToDelete));
      setIsDeleting(false);
      setEventToDelete(null);
    } catch (error) {
      console.error("Error deleting event: ", error);
    }
  };

  const handleSort = (field) => {
    const newDirection = sortDirection === "asc" ? "desc" : "asc"; // Toggle sort direction
    setSortDirection(newDirection);
    setSortField(field); // Update the field to sort by
  };

  const handleColumnVisibility = (field) => {
    setVisibleColumns((prev) => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <div style={{ marginBottom: "1.5rem" }}>
        <Link to="/create" style={{
          padding: "0.6rem 1rem",
          backgroundColor: "#3b82f6",
          color: "white",
          textDecoration: "none",
          borderRadius: "6px",
          fontWeight: "bold"
        }}>
          + Create Event
        </Link>
      </div>

      <h2>Your Events</h2>

      <div>
        <h3>Show/Hide Columns</h3>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.name}
            onChange={() => handleColumnVisibility("name")}
          />
          Name
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.format}
            onChange={() => handleColumnVisibility("format")}
          />
          Format
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.type}
            onChange={() => handleColumnVisibility("type")}
          />
          Type
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.eventDate}
            onChange={() => handleColumnVisibility("eventDate")}
          />
          Date
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.entryAmount}
            onChange={() => handleColumnVisibility("entryAmount")}
          />
          Entry Fee
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.rounds}
            onChange={() => handleColumnVisibility("rounds")}
          />
          Rounds
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.roundTime}
            onChange={() => handleColumnVisibility("roundTime")}
          />
          Round Time
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.eventCode}
            onChange={() => handleColumnVisibility("eventCode")}
          />
          Event Code
        </label>
        <label>
          <input
            type="checkbox"
            checked={visibleColumns.actions}
            onChange={() => handleColumnVisibility("actions")}
          />
          Actions
        </label>
      </div>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <table style={{
          width: "100%",
          borderCollapse: "collapse",
          marginTop: "1rem"
        }}>
          <thead>
            <tr>
              {visibleColumns.name && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "left"
                  }}
                  onClick={() => handleSort("name")}
                >
                  Name {sortField === "name" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.format && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "left"
                  }}
                  onClick={() => handleSort("format")}
                >
                  Format {sortField === "format" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.type && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "left"
                  }}
                  onClick={() => handleSort("type")}
                >
                  Type {sortField === "type" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.eventDate && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "left"
                  }}
                  onClick={() => handleSort("eventDate")}
                >
                  Date {sortField === "eventDate" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.entryAmount && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "right"
                  }}
                  onClick={() => handleSort("entryAmount")}
                >
                  Entry Fee {sortField === "entryAmount" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.rounds && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "right"
                  }}
                  onClick={() => handleSort("rounds")}
                >
                  Rounds {sortField === "rounds" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.roundTime && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "right"
                  }}
                  onClick={() => handleSort("roundTime")}
                >
                  Round Time {sortField === "roundTime" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.eventCode && (
                <th
                  style={{
                    cursor: "pointer",
                    padding: "12px",
                    borderBottom: "2px solid #ddd",
                    textAlign: "left"
                  }}
                  onClick={() => handleSort("eventCode")}
                >
                  Event Code {sortField === "eventCode" && (sortDirection === "asc" ? "↑" : "↓")}
                </th>
              )}
              {visibleColumns.actions && (
                <th style={{ padding: "12px", borderBottom: "2px solid #ddd" }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event.id}>
                {visibleColumns.name && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "left"
                  }}>
                    <Link to={`/event/${event.id}`}>
                      <strong>{event.name}</strong>
                    </Link>
                  </td>
                )}
                {visibleColumns.format && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "left"
                  }}>
                    {event.format}
                  </td>
                )}
                {visibleColumns.type && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "left"
                  }}>
                    {event.type}
                  </td>
                )}
                {visibleColumns.eventDate && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "left"
                  }}>
                    {event.eventDate}
                  </td>
                )}
                {visibleColumns.entryAmount && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "right"
                  }}>
                    {event.entryFee ? `${event.entryAmount}€` : "No"}
                  </td>
                )}
                {visibleColumns.rounds && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "right"
                  }}>
                    {event.settings?.maxRounds}
                  </td>
                )}
                {visibleColumns.roundTime && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    textAlign: "right"
                  }}>
                    {event.settings?.countdown}
                  </td>
                )}
                {visibleColumns.eventCode && (
                  <td
                    style={{
                      padding: "12px",
                      borderBottom: "1px solid #ddd",
                      textAlign: "left",
                      fontWeight: "bold" // This will make the eventCode bold
                    }}
                  >
                    {event.joinCode}
                  </td>
                )}

                {visibleColumns.actions && (
                  <td style={{
                    padding: "12px",
                    borderBottom: "1px solid #ddd",
                    display: "flex",
                    justifyContent: "flex-start"
                  }}>
                    <button
                      style={{
                        marginRight: "1rem",
                        padding: "0.5rem 1rem",
                        backgroundColor: "#3b82f6",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        window.location.href = `/create?edit=true&id=${event.id}`;
                      }}
                    >
                      Edit
                    </button>
                    <button
                      style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#e11d48",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        cursor: "pointer"
                      }}
                      onClick={() => {
                        setIsDeleting(true);
                        setEventToDelete(event.id);
                      }}
                    >
                      Delete
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>

        </table>
      )}

      {isDeleting && (
        <div>
          <h3>Are you sure you want to delete this event?</h3>
          <button onClick={handleDeleteEvent}>Confirm</button>
          <button onClick={() => setIsDeleting(false)}>Cancel</button>
        </div>
      )}
    </div>
  );
};

export default Events;
