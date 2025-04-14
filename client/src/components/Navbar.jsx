// client/src/components/Navbar.jsx
import React from "react";
import { Link } from "react-router-dom";

const Navbar = ({ user, onLogout }) => {
  return (
    <nav style={styles.nav}>
      <div>
        <Link to="/" style={styles.brand}>
          MTG Tournament App
        </Link>
      </div>
      <div style={styles.links}>
        {user ? (
          <>
            <Link to="/" style={styles.link}>Events</Link>
            {/* You can add more links here later */}
            <button onClick={onLogout} style={styles.button}>Logout</button>
          </>
        ) : (
          <Link to="/login" style={styles.link}>Login</Link>
        )}
      </div>
    </nav>
  );
};

const styles = {
  nav: {
    padding: "1rem 2rem",
    background: "#1f2937",
    color: "#fff",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brand: {
    fontSize: "1.5rem",
    textDecoration: "none",
    color: "#fff",
    fontWeight: "bold",
  },
  links: {
    display: "flex",
    alignItems: "center",
    gap: "1rem",
  },
  link: {
    textDecoration: "none",
    color: "#fff",
  },
  button: {
    padding: "0.4rem 0.8rem",
    background: "#ef4444",
    border: "none",
    color: "#fff",
    cursor: "pointer",
    borderRadius: "4px",
  },
};

export default Navbar;
