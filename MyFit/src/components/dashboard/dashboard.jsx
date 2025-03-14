import React, { useEffect, useState } from "react";
import Chat from './chat.jsx';
import Popup from "./popup.jsx";
import { useLocation } from "react-router-dom";

function Home() {
   const location = useLocation();
   const email = location.state?.email || '';
   const [user, setUser] = useState(null);
   const [popup, setPopup] = useState(false);

   useEffect(() => {
      fetch("http://localhost:8080/api/getUser", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email: email }),
      })
      .then(response => response.json())
      .then(data => {
         setUser(data)
         console.log(data)
      })
      .catch(error => console.error('Error fetching user details:', error));
   }, [email]);

   useEffect(() => {
      
   })

   return (
      <>
         <h1>Hello there {user ? user.username : ''}</h1>
         <form method="post" action="http://localhost:8080/api/addMeal">
            <input name="prompt" type="text" placeholder="Input meal here" />
            <input type="submit" value="Submit" />
         </form>
         <Popup trigger={popup}>
            <h1>test</h1>
         </Popup>
         <div>
            <Chat></Chat>
         </div>
      </>
   );
}

export default Home;