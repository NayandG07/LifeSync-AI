// Main entry point for Netlify functions
// This also acts as a basic function to verify deployment

export const handler = async (event, context) => {
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS'
  };
  
  // Handle OPTIONS request for CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 204,
      headers
    };
  }
  
  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      message: "LifeSync API is working!",
      availableFunctions: [
        "/.netlify/functions/hello",
        "/.netlify/functions/test",
        "/.netlify/functions/gemma-proxy"
      ],
      documentation: "Use these functions to interact with the LifeSync API"
    })
  };
}; 