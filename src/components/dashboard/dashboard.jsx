import React, { useEffect, useState } from "react";
import Chat from './chat.jsx';
import Popup from "./popup.jsx";
import { useNavigate } from 'react-router-dom';

function Home() {
   const navigate = useNavigate();
   const [mail, setMail] = useState(null);
   const [user, setUser] = useState(null);
   const [popup, setPopup] = useState(false);
   const [mealInfo, setMealInfo] = useState({});
   const [meal, setMeal] = useState("");
   const [calorie, setCalorie] = useState(0);
   const [calorieToday, setCalorieToday] = useState(0);

   // ✅ Step 1: Fetch profile data and set mail
   useEffect(() => {
      fetch('http://localhost:8080/api/profile', {
         method: 'POST',
         credentials: 'include' // Include session cookies
      })
      .then(response => response.json())
      .then(data => {
         if (data.message === 'Profile data') {
            console.log("User session:", data);
            setMail(data.user.email);
         }
      })
      .catch(error => console.error('Error fetching profile:', error));
   }, []);

   // ✅ Step 2: Fetch user details and meals *after* mail is set
   useEffect(() => {
      if (!mail) return;

      console.log("Fetching data for:", mail);

      // Fetch user details
      fetch("http://localhost:8080/api/getUser", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email: mail }),
      })
      .then(response => response.json())
      .then(data => {
         setUser(data);
         console.log("User data:", data);
      })
      .catch(error => console.error('Error fetching user details:', error));

      // Fetch meals for today
      fetch("http://localhost:8080/api/getMeals", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email: mail, date: new Date().toISOString().split("T")[0] }),
      })
      .then(response => response.json())
      .then(data => {
         const totalCalories = data.reduce((sum, meal) => sum + parseInt(meal.calories, 10), 0);
         setCalorieToday(totalCalories);
         console.log("Today's total calories:", totalCalories);
      })
      .catch(error => console.error('Error fetching meals:', error));
   }, [mail]);

   // Handle meal input change
   const handleChange = (e) => {
      setMeal(e.target.value);
   };

   // ✅ Step 3: Fetch meal details
   const handleSubmit = async (e) => {
      e.preventDefault();
      console.log("Fetching meal info...");

      const res = await fetch("http://localhost:8080/api/addMeal", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ prompt: meal }),
      });

      if (res.status === 201) {
         setPopup(true);
         const data = await res.json();
         setMealInfo({ name: meal, calories: data.content });
         console.log("Meal info:", mealInfo);
      }
   };

   // Handle manual calorie input
   const handleCalories = (e) => {
      setCalorie(e.target.value);
   };

   // ✅ Step 4: Save meal to database
   const submitFood = async (e) => {
      e.preventDefault();
      console.log("Saving meal...");

      const res = await fetch("http://localhost:8080/api/saveMeal", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            email: user?.mail, // Ensure mail is set
            meal: meal,
            calories: calorie
         }),
      });

      if (res.status === 201) {
         setPopup(false);

         // Fetch updated daily calorie count
         fetch("http://localhost:8080/api/getMeals", {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: mail, date: new Date().toISOString().split("T")[0] }),
         })
         .then(response => response.json())
         .then(data => {
            const totalCalories = data.reduce((sum, meal) => sum + parseInt(meal.calories, 10), 0);
            setCalorieToday(totalCalories);
            console.log("Updated calorie count:", totalCalories);
         })
         .catch(error => console.error('Error fetching updated calorie count:', error));
      }
   };

   // ✅ Step 5: Logout user
   const handleLogout = async (e) => {
      e.preventDefault();
      const res = await fetch("http://localhost:8080/api/logout", {
         method: "POST",
         credentials: "include",
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
      });

      setUser(null);
      localStorage.removeItem("user");

      if (res.status === 201) {
         console.log("Logged out successfully");
         navigate('/home')
      }
   };

   return (
      <>
         <title>YouFit - Dashboard</title>
         {
            user ? 
            <>
               <h1>Hello there, {user.username}!</h1>
               <form onSubmit={handleSubmit}>
                  <input name="prompt" type="text" placeholder="Input meal here" onChange={handleChange} />
                  <input type="submit" value="Submit" />
               </form>
               <p>Daily Calorie Intake: {calorieToday}/{user.dailyIntake} calories</p>
               <progress value={calorieToday} max={user.dailyIntake}></progress>

               <Popup trigger={popup} mealInfo={mealInfo} setTrigger={setPopup}>
                  <form onSubmit={submitFood}>
                     <input type="hidden" name="meal" value={mealInfo.name} />
                     <label htmlFor="calories">{mealInfo.name}</label>
                     <input type="number" name="calories" defaultValue={mealInfo.calories} onChange={handleCalories} />
                     <input type="submit" value="Add meal" />
                  </form>
               </Popup>

               <Chat user={user} calorieToday={calorieToday} />
               <button onClick={handleLogout} className="logout">Logout</button>
            </>
            : <p>You are not Signed in <a href="../login">sign in here</a></p>
         }
      </>
   );
}

export default Home;