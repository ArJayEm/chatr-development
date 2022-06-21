/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../firebase";
import Contacts from "./Contacts";
import NavigationBar from "./NavigationBar";
// import { useAuthState } from "react-firebase-hooks/auth";
import Login from "./Login";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const displayName =
    currentUser && (currentUser.displayName ?? currentUser.email);

  return auth.currentUser ? (
    <>
      <NavigationBar />
      <Contacts />
    </>
  ) : (
    <Login />
  );
}
