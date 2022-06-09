import React, { useState, useEffect } from "react";
import { Card, Alert, Navbar, Container, Image } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
// import { useAuthState } from "react-firebase-hooks/auth";

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const history = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const displayName = currentUser.displayName ?? currentUser.email;

  useEffect(() => {
    saveUser();
    console.log(auth.currentUser);
  }, []);

  async function saveUser() {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      var doc = firestore.collection("users").doc(auth.currentUser.uid);

      (await doc.get()).exists
        ? await doc.update({
            name: auth.currentUser.displayName ?? auth.currentUser.email,
            email: auth.currentUser.email,
            photoUrl: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
            editedDate: Date.now(),
          })
        : await doc.set({
            name: auth.currentUser.displayName ?? auth.currentUser.email,
            email: auth.currentUser.email,
            photoUrl: auth.currentUser.photoURL,
            uid: auth.currentUser.uid,
            createdDate: Date.now(),
          });
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      return setError("Login error.");
    }
  }

  async function handleLogout() {
    try {
      setMessage("");
      setError("");
      setLoading(true);
      await logout();
      history("/login");
    } catch (e) {
      setLoading(false);
      console.log(e);
      return setError("Log out failed.");
    }
  }

  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand href="/">
            <img
              alt=""
              src="../chatr_icon.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
            />{" "}
            Chatr
          </Navbar.Brand>
          <ul className="nav">
            <li>
              <Link className="link active" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="link" to="/update-profile">
                Profile
              </Link>
            </li>
            <li>
              <Link className="link" to="/contacts">
                Contacts
              </Link>
            </li>
          </ul>
          <ul className="nav menu">
            <li>
              <Link className="link" to="/notifications">
                Notifications
              </Link>
            </li>
            <li>
              <Link
                className="link"
                to=""
                title={displayName}
                disabled={loading}
                onClick={handleLogout}
              >
                <Image
                  roundedCircle
                  src={auth.currentUser.photoURL.toString()}
                  alt="PhotoURL"
                  style={{ width: "1.5em" }}
                />{" "}
                Log Out
              </Link>
            </li>
          </ul>
        </Container>
      </Navbar>
      <Card>
        <Card.Body>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          Welcome <strong>{displayName}</strong>
        </Card.Body>
      </Card>
    </>
  );
}
