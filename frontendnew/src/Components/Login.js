import './Components.css'
import React, { useEffect, useState } from 'react'
import logo from '../assest/logo-white.png';
// import { Button } from '@mui/material';
import { Button } from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import axios from 'axios';
import { useNavigate } from "react-router-dom";


import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Signup from './Signup';


//trying.....................................................................................


const Login = () => {

    const[password,setPassword]=useState();
    const[email,setEmail]=useState();

    const[show,setShow]=useState(false);

    const navigate = useNavigate();

    const  [islogin, setIslogin] = useState(true);

    useEffect(()=>{
      const user =JSON.parse(localStorage.getItem("userInfo"));


      if(user){
        // console.log(user.name);

          navigate("/chats");

      }
  },[navigate]);

  
const RedirectHandler=()=>{
  setIslogin(false);
}


    const submitHandler=async()=>{

      if(!email || !password){
        toast.warn("Please fill all fields required", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
          });   
        console.log("please fill all fields required");
        return;
      }

      try {

        const config={
          headers:{
            "Content-type":"application/json",
          },
        };

        const {data}=await axios.post("/api/user/login",{
          email,password
        },config
        );

      
        // toast.warn("logininkionciosanfoisdncoi", {
        //   position: "bottom-right",
        //   autoClose: 4000,
        //   hideProgressBar: true,
        //   closeOnClick: true,
        //   pauseOnHover: true,
        //   draggable: true,
        //   theme: "dark",
        //   });
        // console.log("Login")
        localStorage.setItem("userInfo",JSON.stringify(data));

        navigate("/chats");
       


      } catch (error) {

        toast.error("Incorrect UserName or Password ", {
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



  return (
    <>

  <div className="all-div">

  </div>
    <div className="main-login">

        <div className="logo-container">
        <img className='logo-login' src={logo}  alt="" />

        </div>

    
        <div className="login-container">


          {

            islogin?(<>
            <h2>Login or <span className='option' onClick={RedirectHandler}>SignUp</span> </h2>



       

<input className='username-search'
  onChange={(e)=>setEmail(e.target.value)}
  type="text" 
  placeholder='email' />


<div className="password-div">
<input className='username-searchpass' type={show?("text"):("password")} 
         placeholder='Password'
         onChange={(e)=>setPassword(e.target.value)}  />
         <button className='show' onClick={()=> setShow(!show)}>
         {show?( <VisibilityIcon className='eye' />):(<VisibilityOffIcon className='eye'/>)}
         </button>

</div>
 






         



  <Button className='login-button' variant="contained" onClick={submitHandler} >Login</Button>

            
            </>):(<>
            <Signup islogin={islogin} setIslogin={setIslogin}/>
            
            </>)
          }

        
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
    </div>
    


    

    
    </>
    
  )
}

export default Login





















// import React from 'react'
// // import Logo from '../assets/logo-black.png'
// import Button from '@mui/material/Button';
// import './Components.css';
// const Login = () => {
//     return (
//       <div className='login-container'>
//           <div className="logo-container">
//               <img className='logo-login'  alt="" />
  
//           </div>
  
//           <div className="login-box">
  
  
//           <h2>Login To join</h2>
  
  
  
//           <input className='username-search' type="text" 
//               placeholder='Username' />
  
  
//          <input className='username-search' type="password" 
//               placeholder='Password' />
  
  
//           <Button className='login-button' variant="contained">Login</Button>
  
//           </div>
  
//       </div>
//     )
//   }
  
//   export default Login



