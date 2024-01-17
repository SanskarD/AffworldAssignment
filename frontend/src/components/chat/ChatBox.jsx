import React, { useEffect, useState } from "react";
import { Box, Spinner, Input, useToast, Button } from "@chakra-ui/react";
import { FormControl } from "@chakra-ui/react";
import axios from "axios";
import styles from "./ChatBox.module.css";
import ScrollableChat from "./ScrollableChat.jsx";
import io from "socket.io-client";
import { UserState } from "../../context/UserProvider.jsx";

const ENDPOINT = import.meta.env.VITE_BACKENDURL;
let socket;

const ChatBox = () => {
  const [messages, setMessages] = useState([]);
  const [laoding, setLaoding] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const user = JSON.parse(localStorage.getItem("userInfo"));
  const [buttonDisabled, setButtonDisabled] = useState(user.sharedSecret);
  const toast = useToast();

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
  }, []);

  useEffect(() => {
    socket.on("message recieved", (newMessage) => {
      if (newMessage.sender._id !== user._id) {
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });
    return () => {
      socket.off("message recieved");
    };
  });

  const fetchMessages = async () => {
    setLaoding(true);
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKENDURL}/api/message`,
        config
      );
      setMessages(data);
      setLaoding(false);
      socket.emit("join chat");
    } catch (error) {
      toast({
        title: "Something went wrong!",
        description: error.message,
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
      setLaoding(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const sendMessage = async (e) => {
    if(newMessage === "") return
    const messageToSend = newMessage;
    setNewMessage("");
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/api/message`,
        {
          content: messageToSend,
        },
        config
      );

      socket.emit("new message", data);
      setMessages((prevMessages) => [...prevMessages, data]);
      setButtonDisabled(true);
      localStorage.setItem(
        "userInfo",
        JSON.stringify({ ...user, sharedSecret: true })
      );
    } catch (error) {
      toast({
        title: "Message cannot be sent!",
        description: error.message,
        status: "warning",
        duration: 2500,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDir={"column"}
        justifyContent={"flex-end"}
        p={3}
        bg={"#E8E8E8"}
        width={"100%"}
        height={"100%"}
        borderRadius={"lg"}
        overflowY={"hidden"}
      >
        {laoding ? (
          <Spinner
            size={"xl"}
            w={20}
            h={20}
            alignSelf={"center"}
            margin={"auto"}
          />
        ) : (
          <div className={styles.messages}>
            <ScrollableChat messages={messages} />
          </div>
        )}

        <FormControl
          isRequired
          mt={3}
          display={"flex"}
          onKeyDown={(e) => {
            if (e.key == "Enter") sendMessage();
          }}
        >
          <Input
            bg={"#E0E0E0"}
            variant={"filled"}
            placeholder={
              buttonDisabled
                ? "You have already shared a Secret"
                : "Share your Secret"
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <Button isDisabled={buttonDisabled} ml={2} onClick={sendMessage}>
            Send
          </Button>
        </FormControl>
      </Box>
    </>
  );
};

export default ChatBox;
