/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { GoogleLogin } from '@react-oauth/google';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie'

function Login() {
   const navigate = useNavigate();
   const [email, setEmail] = useState('');
   const [name, setName] = useState('');
   const [animateIn, setAnimateIn] = useState(false);
   const [credential, setCredential] = useState('');
   const [logging, setLogging] = useState(false);
   const [cookies, setCookie] = useCookies(['user'])
   
   // Trigger animations after component mounts
   useEffect(() => {
      setAnimateIn(true);
   }, []);

   useEffect(() => {
      console.log("Setting credential to", credential);
   }, [credential]);

   const handleSuccess = async (credentialResponse) => {
      setCredential(credentialResponse); // Update state

      console.log("Setting credential...", credentialResponse);
      console.log("Pulling from https://myfit-server.vercel.app/api/login");
      setLogging(true);

      const res = await fetch("https://myfit-server.vercel.app/api/login", {
         method: 'post',
         credentials: "include",
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ raw: credentialResponse.credential }),
      });

      if (res.status === 201) {
         const data = await res.json();
         const email = data.status.email;
         const name = data.status.given_name;
         setName(name);
         setEmail(email);

         setCookie('email', email)

         console.log("Navigating with:", { credentialResponse, email, name });

         // Add exit animation before navigation
         setAnimateIn(false);
         setTimeout(() => {
            navigate(data.message, { state: { credential: credentialResponse, email, name } });
         }, 500);
      }
   };

   return (
      (logging) ? <p>Trying to log you in</p> :
      <div className="h-screen w-screen flex items-center justify-center bg-[#FEF9E1] relative overflow-hidden">
         <Helmet>
            <title>YouFit - Login</title>
            <meta name="description" content="Login to MyFit - Track your calories and reach your fitness goals" />
            <meta name="keywords" content="fitness, diet, calorie tracking, weight management" />
            <meta property="og:title" content="MyFit - Your Personal Diet & Calorie Tracker" />
            <meta property="og:description" content="Track your calories, plan your diet, and reach your weight goals with MyFit" />
         </Helmet>

         {/* Animated Background elements with pulsating effect */}
         <div 
            className={`absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#E5D0AC] opacity-50 -mb-32 -ml-32 transition-all duration-1000 ease-in-out ${animateIn ? 'scale-125' : 'scale-75'}`}
            style={{ animation: animateIn ? 'pulse 6s ease-in-out infinite alternate' : 'none' }}
         ></div>
         <div 
            className={`absolute top-0 right-0 w-96 h-96 bg-[#A31D1D] opacity-30 -mt-20 -mr-20 transition-all duration-1000 delay-300 ease-in-out ${animateIn ? 'scale-110' : 'scale-90'}`}
            style={{ animation: animateIn ? 'float 8s ease-in-out infinite alternate' : 'none' }}
         ></div>

         {/* Main card with entrance animation */}
         <div 
            className={`w-full max-w-4xl flex overflow-hidden rounded-lg shadow-xl z-10 transition-all duration-700 ease-out ${
               animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
            }`}
         >
            {/* Left Panel */}
            <div className="w-5/12 bg-[#A31D1D] text-white flex flex-col justify-center p-12 relative">
               <div 
                  className={`absolute top-8 left-8 flex items-center transition-all duration-500 delay-300 ${
                     animateIn ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'
                  }`}
               >
                  <div className="w-8 h-8 bg-white rounded-md flex items-center justify-center mr-2">
                     <span className="text-[#A31D1D] font-bold">Y</span>
                  </div>
                  <span className="text-white font-medium">YouFit</span>
               </div>

               <h2 className={`text-3xl font-bold mb-4 transition-all duration-500 delay-500 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Welcome to YouFit!
               </h2>

               <p className={`mb-8 transition-all duration-500 delay-700 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Track your calories, plan your diet, and reach your weight goals with our easy-to-use platform
               </p>
            </div>

            {/* Right Panel */}
            <div className="w-7/12 bg-white p-12 flex flex-col justify-center items-center">
               <h2 className={`text-2xl font-bold text-[#6D2323] text-center mb-6 transition-all duration-500 delay-600 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Sign in to YouFit
               </h2>

               <p className={`text-gray-600 text-center mb-8 transition-all duration-500 delay-800 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  Use your Google account to sign in
               </p>

               <div className={`mb-8 transition-all duration-500 delay-1000 ${animateIn ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                  <GoogleOAuthProvider clientId="788860631464-5frp9jdepqedqc0fhoprp8n3skl01i05.apps.googleusercontent.com">
                     <GoogleLogin
                        onSuccess={handleSuccess}
                        onError={() => console.log('Login Failed')}
                        size="large"
                        text="signin_with"
                        shape="rectangular"
                        theme="filled_blue"
                     />
                  </GoogleOAuthProvider>
               </div>

               <div className={`text-center text-gray-500 text-sm transition-all duration-500 delay-1200 ${animateIn ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                  <p>By signing in, you agree to our <a href="#" className="text-[#A31D1D]">Terms of Service</a> and <a href="#" className="text-[#A31D1D]">Privacy Policy</a></p>
               </div>
            </div>
         </div>

         {/* Global keyframes for animations */}
         <style jsx global>{`
            @keyframes pulse {
               0% { transform: scale(1); }
               50% { transform: scale(1.1); }
               100% { transform: scale(1); }
            }

            @keyframes float {
               0% { transform: translateY(0) rotate(0deg); }
               50% { transform: translateY(-15px) rotate(5deg); }
               100% { transform: translateY(0) rotate(0deg); }
            }

            @keyframes spin {
               from { transform: rotate(0deg); }
               to { transform: rotate(360deg); }
            }
         `}</style>
      </div>
   );
}

export default Login;
