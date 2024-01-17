import React, { useState } from "react";
import { VStack } from "@chakra-ui/react";
import { FormControl, FormLabel, useToast } from "@chakra-ui/react";
import { Button } from "@chakra-ui/button";
import { Input, InputGroup, InputRightElement } from "@chakra-ui/input";
import axios from "axios";
import {useNavigate} from 'react-router-dom'
import { UserState } from "../../context/userProvider";

const SignUp = () => {
  const [showPass, setShowPass] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const navigate= useNavigate()
  const {setUser} = UserState()

  const handleClick = () => {
    setShowPass((prevShowPass) => !prevShowPass);
  };


  const submitHandler = async (e) => {
    e.preventDefault()
    setLoading(true);
    if (!username || !email || !password || !confirmPassword) {
      toast({
        title: "Please Fill all the Fields",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    if (password !== confirmPassword) {
      toast({
        title: "Passwords do not match!",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
      return;
    }
    
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
        },
      };
      const { data } = await axios.post(`${import.meta.env.VITE_BACKENDURL}/api/user`, {
        username,
        email,
        password
      },
      config
      );
      toast({
        title: "User registered Successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      localStorage.setItem('userInfo',JSON.stringify(data))
      setLoading(false)
      setUser(JSON.parse(localStorage.getItem('userInfo')))
      navigate('/secrets')
    } catch (err) {
      toast({
        title: "Error Occured!",
        description: err.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
      setLoading(false)
    }
  };

  return (
    <>
      <VStack spacing={"5px"}>
        <FormControl id="username" isRequired>
          <FormLabel>Username</FormLabel>
          <Input
            placeholder="Enter Your username"
            onChange={(e) => setUsername(e.target.value)}
            value={username}
          />
        </FormControl>

        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
          type="email"
            placeholder="Enter Your Email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </FormControl>

        <FormControl id="password" isRequired>
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

        <FormControl id="confirm Password" isRequired>
          <FormLabel>Confirm Password</FormLabel>

          <InputGroup>
            <Input
              type={showPass ? "text" : "password"}
              placeholder="Confirm Password"
              onChange={(e) => setConfirmPassword(e.target.value)}
              value={confirmPassword}
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
          Sign Up!
        </Button>
      </VStack>
    </>
  );
};

export default SignUp;
