    import fetch from 'node-fetch'; // Ensure node-fetch is installed

    export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
        // Extract the prompt from the request body
        const { prompt } = req.body.data;
        console.log('Prompt received:', prompt);

        // Define the API endpoint with the API key
        const apiKey = process.env.GOOGLE_API_KEY;
        if (!apiKey) {
            console.error('API key is missing');
            return res.status(500).json({ error: 'API key is not configured' });
        }
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${apiKey}`;
        
        // Prepare the request body for the API call
        const requestBody = {
            contents: [
            {
                parts: [
                {
                    text: prompt
                }
                ]
            }
            ]
        };
        console.log('Request body:', requestBody);

        // Make the request to the Gemini API
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        // Check if the response is ok
        if (!response.ok) {
            const errorDetails = await response.json();
            console.error('Error details:', errorDetails);
            return res.status(response.status).json({ error: 'Error communicating with the API' });
        }

        // Parse the response JSON
        const data = await response.json();
        console.log('API response data:', data);
        
        // Extract the response text from the API
        const content = data.candidates[0].content.parts[0].text || "Sorry, I couldn't understand that.";
        console.log('Extracted content:', content);

        // Send the content as the API response
        res.status(200).json({ content });
        } catch (error) {
        console.error('Error communicating with the API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
    }
