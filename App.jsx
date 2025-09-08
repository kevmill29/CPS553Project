import React, { useEffect } from 'react'
import './App.css'
import Chat from './components/Chat'
import Sidebar from './components/Sidebar'
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "./features/userSlice"
import Login from './components/Login';
import {login, logout} from "./features/userSlice"
import { auth } from './components/firebase';

export default function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  

  useEffect(()=>{
    auth.onAuthStateChanged((authUser)=>{
      if (authUser){
        // the user is logged in
        dispatch(
          login({
          uid: authUser.uid,
          photo: authUser.photoURL,
          email:authUser.email,
          displayName: authUser.displayName,
        }))
      } else{
        // the user is logged out
        dispatch(
          logout())
      }
    })
  }, [])
  return (
    <div className="app">
      
        
        {user ? (  
          <>
            <Sidebar/>
            <Chat />
          </>
        ):(
          <Login/>
        )
      }
    
      

    </div>
    
  )
 
}

 
