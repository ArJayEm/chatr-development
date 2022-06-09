import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function UpdateProfile() {
  const displayNameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const confirmpasswordRef = useRef();
  const { currentUser, updateEmail, updatePassword } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const history = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    if (passwordRef.current.value !== confirmpasswordRef.current.value) {
      return setError("Passwords do not match.");
    }

    const promises = [];
    setLoading(true);
    setError("");
    if (emailRef.current.value !== currentUser.email) {
      promises.push(updateEmail(emailRef.current.value));
    }
    if (passwordRef.current.value) {
      promises.push(updatePassword(passwordRef.current.value));
    }

    Promise.all(promises)
      .then(() => {
        history("/");
      })
      .catch(() => {
        setError("Failed to update");
      })
      .finally(() => {
        setLoading(false);
      });
  }

  return (
    <Container
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh" }}
    >
      <div className="w-100" style={{ maxWidth: "400px" }}>
        <Card>
          <Card.Body>
            <h2 className="text-center mb-4">Profile</h2>
            {error && <Alert variant="danger">{error}</Alert>}
            <Form onSubmit={handleSubmit}>
              <Form.Group id="displayName" className="mb-2">
                <label>Name</label>
                <Form.Control
                  type="text"
                  ref={emailRef}
                  required
                  defaultValue={currentUser.displayName}
                />
              </Form.Group>
              <Form.Group id="email" className="mb-2">
                <label>Email</label>
                <Form.Control
                  type="email"
                  ref={displayNameRef}
                  required
                  defaultValue={currentUser.email}
                />
              </Form.Group>
              <Form.Group id="password" className="mb-2">
                <label>Password</label>
                <Form.Control
                  type="password"
                  ref={passwordRef}
                  autoComplete="on"
                  placeholder="Leave blank to keep the same password"
                />
              </Form.Group>
              <Form.Group id="confirm-password" className="mb-2">
                <label>Confirm Password</label>
                <Form.Control
                  type="password"
                  ref={confirmpasswordRef}
                  autoComplete="on"
                  placeholder="Leave blank to keep the same password"
                />
              </Form.Group>
              <Button disabled={loading} className="w-100 mt-4" type="submit">
                Update
              </Button>
            </Form>
          </Card.Body>
        </Card>
        <div className="w-100 text-center mt-2">
          <Link to="/" style={{ textDecoration: "none" }}>
            <span>{"<"}</span> Back
          </Link>
        </div>
      </div>
    </Container>
  );
}
