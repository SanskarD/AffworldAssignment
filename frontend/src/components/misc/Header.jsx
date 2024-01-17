import React from "react";
import { Box,Text,Button } from "@chakra-ui/react";
import {useNavigate }from 'react-router-dom'
const Header = () => {
  const navigate = useNavigate()
  const logOutHandler = ()=>{
    localStorage.removeItem('userInfo')
    navigate(0)
  }
  return (
    <>
    <Box
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
      w="100%"
    >
      <Text fontSize={{ base: "2em", md: "4em" }} fontFamily={"caveat"} fontWeight={600}>Ssh! Don't Tell Anyone</Text>
    <Button onClick={logOutHandler} position={"relative"} top={7} left={10}>Logout</Button>
    </Box>
    </>
  );
};

export default Header;
