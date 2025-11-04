import React from 'react'

function Login() {
  return (
    <div>
        <nav>
       <ul>
            <a href="post.html">Post Here</a>
            <a href="register.html">Register Here</a>
        </ul>  
    </nav>
    
        <form class="form" >
        <label for="email">Email:</label>
        <input type="email" id="useremail"/>
        <label for="passwd">Password:</label>
        <input type="password"  id="passwd"/>
        <input type="submit" value="Login"/>
         </form>
    </div>
  )
}

export default Login