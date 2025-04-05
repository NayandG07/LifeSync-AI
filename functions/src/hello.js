// Simple test function to verify Netlify functions deployment
export const handler = async (event, context) => {
  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      message: "Hello from LifeSync API! Functions are working correctly.",
      timestamp: new Date().toISOString()
    })
  };
}; 