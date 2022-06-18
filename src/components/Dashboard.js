/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Card, Alert } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { auth, firestore } from "../firebase";
import Contacts from "./Contacts";
import NavigationBar from "./NavigationBar";
// import { useAuthState } from "react-firebase-hooks/auth";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const displayName = currentUser.displayName ?? currentUser.email;

  useEffect(() => {
    //setLoading("Loading...");
    saveUser();
    //setLoading("");
  });

  async function saveUser() {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      var doc = firestore.collection("users").doc(auth.currentUser.uid);

      (await doc.get()).exists
        ? await doc.update({
            //name: auth.currentUser.displayName ?? auth.currentUser.email,
            //email: auth.currentUser.email,
            //photoUrl: auth.currentUser.photoURL,
            //uid: auth.currentUser.uid,
            editedDate: auth.currentUser.metadata.lastSignInTime,
            //loggedInUsing: ''
            //createdDate: auth.currentUser.metadata.createdDate,
            //editedDate: auth.currentUser.metadata.editedDate,
            name: auth.currentUser.displayName ?? auth.currentUser.email,
            lastLogIn: auth.currentUser.metadata.lastSignInTime,
            providerData: currentUser.providerData.map((e) => e)[0],
          })
        : await doc.set({
            name: auth.currentUser.displayName ?? auth.currentUser.email,
            //email: auth.currentUser.email,
            //photoUrl: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
            createdDate: auth.currentUser.metadata.createdDate ?? Date.now(),
            lastLogIn: auth.currentUser.metadata.lastSignInTime ?? Date.now(),
            providerData: currentUser.providerData.map((e) => e)[0],
            userCode: null,
            contacts: [],
          });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      return setError("Login error.");
    }
  }

  return (
    <>
      <NavigationBar />
      <Contacts />
      {/* <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          Welcome <strong>{displayName}</strong>
        </Card.Body>
      </Card> */}
    </>
  );
}
