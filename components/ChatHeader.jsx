import React from 'react'
import './Chatheader.css'
import NotificationsIcon from '@mui/icons-material/Notifications';
import EditLocationIcon from '@mui/icons-material/EditLocation';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import SearchIcon from '@mui/icons-material/Search';
import SendIcon from '@mui/icons-material/Send';
import HelpIcon from '@mui/icons-material/Help';

function ChatHeader({ channelName }) {
  return (
    <div className='chatheader'>
      
      <div className="chatheader--left">
        <h3>
            <span className='chatheader--hash'>
                #
            </span>
            {channelName}
        </h3>
      </div>
      
      <div className="chatheader--right">
        <NotificationsIcon />
        <EditLocationIcon />
        <PeopleAltIcon />

        <div className="chatheader--search">
            <input placeholder="search" />
            <SearchIcon />
        </div>

        <SendIcon />
        <HelpIcon />

      </div>
    </div>
  )
}

export default ChatHeader