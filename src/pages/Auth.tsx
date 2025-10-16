import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

// --- Firebase imports ---
import { auth, db } from "@/integrations/firebase/client"; // db আমদানি করা হলো
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    GoogleAuthProvider,
    signInWithPopup
} from "firebase/auth";
import { doc, setDoc, getDoc, serverTimestamp } from "firebase/firestore"; // Firestore function imports

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState(""); // Full name field added back
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Firebase: Monitor user state change
    const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // If user is logged in, redirect to home
            navigate("/");
            toast.success("Welcome!");
        }
    });
    return unsubscribe; // Unsubscribe listener on component unmount
  }, [navigate]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // Firebase: Login
        await signInWithEmailAndPassword(auth, email, password);
        // onAuthStateChanged listener will handle successful login.
      } else {
        // Firebase: Registration (user will be logged in directly without email verification)
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Create a profile document for the new user in Firestore
        await setDoc(doc(db, "users", user.uid), {
          uid: user.uid,
          fullName: fullName,
          email: user.email,
          role: "user", // default role
          createdAt: serverTimestamp(), // document creation time
        });

        toast.success("Account created successfully! Welcome.");
        // onAuthStateChanged listener will handle successful registration.
      }
    } catch (error: any) {
        console.error("Authentication Error:", error);
        
        let errorMessage = "An account-related error occurred.";
        if (error.code === 'auth/invalid-email') {
            errorMessage = "Invalid email format.";
        } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
            errorMessage = "Incorrect email or password.";
        } else if (error.code === 'auth/email-already-in-use') {
            errorMessage = "This email is already in use.";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "The password is too weak (at least 6 characters required).";
        }

        toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      // Check if the user's profile already exists
      const userDocRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(userDocRef);

      if (!docSnap.exists()) {
        // If the profile doesn't exist, create a new one
        await setDoc(userDocRef, {
          uid: user.uid,
          fullName: user.displayName,
          email: user.email,
          role: "user",
          createdAt: serverTimestamp(),
        });
      }
      toast.success("Google sign-in successful!");
    } catch (error: any) {
      console.error("Google Sign-In Error:", error);
      toast.error(error.message || "Could not sign in with Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-background via-muted/20 to-background">
      <Card className="w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {isLogin ? "Welcome Back" : "Create an Account"}
          </h1>
          <p className="text-muted-foreground">
            {isLogin ? "Sign in to your account" : "Join Snova Digital Agency"}
          </p>
        </div>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                required={!isLogin}
              />
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isLogin ? "Sign In" : "Sign Up"}
          </Button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or</span></div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading}>
          {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 23.4 172.9 61.9l-76.2 64.5C308.6 106.5 279.2 96 248 96c-88.8 0-160.1 71.1-160.1 160s71.3 160 160.1 160c98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 26.9 3.9 41.4z"></path></svg>}
          Sign in with Google
        </Button>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-sm text-primary hover:underline"
          >
            {isLogin
              ? "Don't have an account? Sign up"
              : "Already have an account? Log in"}
          </button>
        </div>

        <div className="mt-6">
          <Link to="/">
            <Button variant="outline" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default Auth;
