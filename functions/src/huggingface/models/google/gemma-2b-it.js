// Netlify function to proxy requests to HuggingFace API for the gemma-2b-it model
import fetch from 'node-fetch';

// Handle preflight CORS requests
const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

export const handler = async (event, context) => {
  console.log("Gemma-2b-it function called with method:", event.httpMethod);
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  // Only allow POST requests
  if (event.httpMethod !== 'POST') {
    console.log(`Rejected ${event.httpMethod} request to gemma-2b-it proxy`);
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
      headers: {
        ...headers,
        'Allow': 'POST, OPTIONS'
      }
    };
  }

  try {
    // Get API key from environment variable
    const API_KEY = process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY;
    
    if (!API_KEY) {
      console.error("API key not found in environment variables");
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ error: 'API key not configured on server' })
      };
    }

    const API_URL = "https://api-inference.huggingface.co/models/google/gemma-2b-it";
    
    // Parse the request body from the client
    let requestBody;
    try {
      requestBody = JSON.parse(event.body);
      console.log("Request payload shape:", 
                  Object.keys(requestBody), 
                  requestBody.inputs ? requestBody.inputs.substring(0, 100) + "..." : "No inputs");
    } catch (e) {
      console.error("Error parsing request body", e);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid request body - could not parse JSON',
          body: event.body.substring(0, 100) + "..."  // Include part of the body for debugging
        })
      };
    }
    
    console.log("Forwarding request to HuggingFace API");
    
    // Forward the request to HuggingFace API
    let response;
    try {
      response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });
    } catch (fetchError) {
      console.error("Fetch to HuggingFace API failed:", fetchError);
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ 
          error: 'Failed to reach HuggingFace API',
          message: fetchError.message
        })
      };
    }

    // Check if the response is ok before parsing JSON
    if (!response.ok) {
      console.error(`HuggingFace API error: ${response.status} ${response.statusText}`);
      
      // Try to get the error response body
      let errorBody = "";
      try {
        errorBody = await response.text();
      } catch (e) {
        errorBody = "Could not read error response";
      }
      
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ 
          error: `Error from HuggingFace API: ${response.statusText}`,
          status: response.status,
          details: errorBody.substring(0, 500)  // Trim long error responses
        })
      };
    }

    // Get the response data
    let data;
    try {
      data = await response.json();
      console.log("Received response from HuggingFace API:", 
                 Array.isArray(data) ? `Array with ${data.length} items` : typeof data);
    } catch (jsonError) {
      console.error("Failed to parse JSON from HuggingFace API:", jsonError);
      
      // Try to get the response as text
      let textResponse = "";
      try {
        textResponse = await response.text();
      } catch (e) {
        textResponse = "Could not read response as text";
      }
      
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ 
          error: 'Invalid JSON response from HuggingFace API',
          message: jsonError.message,
          responseText: textResponse.substring(0, 500)  // Include part of the response for debugging
        })
      };
    }
    
    // Return the API response to the client
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(data)
    };
    
  } catch (error) {
    console.error('Error proxying to HuggingFace API:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Failed to proxy request to HuggingFace API',
        message: error.message
      })
    };
  }
}; 