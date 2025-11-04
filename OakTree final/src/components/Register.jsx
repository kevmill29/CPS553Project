import React from 'react'

function Register() {
  return (
    <div>
         <nav>
        <ul>
            <a href="login.html">Login Page</a>
            <a href="post.html">Page for Posting</a>
        </ul>
    </nav>
    <form class="form">
        <label for="userEmail">Enter Email Here:</label>
        <input type="email"  id="userEmail"/>
        <label for="passwd">Enter Password Here:</label>
        <input type="password"  id="passwd"/>
        <label type="submit">Click Complete Registration:</label>
        <input type="submit" value="Register"/>
    </form>
    </div>
  )
}

export default Register