// Debug function to test message formatting and API calls
export const handler = async (event, context) => {
  // Common response headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }

  try {
    // For GET requests, return test info
    if (event.httpMethod === 'GET') {
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Test function is working",
          environment: {
            NETLIFY: process.env.NETLIFY || "Not set",
            NODE_ENV: process.env.NODE_ENV || "Not set",
            API_KEY_STATUS: process.env.NEXT_PUBLIC_HUGGINGFACE_API_KEY ? "Set" : "Not set"
          },
          query: event.queryStringParameters,
          request: {
            method: event.httpMethod,
            path: event.path,
            headers: event.headers
          }
        })
      };
    }

    // For POST requests, echo back what was sent
    if (event.httpMethod === 'POST') {
      let requestBody;
      try {
        requestBody = JSON.parse(event.body);
      } catch (e) {
        requestBody = { error: "Could not parse request body as JSON", raw: event.body };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          message: "Received POST data",
          receivedData: requestBody
        })
      };
    }

    // Handle other request methods
    return {
      statusCode: 405,
      headers: { ...headers, Allow: 'GET, POST, OPTIONS' },
      body: JSON.stringify({ error: 'Method Not Allowed' })
    };

  } catch (error) {
    console.error('Error in test function:', error);
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      })
    };
  }
}; 