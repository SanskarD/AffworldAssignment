import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserState } from "../context/userProvider";
import { Box } from "@chakra-ui/react";
import Header from "../components/misc/Header";
import ChatBox from "../components/chat/ChatBox";

const SecretsPage = () => {
  const navigate = useNavigate();
  const { user } = UserState();
  
  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (!userInfo) {
      navigate("/");
    }
  }, []);

  return (
    <Box width={"100%"} >
      {user && <Header />}
      {user && 
      <Box
        display={"flex"}
        justifyContent={"center"}
        w="100%"
        h={{base:"95%",md:"85.5vh"}}
      >
        <Box
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          p={3}
          bg="white"
          width={{ base: "100%", md: "68%" }}
          height={{base:"100%"}}
          borderRadius={"lg"}
          borderWidth={"1px"}
        >
          {<ChatBox />}
        </Box>
      </Box>}
    </Box>
  );
};

export default SecretsPage;
