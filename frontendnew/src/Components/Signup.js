import './Components.css'
import React, { useState } from 'react'
import logo from '../assest/logo-black.png';
// import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Signup = ({ islogin, setIslogin }) => {

  const [name, setName] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmpass, setConfirmpass] = useState();
  const [pic, setPic] = useState();
  const [show, setShow] = useState(false);

  console.log("check");
  const navigate = useNavigate();


  const submitHandler = async () => {

    if (!name || !email || !password) {
      toast.warn("Please fill All fields", {
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

    if (password !== confirmpass) {
      toast.error("Incorrect Password Try again", {
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
          "Content-type": "application/json",
        },
      };

      const { data } = await axios.post("https://bee-project-viwy.onrender.com/api/user", {
        name, email, password, pic
      }, config
      );
      // console.log(data+"signup page")

      localStorage.setItem("userInfo", JSON.stringify(data));

      navigate("/chats")
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

  };

  const RedirectHandler = () => {
    setIslogin(true);
  }



  return (
    <>



      <h2>Signup To join or <span className='option' onClick={RedirectHandler}> LOGIN</span></h2>



      <input className='username-search'
        onChange={(e) => setName(e.target.value)}
        type="text"
        placeholder='Username' />


      <input className='username-search'
        onChange={(e) => setEmail(e.target.value)}
        type="text"
        placeholder='email' />


      <div className="password-div">
        <input className='username-searchpass' type={show ? ("text") : ("password")}
          placeholder='Password'
          onChange={(e) => setPassword(e.target.value)} />
        <button className='show' onClick={() => setShow(!show)}>
          {show ? (<VisibilityIcon className='eye' />) : (<VisibilityOffIcon className='eye' />)}
        </button>

      </div>

      <div className="password-div">
        <input className='username-searchpass' type={show ? ("text") : ("password")}
          placeholder='confirm Password'
          onChange={(e) => setConfirmpass(e.target.value)} />
        <button className='show' onClick={() => setShow(!show)}>
          {show ? (<VisibilityIcon className='eye' />) : (<VisibilityOffIcon className='eye' />)}
        </button>
      </div>

      <Button className='login-button' variant="contained" onClick={submitHandler} >SignUp</Button>

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

  )
}



export default Signup