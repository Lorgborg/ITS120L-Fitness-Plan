/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Chat from './chat.jsx';
import Popup from "./popup.jsx";
import { useNavigate } from 'react-router-dom';
import { BarChart } from "@mui/x-charts";
import { motion } from "framer-motion";

// Background decorative elements component
const BackgroundShapes = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
    <motion.div 
      className="absolute top-20 right-20 w-32 h-32 rounded-full bg-[#00AFB9] opacity-10"
      animate={{ 
        y: [0, 20, 0],
        scale: [1, 1.1, 1],
      }}
      transition={{ 
        duration: 8, 
        repeat: Infinity,
        ease: "easeInOut" 
      }}
    />
    <motion.div 
      className="absolute bottom-40 left-20 w-48 h-48 rounded-full bg-[#F07167] opacity-10"
      animate={{ 
        y: [0, -30, 0],
        scale: [1, 0.9, 1],
      }}
      transition={{ 
        duration: 10, 
        repeat: Infinity,
        ease: "easeInOut",
        delay: 1
      }}
    />
    <motion.div 
      className="absolute top-60 left-60 w-24 h-24 rounded-full bg-[#FED9B7] opacity-10"
      animate={{ 
        x: [0, 20, 0],
        y: [0, 15, 0],
      }}
      transition={{ 
        duration: 12, 
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.5
      }}
    />
  </div>
);

