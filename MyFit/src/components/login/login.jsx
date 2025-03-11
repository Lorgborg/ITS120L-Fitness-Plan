import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet"
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';


// import PropTypes from 'prop-types';
// import { loginWrapper } from './login.styled';


function Login() {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   

const handleSuccess = async (credentialResponse) => {
   console.log("Pulling from http://localhost:8080/api/login")
   const res = await fetch("http://localhost:8080/api/login", {
      method: 'post',
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json'
      },
      body: JSON.stringify({ raw: credentialResponse.credential }),
   })
   if (res.status === 201) {
      const data = await res.json()
      const email = data.status.email; // Assuming the response contains the email
      const name = data.status.given_name;
      setName(name);
      setEmail(email); // Set the email state
      navigate(data.message, { state: { email, name } }) // Pass the email directly
      console.log({ email: email })
      console.log({ data: data.status.given_name })
   }
}
   return (
      <div>
         <Helmet>
         <title>this is a login</title>
            <meta name="description" content="This is a description of my page." />
            <meta name="keywords" content="react, helmet, seo" />
            <meta property="og:title" content="My Page Title for Social Media" />
            <meta property="og:description" content="This is a description for social media." />
         </Helmet>
         <h1>LOGIN</h1>
         <GoogleOAuthProvider clientId="788860631464-5frp9jdepqedqc0fhoprp8n3skl01i05.apps.googleusercontent.com">

            <GoogleLogin
               onSuccess={handleSuccess}
               onError={() => {
                  console.log('Login Failed');
               }}
               auto_select
            />
         </GoogleOAuthProvider>
      </div>
   )
}

export default Login;
