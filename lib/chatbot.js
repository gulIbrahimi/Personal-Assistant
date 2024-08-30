    // lib/chatbot.js

    export async function getChatbotResponse(prompt) {
        try {
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify({ contents: [{ parts: [prompt] }] }), // Ensure request body matches API expectations
        });
    
        if (!response.ok) {
            // Enhanced error handling
            console.warn('API responded with a non-200 status:', response.status);
            throw new Error(`Network response was not ok: ${response.status}`);
        }
    
        const data = await response.json();
        
        // Validate the structure of the response
        if (!data || !Array.isArray(data.candidates) || data.candidates.length === 0) {
            console.warn('Unexpected response structure:', data);
            throw new Error('Unexpected response structure');
        }
    
        const content = data.candidates[0].content || generateFallbackResponse(prompt); // Use fallback if content is missing
    
        return content;
        } catch (error) {
        console.error('Error communicating with the API:', error);
        return "There was an error processing your request. Please try again later.";
        }
    }
    
    // Fallback mechanism to generate a basic response if the API fails
    function generateFallbackResponse(prompt) {
        // Analyze the prompt to provide a relevant fallback response
        if (prompt.toLowerCase().includes('help')) {
        return "It seems like you need help. How can I assist you further?";
        } else if (prompt.toLowerCase().includes('schedule')) {
        return "I'm sorry, I'm unable to access your schedule right now. Can you try again later?";
        } else {
        return "I'm here to assist you with your needs. Could you please clarify your request?";
        }
    }
    