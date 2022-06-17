import React, { useRef, useState } from "react";
import { Container, Card, Alert, Button, Image } from "react-bootstrap";
import { Link } from "react-router-dom";
import NavigationBar from "./NavigationBar";
import SearchIcon from "mdi-react/SearchIcon";
import BarcodeScannerIcon from "mdi-react/QrcodeIcon";
import { auth, firestore } from "../firebase";
import defaultUser from "../images/default_user.jpg";

export default function AddContact() {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const userCodeRef = useRef("");
  const [contacts, setContacts] = useState(null);

  var usersRef = firestore.collection("users");
  var requestsRef = firestore
    .collection("requests")
    .where("deleted", "==", false);

  function handleOnSearch() {
    try {
      setMessage("");
      setError("");
      setLoading(true);
      setContacts(null);

      usersRef
        .where("userCode", "==", userCodeRef.current.value)
        .where("uid", "!=", auth.currentUser.uid)
        .get()
        .then((snapshot) => {
          snapshot.docs.map((doc) => setContacts(doc.data()));
        });
      setLoading(false);
      console.log(contacts);
    } catch (e) {
      setLoading(false);
      console.error(e);
      setError("Login failed. " + e);
      return false;
    }
  }

  async function handleSendRequest(uid) {
    try {
      setMessage("");
      setError("");
      setLoading(true);

      await firestore.collection("requests").add({
        createdDate: new Date(Date.now()),
        isAccepted: false,
        recipient: uid,
        sender: auth.currentUser.uid,
      });

      setMessage("Request sent.");
      setLoading(false);
    } catch (e) {
      console.error(e);
      setError("Request not sent.");
      setLoading(false);
      return false;
    }
  }

  return (
    <>
      <NavigationBar />
      <Container
        className="d-flex align-items-center justify-content-center"
        style={{ minHeight: "100vh" }}
      >
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Link to="/" style={{ textDecoration: "none" }}>
            <Button variant="light" type="button">
              Back
            </Button>
          </Link>
          <Card className="mt-2">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              {message && <Alert variant="success">{message}</Alert>}
              <div className="form-group">
                <input
                  type="text"
                  maxLength="12"
                  className="form-control"
                  placeholder="User Code..."
                  ref={userCodeRef}
                />
                <button
                  type="button"
                  title="Search"
                  onError=""
                  onClick={handleOnSearch}
                >
                  <SearchIcon />
                </button>
                <button type="button" title="Scan">
                  <BarcodeScannerIcon />
                </button>
              </div>
              {/* <h2 className="text-center mb-4">Add Contact</h2> */}
              <div className="w-100 text-center mt-2">
                <ul id="Users" className="mt-2">
                  {!loading &&
                    contacts &&
                    [contacts].map((contact, i) => {
                      let isRequested =
                        [requestsRef].map(
                          (request) =>
                            request.recipient === contact.uid &&
                            request.isAccepted === false
                        )[0] ?? false;
                      return (
                        <li id={contact.uid} key={i}>
                          <Image
                            roundedCircle
                            onError={defaultUser}
                            src={
                              (contact && contact.providerData.photoURL) ||
                              defaultUser
                            }
                            alt="photoURL"
                            style={{ width: "3em" }}
                          />
                          <div
                            style={{
                              maxWidth: "8em",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              lineHeight: 2,
                            }}
                          >
                            {contact.name}
                          </div>
                          <Button
                            disabled={!isRequested}
                            variant={isRequested ? "success" : "light"}
                            type="button"
                            onError=""
                            onClick={() => handleSendRequest(contact.uid)}
                          >
                            {isRequested ? "Send Request" : "Request Sent"}
                          </Button>
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
