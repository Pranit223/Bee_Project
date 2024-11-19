import React, { useEffect, useState } from 'react'
import SearchIcon from '@mui/icons-material/Search';
import NotificationsIcon from '@mui/icons-material/Notifications';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { ChatState } from '../context/ChatProvider';


import Menu from '@mui/material/Menu';
import ListItemIcon from '@mui/material/ListItemIcon';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import PersonAdd from '@mui/icons-material/PersonAdd';
import Settings from '@mui/icons-material/Settings';
import Logout from '@mui/icons-material/Logout';
import Avatar from '@mui/material/Avatar';




import Modal from '@mui/material/Modal';
import { useNavigate } from 'react-router-dom';
import { Drawer, IconButton } from '@mui/material';
import axios from 'axios';
import ChatLoading from './ChatLoading';
import SearchedUser from './SearchedUser';
// import { Drawer } from '@chakra-ui/react';


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NotificationBadge, { Effect } from "react-notification-badge"

const SideBar = () => {

const [search,setSearch]=useState("");
const [searchResult,setSearchResult]=useState([]);
const [loading,setLoading]=useState(false);
const [loadingChat,setLoadingChat]=useState();

const [isDrawerOpen,setIsDrawerOpen]=useState(false);






const{user,setSelectedChat,selectedChat,chats,setChats,notification}=ChatState();
var tag="User";
if (user) {
  // console.log(`user in sidebar ${user}`);
  tag=user.name;
  var pic=user.pic;
  var email=user.email;
  // Handle the case where user is null (not authenticated)
  // return null; // or render a login component or redirect to login page
}






const [anchorEl, setAnchorEl] = React.useState(null);
const open = Boolean(anchorEl);
const handleClick = (event) => {
  setAnchorEl(event.currentTarget);
};
const handleClose = () => {
  setAnchorEl(null);
};



const navigate = useNavigate();


// HANDLERS


const logoutHandler=()=>{
  localStorage.removeItem("userInfo");
  navigate("/");
};

const searchHandler=async()=>{
  if(!search){
    return;
  }


  try {
    setLoading(true);

    const config={
      headers:{Authorization:`Bearer ${user.token}`,
    },

    };

    const {data}=await axios.get(`/api/user?search=${search}`,config);
    
    setSearchResult(data);
    // console.log("data itthe hai");
    // console.log(data);
    setLoading(false);
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




const accessChat= async(userId)=>{

  try {
    setLoadingChat(true);
    const config={
      headers:{
      "Content-type":"application/json",
      Authorization:`Bearer ${user.token}`,
    },

    };

    const {data}=await axios.post('/api/chat',{userId},config);
    
    // console.log("heee data");
    // console.log(data);
    
if(!chats.find((c)=>c._id===data._id))  setChats([data,...chats]);

    setSelectedChat(data);
    setLoadingChat(false);

    //TO Remember this point...............
    setIsDrawerOpen(false);


    
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

//MODAL CODE
const [openModal, setOpen] = React.useState(false);
const handleOpenModal = () => setOpen(true);
const handleCloseModal = () => setOpen(false);

  return (
    <>
      <div className="header">
        <div className="sub-header">
          <div
            className="user-search-div"
            onClick={() => {
              setIsDrawerOpen(true);
            }}
          >
            <button className="search-button">
              <SearchIcon className="Search-icon" />
            </button>
            <input
              className="user-search-input"
              type="text"
              placeholder="Search"
            />
          </div>

          <h1>Wave Chat</h1>

          <div className="header-icon">
            <NotificationsIcon className="bell" />
            <NotificationBadge
              className="noti"
              count={notification.length}
              effect={Effect.SCALE}
            />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                textAlign: "center",
              }}
            >
              <Tooltip title="Account settings">
                <IconButton
                  onClick={handleClick}
                  size="small"
                  sx={{ ml: 2 }}
                  aria-controls={open ? "account-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                >
                  {/* {pic && console.log("picture", pic)} */}

                  {/* <Avatar className='Avatar' sx={{ width: 32, height: 32 }}>{tag[0]}</Avatar> */}
                  <div
                    className="circle"
                    style={{
                      backgroundImage: `url(${pic})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      width: "50px", // Adjust as needed
                      height: "50px", // Adjust as needed
                      borderRadius: "50%", // To make it circular
                    }}
                  ></div>
                </IconButton>
              </Tooltip>
            </Box>
            <Menu
              anchorEl={anchorEl}
              id="account-menu"
              open={open}
              onClose={handleClose}
              onClick={handleClose}
              PaperProps={{
                elevation: 0,
                sx: {
                  overflow: "visible",
                  filter: "drop-shadow(0px 2px 8px rgba(255, 255, 255, 0.264))",
                  mt: 1.5,
                  "& .MuiAvatar-root": {
                    width: 32,
                    height: 32,
                    ml: -0.5,
                    mr: 1,
                  },
                  "&:before": {
                    content: '""',
                    display: "block",
                    position: "absolute",
                    top: 0,
                    right: 14,
                    width: 10,
                    height: 10,
                    bgcolor: "background.paper",
                    transform: "translateY(-50%) rotate(45deg)",
                    zIndex: 0,
                  },
                },
              }}
              transformOrigin={{ horizontal: "right", vertical: "top" }}
              anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
              <MenuItem onClick={handleClose}>
                <div onClick={handleOpenModal} className="myaccount-div">
                  <Avatar></Avatar>My account
                </div>
              </MenuItem>
              <Divider />

              <div className="logout-div" onClick={logoutHandler}>
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    <Logout fontSize="small" />
                  </ListItemIcon>
                  Logout
                </MenuItem>
              </div>
            </Menu>

            <Modal
              className="modal-main"
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
            >
              <Box className="modal-div">
                <div className="profile-content">
                  <img
                    className="profile-icon"
                    src={pic}
                    alt=""
                    width={250}
                    height={250}
                  />
                </div>
              </Box>
            </Modal>
          </div>
        </div>

        {/* DRAWER........... */}

        <Drawer
          anchor="left"
          open={isDrawerOpen}
          onClose={() => {
            setIsDrawerOpen(false);
          }}
        >
          <div className="drawer">
            <h1>Search User</h1>

            <div className="user-search-div-main">
              <div className="user-search-div2">
                <input
                  className="user-search-input2"
                  type="text"
                  placeholder="Search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="search-button2" onClick={searchHandler}>
                  <SearchIcon className="Search-icon" />
                </button>
              </div>

              {loading ? (
                <ChatLoading />
              ) : (
                searchResult.map((searchUser) => (
                  <SearchedUser
                    key={searchUser._id}
                    searchUser={searchUser}
                    handleFunction={() => accessChat(searchUser._id)}
                  />
                ))

                // <span>result</span>
              )}
            </div>
          </div>
        </Drawer>
      </div>

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
    </>
  );
}

export default SideBar