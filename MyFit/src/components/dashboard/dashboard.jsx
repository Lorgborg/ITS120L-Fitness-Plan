import React, { useEffect, useState } from "react";
import Chat from './chat.jsx';
import Popup from "./popup.jsx";
import { useLocation } from "react-router-dom";

function Home() {
   const location = useLocation();
   const email = location.state?.email || '';
   const [user, setUser] = useState(null);
   const [popup, setPopup] = useState(false);
   const [mealInfo, setMealInfo] = useState({});
   const [meal, setMeal] = useState(null);

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
   // eslint-disable-next-line react-hooks/exhaustive-deps
   }, []);

   const handleChange = (e) => {
      setMeal(e.target.value);
      console.log(meal);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("fetching meal")
      const res = await fetch("http://localhost:8080/api/addMeal", {
         method: 'post',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            email: email,
            prompt: meal
         }),
      });

      console.log("meal fetched")

      if(res.status == 201) {
         setPopup(true);
         const data = await res.json()
         setMealInfo({name: meal, calories: data.content})
         console.log(meal)
      }
   }

   return (

      <><title>YouFit - Dashboard</title>
      {
         (user != null) ? 
         <>
            <h1>Hello there {user ? user.username : ''}</h1>
            <form onSubmit={handleSubmit}>
               <input name="prompt" type="text" placeholder="Input meal here" onChange={handleChange}/>
               <input type="submit" value="Submit" />
            </form>
            <p>Daily Calorie Intake: {user.dailyIntake} calories</p>
            <Popup trigger={popup} mealInfo={mealInfo} setTrigger={setPopup}>
               <h1>{mealInfo.name}</h1>
               <h1>{mealInfo.calories}</h1>
            </Popup>
            <Chat user={user}></Chat>
         </> :
         <p>Loading...</p>
         
      }
         
      </>
   );
}

export default Home;