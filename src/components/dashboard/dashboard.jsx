import React, { useEffect, useState } from "react";
import Chat from './chat.jsx';
import Popup from "./popup.jsx";
import { useNavigate } from 'react-router-dom';
import { BarChart } from "@mui/x-charts";

const getPHTDate = () => {
   const now = new Date();
   return new Date(now.getTime() + 8 * 3600000);
};

function Home() {
   const navigate = useNavigate();
   const [mail, setMail] = useState(null);
   const [user, setUser] = useState(null);
   const [popup, setPopup] = useState(false);
   const [mealInfo, setMealInfo] = useState({});
   const [meal, setMeal] = useState("");
   const [calorie, setCalorie] = useState(0);
   const [calorieToday, setCalorieToday] = useState(0);
   const [loading, setLoading] = useState(true);
   const [weekMeals, setWeekMeals] = useState({});

   useEffect(() => {
      fetch('http://localhost:8080/api/profile', {
         method: 'POST',
         credentials: 'include'
      })
      .then(response => response.json())
      .then(data => {
         if (data.message === 'Profile data') {
            setMail(data.user.email);
         }
      })
      .catch(error => console.error('Error fetching profile:', error));
   }, []);

   useEffect(() => {
      if (!mail) return;
      setLoading(true);

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
      })
      .catch(error => console.error('Error fetching user details:', error));

      fetch("http://localhost:8080/api/getWeekMeals", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ email: mail }),
      })
      .then(response => response.json())
      .then(data => {
         setWeekMeals(data)
      })

      fetch("http://localhost:8080/api/getMeals", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email: mail, date: getPHTDate().toISOString().split("T")[0] }),
      })
      .then(response => response.json())
      .then(data => {
         const totalCalories = data.reduce((sum, meal) => sum + parseInt(meal.calories, 10), 0);
         console.log(totalCalories)
         setCalorieToday(totalCalories);
         setLoading(false);
      })
      .catch(error => {
         console.error('Error fetching meals:', error);
         setLoading(false);
      });
   }, [mail]);

   const handleChange = (e) => {
      setMeal(e.target.value);
   };

   const handleSubmit = async (e) => {
      e.preventDefault();
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
      }
   };

   const handleCalories = (e) => {
      setCalorie(e.target.value);
   };

   const submitFood = async (e) => {
      console.log(calorie)
      e.preventDefault();
      const res = await fetch("http://localhost:8080/api/saveMeal", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            email: user?.email,
            meal: meal,
            calories: (calorie == 0) ? mealInfo.calories : calorie
         }),
      });

      if (res.status === 201) {
         setPopup(false);
         fetch("http://localhost:8080/api/getMeals", {
            method: 'POST',
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: mail, date: getPHTDate().toISOString().split("T")[0] }),
         })
         .then(response => response.json())
         .then(data => {
            const totalCalories = data.reduce((sum, meal) => sum + parseInt(meal.calories, 10), 0);
            setCalorieToday(totalCalories);
         })
         .catch(error => console.error('Error fetching updated calorie count:', error));
      }
   };

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
         navigate('/home');
      }
   };

   return (
      <>
         <title>YouFit - Dashboard</title>
         {
            loading ? 
            <div className="loading-spinner">Loading...</div> :
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
               <BarChart
                  xAxis={[
                     {
                        id: 'barCategories',
                        data: Object.keys(weekMeals).map(date => {
                           const day = new Date(date).toLocaleDateString("en-US", { weekday: "long" });
                           return day;
                       }),
                        scaleType: 'band',
                     },
                  ]}
                  series={[
                     {
                        data: Object.values(weekMeals),
                     },
                  ]}
                  width={500}
                  height={300}
               />
               <button onClick={handleLogout} className="logout">Logout</button>
            </> : 
            <p>You are not Signed in <a href="../login">sign in here</a></p>
         }
      </>
   );
}

export default Home;