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
      const res = await fetch('http://localhost:8080/api/getResponse', {
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
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((message, i) => (
          <div
            key={i}
            style={{
              ...styles.message,
              alignSelf: message.role === 'user' ? 'flex-end' : 'flex-start',
              backgroundColor: message.role === 'user' ? '#007bff' : '#f1f1f1',
              color: message.role === 'user' ? '#fff' : '#000',
            }}
          >
            <strong>{message.role === 'user' ? 'You' : 'Assistant'}:</strong> {message.content}
          </div>
        ))}
        {loading && <div style={styles.message}>Loading...</div>}
        <div ref={messagesEndRef} />
      </div>

      {/* Input form */}
      <form onSubmit={handleSubmit} style={styles.form}>
        <div className='text-gray-600'> 
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          style={styles.input}
          disabled={loading} // Disable input while loading
        /></div>
        <button type="submit" style={styles.button} disabled={loading}>
          Send
        </button>
      </form>
    </div>
  );
};

const styles = {
  chatContainer: {
    display: 'flex',
    flexDirection: 'column',
    height: '500px',
    width: '400px',
    border: '1px solid #ccc',
    borderRadius: '8px',
    overflow: 'hidden',
  },
  messagesContainer: {
    flex: 1,
    overflowY: 'auto',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  message: {
    padding: '8px',
    borderRadius: '8px',
    maxWidth: '80%',
  },
  form: {
    display: 'flex',
    padding: '10px',
    borderTop: '1px solid #ccc',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    padding: '8px',
    borderRadius: '4px',
    border: '1px solid #ccc',
    marginRight: '10px',
  },
  button: {
    padding: '8px 16px',
    borderRadius: '4px',
    border: 'none',
    backgroundColor: '#007bff',
    color: '#fff',
    cursor: 'pointer',
  },
};

export default Chat;
