import React, { useState, useEffect } from "react";

function Home() {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Set isLoaded to true after component mounts to trigger animations
    setIsLoaded(true);
  }, []);

  return (
    
    <div className="min-h-full w-full bg-[#FEF9E1]">
       <title>YouFit - Home</title>

      {/* Header */}
      <header className="w-full bg-[#A31D1D] text-white p-4 text-center text-lg font-semibold transition-all duration-500 ease-in-out hover:bg-[#8A1818]">
        Homepage
      </header>
      
      {/* About Us Section */}
      <section className={`w-full py-12 flex flex-col items-center transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
        <div className="flex space-x-12">
        <div className="flex space-x-12">
  <img 
    src="/public/lorgborg profile.jpg" 
    alt="Lorgborg" 
    className="w-28 h-28 rounded-full object-cover shadow-lg transition-all duration-500 ease-in-out hover:scale-110"
  />
  <img 
    src="/public/catto profile.jpg" 
    alt="Chewii29" 
    className="w-28 h-28 rounded-full object-cover shadow-lg transition-all duration-500 ease-in-out hover:scale-110"
  />
</div>
        </div>
        <h2 className={`text-3xl font-semibold mt-6 text-[#6D2323] text-center transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          About Us
        </h2>
        <div className="w-full max-w-5xl px-6 mx-auto">
          <p className={`mt-4 text-gray-700 text-center text-lg transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            Staying fit and healthy is important, but with so much information out there, it can be overwhelming to know what's actually helpful. Unfortunately, some sources can be misleading, and many fitness products take advantage of people's insecurities. That's where this app comes in! Our goal is to make reliable dietary and fitness information easy to understand and accessible, so you can focus on reaching your health goals without the stress. We know that sticking to a fitness journey can be tough—both financially and mentally—but with the right guidance, it doesn't have to be so complicated!
          </p>
        </div>
        
        <a 
          href="./login" 
          className={`mt-6 px-8 py-3 bg-[#A31D1D] text-white rounded-lg font-medium text-lg shadow-md transition-all duration-300 hover:bg-[#8A1818] hover:shadow-lg active:transform active:scale-95 delay-400 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
        >
          Login or Sign Up
        </a>
        <p className={`mt-4 text-gray-800 transition-all duration-300 delay-500 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
          Join Us in Your Fitness Journey!
        </p>
      </section>
      
      {/* Section 1 */}
      <div className="w-full bg-[#6D2323] text-white text-center py-6 transition-all duration-500 ease-in-out hover:bg-[#5A1E1E]">
        <span> <h3 className="text-2xl font-semibold text-center mb-8 animate-pulse">Our Goals</h3></span>
      </div>
      
{/* Our Goals Section */}
<section className="w-full bg-[#A31D1D] text-white py-16">
  <div className="flex flex-wrap justify-center gap-8 w-full px-8 max-w-6xl mx-auto">
    {[
      {
        title: "Reliable & Simple Nutrition Tracking",
        description: "Our app helps you track your daily caloric intake with clear, accurate recommendations. Just enter your weight, height, age, and target weight, and we’ll generate a personalized daily goal to keep you on track.",
        image: "https://cdn-icons-png.flaticon.com/128/2920/2920320.png",
      },
      {
        title: "Personalized Goal Setting",
        description: "Easily adjust your weight goals and update your details anytime. Your daily calorie target will automatically adapt, and a visual progress tracker helps you stay motivated.",
        image: "https://cdn-icons-png.flaticon.com/128/3039/3039365.png",
      },
      {
        title: "Easy Meal Logging",
        description: "Manually input meals or use our chatbot for quick calorie estimates. Save frequent meals for faster logging and keep your diet tracking hassle-free.",
        image: "https://cdn-icons-png.flaticon.com/128/3514/3514491.png",
      },
      {
        title: "User-Friendly & Efficient",
        description: "Built with the MERN stack, our app offers a smooth and interactive experience. Sign up, log in, and manage your data effortlessly while staying focused on your fitness journey.",
        image: "https://cdn-icons-png.flaticon.com/128/1170/1170678.png",
      },
    ].map((goal, index) => (
      <div 
        key={index}
        className="w-[45%] min-w-[300px] h-80 bg-[#E5D0AC] rounded-lg flex flex-col items-center justify-center text-center px-6 py-4 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-xl"
      >
        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center mb-4">
          <img src={goal.image} alt={goal.title} className="w-12 h-12 object-contain" />
        </div>
        <h3 className="text-xl font-semibold text-[#6D2323] mb-2">{goal.title}</h3>
        <p className="text-sm text-gray-800">{goal.description}</p>
      </div>
    ))}
  </div>
</section>



      
      {/* Footer */}
      <footer className="w-full bg-[#6D2323] text-white text-center py-8 transition-all duration-500 ease-in-out hover:bg-[#5A1E1E]">
        {/* Footer content */}
      </footer>
    </div>
  );
}

export default Home;
