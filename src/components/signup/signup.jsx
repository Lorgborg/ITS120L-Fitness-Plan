import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";

function calculateDailyCalories(weight, height, age, gender, idealWeight, goalDate) {
   // Convert dates and get time difference in weeks
   const oneWeek = 1000 * 60 * 60 * 24 * 7;
   const startDate = new Date();
   const endDate = new Date(goalDate);
   const timeInWeeks = Math.round((endDate - startDate) / oneWeek);

   if (timeInWeeks <= 0) {
       return "Goal date must be in the future!";
   }

   // Calculate BMR (Basal Metabolic Rate) using Mifflin-St Jeor Equation
   let BMR;
   if (gender === "male") {
       BMR = 10 * weight + 6.25 * height - 5 * age + 5;
   } else {
       BMR = 10 * weight + 6.25 * height - 5 * age - 161;
   }

   // Calculate TDEE (Total Daily Energy Expenditure)
   let TDEE = BMR * 1.6; // Default to sedentary if invalid input

   // Calculate total calories needed to gain/lose the weight
   const weightChange = idealWeight - weight;
   const totalCaloriesNeeded = weightChange * 7700; // 1 kg = 7700 kcal

   // Daily calorie surplus/deficit
   const dailyCalorieChange = totalCaloriesNeeded / (timeInWeeks * 7); // Spread over time

   // Final daily intake to reach goal
   const dailyCalorieIntake = TDEE + dailyCalorieChange;

   return {
       weeksUntilGoal: timeInWeeks,
       BMR: Math.round(BMR),
       TDEE: Math.round(TDEE),
       dailyCalorieIntake: Math.round(dailyCalorieIntake)
   };
}

