// A simple Netlify function using ES module format
export const handler = async (event, context) => {
  try {
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Hello from LifeSync API!" }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to execute function" }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    };
  }
}; 