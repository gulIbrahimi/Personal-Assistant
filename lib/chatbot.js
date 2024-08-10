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
            throw new Error('Network response was not ok');
        }
    
        const data = await response.json();
        const content = data.candidates?.[0]?.content || "I'm sorry, can I help with something else?"; // Correct content extraction
    
        return content;
        } catch (error) {
        console.error('Error communicating with the API:', error);
        return "There was an error. Please try again later.";
        }
    }
    