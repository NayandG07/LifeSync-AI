// This extends the Window interface to include our custom ENV object
interface Window {
  ENV?: {
    NEXT_PUBLIC_HUGGINGFACE_API_KEY: string;
    // Add other environment variables as needed
  };
} 