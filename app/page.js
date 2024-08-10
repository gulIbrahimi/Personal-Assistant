/**
 * By Gul Amiz Ibrahimi
 * Define the Home component
 * This component will be the main page of the application
 * It will contain the chat interface
 * The chat interface will display messages from the user and the assistant
 * The user can type a message and send it to the assistant
 * The assistant will respond with a placeholder message after a delay
 * The chat interface will display the messages in a conversation style
 * The user's messages will be displayed on the right side
 * The assistant's messages will be displayed on the left side
 * The chat interface will have a title, message input field, and send button
 */

'use client';

// Import the required modules from the Material-UI library and React library into the Home component
import { Box, Button, Stack, TextField, Typography } from '@mui/material';
import { useState } from 'react';

// Export the Home component
export default function Home() {
  // Define the messages state
  const [messages, setMessages] = useState([
    {
      // The assistant will be the first to send a message
      role: 'assistant',
      // The content of the message
      content: "Hi! I'm you personal assistant. How can I help you today?",
    },
  ]);

  // Define the message state
  const [message, setMessage] = useState('');

    // Function to handle sending a message
    const sendMessage = async () => {
      setMessage(''); // Clear the input field
    
      // Add the user's message to the chat
      setMessages((messages) => [
        ...messages,
        { role: 'user', content: message },
        { role: 'assistant', content: '' }, // Placeholder for the assistant's response
      ]);
    
      try {
        // Send the message to the API
        const response = await fetch('/api/gemini', { // Corrected API path
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: { prompt: `The user asked: "${message}". Provide a detailed and informative response.` } }),
        });
        //const prompt = `The user asked: "${message}". Provide a detailed and informative response.`;

        // Handle the response from the API
        const data = await response.json();
        const assistantMessage = data.content || "I'm sorry, can I help with something else?";
      
        // Corrected response handling
    
        // Update the assistant's message
        setMessages((messages) => {
          const updatedMessages = [...messages];
          updatedMessages[updatedMessages.length - 1].content = assistantMessage;
          return updatedMessages;
        });

      } catch (error) {
        console.error('Error communicating with the API:', error);
        setMessages((messages) => [
          ...messages,
          { role: 'assistant', content: "There was an error. Please try again later." },
        ]);
      }
    };
    

  
  // Return the chat interface
  return (
    // Use the Box component to create a container for the chat interface
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bgcolor="#f0f4f8"
      p={3}
    >
      <Stack
        direction={'column'}
        width="100%"
        maxWidth="600px"
        height="80%"
        borderRadius={4}
        boxShadow={3}
        overflow="hidden"
        bgcolor="white"
      >
        <Box
          bgcolor="#1976d2"
          p={2}
          borderRadius="4px 4px 0 0"
        >
          <Typography variant="h5" color="white">
            Chat with Headstarter Assistant
          </Typography>
        </Box>

        <Stack
          direction={'column'}
          spacing={2}
          flexGrow={1}
          p={2}
          overflow="auto"
        >
          {messages.map((msg, index) => (
            <Box
              key={index}
              display="flex"
              justifyContent={msg.role === 'assistant' ? 'flex-start' : 'flex-end'}
            >
              <Box
                bgcolor={msg.role === 'assistant' ? '#1976d2' : '#4caf50'}
                color="white"
                borderRadius={16}
                p={2}
                maxWidth="70%"
                boxShadow={2}
              >
                {msg.content}
              </Box>
            </Box>
          ))}
        </Stack>

        <Stack direction={'row'} spacing={2} p={2}>
          <TextField
            label="Type a message..."
            fullWidth
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            variant="outlined"
            InputProps={{
              style: {
                borderRadius: 20,
              },
            }}
            sx={{ backgroundColor: '#f5f5f5' }}
          />

          <Button
            variant="contained"
            onClick={sendMessage}
            sx={{
              borderRadius: '20px',
              bgcolor: '#1976d2',
              '&:hover': {
                bgcolor: '#1565c0',
              },
            }}
          >
            Send
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
}
