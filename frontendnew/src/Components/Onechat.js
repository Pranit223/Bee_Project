import React, { useEffect, useState } from 'react'
import { ChatState } from '../context/ChatProvider';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { Dialog } from '@mui/material';
import UpdateGroup from './UpdateGroup';
import SpinnerLoading from './SpinnerLoading';
import axios from 'axios';
import MessageUi from './MessageUi';

import io from 'socket.io-client'

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Typing from './Typing';

const ENDPOINT = "http://localhost:5000";

var socket, selectedChatCompare;




const Onechat = ({ fetchAgain, setFetchAgain }) => {

  const [messages, setMessages] = useState([]);

  const [newMessages, setNewMessages] = useState("");

  const [loading, setLoading] = useState(false);

  const [socketConnected, setSocketConnected] = useState(false);

  const [typing, setTyping] = useState(false);

  const [isTyping, setIsTyping] = useState(false);


  const { user, setSelectedChat, selectedChat, chats, setChats, notification, setNotification } = ChatState();

  // console.log("selected "+selectedChat);

  const [open, SetOpen] = useState(false);

  console.log("selected chat");
  if (selectedChat) {
    // const utcTime = selectedChat.updatedAt;
    console.log(selectedChat)

    // Create a Date object from the UTC time string

    const istTime = new Date(`${selectedChat.updatedAt}`);

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    const istTimeString = `${hours}:${minutes}`;
    console.log(istTimeString);


  }

  const displayProfile = () => {
    SetOpen(!open);
  }

  const fetchMessages = async () => {
    if (!selectedChat) {
      return;
    }


    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);

      const { data } = await axios.get(
        `/api/message/${selectedChat._id}`,
        config
      );
      // console.log("masagesses");
      // console.log(messages);

      setMessages(data);
      setLoading(false);

      socket.emit("join chat", selectedChat._id);

    } catch (error) {
      toast.error("Error", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

    }

  }
  useEffect(() => {

    // changes made here(user in dependency aaray) else we will fetch from local storage

    socket = io(ENDPOINT);
    if (user) {
      socket.emit("setup", user);
    }
    socket.on("connected", () => { setSocketConnected(true) });

    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));


  }, [user]);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
    // console.log(selectedChat);
  }, [selectedChat]);

  //making changes...........................................................
  useEffect(() => {
    socket.on("message recieved", (newMessageRecieved) => {
      // console.log("testing");

      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

        // if(!notification.includes(newMessageRecieved)){
        //   console.log("Enter3");
        //   setNotification([newMessageRecieved, ...notification]);
        //   setFetchAgain(!fetchAgain);
        //   // console.log("notification......."+notification);
        // }


      }
      else {
        // console.log("enter");

        setMessages([...messages, newMessageRecieved]);

      }
    })


    socket.on("notification", (newMessageRecieved) => {

      if (!selectedChatCompare || selectedChatCompare._id !== newMessageRecieved.chat._id) {

        if (!notification.includes(newMessageRecieved)) {
          setNotification([newMessageRecieved, ...notification]);
          setFetchAgain(!fetchAgain);
        }


      }
    })
  })

  //Socket io useEffect



  const sendMessage = async (event) => {

    if (event.keyCode === 13) {

      socket.emit("stop typing", selectedChat._id);


      try {

        const config = {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        };


        setNewMessages("");

        const { data } = await axios.post(
          "/api/message",
          {
            content: newMessages,
            chatId: selectedChat._id,
          },
          config

        );

        // console.log("data")
        // console.log(data);

        socket.emit("new message", data);
        setMessages([...messages, data]);
        // fetchAgain();
        setFetchAgain(!fetchAgain);

      } catch (error) {
        toast.error("Error", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

      }
      // console.log('Enter');
    }

  };

  const typingHandler = async (event) => {
    setNewMessages(event.target.value);

    if (!socketConnected) {

      return;
    }
    if (!typing) {
      // console.log(socketConnected)
      setTyping(true);
      socket.emit("typing", selectedChat._id);

    }

    var lastTypingTime = new Date().getTime();
    var timerLength = 2000;

    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;
      socket.emit("stop typing", selectedChat._id);
      setTyping(false);
      // if(timeDiff >= timerLength && typing){
      //   socket.emit("stop typing",selectedChat._id);
      //   setTyping(false);
      // }
    }, timerLength);

  };


  // console.log(user);
  return (
    <div className="Onechat">
      <div className="onechat-header">
        {selectedChat ? (
          <h2>
            {selectedChat.isGroupChat
              ? selectedChat.chatName.toUpperCase()
              : selectedChat.users[0]._id === user._id
                ? selectedChat.users[1].name.toUpperCase()
                : selectedChat.users[0].name.toUpperCase()}
          </h2>
        ) : (
          <></>
        )}

        {selectedChat ? (
          selectedChat.isGroupChat ? (
            <UpdateGroup
              fetchAgain={fetchAgain}
              setFetchAgain={setFetchAgain}
            />
          ) : (
            <div
              className="profile-selectedUser"
              style={{
                backgroundImage: `url(${selectedChat.users[1].pic})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                width: "70px", // Adjust as needed
                height: "70px", // Adjust as needed
                borderRadius: "50%", // To make it circular
              }}
              onClick={displayProfile}
            />
          )
        ) : (
          <></>
        )}
      </div>

      <div className="onechat-body">
        {selectedChat ? (
          <>
            {loading ? (
              <SpinnerLoading />
            ) : (
              <div className="onechat-body-chat">
                {messages.map((message) => (
                  <MessageUi
                    key={message._id}
                    selectedChat={selectedChat}
                    message={message}
                    user={user}
                  />
                ))}
                {isTyping ? <Typing /> : <></>}
              </div>
            )}

            <div className="onechat-body-input">
              <input
                className="chat-send-message"
                onKeyDown={sendMessage}
                onChange={typingHandler}
                type="text"
                value={newMessages}
                placeholder="Type a message"
              />
            </div>
          </>
        ) : (
          <>
            {/* <h1>Click On a chat to start chatting</h1> */}
            <div
              className="centre-img"
              style={{
                backgroundImage: `url(${require("../assest/logo-white.png")})`,
              }}
            ></div>
          </>
        )}
      </div>

      <Dialog
        className="profile-selectedUser-dailog"
        open={open}
        onClose={displayProfile}
      >
        {/* IMAGE */}

        <img
          className="profile-icon2"
          src={
            selectedChat ? (
              selectedChat.users[0]._id === user._id ? (
                selectedChat.users[1].pic
              ) : (
                selectedChat.users[0].pic
              )
            ) : (
              <></>
            )
          }
          alt=""
        />

        {/* NAME           */}
      </Dialog>

      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        limit={3}
        hideProgressBar
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </div>
  );
}

export default Onechat