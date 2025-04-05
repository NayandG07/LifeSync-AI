import { useState } from "react";
import { Activity } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth";
import { FirebaseError } from "firebase/app";
import { signInWithPopup, Auth, GoogleAuthProvider } from "firebase/auth";
import { auth as firebaseAuth, googleProvider as firebaseGoogleProvider } from "@/lib/firebase";
import { useNavigate } from "react-router-dom";

const auth = firebaseAuth as Auth;
const googleProvider = firebaseGoogleProvider as GoogleAuthProvider;

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent, mode: "signin" | "signup") => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === "signin") {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      toast({
        title: mode === "signin" ? "Welcome back!" : "Account created",
        description: mode === "signin" 
          ? "You've been successfully logged in"
          : "Your account has been created and you're now logged in",
      });
    } catch (error) {
      const firebaseError = error as FirebaseError;
      let errorMessage = "An error occurred during authentication";
      
      switch (firebaseError.code) {
        case "auth/invalid-email":
          errorMessage = "Please enter a valid email address";
          break;
        case "auth/user-not-found":
          errorMessage = "No account found with this email";
          break;
        case "auth/wrong-password":
          errorMessage = "Incorrect password";
          break;
        case "auth/weak-password":
          errorMessage = "Password should be at least 6 characters";
          break;
        case "auth/email-already-in-use":
          errorMessage = "An account with this email already exists";
          break;
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many attempts. Please try again later";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your internet connection";
          break;
      }

      toast({
        title: "Authentication error",
        description: errorMessage,
        variant: "destructive",
      });
      console.error("Auth error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      toast({
        title: "Welcome!",
        description: "You've been successfully logged in with Google",
      });
      
      navigate('/');
      
    } catch (error) {
      const firebaseError = error as FirebaseError;
      toast({
        title: "Authentication error",
        description: "Could not sign in with Google. Please try again.",
        variant: "destructive",
      });
      console.error("Google auth error:", firebaseError);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-gray-900 to-gray-800">
      <Card className="w-full max-w-sm p-8 space-y-6 bg-[#1e1e2f] border border-gray-700/30 rounded-lg shadow-inner shadow-gray-900/10">
        <div className="flex flex-col items-center space-y-2 mb-4">
          <Activity className="h-12 w-12 text-blue-400" />
          <h1 className="text-2xl font-bold text-gray-100">Welcome to LifeSync</h1>
          <p className="text-sm text-gray-400 text-center">
            Sign in to your account to continue
          </p>
        </div>

        <form onSubmit={(e) => handleSubmit(e, "signin")} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500 text-gray-200 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="bg-gray-800/50 border-gray-700 focus:border-blue-500 text-gray-200 placeholder:text-gray-500"
              required
            />
          </div>

          <div className="space-y-3 pt-2">
            <Button 
              type="submit" 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? "Loading..." : "Sign In"}
            </Button>
            <Button
              type="button"
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              disabled={isLoading}
              onClick={(e) => handleSubmit(e, "signup")}
            >
              Create Account
            </Button>
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-700" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-[#1e1e2f] px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full flex items-center justify-center gap-2 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-gray-100"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
                <path d="M1 1h22v22H1z" fill="none" />
              </svg>
              Sign up with Google
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}