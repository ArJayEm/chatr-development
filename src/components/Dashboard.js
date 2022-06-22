/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
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
  const displayName =
    currentUser && (currentUser.displayName ?? currentUser.email);

  useEffect(
    () => {
      saveUser();
    },
    //eslint-disable-next-line
    []
  );

  async function saveUser() {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      var doc = firestore.collection("users").doc(auth.currentUser.uid);

      (await doc.get()).exists
        ? await doc.update({
            editedDate: auth.currentUser.metadata.lastSignInTime,
            displayName: auth.currentUser.displayName ?? auth.currentUser.email,
            lastLogIn: auth.currentUser.metadata.lastSignInTime,
            providerData: auth.currentUser.providerData.map((e) => e)[0],
            isLoggedIn: true,
          })
        : await doc.set({
            displayName: auth.currentUser.displayName ?? auth.currentUser.email,
            uid: auth.currentUser.uid,
            createdDate: auth.currentUser.metadata.createdDate ?? Date.now(),
            lastLogIn: auth.currentUser.metadata.lastSignInTime ?? Date.now(),
            providerData: auth.currentUser.providerData.map((e) => e)[0],
            userCode: null,
            contacts: [],
            isLoggedIn: true,
          });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      return setError("Login error.");
    }
  }

  // return auth.currentUser.isLoggedIn ? (
  //   <>
  //     <NavigationBar />
  //     <Contacts />
  //   </>
  // ) : (
  //   <Login />
  // );
  return (
    <>
      <NavigationBar />
      <Contacts />
    </>
  );
}
