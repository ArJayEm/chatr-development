import React, { useState, useEffect, useRef } from "react";
import { Alert, Form, Button, Image } from "react-bootstrap";
import { auth, firestore } from "../firebase";
import { useParams } from "react-router-dom";
import NavigationBar from "./NavigationBar";

//import { useAuthState } from "react-firebase-hooks/auth";
import { useCollectionData } from "react-firebase-hooks/firestore";
//import { format } from "date-fns";

import MessageBubble from "./MessageBubble";
import defaultUser from "../images/default_user.jpg";

export default function Conversation() {
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  //const [messages, setMessages] = useState(null);
  let { uid } = useParams();
  const [contact, setContact] = useState();
  const messageRef = useRef();
  const scrollRef = useRef();

  //get all messages with limit
  var messagesCol = firestore.collection("messages");
  var query = messagesCol.orderBy("createdDate");
  let [conversations] = useCollectionData(query, {
    sender: auth.currentUser.uid,
  });
  messagesCol.get(function (snapshot) {
    //do whatever
    //if (querySnapshot.docChanges)
    let hasNewMessage = false; //[snapshot.docChanges].map((e) => e.change.type === "added");
    //console.log([snapshot.docChanges]);
    if (hasNewMessage) {
      console.log("New Message!");
    }
  });
  //console.log(conversations);
  //const convos = conversations.map((message, i) => message);
  //getContactDetails();

  // var contactRef = firestore.collection("users");
  // let [contact] = useCollectionData(contactRef, { uid: uid });
  // console.log(contact.filter((e) => e.uid === uid));

  async function getContact() {
    try {
      await firestore
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot) => {
          if (snapshot.exists) {
            setContact(snapshot.data());
          }
        });
    } catch (e) {
      setLoading(false);
      console.log(e);
      setError("Login failed. " + e);
      return false;
    }
  }

  async function getConversations() {}

  async function handleOnSend(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setLoading(true);

      await messagesCol.add({
        createdDate: new Date(Date.now()),
        message: messageRef.current.value,
        recipient: auth.currentUser.uid,
        sender: uid,
      });
      scrollToBottom();
      messageRef.current.value = "";
      setLoading(false);
    } catch (e) {
      setLoading(false);
      console.error(e);
      return setError("Message not sent.");
    }
  }

  const divRef = useRef(null);
  useEffect(() => {
    //scrollToBottom();
    getConversations();
    getContact();
  });

  function scrollToBottom() {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "nearest",
    });
  }

  return (
    <>
      <div className="page" ref={divRef}>
        <NavigationBar />
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success">{message}</Alert>}
        <div id="Conversations" className="w-100 text-center">
          <div className="contact contact_medium w-100 mb-2" style={{}}>
            <Image
              roundedCircle
              onError={defaultUser}
              src={(contact && contact.providerData.photoURL) || defaultUser}
              alt=""
              style={{ width: "3em" }}
            />
            &nbsp;&nbsp;{contact && contact.providerData.displayName}
          </div>
          <table>
            <tbody>
              {conversations &&
                conversations.map((message, i) => {
                  let previousMessage = i > 0 ? conversations[i - 1] : null;
                  let nextMessage =
                    i < conversations.length - 1 ? conversations[i + 1] : null;

                  return (
                    <MessageBubble
                      key={message.id}
                      index={i}
                      len={conversations.length}
                      message={message}
                      previousMessage={previousMessage}
                      nextMessage={nextMessage}
                    />
                  );
                })}
            </tbody>
          </table>
        </div>
        <Form id="Reply" onSubmit={handleOnSend}>
          <Form.Control
            type="text"
            ref={messageRef}
            placeholder="Reply..."
            required
          />
          <Button variant="success" disabled={loading} type="submit">
            Send
          </Button>
        </Form>
      </div>
      <div ref={scrollRef}></div>
    </>
  );
}

<script type="text/javascript">
  let height = document.getElementsByClassName('contact')[0].offsetHeight +
  document.getElementsByClassName('navbar')[0].offsetHeight;
  document.getElementsByClassName('page')[0].
</script>;
