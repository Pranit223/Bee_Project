import React, { useState } from 'react'
import './Components.css'
import Allchats from './Allchats'
import Onechat from './Onechat'

const ChatBox = () => {
  const [fetchAgain,setFetchAgain]=useState(false);
  return (
    <div className='chat-box'>
      <Allchats fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>

      <Onechat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain}/>


    </div>
  )
}

export default ChatBox