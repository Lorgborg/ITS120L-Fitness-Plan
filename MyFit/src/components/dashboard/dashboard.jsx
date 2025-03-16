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
   const [calorie, setCalorie] = useState(0);
   const [calorieToday, setCalorieToday] = useState(0);

   useEffect(() => {
      console.log("User state updated:", user);
   }, [user]);

   useEffect(() => {
      console.log("changing calorie")
      if (mealInfo.calories !== undefined) {
         console.log("changing calorie");
         setCalorie(mealInfo.calories); 
      }
   }, [mealInfo.calories]);

   useEffect(() => {
      fetch("https://myfit-server.vercel.app/api/getUser", {
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

      fetch("https://myfit-server.vercel.app/api/getMeals", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email: email, date: new Date().toISOString().split("T")[0] }),
      })
      .then(response => response.json())
      .then(data => {
         const totalCalories = data.reduce((sum, meal) => sum + parseInt(meal.calories, 10), 0);
         setCalorieToday(totalCalories)
         console.log(totalCalories)
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
      const res = await fetch("https://myfit-server.vercel.app/api/addMeal", {
         method: 'post',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
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

   const handleCalories = (e) => {
      setCalorie(e.target.value);
      console.log("setting calorie to: " + calorie)
   }

   const submitFood = async (e) => {
      e.preventDefault();
      console.log("fetching meal");
  
      const res = await fetch("https://myfit-server.vercel.app/api/saveMeal", {
          method: 'post',
          headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
          },
          body: JSON.stringify({
              email: user.email,
              meal: meal,
              calories: calorie
          }),
      });
  
      if (res.status === 201) {
          setPopup(false);
  
          // Fetch updated daily calorie count
          fetch("https://myfit-server.vercel.app/api/getMeals", {
              method: 'POST',
              headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ email: user.email, date: new Date().toISOString().split("T")[0] }),
          })
          .then(response => response.json())
          .then(data => {
              const totalCalories = data.reduce((sum, meal) => sum + parseInt(meal.calories, 10), 0);
              setCalorieToday(totalCalories); // Update calorieToday
              console.log("Updated calorieToday:", totalCalories);
          })
          .catch(error => console.error('Error fetching updated calorie count:', error));
      }
  };  

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
            <p>Daily Calorie Intake: {calorieToday}/{user.dailyIntake} calories</p>
            <progress value={calorieToday} max={user.dailyIntake}>600</progress>
            <Popup trigger={popup} mealInfo={mealInfo} setTrigger={setPopup}>
               <form onSubmit={submitFood}>
                  <input type="hidden" name="meal" id="" value={mealInfo.name}/>
                  <label htmlFor="calories">{mealInfo.name}</label>
                  <input type="number" name="calories" defaultValue={mealInfo.calories} onChange={handleCalories} />
                  <input type="submit" value="Add meal" />
               </form>
            </Popup>
            <Chat user={user} calorieToday={calorieToday}></Chat>
         </> :
         <p>Loading...</p>
         
      }
         
      </>
   );
}

export default Home;