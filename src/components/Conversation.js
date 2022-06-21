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
  // eslint-disable-next-line
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  //const [messages, setMessages] = useState(null);
  let { uid: contactId } = useParams();
  const [contact, setContact] = useState();
  //const [conversations, setConversations] = useState();
  const messageRef = useRef();
  const scrollRef = useRef();
  //for scrolling
  const divRef = useRef(null);

  let messagesCollection = firestore.collection("messages");
  let usersCollection = firestore.collection("users");

  useEffect(
    () => {
      scrollToBottom();
      getContact();
    },
    //eslint-disable-next-line
    []
  );

  let filterMessages = messagesCollection.orderBy("createdDate");
  let [conversations] = useCollectionData(filterMessages);

  useEffect(
    () => {
      //getConversations();
    },
    //eslint-disable-next-line
    []
  );

  //get all messages with limit
  // messagesCollection
  //   .where("from", "==", auth.currentUser.uid)
  //   .orderBy("createdDate")
  //   .get()
  //   .then((snapshot) => {
  //     if (snapshot.exists) {
  //       setConversations(snapshot.data());
  //     }
  //   });

  // messagesCol.get(function (snapshot) {
  //   //do whatever
  //   //if (querySnapshot.docChanges)
  //   let hasNewMessage = false; //[snapshot.docChanges].map((e) => e.change.type === "added");
  //   //console.log([snapshot.docChanges]);
  //   if (hasNewMessage) {
  //     console.log("New Message!");
  //   }
  // });
  //console.log(conversations);
  //const convos = conversations.map((message, i) => message);
  //getContactDetails();

  // var contactRef = firestore.collection("users");
  // let [contact] = useCollectionData(contactRef, { uid: uid });
  // console.log(contact.filter((e) => e.uid === uid));

  async function getContact() {
    load();

    await usersCollection
      .doc(contactId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists) {
          setContact(snapshot.data());
        }
      })
      .finally(() => {})
      .catch((e) => {
        catchError(e, "get-contact-error.");
      });
  }

  // async function getConversations() {
  //   load();

  //   await messagesCollection
  //     .where("from", "==", auth.currentUser.uid)
  //     .where("to", "==", contactId)
  //     .orderBy("createdDate")
  //     .get()
  //     .then((snapshots) => {
  //       setConversations(
  //         snapshots.docs.map((e) => {
  //           let data = e.data();
  //           data.id = e.id;
  //           return data;
  //         })
  //       );
  //       setLoading(false);
  //     })
  //     .finally(() => {})
  //     .catch((e) => {
  //       catchError(e, "Can't load conversation.");
  //     });
  // }

  async function handleOnSend(e) {
    e.preventDefault();

    try {
      setMessage("");
      setError("");
      setSending(true);

      await messagesCollection.add({
        createdDate: new Date(Date.now()),
        message: messageRef.current.value,
        to: contactId,
        from: auth.currentUser.uid,
        status: 0,
      });
      scrollToBottom();
      messageRef.current.value = "";
      setSending(false);
    } catch (e) {
      setSending(false);
      console.error(e);
      return setError("Message not sent.");
    }
  }

  function scrollToBottom() {
    scrollRef.current.scrollIntoView({
      behavior: "smooth",
      // block: "end",
      // inline: "nearest",
    });
  }

  function load() {
    setMessage("");
    setError("");
    setLoading(true);
  }

  function catchError(e, msg) {
    setLoading(false);
    console.log(e);
    return setError(msg);
  }

  function handleOnError() {}

  return (
    <>
      <div className="page" ref={divRef}>
        <NavigationBar />
        <div id="Conversations" className="w-100 text-center">
          <div
            className="contact contact_medium w-100 mb-2"
            style={{ display: "flex" }}
          >
            <Image
              roundedCircle
              onError={() => handleOnError}
              src={(contact && contact.providerData.photoURL) || defaultUser}
              alt=""
              style={{ width: "3em" }}
            />
            &nbsp;&nbsp;
            <div>
              {contact &&
                (contact.displayName || contact.providerData.displayName)}
              {/* {contact.isLoggedIn ?? false ? (
                <small>Online</small>
              ) : (
                <small>Offline</small>
              )} */}
            </div>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
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
                      uid={auth.currentUser.uid}
                      // ref={i === conversations.length - 1 ? scrollRef : null}
                    />
                  );
                })}
            </tbody>
          </table>
          <div ref={scrollRef}></div>
        </div>
        <Form id="Reply" onSubmit={handleOnSend}>
          <Form.Control
            type="text"
            ref={messageRef}
            placeholder="Reply..."
            required
          />
          <Button variant="success" disabled={sending} type="submit">
            Send
          </Button>
        </Form>
      </div>
    </>
  );
}

<script type="text/javascript">
  let height = document.getElementsByClassName('contact')[0].offsetHeight +
  document.getElementsByClassName('navbar')[0].offsetHeight;
  document.getElementsByClassName('page')[0].
</script>;
