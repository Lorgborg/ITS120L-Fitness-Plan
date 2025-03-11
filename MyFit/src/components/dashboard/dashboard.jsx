import React from "react";
import Chat from './chat.jsx'
import { useLocation } from "react-router-dom";

function Home() {
   const location = useLocation();
   const email = location.state?.email || '';
   const name = location.state?.name || '';

   console.log("signup email: " + email)
   console.log("signup name: " + name)

   return (
      <>
         <h1>Hello there {name}</h1>
         <button>add meal</button>
         <div>
         <Chat></Chat>

         </div>
      </>
   )
}

export default Home;
