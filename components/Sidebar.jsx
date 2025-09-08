import React, { useEffect, useState } from 'react'
import "./Sidebar.css"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import AddIcon from "@mui/icons-material/Add"
import SidebarChannel from './SidebarChannel'
import SignalCellularAltIcon from '@mui/icons-material/SignalCellularAlt';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import CallIcon from '@mui/icons-material/Call';
import { Avatar } from '@mui/material'
import MicIcon from '@mui/icons-material/Mic';
import HeadsetIcon from '@mui/icons-material/Headset';
import SettingsIcon from '@mui/icons-material/Settings';
import { useSelector } from 'react-redux'
import { selectUser } from '../../features/userSlice'
import db, { auth } from './firebase'
import { addDoc, collection, onSnapshot } from 'firebase/firestore'



export default function Sidebar() {
 
  const user =  useSelector(selectUser)
  const [channels, setChannels] = useState([])

  useEffect(()=>{
    onSnapshot(collection(db, 'channels'),(snapshot)=>{
      setChannels(
        snapshot.docs.map((doc) => 
        ({
        id: doc.id,
        channel: doc.data(),
      }))
  )
})
})

const handleAddChannel = () =>{
  const channelName = prompt("Enter a new channel name")

  if(channelName){
      addDoc(collection(db, "channels"),{
        channelName: channelName
      })
  }
}


  return (
    
    <div className='sidebar'>
        <div className="sidebar--top"> 
            <h2>Flex Life</h2>
            <ExpandMoreIcon />
        </div>

        <div className="sidebar--channels">
          <div className="sidebar--channelsheader">
              <div className="sidebar--header">
                  <ExpandMoreIcon />
                  <h4>Text Channels</h4>
              </div>

              <AddIcon onClick={handleAddChannel}className="sidebar--addChannel" />
          </div>
            <div className="sidebar--channels-list">
                {channels.map(({id, channel})=>(
                  <SidebarChannel key={id} id={id} channelName={channel.channelName} />
                ))}
                
            </div>
        </div>

        <div className="sidebar--voice">
            <SignalCellularAltIcon 
            className="sidebar--voiceIcon" 
            fontSize="large" 
            />
          <div className="sidebar--voiceInfo">
                <h3>Voice Connected</h3>
                <p>Stream</p>
          </div>

            <div className="sidebar--voiceIcons">
                <InfoOutlinedIcon />
                <CallIcon />
            </div>


        </div>
        
        <div className="sidebar--profile">
              <Avatar onClick={()=> auth.signOut()}src={user.photo}/>
              <div className="sidebar--profileInfo">
                <h3>{user.displayName}</h3>
                <p>#{user.uid.substr(0, 5)}</p>
              </div>
            

            <div className="sidebar--profileIcons">
              <MicIcon />
              <HeadsetIcon />
              <SettingsIcon />
            </div>
          </div>
    </div>  
  )
}

 