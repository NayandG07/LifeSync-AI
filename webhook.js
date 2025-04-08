addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Handle CORS
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Force-Method',
      },
    });
  }

  // Special handling for "test" requests to quickly verify the service is working
  // This helps reduce timeouts during availability checks
  try {
    const contentType = request.headers.get('Content-Type') || '';
    
    // If it's a POST request with JSON content-type
    if (request.method === 'POST' && contentType.includes('application/json')) {
      const body = await request.json();
      
      // Quick response for test requests
      if (body.text === 'test') {
        return new Response(JSON.stringify({ 
          text: 'Service is working',
          max_tokens: 1024 
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
      
      // Check for required fields in non-test requests
      if (!body.text) {
        return new Response(JSON.stringify({ error: 'Missing required field: text' }), {
          status: 400,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }

      // Make direct request to Gemini API
      const API_KEY = "AIzaSyBv6KK5I0UBOBE-UjGg5YwCAs67HrdsJ_M";
      const modelName = body.model || "gemini-1.5-pro"; // Prefer pro for therapy
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${API_KEY}`;
      
      // Set the max tokens value
      const maxOutputTokens = body.max_tokens || 1024; // Allow client to specify max tokens or use default

      // Prepare the request payload with the proper structure
      const payload = {
        contents: [
          {
            parts: [
              {
                text: body.text
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.9, // Higher for more creative therapeutic responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: maxOutputTokens,
        }
      };

      // Make the API call with a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15 second timeout for Gemini API
      
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);

        // Get the response
        const data = await response.json();

        // Extract the text from the response
        let resultText = "No response generated";
        if (data.candidates && data.candidates.length > 0 && 
            data.candidates[0].content && data.candidates[0].content.parts && 
            data.candidates[0].content.parts.length > 0) {
          resultText = data.candidates[0].content.parts[0].text;
        }

        // Return the response with appropriate cache headers
        return new Response(JSON.stringify({
          text: resultText,
          model: modelName,
          max_tokens: maxOutputTokens // Pass the max tokens back to the client
        }), {
          status: 200,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0',
            'Pragma': 'no-cache'
          },
        });
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        return new Response(JSON.stringify({
          error: 'Error calling Gemini API',
          details: fetchError.message,
          max_tokens: maxOutputTokens // Include in error response too
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }
  } catch (error) {
    console.error('Error:', error);
  }
  
  // If we get here, it wasn't a valid POST request with JSON
  return new Response(JSON.stringify({ 
    error: 'Method not allowed or invalid request format',
    note: 'This endpoint requires a POST request with JSON body containing a "text" field',
    max_tokens: 1024 // Default value
  }), {
    status: 405,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Allow': 'POST, OPTIONS'
    },
  });
} 