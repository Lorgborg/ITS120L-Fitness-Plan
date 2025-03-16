import React, { useEffect, useReducer, useState } from "react";
import Chat from './chat.jsx';
import Popup from "./popup.jsx";
import { useLocation } from "react-router-dom";

function Home() {
   const location = useLocation();
   const email = location.state?.email || '';
   const [user, setUser] = useState(null);
   const [popup, setPopup] = useState(false);

   useEffect(() => {
      console.log("User state updated:", user);
   }, [user]);

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
   }, []);

   // const handleChange = (e) => {
   //    setFormData({
   //       ...formData,
   //       [e.target.name]: e.target.value
   //    });
   // };

   const handleSubmit = async () => {
      const res = await fetch("http://localhost:8080/api/signup", {
         method: 'post',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            prompt: prompt
         }),
      });

      if(res.status == 201) {
         setPopup(true);
      }
   }

   return (

      <><title>YouFit - Dashboard</title>
      {
         (user != null) ? 
         <>
            <h1>Hello there {user ? user.username : ''}</h1>
            <form method="post" onSubmit="http://localhost:8080/api/">
               <input name="prompt" type="text" placeholder="Input meal here" />
               <input type="submit" value="Submit" />
            </form>
            <p>Daily Calorie Intake: {user.dailyIntake}</p>
            <Popup trigger={popup}>
               <h1>test</h1>
            </Popup>
            <Chat user={user}></Chat>
         </> :
         <p>not signed in</p>
         
      }
         
      </>
   );
}

export default Home;