import React from "react";
import Chat from './chat.jsx'
import { useLocation } from "react-router-dom";

function Home() {
   const location = useLocation();
   const email = location.state?.email || '';

   // eslint-disable-next-line no-unused-vars
   // const userDetails = fetch("http://localhost:8080/api/getUser", {
   //    method: 'GET',
   //    headers: {
   //      'Accept': 'application/json',
   //      'Content-Type': 'application/json',
   //    },
   //    body: JSON.stringify({ email: email }),
   // })

   console.log("signup email: " + email)

   return (
      <>
         <h1>Hello there {}</h1>
         <button>add meal</button>
         <div>
         <Chat></Chat>

         </div>
      </>
   )
}

export default Home;
