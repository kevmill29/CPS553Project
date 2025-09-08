import React from 'react'
import "./Login.css"
import logo from "../assets/accordlogo.png"

import { auth, provider} from "./firebase"
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'



function Login() {
    const signIn = ()=>{
signInWithPopup(auth, provider)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    // The signed-in user info.
    const user = result.user;
    // IdP data available using getAdditionalUserInfo(result)
    // ...
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;
    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
    }

  return (
    <div className='login'>
        <div className="login--logo">
            <img src={logo} alt=""/>
        </div>
        <button onClick={signIn}>Sign In</button>
    </div>
        
       
  )
}

export default Login