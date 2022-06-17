import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Container, Alert, Button } from "react-bootstrap";
import { auth, firestore } from "../firebase";
import AddIcon from "mdi-react/AddIcon";

export default function Contacts() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState(null);
  const history = useNavigate();

  useEffect(() => {
    getContacts();
    //console.log(contacts);
  }, []);

  async function getContacts() {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      firestore
        .collection("users")
        .doc(auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setContacts(snapshot.get("contacts").map((contact, i) => contact));
          }
        });

      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.log(e);
      return setError("getContacts error.");
    }
  }

  function handleOnClick(uid) {
    console.log(uid);
    history("/conversation/" + uid);
  }

  return (
    <>
      <Container
        className="d-flex justify-content-center mt-4"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Card>
            <Card.Body>
              {/* <h2 className="text-center mb-4">Messages</h2> */}
              <div className="w-100 text-center mt-2">
                <Link variant="button" to="/addcontact">
                  <Button variant="success" className="w-100 mb-2">
                    <AddIcon /> Add Contact
                  </Button>
                </Link>
                <Link to="/" style={{ textDecoration: "none" }}>
                  Reload
                </Link>
                <ul id="Contacts" className="mt-2">
                  {!loading &&
                    contacts &&
                    contacts.map((contact, i) => {
                      return (
                        <li
                          className={i === 0 ? "active" : ""}
                          id={contact.uid}
                          onClick={() => handleOnClick(contact.uid)}
                        >
                          <span>{contact.name}</span>
                          <br />
                          <small>{"{message.last}"}</small>
                        </li>
                      );
                    })}
                </ul>
              </div>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  );
}
