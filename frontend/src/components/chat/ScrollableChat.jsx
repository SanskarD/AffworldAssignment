import React from "react";
import ScrollableFeed from "react-scrollable-feed";
import { Box } from "@chakra-ui/react";
import styles from "./ScrollableChat.module.css";
import { UserState } from "../../context/UserProvider.jsx";

const ScrollableChat = ({ messages }) => {
    const {user} = UserState()
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((message) => {
          const addedStyles =
            message.sender._id === user._id
              ? styles.sameSender
              : styles.differentSender;
          return (
            <Box display={"flex"} key={message._id}>
              <span className={`${styles.message} ${addedStyles}`}>
                {message.content}
              </span>
            </Box>
          );
        })}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
