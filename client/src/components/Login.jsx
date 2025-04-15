// client/src/components/Login.jsx
import React, { useState } from "react";
import { auth } from "../firebase";  // Import Firebase auth
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously
} from "firebase/auth";  // Firebase auth methods

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCred.user);
    } catch (error) {
      console.error("Login error:", error); // 👈 log it here
      alert("Login failed. Are you registered?");
    }
  };


  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(userCred.user);  // Pass the authenticated user to the parent
    } catch (error) {
      alert("Registration failed.");
    }
  };

  const handleGuest = async () => {
    try {
      const userCred = await signInAnonymously(auth);  // Sign in anonymously
      onLogin(userCred.user);  // Pass the authenticated user to the parent
    } catch (error) {
      alert("Guest login failed.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Login / Register</h2>
      <input
        type="email"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      /><br />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      /><br />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
      <button onClick={handleGuest}>Guest Login</button>
    </div>
  );
};

export default Login;
