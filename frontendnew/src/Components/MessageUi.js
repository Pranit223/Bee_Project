import React from 'react'
const MessageUi = ({message,user,selectedChat} ) => {
  
  // console.log(message.sender.name)
  return (
    <div className={`single-message ${message.sender._id === user._id ? 'sent' : 'received'}`}>


        
        {
          message.sender._id === user._id ?(<></>):(
            selectedChat.isGroupChat?(<p className='sender-name'>{message.sender.name}</p>):(<></>)
          )
        
        }

        <p>{message.content}</p>
        

    </div>
  )
}

export default MessageUi