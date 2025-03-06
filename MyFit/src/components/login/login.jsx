import React from "react";
// import PropTypes from 'prop-types';
// import { loginWrapper } from './login.styled';


function Login() {

   return (
      <>
         <form action="http://localhost:8080/api/signup" method="post">
            <label htmlFor="username">Username</label>
            <input type="text" name="username" id="username" required/>
            <label htmlFor="password">Password</label>
            <input type="password" name="password" id="password" required/>
            <button type="submit">Submit</button>
         </form>
      </>
   )
}

export default Login;
