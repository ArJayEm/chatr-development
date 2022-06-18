import React from "react";
import { auth } from "../firebase";
import { format } from "date-fns";

export default function MessageBubble({
  index,
  len,
  message,
  previousMessage,
  nextMessage,
}) {
  const isSent = message.sender !== auth.currentUser.uid;
  let isPreviousSameSender = false;
  let isNextSameSender = false;
  let bubbleCounter = 0;
  let sameTime = false;
  let sameTimeNext = false;
  let bubbleClass = "";

  //function convertTime() {}

  function secondsToHms(d) {
    let date = new Date(d * 1000); //.setUTCSeconds(d);
    let now = new Date(Date.now());

    let dateFormat = "";
    let timeFormat = "h:mm a";

    let isSameMonth = format(now, "MMM") === format(date, "MMM");
    let isSameYear = format(now, "yy") === format(date, "yy");
    let isSameWeek = format(now, "w") === format(date, "w");
    let isSameDay = format(now, "d") === format(date, "d");
    let isSameHour = format(now, "H") === format(date, "H");
    let isSameMinute = format(now, "m") === format(date, "m");
    let isWithinAWeek =
      isSameYear && isSameMonth && date.getDay() - now.getDay() < 8;

    if (!isSameMonth) {
      dateFormat += "MMM d";
    }
    if (!isSameYear) {
      dateFormat += ", yyyy ";
    }
    if (!isSameDay) {
      dateFormat += "EEE ";
    }
    if (!isSameWeek) {
      dateFormat = dateFormat.replace("EEE", "");

      if (isSameMonth) {
        dateFormat += "MMM d ";
      }
    }

    if (now.getDay() !== date.getDay()) {
      //dateFormat += "MMM d ";
    }
    if (isWithinAWeek) {
      //weekFormat = format(date, "EEE") + " ";
      //dateFormat = dateFormat.replace("MMM d", "");
    } else {
      //dateFormat = dateFormat.replace("EEE", "");
      //dateFormat += "MMM d ";
    }
    //not same hour
    if (format(now, "h") !== format(date, "h")) {
      //dateFormat += "h ";
    }
    let displayTime =
      (dateFormat.replace(/[ ]/g, "") && format(date, dateFormat) + " at ") +
      format(date, timeFormat);

    if (isSameDay) {
      //dateFormat = "";
      //timeFormat = "";

      if (isSameHour) {
        let minutes = now.getMinutes() - date.getMinutes();
        displayTime = minutes === 1 ? "a minute ago" : minutes + " minutes ago";

        if (isSameMinute) {
          displayTime = "now";
        }
      }
      if (!isSameHour && now.getHours() - date.getHours() < 2) {
        displayTime = "an hour ago";
      }
    }

    return displayTime;
  }

  if (index > 0) {
    sameTime =
      format(new Date(message.createdDate.seconds * 1000), "MMM dd yy h:mm") ===
      format(
        new Date(previousMessage.createdDate.seconds * 1000),
        "MMM dd yy h:mm"
      );
    isPreviousSameSender =
      (message.sender === previousMessage.sender &&
        message.sender === auth.currentUser.uid) ||
      (message.sender === previousMessage.sender &&
        message.sender !== auth.currentUser.uid);
    if (sameTime) {
      if (isPreviousSameSender) {
        bubbleClass = "bubble-last";
        bubbleCounter += 1;
      } else {
        bubbleClass = "bubble-first";
        bubbleCounter = 0;
      }
    } else {
      bubbleCounter = 0;
      bubbleClass = "bubble-first";
    }
  }

  if (index < len - 1) {
    sameTimeNext =
      format(new Date(message.createdDate.seconds * 1000), "MMM dd yy h:mm") ===
      format(
        new Date(nextMessage.createdDate.seconds * 1000),
        "MMM dd yy h:mm"
      );
    isNextSameSender =
      (message.sender === nextMessage.sender &&
        message.sender === auth.currentUser.uid) ||
      (message.sender === nextMessage.sender &&
        message.sender !== auth.currentUser.uid);
    if (sameTimeNext && bubbleCounter > 0) {
      bubbleClass = "bubble-" + (isNextSameSender ? "middle" : "last");
    }
  }

  bubbleClass += " bubble-" + bubbleCounter;

  return (
    <>
      {!sameTime && (
        <tr>
          <td>
            <small>{secondsToHms(message.createdDate.seconds)}</small>
          </td>
        </tr>
      )}
      <tr className={bubbleClass}>
        <td>
          <p className={isSent ? "sent" : "recieved"} id={message.id}>
            {message.message}
          </p>
        </td>
      </tr>
    </>
  );
}
