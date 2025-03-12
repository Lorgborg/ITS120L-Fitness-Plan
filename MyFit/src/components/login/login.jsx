<<<<<<< Updated upstream
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet"
=======
import React from "react";
import { Helmet } from "react-helmet";
>>>>>>> Stashed changes
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

<<<<<<< Updated upstream

// import PropTypes from 'prop-types';
// import { loginWrapper } from './login.styled';


=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
      <div>
=======
      <div className="min-h-screen flex items-center justify-center bg-[#FEF9E1] relative overflow-hidden">
>>>>>>> Stashed changes
         <Helmet>
            <title>MyFit - Login</title>
            <meta name="description" content="Login to MyFit - Track your calories and reach your fitness goals" />
            <meta name="keywords" content="fitness, diet, calorie tracking, weight management" />
            <meta property="og:title" content="MyFit - Your Personal Diet & Calorie Tracker" />
            <meta property="og:description" content="Track your calories, plan your diet, and reach your weight goals with MyFit" />
         </Helmet>
<<<<<<< Updated upstream
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
=======
         
         {/* Background elements */}
         <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E5D0AC] opacity-50 -mb-32 -ml-32"></div>
         <div className="absolute top-0 right-0 w-96 h-96 bg-[#A31D1D] opacity-30 -mt-20 -mr-20"></div>
         
         <div className="w-full max-w-4xl flex overflow-hidden rounded-lg shadow-xl z-10">
            {/* Left Panel */}
            <div className="w-5/12 bg-[#A31D1D] text-white flex flex-col justify-center p-12 relative">
               <div className="absolute top-8 left-8 flex items-center">
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-2">
                     <span className="text-[#A31D1D] font-bold">M</span>
                  </div>
                  <span className="text-white font-medium">MyFit</span>
               </div>
               
               <h2 className="text-3xl font-bold mb-4">Welcome to MyFit!</h2>
               <p className="mb-8">Track your calories, plan your diet, and reach your weight goals with our easy-to-use platform</p>
               
               {/* Decorative elements */}
               <div className="absolute bottom-0 right-0 w-32 h-32 rounded-full bg-[#6D2323] opacity-40 -mb-16 -mr-16"></div>
               <div className="absolute top-24 right-24 w-20 h-20 rounded-full border-4 border-[#FEF9E1] opacity-20"></div>
            </div>
            
            {/* Right Panel */}
            <div className="w-7/12 bg-white p-12 flex flex-col justify-center items-center">
               <h2 className="text-2xl font-bold text-[#6D2323] text-center mb-6">Sign in to MyFit</h2>
               <p className="text-gray-600 text-center mb-8">Use your Google account to sign in</p>
               
               <div className="mb-8">
                  <GoogleOAuthProvider clientId="788860631464-5frp9jdepqedqc0fhoprp8n3skl01i05.apps.googleusercontent.com">
                     <GoogleLogin
                        onSuccess={async credentialResponse => {
                           const res = await fetch("http://localhost:8080/api/login", {
                              method: 'post',
                              headers: {
                                 'Accept': 'application/json',
                                 'Content-Type': 'application/json'
                              },
                              body: JSON.stringify({raw: credentialResponse.credential}),
                           })
                           
                           if(res.status === 200) {
                              // User exists, go to dashboard
                              console.log("User logged in successfully")
                              navigate('./dashboard')
                           } else if(res.status === 404) {
                              // User doesn't exist, go to signup
                              console.log("New user, redirecting to signup")
                              // Pass the Google credential to the signup page
                              navigate('./signup', { 
                                 state: { credential: credentialResponse.credential } 
                              })
                           } else {
                              // Handle other errors
                              console.log("Login error:", res.status)
                           }
                        }}
                        onError={() => {
                           console.log('Login Failed');
                        }}
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        theme="filled_blue"
                     />
                  </GoogleOAuthProvider>
               </div>
               
               <div className="text-center text-gray-500 text-sm">
                  <p>By signing in, you agree to our <a href="#" className="text-[#A31D1D]">Terms of Service</a> and <a href="#" className="text-[#A31D1D]">Privacy Policy</a></p>
               </div>
            </div>
         </div>
>>>>>>> Stashed changes
      </div>
   );
}

export default Login;
