import React, { useState, useRef } from 'react';

const Chat = (props) => {
  const [messages, setMessages] = useState([]); // Stores chat history
  const [inputValue, setInputValue] = useState(''); // Stores the input from the form
  const [loading, setLoading] = useState(false); // Tracks loading state for API call
  const messagesEndRef = useRef(null); // Ref for scrolling to the bottom of the chat
  const user = props.user

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!inputValue.trim()) return; // Ignore empty input

    setLoading(true); // Set loading state
    setMessages((prevMessages) => [...prevMessages, { role: 'user', content: inputValue }]); // Add user message to chat history
    setInputValue(''); // Clear the input field

    try {
      // Fetch response from the API
      const res = await fetch('https://myfit-server.vercel.app/api/getResponse', {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: inputValue,
          user: user,
          calorieToday: props.calorieToday,
        }), // Send the user's input as the prompt
      });
      const response = await res.json();

      // Add the assistant's response to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: response.content },
      ]);
    } catch (error) {
      console.error('Error fetching messages:', error);
      // Optionally, add an error message to the chat history
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'Assistant', content: 'Failed to fetch response. Please try again.' },
      ]);
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // Scroll to the bottom of the chat when new messages are added
  React.useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  return (
    <div className="flex flex-col items-center justify-center w-[800px] h-[600px] bg-[#FFD6B5] rounded-lg shadow-lg p-6">
    {/* Logo at the top */}
    <img src="/MyFitt.png" alt="MyFitLogo" className="w-15 h-15 mb-3 mt-[-15px]" />
    
    {/* Welcome Message (disappears after first message) */}
    {messages.length === 0 && (
      <div className="text-center text-gray-800">
        <p className="text-lg text-gray-400 font-medium">Hi, there!</p>
        <p className="text-xl font-semibold">How may I assist you?</p>
      </div>
    )}

    {/* Messages Container */}
    <div className="flex flex-col w-full h-[350px] overflow-y-auto px-4 py-2">
      {messages.map((message, i) => (
        <div
          key={i}
          className={`px-4 py-2 mb-3 rounded-lg max-w-[60%] ${
            message.role === 'user' 
              ? 'bg-[#F07167] text-white self-end' 
              : 'bg-[#0081A7] text-white self-start'
          }`}
        >
          {message.content}
        </div>
      ))}
      {loading && <div className="text-gray-600">Loading...</div>}
      <div ref={messagesEndRef} />
    </div>

    {/* Input Field & Send Button */}
    <form onSubmit={handleSubmit} className="flex items-center w-full mt-4 gap-2">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="Talk to assistant..."
        disabled={loading}
        className="w-full px-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-red-400"
      />
      <button type="submit" disabled={loading} className="p-2 border-none bg-transparent">
        <img src="/arrow-submit.png" alt="Send" className="w-20 h-12 object-contain" />
      </button>
    </form>
  </div>

  );
  
};

export default Chat;
