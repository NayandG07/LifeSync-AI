# LifeSync App

LifeSync is a wellness-focused application with an AI-powered chatbot that helps users manage their mental health and wellness journey.

## Features

- AI-powered therapeutic chatbot using Google's Gemma 2B model
- User authentication with Firebase
- Chat history saving with Firestore
- Responsive design with Tailwind CSS
- Multiple chat sessions with tab interface

## Tech Stack

- React
- TypeScript
- Firebase (Authentication, Firestore)
- Hugging Face Inference API
- Tailwind CSS
- Shadcn UI Components
- Vite

## Development

```
# Install dependencies
npm install

# Start development server
npm run dev:frontend

# Build for production
npm run build
```

## Deployment

This application is set up for deployment on Netlify with the included netlify.toml configuration.

## Environment Variables

The following environment variables are required:

- NEXT_PUBLIC_HUGGINGFACE_API_KEY: API key for Hugging Face Inference API
- FIREBASE_PROJECT_ID: Firebase project ID
- FIREBASE_CLIENT_EMAIL: Firebase client email
- FIREBASE_PRIVATE_KEY: Firebase private key
- GOOGLE_CLIENT_ID: Google client ID for authentication 