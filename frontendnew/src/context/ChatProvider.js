import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

const ChatProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [selectedChat,setSelectedChat]=useState();
  const [chats,setChats]=useState([]);
const [notification, setNotification] = useState([]);


  const navigate = useNavigate();

  useEffect(() => {
    const fetchInfo=async()=>{
      const userInfo = await JSON.parse(localStorage.getItem("userInfo"));
      if (!userInfo) {
        navigate("/");
      } else {
        setUser(userInfo);
      }
  

    }
    

    fetchInfo();
  }, [navigate]);

  return (
    <ChatContext.Provider value={{ user, setUser,selectedChat,setSelectedChat,chats,setChats ,notification, setNotification}}>
      {children}
    </ChatContext.Provider>
  );
};

export const ChatState = () => {
  return useContext(ChatContext);
};

export default ChatProvider;
