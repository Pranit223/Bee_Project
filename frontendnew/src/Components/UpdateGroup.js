import React, { useState } from 'react'
import GroupsIcon from '@mui/icons-material/Groups';
import { Dialog } from '@mui/material';
import { ChatState } from '../context/ChatProvider';
import SelectedtUserTag from './SelectedtUserTag';
import './Components.css'
import axios from 'axios';
import SearchedUser from './SearchedUser';
import SpinnerLoading from './SpinnerLoading';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const UpdateGroup = ({fetchAgain,setFetchAgain}) => {


    const[groupChatName,setGroupChatName]=useState();
    const[search,setSearch]=useState();
    const[searchResult,setSearchResult]=useState([]);
    const[loading,setLoading]=useState(false);
  

    const{user,setSelectedChat,selectedChat}=ChatState();


    



    const [open,SetOpen]=useState(false);

    const displayProfile=()=>{
        SetOpen(!open);
      }




      const RemoveTag=async(e)=>{

        if(selectedChat.groupAdmin._id !== user._id){
          toast.warn("Only admis can modify group", {
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
        if(e._id ===selectedChat.groupAdmin._id){

          toast.warn("Admins can not be kicked", {
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
        if(selectedChat.users.length < 3){

          toast.warn("Min. Two member Should be there in group", {
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
            
            const config={
                headers:{Authorization:`Bearer ${user.token}`,
              },
          
              };
        

              const {data}=await axios.put(`/api/chat/groupremove`,{
                chatId:selectedChat._id,
                userId:e._id,
              },config);


              // console.log(data)
              setSelectedChat(data);
              setFetchAgain(!fetchAgain);
              setGroupChatName("");
              

        } catch (error) {

          toast.warn("Can not Add user", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            }); 
            // console.log("Coan not add user");
            console.log(error)
        }

        setLoading(false);
      }

      //Rename the group
      const HandleRename=async()=>{
        if(!groupChatName){
            return;
        }


        try {
            
            const config={
                headers:{Authorization:`Bearer ${user.token}`,
              },
          
              };
        

              const {data}=await axios.put(`/api/chat/rename`,{
                chatId:selectedChat._id,
                chatName:groupChatName,
              },config);


              // console.log(data)
              setSelectedChat(data);
              setFetchAgain(!fetchAgain);
              displayProfile();
              setGroupChatName("");

        } catch (error) {
          toast.warn("Unable to change name", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            }); 
            console.log(error)
        }
      }


      //Search the user to add
      const HandleSearch=async(query)=>{
        if(!query){
          setSearch(query);
            return;
          }
      
          try {
            setLoading(true);
            setSearch(query);
            const config={
              headers:{Authorization:`Bearer ${user.token}`,
            },
        
            };
        
            const {data}=await axios.get(`/api/user?search=${search}`,config);
            
            setSearchResult(data);
            // console.log("data itthe hai");
            // console.log(data);
            
          } catch (error) {
            toast.warn("Error Occured failed to load Results!!!", {
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

      //add the user
      const addTolist=async(e)=>{
        setLoading(true);
        
        if(selectedChat.users.find((u)=> u._id===e._id)){
          toast.warn("user already in the group", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            });
            setLoading(false);
            return;
        }


        if(selectedChat.groupAdmin._id !== user._id){
          toast.warn("Only admis can modify group", {
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
            
            const config={
                headers:{Authorization:`Bearer ${user.token}`,
              },
          
              };
        

              const {data}=await axios.put(`/api/chat/groupadd`,{
                chatId:selectedChat._id,
                userId:e._id,
              },config);


              // console.log(data)
              setSelectedChat(data);
              setFetchAgain(!fetchAgain);
              setGroupChatName("");
              setSearchResult([]);

        } catch (error) {
          toast.warn("unable to add User", {
            position: "bottom-right",
            autoClose: 4000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
            });
            console.log(error)
        }

        setLoading(false);


      }

//Leave Group button for Admin to leave
      const Handleremove=()=>{
        
      }

//test console log
// console.log(selectedChat.chatName);

  return (
    <>
    <GroupsIcon className='profile-selectedGroup' onClick={displayProfile}/>




<Dialog className='profile-selectedGroup-dailog' open={open} onClose={displayProfile}>
<h1>
{selectedChat.chatName.toUpperCase()}
</h1>

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

<div className="SelectedUser-div">
          {selectedChat.users.map((e)=>(
              
              <SelectedtUserTag key={e._id} SelectedUser={e} Handleremove={()=>RemoveTag(e)}/>
            ))}


 </div>

<div className="in-one">



 <input className='createGroup-search Chat-Name'
            onChange={(e)=>setGroupChatName(e.target.value)}
            type="text" 
            // value={groupChatName}
            placeholder='Chat Name' />
             <button className="button2 update-chatname" onClick={HandleRename} >Update</button>


</div>



<input className='createGroup-search Chat-Name'
            onChange={(e)=>HandleSearch(e.target.value)}
            type="text" 
            // value={search}
            placeholder='Search User' />

            {/* SELECTED USERS */}

          {/* <div className="SelectedUser-div">
          {selectedUser?.map((e)=>(
              
              <SelectedtUserTag key={e._id} SelectedUser={e} Handleremove={()=>RemoveTag(e)}/>
            ))}


          </div> */}




                {/* Render Search Users */}
                {loading?(<SpinnerLoading/>):(
              searchResult?.slice(0,4).map((e)=>(
                
                <SearchedUser  key={e._id} searchUser={e} selectedChat={selectedChat} handleFunction={()=>addTolist(e)}/>
              ))
            )}


<button className="button2 leave-group" onClick={()=>Handleremove(user)} >Leave group</button>

  </Dialog>  

    </>
  )
}

export default UpdateGroup