function Signup() {
   const location = useLocation();
   const navigate = useNavigate();

   const credentialResponse = location.state?.credential || '';
   const [formData, setFormData] = useState({
      username: '',
      weight: '',
      height: '',
      sex: 'Male',
      idealWeight: '',
      nationality: '',
      age: '',
      time: '',
   });
   const [showPopup, setShowPopup] = useState(false);
   const [dailyCalorie, setDailyCalorie] = useState(0);

   useEffect(() => {
      const allFieldsFilled = Object.values(formData).every(value => value !== '');
      if (allFieldsFilled) {
         const result = calculateDailyCalories(formData.weight, formData.height, formData.age, formData.sex, formData.idealWeight, new Date(formData.time).toISOString().split("T")[0]);
         setDailyCalorie(result.dailyCalorieIntake);
         console.log(dailyCalorie)
         console.log("All fields are filled! Running code...");
         // Place your desired code here
      }

      if (allFieldsFilled) {
         setShowPopup(true);
         console.log("All fields are filled! Showing popup...");
     } else {
         setShowPopup(false);
     }
   }, [formData]);

   const handleChange = (e) => {
      console.log(e.target.value)
      setFormData({
         ...formData,
         [e.target.name]: e.target.value
      });

   };

   const handleSubmit = async (e) => {
      e.preventDefault();

      const email = location.state?.email || '';

      const res = await fetch("https://myfit-server.vercel.app/api/signup", {
         method: 'post',
         headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
         },
         body: JSON.stringify({
            email: email,
            username: formData.username,
            weight: formData.weight,
            height: formData.height,
            age: formData.age,
            sex: formData.sex,
            nationality: formData.nationality,
            idealWeight: formData.idealWeight,
            time: formData.time,
         }),
      });

      if(res.status === 200) {
         console.log("Account created successfully");
         console.log(credentialResponse)
         const res = await fetch("https://myfit-server.vercel.app/api/login", {
            method: 'post',
            credentials: "include",
            headers: {
               'Accept': 'application/json',
               'Content-Type': 'application/json'
            },
            body: JSON.stringify({ raw: credentialResponse.credential, email: email }),
         })
         if(res.status == 201){
            navigate('../dashboard')
         }
      }
   };

   return (
      <div className="min-h-screen w-screen flex flex-col items-center justify-center bg-[#FEF9E1] overflow-hidden">
         <Helmet>
            <title>MyFit - Create Account</title>
            <meta name="description" content="Sign up for YouFit - Your personal diet and calorie tracker" />
            <meta name="keywords" content="fitness, diet, calorie tracking, weight management, signup" />
            <meta property="og:title" content="Join YouFit - Start Your Health Journey" />
            <meta property="og:description" content="Create your account to track calories, plan your diet, and reach your weight goals" />
         </Helmet>

         <div className="w-full max-w-3xl flex overflow-hidden rounded-lg shadow-xl">
            {/* Left Panel */}
            <div className="hidden md:flex md:w-1/2 bg-[#A31D1D] text-white flex-col justify-center items-center p-10">
               <h1 className="text-4xl font-bold mb-4">YouFit</h1>
               <p className="text-xl text-center mb-6">Your journey to better health starts here.</p>
               <img src="Yummers.jpg" alt="Healthy Food" className="mb-6 " />
               <div className="space-y-4">
                  <div className="flex items-start">
                     <div className="mr-2 mt-1 text-2xl">✓</div>
                     <p>Track your daily calorie intake</p>
                  </div>
                  <div className="flex items-start">
                     <div className="mr-2 mt-1 text-2xl">✓</div>
                     <p>Get personal diet recommendations</p>
                  </div>
                  <div className="flex items-start">
                     <div className="mr-2 mt-1 text-2xl">✓</div>
                     <p>Achieve your weight goals</p>
                  </div>
               </div>
            </div>

            {/* Right Panel */}
            <div className="w-screen md:w-1/2 bg-white p-8 md:p-12">
               <div className="md:hidden text-center mb-8">
                  <h1 className="text-3xl font-bold text-[#A31D1D]">YouFit</h1>
                  <p className="text-[#6D2323]">Start your health journey today</p>
               </div>

               <h2 className="text-2xl font-bold text-[#6D2323] mb-2">Create Your Account</h2>
               <p className="text-gray-600 mb-6">Join YouFit and start tracking your nutrition</p>

               <form onSubmit={handleSubmit} className="mb-6">
                  <div className="mb-4">
                     <label htmlFor="username" className="block text-[#6D2323] font-medium mb-1">Username</label>
                     <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     />
                  </div>

                  <div className="mb-4">
                     <label htmlFor="weight" className="block text-[#6D2323] font-medium mb-1">Weight</label>
                     <input
                        type="text"
                        id="weight"
                        name="weight"
                        value={formData.weight}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     />
                  </div>

                  <div className="mb-4">
                     <label htmlFor="height" className="block text-[#6D2323] font-medium mb-1">Height</label>
                     <input
                        type="number"
                        id="height"
                        name="height"
                        value={formData.height}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     />
                  </div>

                  <div className="mb-4">
                     <label htmlFor="age" className="block text-[#6D2323] font-medium mb-1">Age</label>
                     <input
                        type="number"
                        id="age"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     />
                  </div>

                  <div className="mb-4">
                     <label htmlFor="sex" className="block text-[#6D2323] font-medium mb-1">Sex</label>
                     <select
                        type="select"
                        id="sex"
                        name="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                     </select>
                  </div>

                  <div className="mb-4">
                     <label htmlFor="idealWeight" className="block text-[#6D2323] font-medium mb-1">Ideal Weight</label>
                     <input
                        type="text"
                        id="idealWeight"
                        name="idealWeight"
                        value={formData.idealWeight}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     />
                  </div>

                  <div className="mb-4">
                     <label htmlFor="time" className="block text-[#6D2323] font-medium mb-1">Achieve By: </label>
                     <input
                        type="date"
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     />
                  </div>

                  <div className="mb-6">
                     <label htmlFor="nationality" className="block text-[#6D2323] font-medium mb-1">Nationality</label>
                     <select
                        id="nationality"
                        name="nationality"
                        value={formData.nationality}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border text-gray-500 border-[#E5D0AC] rounded focus:outline-none focus:border-[#A31D1D]"
                        required
                     >
                        <option value="">Select your nationality</option>
                        <option value="Afghanistan">Afghanistan</option>
                        <option value="Åland Islands">Åland Islands</option>
                        <option value="Albania">Albania</option>
                        <option value="Algeria">Algeria</option>
                        <option value="American Samoa">American Samoa</option>
                        <option value="Andorra">Andorra</option>
                        <option value="Angola">Angola</option>
                        <option value="Anguilla">Anguilla</option>
                        <option value="Antarctica">Antarctica</option>
                        <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Armenia">Armenia</option>
                        <option value="Aruba">Aruba</option>
                        <option value="Australia">Australia</option>
                        <option value="Austria">Austria</option>
                        <option value="Azerbaijan">Azerbaijan</option>
                        <option value="Bahamas">Bahamas</option>
                        <option value="Bahrain">Bahrain</option>
                        <option value="Bangladesh">Bangladesh</option>
                        <option value="Barbados">Barbados</option>
                        <option value="Belarus">Belarus</option>
                        <option value="Belgium">Belgium</option>
                        <option value="Belize">Belize</option>
                        <option value="Benin">Benin</option>
                        <option value="Bermuda">Bermuda</option>
                        <option value="Bhutan">Bhutan</option>
                        <option value="Bolivia">Bolivia</option>
                        <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                        <option value="Botswana">Botswana</option>
                        <option value="Bouvet Island">Bouvet Island</option>
                        <option value="Brazil">Brazil</option>
                        <option value="British Indian Ocean Territory">British Indian Ocean Territory</option>
                        <option value="Brunei Darussalam">Brunei Darussalam</option>
                        <option value="Bulgaria">Bulgaria</option>
                        <option value="Burkina Faso">Burkina Faso</option>
                        <option value="Burundi">Burundi</option>
                        <option value="Cambodia">Cambodia</option>
                        <option value="Cameroon">Cameroon</option>
                        <option value="Canada">Canada</option>
                        <option value="Cape Verde">Cape Verde</option>
                        <option value="Cayman Islands">Cayman Islands</option>
                        <option value="Central African Republic">Central African Republic</option>
                        <option value="Chad">Chad</option>
                        <option value="Chile">Chile</option>
                        <option value="China">China</option>
                        <option value="Christmas Island">Christmas Island</option>
                        <option value="Cocos (Keeling) Islands">Cocos (Keeling) Islands</option>
                        <option value="Colombia">Colombia</option>
                        <option value="Comoros">Comoros</option>
                        <option value="Congo">Congo</option>
                        <option value="Congo, The Democratic Republic of The">Congo, The Democratic Republic of The</option>
                        <option value="Cook Islands">Cook Islands</option>
                        <option value="Costa Rica">Costa Rica</option>
                        <option value="Cote D'ivoire">Cote D'ivoire</option>
                        <option value="Croatia">Croatia</option>
                        <option value="Cuba">Cuba</option>
                        <option value="Cyprus">Cyprus</option>
                        <option value="Czech Republic">Czech Republic</option>
                        <option value="Denmark">Denmark</option>
                        <option value="Djibouti">Djibouti</option>
                        <option value="Dominica">Dominica</option>
                        <option value="Dominican Republic">Dominican Republic</option>
                        <option value="Ecuador">Ecuador</option>
                        <option value="Egypt">Egypt</option>
                        <option value="El Salvador">El Salvador</option>
                        <option value="Equatorial Guinea">Equatorial Guinea</option>
                        <option value="Eritrea">Eritrea</option>
                        <option value="Estonia">Estonia</option>
                        <option value="Ethiopia">Ethiopia</option>
                        <option value="Falkland Islands (Malvinas)">Falkland Islands (Malvinas)</option>
                        <option value="Faroe Islands">Faroe Islands</option>
                        <option value="Fiji">Fiji</option>
                        <option value="Finland">Finland</option>
                        <option value="France">France</option>
                        <option value="French Guiana">French Guiana</option>
                        <option value="French Polynesia">French Polynesia</option>
                        <option value="French Southern Territories">French Southern Territories</option>
                        <option value="Gabon">Gabon</option>
                        <option value="Gambia">Gambia</option>
                        <option value="Georgia">Georgia</option>
                        <option value="Germany">Germany</option>
                        <option value="Ghana">Ghana</option>
                        <option value="Gibraltar">Gibraltar</option>
                        <option value="Greece">Greece</option>
                        <option value="Greenland">Greenland</option>
                        <option value="Grenada">Grenada</option>
                        <option value="Guadeloupe">Guadeloupe</option>
                        <option value="Guam">Guam</option>
                        <option value="Guatemala">Guatemala</option>
                        <option value="Guernsey">Guernsey</option>
                        <option value="Guinea">Guinea</option>
                        <option value="Guinea-bissau">Guinea-bissau</option>
                        <option value="Guyana">Guyana</option>
                        <option value="Haiti">Haiti</option>
                        <option value="Heard Island and Mcdonald Islands">Heard Island and Mcdonald Islands</option>
                        <option value="Holy See (Vatican City State)">Holy See (Vatican City State)</option>
                        <option value="Honduras">Honduras</option>
                        <option value="Hong Kong">Hong Kong</option>
                        <option value="Hungary">Hungary</option>
                        <option value="Iceland">Iceland</option>
                        <option value="India">India</option>
                        <option value="Indonesia">Indonesia</option>
                        <option value="Iran, Islamic Republic of">Iran, Islamic Republic of</option>
                        <option value="Iraq">Iraq</option>
                        <option value="Ireland">Ireland</option>
                        <option value="Isle of Man">Isle of Man</option>
                        <option value="Israel">Israel</option>
                        <option value="Italy">Italy</option>
                        <option value="Jamaica">Jamaica</option>
                        <option value="Japan">Japan</option>
                        <option value="Jersey">Jersey</option>
                        <option value="Jordan">Jordan</option>
                        <option value="Kazakhstan">Kazakhstan</option>
                        <option value="Kenya">Kenya</option>
                        <option value="Kiribati">Kiribati</option>
                        <option value="Korea, Democratic People's Republic of">Korea, Democratic People's Republic of</option>
                        <option value="Korea, Republic of">Korea, Republic of</option>
                        <option value="Kuwait">Kuwait</option>
                        <option value="Kyrgyzstan">Kyrgyzstan</option>
                        <option value="Lao People's Democratic Republic">Lao People's Democratic Republic</option>
                        <option value="Latvia">Latvia</option>
                        <option value="Lebanon">Lebanon</option>
                        <option value="Lesotho">Lesotho</option>
                        <option value="Liberia">Liberia</option>
                        <option value="Libyan Arab Jamahiriya">Libyan Arab Jamahiriya</option>
                        <option value="Liechtenstein">Liechtenstein</option>
                        <option value="Lithuania">Lithuania</option>
                        <option value="Luxembourg">Luxembourg</option>
                        <option value="Macao">Macao</option>
                        <option value="Macedonia, The Former Yugoslav Republic of">Macedonia, The Former Yugoslav Republic of</option>
                        <option value="Madagascar">Madagascar</option>
                        <option value="Malawi">Malawi</option>
                        <option value="Malaysia">Malaysia</option>
                        <option value="Maldives">Maldives</option>
                        <option value="Mali">Mali</option>
                        <option value="Malta">Malta</option>
                        <option value="Marshall Islands">Marshall Islands</option>
                        <option value="Martinique">Martinique</option>
                        <option value="Mauritania">Mauritania</option>
                        <option value="Mauritius">Mauritius</option>
                        <option value="Mayotte">Mayotte</option>
                        <option value="Mexico">Mexico</option>
                        <option value="Micronesia, Federated States of">Micronesia, Federated States of</option>
                        <option value="Moldova, Republic of">Moldova, Republic of</option>
                        <option value="Monaco">Monaco</option>
                        <option value="Mongolia">Mongolia</option>
                        <option value="Montenegro">Montenegro</option>
                        <option value="Montserrat">Montserrat</option>
                        <option value="Morocco">Morocco</option>
                        <option value="Mozambique">Mozambique</option>
                        <option value="Myanmar">Myanmar</option>
                        <option value="Namibia">Namibia</option>
                        <option value="Nauru">Nauru</option>
                        <option value="Nepal">Nepal</option>
                        <option value="Netherlands">Netherlands</option>
                        <option value="Netherlands Antilles">Netherlands Antilles</option>
                        <option value="New Caledonia">New Caledonia</option>
                        <option value="New Zealand">New Zealand</option>
                        <option value="Nicaragua">Nicaragua</option>
                        <option value="Niger">Niger</option>
                        <option value="Nigeria">Nigeria</option>
                        <option value="Niue">Niue</option>
                        <option value="Norfolk Island">Norfolk Island</option>
                        <option value="Northern Mariana Islands">Northern Mariana Islands</option>
                        <option value="Norway">Norway</option>
                        <option value="Oman">Oman</option>
                        <option value="Pakistan">Pakistan</option>
                        <option value="Palau">Palau</option>
                        <option value="Palestinian Territory, Occupied">Palestinian Territory, Occupied</option>
                        <option value="Panama">Panama</option>
                        <option value="Papua New Guinea">Papua New Guinea</option>
                        <option value="Paraguay">Paraguay</option>
                        <option value="Peru">Peru</option>
                        <option value="Philippines">Philippines</option>
                        <option value="Pitcairn">Pitcairn</option>
                        <option value="Poland">Poland</option>
                        <option value="Portugal">Portugal</option>
                        <option value="Puerto Rico">Puerto Rico</option>
                        <option value="Qatar">Qatar</option>
                        <option value="Reunion">Reunion</option>
                        <option value="Romania">Romania</option>
                        <option value="Russian Federation">Russian Federation</option>
                        <option value="Rwanda">Rwanda</option>
                        <option value="Saint Helena">Saint Helena</option>
                        <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                        <option value="Saint Lucia">Saint Lucia</option>
                        <option value="Saint Pierre and Miquelon">Saint Pierre and Miquelon</option>
                        <option value="Saint Vincent and The Grenadines">Saint Vincent and The Grenadines</option>
                        <option value="Samoa">Samoa</option>
                        <option value="San Marino">San Marino</option>
                        <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                        <option value="Saudi Arabia">Saudi Arabia</option>
                        <option value="Senegal">Senegal</option>
                        <option value="Serbia">Serbia</option>
                        <option value="Seychelles">Seychelles</option>
                        <option value="Sierra Leone">Sierra Leone</option>
                        <option value="Singapore">Singapore</option>
                        <option value="Slovakia">Slovakia</option>
                        <option value="Slovenia">Slovenia</option>
                        <option value="Solomon Islands">Solomon Islands</option>
                        <option value="Somalia">Somalia</option>
                        <option value="South Africa">South Africa</option>
                        <option value="South Georgia and The South Sandwich Islands">South Georgia and The South Sandwich Islands</option>
                        <option value="Spain">Spain</option>
                        <option value="Sri Lanka">Sri Lanka</option>
                        <option value="Sudan">Sudan</option>
                        <option value="Suriname">Suriname</option>
                        <option value="Svalbard and Jan Mayen">Svalbard and Jan Mayen</option>
                        <option value="Swaziland">Swaziland</option>
                        <option value="Sweden">Sweden</option>
                        <option value="Switzerland">Switzerland</option>
                        <option value="Syrian Arab Republic">Syrian Arab Republic</option>
                        <option value="Taiwan">Taiwan</option>
                        <option value="Tajikistan">Tajikistan</option>
                        <option value="Tanzania, United Republic of">Tanzania, United Republic of</option>
                        <option value="Thailand">Thailand</option>
                        <option value="Timor-leste">Timor-leste</option>
                        <option value="Togo">Togo</option>
                        <option value="Tokelau">Tokelau</option>
                        <option value="Tonga">Tonga</option>
                        <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                        <option value="Tunisia">Tunisia</option>
                        <option value="Turkey">Turkey</option>
                        <option value="Turkmenistan">Turkmenistan</option>
                        <option value="Turks and Caicos Islands">Turks and Caicos Islands</option>
                        <option value="Tuvalu">Tuvalu</option>
                        <option value="Uganda">Uganda</option>
                        <option value="Ukraine">Ukraine</option>
                        <option value="United Arab Emirates">United Arab Emirates</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                        <option value="United States Minor Outlying Islands">United States Minor Outlying Islands</option>
                        <option value="Uruguay">Uruguay</option>
                        <option value="Uzbekistan">Uzbekistan</option>
                        <option value="Vanuatu">Vanuatu</option>
                        <option value="Venezuela">Venezuela</option>
                        <option value="Viet Nam">Viet Nam</option>
                        <option value="Virgin Islands, British">Virgin Islands, British</option>
                        <option value="Virgin Islands, U.S.">Virgin Islands, U.S.</option>
                        <option value="Wallis and Futuna">Wallis and Futuna</option>
                        <option value="Western Sahara">Western Sahara</option>
                        <option value="Yemen">Yemen</option>
                        <option value="Zambia">Zambia</option>
                        <option value="Zimbabwe">Zimbabwe</option>
                     </select>
                  </div>

                  <button
                     type="submit"
                     className="w-full bg-[#A31D1D] text-white py-2 rounded hover:bg-[#6D2323] transition-colors"
                  >
                     Complete Profile
                  </button>
               </form>
            </div>
         </div>

         {showPopup && (
         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="w-full max-w-md p-6 rounded-lg shadow-lg" style={{ backgroundColor: '#FEF9E1' }}>
               <div className="mb-4" style={{ backgroundColor: '#A31D1D', padding: '1rem', borderRadius: '0.5rem' }}>
               <h2 className="text-xl font-bold text-white text-center">YouFit Nutrition Plan</h2>
               </div>
               
               <div className="mb-6 text-center">
               <p className="text-lg font-medium mb-2">Your Daily Calorie Target</p>
               <div className="text-3xl font-bold py-4" style={{ color: '#A31D1D' }}>
                  {dailyCalorie} calories
               </div>
               <p className="text-sm text-gray-600 mt-2">
                  Based on your profile information and goals
               </p>
               </div>
               
               <div className="mb-4 p-4 bg-white rounded border border-gray-200">
               <h3 className="font-medium mb-2">Recommended Macros:</h3>
               <div className="grid grid-cols-3 gap-2 text-center">
                  <div>
                     <p className="font-bold" style={{ color: '#6D2323' }}>Protein</p>
                     <p>{Math.round(dailyCalorie * 0.3 / 4)}g</p>
                  </div>
                  <div>
                     <p className="font-bold" style={{ color: '#6D2323' }}>Carbs</p>
                     <p>{Math.round(dailyCalorie * 0.4 / 4)}g</p>
                  </div>
                  <div>
                     <p className="font-bold" style={{ color: '#6D2323' }}>Fat</p>
                     <p>{Math.round(dailyCalorie * 0.3 / 9)}g</p>
                  </div>
               </div>
               </div>
               
               <button
               className="w-full py-3 px-4 rounded font-bold text-white"
               style={{ backgroundColor: '#6D2323' }}
               onClick={() => setShowPopup(false)}
               >
               Close
               </button>
            </div>
         </div>
         )}
      </div>
   );
}

export default Signup;
