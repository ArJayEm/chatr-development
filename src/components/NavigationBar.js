import React from "react";
import { Navbar, Container, Image, Dropdown } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
//import { useAuthState } from "react-firebase-hooks/auth";
import { useAuth } from "../context/AuthContext";
import myIconInverted from "../images/chatr_icon_inverted.png";
//import myIcon from "../images/chatr_icon.png";
import defaultUser from "../images/default_user.jpg";

export default function NavigationBar() {
  //const handleClose = () => setShow(false);
  //const handleShow = () => setShow(true);
  const { currentUser } = useAuth();
  const { logout } = useAuth();
  const history = useNavigate();
  //const [error, setError] = useState("");
  //const [loading, setLoading] = useState(false);
  const displayName =
    currentUser && (currentUser.displayName ?? currentUser.email);

  async function handleLogout() {
    try {
      //setLoading(true);
      await logout();
      history("/login");
    } catch (e) {
      //setLoading(false);
      console.log(e);
      //return setError("Log out failed.");
    }
  }

  return (
    <div style={{ display: "inline-block" }}>
      <Navbar bg="success" variant="dark">
        <Container>
          <ul className="nav">
            <li>
              <Navbar.Brand href="/">
                <img
                  alt=""
                  src={myIconInverted}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />
                Chatr
              </Navbar.Brand>
            </li>
            <li>
              <Link className="link active" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link className="link" to="/notifications">
                Notifications
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
          <Dropdown>
            <Dropdown.Toggle
              variant="success"
              id="dropdown-basic"
              title={displayName}
              style={{ display: "inline-flex" }}
            >
              <Image
                roundedCircle
                onError={defaultUser}
                src={(currentUser && currentUser.photoURL) || defaultUser}
                alt="photoURL"
                style={{ width: "1.5em" }}
              />
              &nbsp;&nbsp;
              <div
                style={{
                  maxWidth: "8em",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {displayName}&nbsp;
              </div>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>Log Out</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Container>
      </Navbar>
    </div>
  );
}
