import React, { useState } from "react";
import { VStack, useToast } from "@chakra-ui/react";
import { FormControl, FormLabel } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserState } from "../../context/userProvider";

const Login = () => {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  const { setUser } = UserState();

  const handleClick = () => {
    setShowPass((prevShowPass) => !prevShowPass);
  };

  const submitHandler = async () => {
    setLoading(true);
    if (!username || !password) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKENDURL}/api/user/login`,
        {
          username,
          password,
        },
        config
      );
      toast({
        title: "User LoggedIn Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem("userInfo", JSON.stringify(data));
      setLoading(false);
      setUser(JSON.parse(localStorage.getItem("userInfo")));
      navigate("/secrets");
    } catch (err) {
      console.log(err)
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <VStack spacing={"10px"}>
        <FormControl id="userLogin" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Enter Your Username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </FormControl>

        <FormControl id="passwordLogin" isRequired>
          <FormLabel>Password</FormLabel>

          <InputGroup>
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Enter Your Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
            />

            <InputRightElement width={"4.5em"}>
              <Button h={"1.75rem"} size="sm" onClick={handleClick}>
                {showPass ? "Hide" : "Show"}
              </Button>
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button
          colorScheme="blue"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          isLoading={loading}
        >
          Login
        </Button>
        <Button
          variant={"solid"}
          colorScheme="red"
          width={"100%"}
          style={{ marginTop: 15 }}
          onClick={() => {
            setUsername("guest1");
            setPassword("12345");
          }}
        >
          Guest Credentials
        </Button>
      </VStack>
    </>
  );
};

export default Login;
