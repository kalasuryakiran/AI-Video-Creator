import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
  };

  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    const debugInfo = {
      timestamp: new Date().toISOString(),
      hasGeminiApiKey: !!process.env.GEMINI_API_KEY,
      geminiApiKeyLength: process.env.GEMINI_API_KEY?.length || 0,
      nodeVersion: process.version,
      environment: process.env.NODE_ENV || 'not-set',
      netlifyContext: context.clientContext || 'no-context',
    };

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(debugInfo, null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
      }),
    };
  }
};