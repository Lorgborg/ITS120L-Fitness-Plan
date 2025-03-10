import React from "react";
import { Helmet } from "react-helmet"
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

// import PropTypes from 'prop-types';
// import { loginWrapper } from './login.styled';


function Login() {
   const navigate = useNavigate();

   return (
      <div>
         <h1>LOGIN</h1>
         <GoogleOAuthProvider clientId="788860631464-5frp9jdepqedqc0fhoprp8n3skl01i05.apps.googleusercontent.com">

            <GoogleLogin
               onSuccess={async credentialResponse =>  {
                  const res = await fetch("http://localhost:8080/api/login", {
                     method: 'post',
                     headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                      },
                     body: JSON.stringify({raw: credentialResponse.credential}),
                  })
                  if(res.status == 200) {
                     console.log("this is logged in")
                     navigate('./dashboard')
                  }
               }}
               onError={() => {
                  console.log('Login Failed');
               }}
               auto_select
            />
         </GoogleOAuthProvider>
         <Helmet>
         <title>this is a login</title>
            <meta name="description" content="This is a description of my page." />
            <meta name="keywords" content="react, helmet, seo" />
            <meta property="og:title" content="My Page Title for Social Media" />
            <meta property="og:description" content="This is a description for social media." />
         </Helmet>
      </div>
   )
}

export default Login;
