import React, { useEffect, useState } from 'react'
import axios from 'axios';
import ChatLoading from './ChatLoading';
import AddIcon from '@mui/icons-material/Add';
import { ChatState } from '../context/ChatProvider';
import { Dialog, DialogContent } from '@mui/material';
import SearchedUser from './SearchedUser';
import SpinnerLoading from './SpinnerLoading';
import SelectedtUserTag from './SelectedtUserTag';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Allchats = ({ fetchAgain }) => {
  //removing user since connot fetch user from global state ;
  const { setSelectedChat, selectedChat, chats, setChats } = ChatState();

  // const[loggedUser,SetLoggedUser]=useState();

  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);

  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  var user = JSON.parse(localStorage.getItem("userInfo")); //therefore fetching user temporary ...will resolve afterwards.

  const timehaldler = (chat) => {
    const istTime = new Date(`${chat.updatedAt}`);

    const hours = istTime.getHours();
    const minutes = istTime.getMinutes();

    const istTimeString = `${hours}:${minutes}`;
    console.log(istTimeString);
    return istTimeString;

  }
  const HandleSearch = async (query) => {
    if (!query) {
      return;
    }

    try {
      setLoading(true);
      setSearch(query);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },

      };

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setSearchResult(data);
      // console.log("data itthe hai");
      // console.log(data);

    } catch (error) {

      toast.error("Error Occured failed to load Results!!!", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });

    }
    setLoading(false);
  }
  // SUBMIT HANDLER

  const HandleSubmit = async () => {
    if (!groupChatName || !selectedUser) {
      toast.warn("Fill All required info", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }
    if (selectedUser.length < 2) {
      toast.warn("Add min two users", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }


    try {


      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },

      };

      const { data } = await axios.post(`/api/chat/group`, {
        name: groupChatName,
        users: JSON.stringify(selectedUser.map((u) => u._id)),
      }, config);
      setChats([data, ...chats]);
      FunctionDailog();
      // console.log(data);

    } catch (error) {
      toast.error("error in creating groupchat", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      // console.log("error in creating groupchat");
      console.log(error)
    }
  }

  const RemoveTag = (toDel) => {
    setSelectedUser(selectedUser.filter((u) => u._id !== toDel._id));
  }

  const addTolist = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {

      toast.warn("User already added", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    setSelectedUser([...selectedUser, userToAdd]);
  }



  const fetchChats = async () => {
    // var user=JSON.parse(localStorage.getItem("userInfo")); //therefore fetching user temporary ...will resolve afterwards.

    // console.log(`userrrrr ${user}`);
    try {

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },

      };

      const { data } = await axios.get(`/api/chat`, config);

      setChats(data);


    } catch (error) {
      toast.error("Error Occured", {
        position: "bottom-right",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      console.log(error);
    }
  }

  useEffect(() => {


    fetchChats();


  }, [fetchAgain]);

  const [open, SetOpen] = useState(false);

  const FunctionDailog = () => {
    SetOpen(!open);
  }

  return (
    <div className="Allchats">
      <div className="header-allchats">
        <h2>MY CHATS</h2>

        <button onClick={FunctionDailog}>
          New Group Chat <AddIcon />
        </button>
      </div>

      {chats ? (
        <div className="one-convo">
          {chats.map((chat) => (
            <div
              key={chat._id}
              className="each-convo"
              onClick={() => setSelectedChat(chat)}
              // bg={selectedChat==chat?"#cecfd2":"#8898cb"}
              style={
                selectedChat === chat
                  ? { backgroundColor: "#eff5fb" }
                  : { backgroundColor: "white" }
              }
            >
              <div
                className="circle"
                style={{
                  backgroundImage: `url(${chat.users[1].pic})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  width: "50px", // Adjust as needed
                  height: "50px", // Adjust as needed
                  borderRadius: "50%", // To make it circular
                }}
              ></div>
              <div className="name-time">
                <h2 className="name-convo">
                  {chat.isGroupChat
                    ? chat.chatName
                    : chat.users[1]._id === user._id
                      ? chat.users[0].name
                      : chat.users[1].name}
                </h2>
                {chat.lastMessage ? (
                  <p>{chat.lastMessage.content.substring(0, 10) + "..."}</p>
                ) : (
                  <></>
                )}
              </div>
              <p className="lmessage">{timehaldler(chat)}</p>
              {console.log(chat)}

              {/* <p>{chat.lastMessage.content.substring(0, 10)+"..."}</p> */}
            </div>
          ))}
        </div>
      ) : (
        <ChatLoading />
      )}
      {/* THE DAILOG BOX CODE...... */}

      <Dialog className="dailog" open={open} onClose={FunctionDailog}>
        <h1>Create a Group-Chat</h1>

        <input
          className="createGroup-search"
          onChange={(e) => setGroupChatName(e.target.value)}
          type="text"
          placeholder="Group-Name"
        />

        <input
          className="createGroup-search"
          onChange={(e) => HandleSearch(e.target.value)}
          type="text"
          placeholder="Search User"
        />

        {/* SELECTED USERS */}

        <div className="SelectedUser-div">
          {selectedUser?.map((e) => (
            <SelectedtUserTag
              key={e._id}
              SelectedUser={e}
              Handleremove={() => RemoveTag(e)}
            />
          ))}
        </div>

        {/* Render Search Users */}
        {loading ? (
          <SpinnerLoading />
        ) : (
          searchResult
            ?.slice(0, 4)
            .map((e) => (
              <SearchedUser
                key={e._id}
                searchUser={e}
                handleFunction={() => addTolist(e)}
              />
            ))
        )}

        <button className="button2" onClick={HandleSubmit}>
          Create Chat
        </button>

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
      </Dialog>
    </div>
  );
}

export default Allchats