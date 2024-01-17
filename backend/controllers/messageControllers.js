const expressAsyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");

const sendMessage = expressAsyncHandler(async (req, res) => {
  const { content } = req.body;

  if (!content) {
    console.log("Invalid data passed");
    return res.status(400);
  }

  let newMessage = {
    sender: req.user._id,
    content: content,
  };

  try {
    newMessage = new Message({ ...newMessage });
    await newMessage.save();

    await newMessage.populate("sender", "username");

    res.json(newMessage);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const getAllMessages = expressAsyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({}).populate("sender", "usernname");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, getAllMessages };
