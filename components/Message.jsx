import { Avatar } from '@mui/material'
import React from 'react'
import './Message.css'

function Message() {
  return (
    <div className='message'>
        <Avatar />
        <div className="message--info">
            <h4>kevmill29
                <span className="message--timestamp">this is a time stamp</span>
            </h4>

            <p>this is a message</p>
        </div>
    </div>
  )
}

export default Message