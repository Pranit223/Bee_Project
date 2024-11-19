import { Skeleton } from '@mui/material'
import React from 'react'
import './Components.css';



const ChatLoading = () => {
  return (
    <div className='skeleton1-div' >
    <Skeleton  width={320} height={90} animation="wave" />
    <Skeleton  width={320} height={90} animation="wave" />
    <Skeleton  width={320} height={90} animation="wave" />
    <Skeleton  width={320} height={90} animation="wave" />
    <Skeleton  width={320} height={90} animation="wave" />
    <Skeleton  width={320} height={90} animation="wave" />
    <Skeleton  width={320} height={90} animation="wave" />



   
   

    </div>
  )
}

export default ChatLoading