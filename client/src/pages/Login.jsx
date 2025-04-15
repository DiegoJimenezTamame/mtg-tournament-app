import React, { useState } from "react";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInAnonymously,
} from "firebase/auth";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      onLogin(userCred.user);
    } catch (error) {
      console.error("Login error:", error); // 👈 log this
      alert("Login failed. Are you registered?");
    }
  };

  const handleRegister = async () => {
    try {
      const userCred = await createUserWithEmailAndPassword(auth, email, password);
      onLogin(userCred.user);
    } catch (error) {
      console.error("Registration error:", error); // 👈 log this
      alert("Registration failed.");
    }
  };

  const handleGuest = async () => {
    try {
      const userCred = await signInAnonymously(auth);
      onLogin(userCred.user);
    } catch (error) {
      console.error("Guest login failed:", error); // ← log the full error
      alert(`Guest login failed: ${error.message}`);
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
