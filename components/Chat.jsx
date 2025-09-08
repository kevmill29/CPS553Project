import React, { useEffect, useState } from 'react'
import "./Chat.css"
import ChatHeader from './ChatHeader'
import AddCircleIcon from '@mui/icons-material/AddCircle';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import GifIcon from '@mui/icons-material/Gif';
import EmojiEmotionsIcon from '@mui/icons-material/EmojiEmotions';
import Message from './Message';
import { useSelector } from 'react-redux';
import { selectChannelId, selectChannelName } from '../../features/appSlice';
import { selectUser } from '../../features/userSlice';
import { serverTimestamp, collection, orderBy, onSnapshot, doc, query, addDoc } from "firebase/firestore";
import db from "./firebase"


function Chat() {
  const user = useSelector(selectUser);
  const channelId = useSelector(selectChannelId);
  const channelName = useSelector(selectChannelName);

  const[input, setInput] = useState([])
  const [messages, setMessages] = useState([])
  
 useEffect(()=>{
  

  
    if(channelId){ 
      {
        onSnapshot(collection(db,"channels"),doc(channelId),(collection(db,"messages")),orderBy("timestamp", "desc"),((snapshot)=>{
    setMessages(snapshot.docs.map((doc)=> doc.data()))
  }))}}
  
 },[channelId])
 
  const sendMessage = e =>{
    e.preventDefault();
     addDoc(collection(db,"channels"),doc(channelId),collection(db,"messages"),{
      timestamp: serverTimestamp(),
      message: input,
      user: user,
    });
    
    setInput('')
  }

  return (
    <div className='chat'>
       
        <ChatHeader channelName={channelName}/>

        <div className="chat--messages">
         { messages.map((message)=>(
          <Message
          timestamp={message.timestamp}
          message={message.message}
          user={message.user} />
         ))
            }
        </div>

        <div className="chat--input">
        <AddCircleIcon fontSize="large" />
            <form action="">
                <input value={input} 
                onChange= {(e)=> setInput(e.target.value)} 
                disabled={!channelId} 
                placeholder={channelName && `Message #${channelName}`} />
                <button 
                className='chat--inputBtn' 
                type="submit"
                disabled={!channelId}
                onClick={sendMessage}
                >
                  Send Message
                  </button>
            </form>

            <div className="chat--inputIcons">
                 <CardGiftcardIcon fontSize="large" />
                 <GifIcon fontSize="large"/>
                 <EmojiEmotionsIcon fontSize="large"/>

            </div>
        </div>
    </div>
  )
}

export default Chat