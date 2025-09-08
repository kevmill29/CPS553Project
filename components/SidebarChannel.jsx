import React from 'react'
import "./SidebarChannel.css"
import { useDispatch } from 'react-redux'
import { setChannelInfo } from '../../features/appSlice';

export default function SidebarChannel({id, channelName}) {
  const dispatch = useDispatch();

  return (
    <div className='sidebarChannel' onClick={()=>
      dispatch(
      setChannelInfo({
        channelId: id, 
        channelName: channelName,
          })
        )
      }>
        <h3><span className="sidebarChannel--hash">#</span>{channelName}</h3>
    </div>
  )
}

 