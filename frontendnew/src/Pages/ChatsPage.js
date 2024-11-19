

import SideBar from "../Components/SideBar";
import { ChatState } from "../context/ChatProvider";
import '../Components/Components.css';
import ChatBox from "../Components/ChatBox";
import { useEffect } from "react";


const ChatsPage = () => {

const{user}=ChatState();




  

  return (
<>
<div className="chatpage-main">



<SideBar/>

<ChatBox/>

</div>


</>

    
  )
}

export default ChatsPage;