// Loading animation component
const LoadingAnimation = () => (
  <div className="flex justify-center items-center h-screen">
    <motion.div
      className="flex space-x-2"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {[0, 1, 2].map((dot) => (
        <motion.div
          key={dot}
          className="w-4 h-4 rounded-full bg-[#0081A7]"
          animate={{
            y: ["0%", "-50%", "0%"],
            opacity: [0.6, 1, 0.6]
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: dot * 0.2,
            ease: "easeInOut"
          }}
        />
      ))}
      <motion.span 
        className="text-[#0081A7] ml-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        Loading...
      </motion.span>
    </motion.div>
  </div>
);

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
   const [animateIn, setAnimateIn] = useState(false);
   const [chartLoaded, setChartLoaded] = useState(false);
   const [loggedIn, setLoggedIn] = useState(false);

   // Animation variants for staggered animations
   const containerVariants = {
     hidden: { opacity: 0 },
     visible: {
       opacity: 1,
       transition: {
         staggerChildren: 0.1,
         delayChildren: 0.2
       }
     }
   };
   
   const itemVariants = {
     hidden: { y: 20, opacity: 0 },
     visible: {
       y: 0,
       opacity: 1,
       transition: { type: "spring", stiffness: 100 }
     }
   };

   useEffect(() => {
      setAnimateIn(true); // Trigger animations on page load
      
      // Simulate chart loading with slight delay
      const chartTimer = setTimeout(() => {
        setChartLoaded(true);
      }, 800);
      
      return () => clearTimeout(chartTimer);
   }, []);

   useEffect(() => {
      fetch('https://myfit-server.vercel.app/api/profile', {
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

      fetch("https://myfit-server.vercel.app/api/getUser", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
         },
         body: JSON.stringify({ email: mail }),
      })
      .then(response => response.json())
      .then(data => {
         if(data.status  != 201 ){
            setLoggedIn(false);
            setLoading(false);
         } else {
            setLoggedIn(true);
            setUser(data);
         }
         
      })
      .catch(error => console.error('Error fetching user details:', error));

      fetch("https://myfit-server.vercel.app/api/getWeekMeals", {
         method: 'POST',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({ email: mail }),
      })
      .then(response => response.json())
      .then(data => {
         setWeekMeals(data);
      });

      fetch("https://myfit-server.vercel.app/api/getMeals", {
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
         console.log(totalCalories);
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
      const res = await fetch("https://myfit-server.vercel.app/api/addMeal", {
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
      console.log(calorie);
      e.preventDefault();
      const res = await fetch("https://myfit-server.vercel.app/api/saveMeal", {
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
         fetch("https://myfit-server.vercel.app/api/getMeals", {
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
      const res = await fetch("https://myfit-server.vercel.app/api/logout", {
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
      <div className="min-h-screen w-full flex bg-[#FDFCDC] p-5 relative overflow-hidden">
         <title>YouFit - Dashboard</title>
         <BackgroundShapes />
         
         {loading ? (
            <LoadingAnimation />
         ) : user ? (
            <motion.div 
              className="max-w-6xl mx-auto bg-[#FDFCDC] rounded-lg overflow-hidden shadow-xl z-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
               {/* Header */}
               <motion.div 
                 className="flex justify-between items-center px-8 py-4"
                 initial={{ opacity: 0 }}
                 animate={{ opacity: 1 }}
                 transition={{ delay: 0.2 }}
               >
                  <motion.div 
                    className="flex items-center"
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  >
                     <motion.div 
                       className="text-[#F07167] text-3xl mr-3"
                       animate={{ 
                         scale: [1, 1.2, 1],
                       }}
                       transition={{ 
                         duration: 2,
                         repeat: Infinity,
                         repeatType: "reverse" 
                       }}
                     >
                       ❤
                     </motion.div>
                     <h2 className="text-xl font-semibold text-gray-700">Hello, {user.username}!</h2>
                  </motion.div>
                  <div className="flex items-center">
                     <motion.button 
                        onClick={handleLogout} 
                        className="bg-[#00AFB9] hover:bg-[#0081A7] text-white px-4 py-2 rounded-md mr-4 text-sm transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                     >
                        Logout
                     </motion.button>
                     <motion.div 
                       className="w-12 h-12 bg-[#00AFB9] rounded-full"
                       whileHover={{ scale: 1.1, rotate: 10 }}
                       whileTap={{ scale: 0.9 }}
                     />
                  </div>
               </motion.div>
               
               {/* Main content */}
               <div className="flex flex-col md:flex-row">
                  {/* Main content area */}
                  <motion.div 
                    className="flex-grow p-5"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                  >
                     <Chat user={user} calorieToday={calorieToday} />
                  </motion.div>
                  
                  {/* Right sidebar */}
                  <motion.div 
                    className="w-full min-h-screen md:w-80 bg-[#FDFCDC] p-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                     {/* Meal input panel */}
                     <motion.div 
                       className="mb-6 bg-[#FED9B7] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                       variants={itemVariants}
                     >
                        <div className="flex justify-between items-center mb-1">
                           <h3 className="font-semibold text-gray-800">Save your Meals</h3>
                           <motion.span 
                             className="text-gray-500"
                             animate={{ rotate: [0, 45, 0] }}
                             transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                           >
                             ⚙️
                           </motion.span>
                        </div>
                        <p className="text-xs text-gray-400 mb-3">Save your meals and update your daily calorie count</p>
                        <form onSubmit={handleSubmit} className="flex text-gray-400 bg-white">
                           <input 
                              name="prompt" 
                              type="text" 
                              placeholder="Enter your meal..." 
                              onChange={handleChange}
                              className="flex-grow border rounded-l-md p-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#00AFB9]"
                           />
                           <motion.button 
                              type="submit" 
                              className="bg-[#F07167] hover:bg-[#0081A7] text-white px-3 rounded-r-md transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                           >
                              ▶
                           </motion.button>
                        </form>
                     </motion.div>
                     
                     {/* Calorie goal panel */}
                     <motion.div 
                       className="mb-6 bg-[#FED9B7] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                       variants={itemVariants}
                     >
                        <h3 className="font-semibold text-gray-700 mb-3">Daily Calorie Goal</h3>
                        <div className="mb-2 text-center">
                           <span className="font-medium text-[#00AFB9]">{calorieToday}/{user.dailyIntake}</span>
                        </div>
                        <div className="bg-[#FDFCDC] rounded-full h-6 overflow-hidden">
                           <motion.div 
                              className="bg-[#00AFB9] h-full rounded-full"
                              initial={{ width: "0%" }}
                              animate={{ 
                                width: `${Math.min(100, (calorieToday / user.dailyIntake) * 100)}%` 
                              }}
                              transition={{ 
                                duration: 1,
                                type: "spring",
                                stiffness: 50
                              }}
                           />
                        </div>
                     </motion.div>
                     
                     {/* Calorie chart panel */}
                     <motion.div 
                       className="bg-[#FED9B7] rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-300"
                       variants={itemVariants}
                     >
                        <div className="flex justify-between items-center mb-3">
                           <h3 className="font-semibold text-gray-700">Daily Calorie Intake</h3>
                           <motion.span 
                             className="text-gray-500"
                             animate={{ rotate: 360 }}
                             transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                           >
                             🕒
                           </motion.span>
                        </div>   
                        <motion.div 
                          className="bg-[#FDFCDC] rounded-lg p-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: chartLoaded ? 1 : 0 }}
                          transition={{ duration: 0.5 }}
                        >
                           {chartLoaded && (
                             <BarChart
                                xAxis={[{
                                   id: 'barCategories',
                                   data: Object.keys(weekMeals).map(date => {
                                      let day = new Date(date).toLocaleDateString("en-US", { weekday: "narrow" });
                                      if(new Date(date).toLocaleDateString("en-US", {weekday: "short"}) == "Sun") {
                                        day = "Su"
                                        console.log('change to su')
                                      }
                                      return day;
                                   }),
                                   scaleType: 'band',
                                }]}
                                series={[{
                                   data: Object.values(weekMeals),
                                   color: '#00AFB9'
                                }]}
                                width={250}
                                height={200}
                                // MUI Chart animation duration in ms
                                animationDuration={1500}
                             />
                           )}
                        </motion.div>
                     </motion.div>
                  </motion.div>
               </div>
               
               {/* Popup for meal information */}
               <Popup trigger={popup} mealInfo={mealInfo} setTrigger={setPopup}>
                 <motion.div 
                   className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black/30"
                   initial={{ opacity: 0 }}
                   animate={{ opacity: 1 }}
                   exit={{ opacity: 0 }}
                 >
                    <motion.div 
                      className="bg-[#FED9B7] p-6 rounded-xl shadow-lg w-96"
                      initial={{ scale: 0.9, y: 20 }} 
                      animate={{ scale: 1, y: 0 }}
                      exit={{ scale: 0.9, y: 20 }}
                      transition={{ type: "spring", stiffness: 300, damping: 15 }}
                    >
                       {/* Header */}
                       <div className="flex items-center bg-[#00AFB9] text-white px-4 py-2 rounded-md mb-4">
                          <motion.span 
                            className="mr-2"
                            animate={{ rotate: [0, 15, -15, 0] }}
                            transition={{ duration: 2, repeat: Infinity, repeatType: "loop" }}
                          >
                            ✏️
                          </motion.span>
                          <h2 className="text-lg font-semibold">Meal Editor</h2>
                       </div>   

                       {/* Meal Name */}
                       <label className="block text-sm font-medium text-gray-700">Name of your Meal</label>
                       <input 
                          type="text" 
                          value={mealInfo.name} 
                          disabled 
                          className="w-full p-2 border rounded-md bg-white text-gray-700 mt-1 mb-3 focus:outline-[#00AFB9]"
                       />

                       {/* Calories Input */}
                       <label className="block text-sm font-medium text-gray-700">Calories Contained</label>
                       <input 
                          type="number" 
                          name="calories" 
                          placeholder="edit your food's calories..." 
                          defaultValue={mealInfo.calories}
                          onChange={handleCalories} 
                          className="w-full p-2 border rounded-md bg-white text-gray-700 mt-1 mb-3 focus:outline-none focus:ring-2 focus:ring-[#00AFB9]"
                       />

                       {/* Buttons */}
                       <div className="flex justify-end gap-2">
                          <motion.button 
                             onClick={() => setPopup(false)} 
                             className="bg-[#F07167] hover:bg-red-600 text-white px-4 py-2 rounded-md transition-colors"
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                          >
                             Discard
                          </motion.button>
                          <motion.button 
                             onClick={submitFood} 
                             className="bg-[#00AFB9] hover:bg-[#0081A7] text-white px-4 py-2 rounded-md transition-colors"
                             whileHover={{ scale: 1.05 }}
                             whileTap={{ scale: 0.95 }}
                          >
                             Submit
                          </motion.button>
                       </div>
                    </motion.div>
                 </motion.div>
              </Popup>
            </motion.div>
         ) : (
            <motion.div 
              className="flex justify-center items-center h-screen w-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            >
               <p className="text-[#0081A7]">
                 You are not Signed in 
                 <motion.a 
                   href="../login" 
                   className="text-[#00AFB9] underline hover:text-[#0081A7] ml-1"
                   whileHover={{ scale: 1.05 }}
                 >
                   sign in here
                 </motion.a>
               </p>
            </motion.div>
         )}
      </div>
   );
}

export default Home;