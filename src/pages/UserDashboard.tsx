// src/pages/UserDashboard.tsx
import React, { useState, useEffect, useRef } from "react";
import {
  CheckCircle,
  Edit,
  Home,
  ShoppingBag,
  Download,
  User,
  Heart,
  LogOut,
  Menu,
  Loader2,
} from "lucide-react";
import { auth, db, storage } from "../integrations/firebase/client"; // Firebase config path
import {
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
  User as FirebaseAuthUser,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from "firebase/auth";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage"; // Step 1: Import storage functions
import { doc, getDoc, setDoc } from "firebase/firestore";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";


interface UserProfile {
  displayName: string | null;
  email: string | null;
}

const AccountDetailsPage: React.FC<{ user: FirebaseAuthUser }> = ({ user }) => {
  const [displayName, setDisplayName] = useState(user.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);

  // Step 2: Add state and refs for photo upload
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [photoLoading, setPhotoLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setPhotoFile(e.target.files[0]);
    }
  };

  const handlePhotoUpload = async () => {
    if (!photoFile) return;
    setPhotoLoading(true);

    const storageRef = ref(storage, `profile_pictures/${user.uid}`);
    const uploadTask = uploadBytesResumable(storageRef, photoFile);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        console.error("Upload failed:", error);
        toast.error("Failed to upload photo. Please try again.");
        setPhotoLoading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          await updateProfile(user, { photoURL: downloadURL });
          const userDocRef = doc(db, "users", user.uid);
          await setDoc(userDocRef, { photoURL: downloadURL }, { merge: true });
          toast.success("Profile picture updated successfully!");
        } catch (error: any) {
          toast.error(`Failed to update profile: ${error.message}`);
        } finally {
          setPhotoLoading(false);
          setPhotoFile(null);
        }
      }
    );
  };

  const handleNameUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setNameLoading(true);
    try {
      await updateProfile(user, { displayName });
      const userDocRef = doc(db, "users", user.uid);
      await setDoc(userDocRef, { fullName: displayName }, { merge: true });
      toast.success("Name updated successfully!");
    } catch (error: any) {
      toast.error(`Failed to update name: ${error.message}`);
    } finally {
      setNameLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword.length < 6) {
      toast.error("New password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
    } catch (error: any) {
      toast.error(error.code === 'auth/wrong-password' ? 'Incorrect current password.' : `Failed to update password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Step 3: Add UI for photo upload */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Update your avatar.</CardDescription>
        </CardHeader>
        <CardContent className="flex items-center gap-6">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/png, image/jpeg"
            hidden
          />
          <div className="relative">
            <img
              src={photoFile ? URL.createObjectURL(photoFile) : user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName || user.email}&background=random`}
              alt="Profile"
              className="w-24 h-24 rounded-full object-cover"
            />
            <Button
              size="icon"
              variant="outline"
              className="absolute bottom-0 right-0 rounded-full h-8 w-8"
              onClick={() => fileInputRef.current?.click()}
              title="Change picture"
            >
              <Edit size={14} />
            </Button>
          </div>
          <div className="flex-1">
            {photoFile && (
              <div className="space-y-2">
                <p className="text-sm font-medium truncate">{photoFile.name}</p>
                {photoLoading && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                  </div>
                )}
                <Button onClick={handlePhotoUpload} disabled={photoLoading}>
                  {photoLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <CheckCircle className="mr-2 h-4 w-4" />}
                  {photoLoading ? 'Uploading...' : 'Save Photo'}
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleNameUpdate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName">Full Name</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={user.email || ""} disabled />
            </div>
            <Button type="submit" disabled={nameLoading}>
              {nameLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Name
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handlePasswordChange} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update Password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

const DashboardSummary: React.FC<{ user: UserProfile | null }> = ({ user }) => (
  <div className="bg-white p-6 rounded-2xl shadow flex items-center gap-4">
    {user ? (
      (user as FirebaseAuthUser).photoURL ? (
      <img
        src={(user as FirebaseAuthUser).photoURL!}
        alt={user.displayName || "Profile"}
        className="w-16 h-16 rounded-full object-cover"
      />
      ) : (
      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-2xl">
        {user.displayName?.[0] || user.email?.[0] || 'G'}
      </div>
      )
    ) : ( // Guest view
      <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
        👤
      </div>
    )}
    <div>
      <h2 className="text-2xl font-bold">
        Welcome, {user?.displayName || user?.email || "Guest"} 👋
      </h2>
      <p className="text-gray-600">
        Here’s your personal dashboard — view your orders, downloads, and more.
      </p>
    </div>
  </div>
);

const UserDashboard: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<FirebaseAuthUser | null>(null);
  const [activeView, setActiveView] = useState("home"); // Step 1: Add state for active view

  // Track Firebase user state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, setUser);
    return unsubscribe;
  }, []);

  // Login with Google
  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
    }
  };

  // Logout
  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
  };

  // Navigation items
  const navItems = [
    { key: "home", name: "Home", icon: <Home size={18} /> },
    { key: "orders", name: "Orders", icon: <ShoppingBag size={18} /> },
    { key: "downloads", name: "Downloads", icon: <Download size={18} /> },
    { key: "account", name: "Account Details", icon: <User size={18} /> },
    { key: "wishlist", name: "Wishlist", icon: <Heart size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } w-64 bg-white shadow-lg transition-transform duration-300 ease-in-out z-40 md:relative md:translate-x-0 flex flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 border-b flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">Dashboard</h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 text-gray-600 hover:text-black"
          >
            ✕
          </button>
        </div>

        {/* Profile Section */}
        <div className="flex items-center gap-3 p-4 border-b">
          {user ? (
            user.photoURL ? (
            <img
              src={user.photoURL}
              alt={user.displayName || "Profile"}
              className="w-12 h-12 rounded-full object-cover"
            />
            ) : (
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700 font-bold text-xl">
              {user.displayName?.[0] || user.email?.[0] || 'G'}
            </div>
            )
          ) : ( // Guest view
            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
              👤
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium">
              {user?.displayName || user?.email || "Guest"}
            </span>
            {!user && (
              <button
                onClick={loginWithGoogle}
                className="text-sm text-blue-500 hover:underline mt-1"
              >
                Login with Google
              </button>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3 flex-1">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => setActiveView(item.key)} // Step 2: Add onClick handler
              className={`flex items-center gap-3 w-full p-3 rounded-lg transition-colors ${
                activeView === item.key
                  ? "bg-blue-600 text-white shadow-md"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
            >
              {item.icon} {item.name}
            </button>
          ))}
        </nav>

        {/* Dark Mode Toggle + Logout */}
        <div className="p-4 border-t mt-auto flex flex-col gap-3">
          {/* Dark Mode Toggle */}
          <button className="flex items-center gap-2 text-gray-700 hover:text-gray-900">
            🌙 Dark Mode
          </button>

          {/* Logout Button */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:text-red-800"
            >
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {/* Hamburger for mobile */}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="md:hidden mb-4 p-2 text-gray-700 hover:text-black"
        >
          <Menu size={22} />
        </button>

        {/* Step 4: Conditionally render content */}
        {activeView === "home" && <DashboardSummary user={user} />}
        {activeView === "account" && user && <AccountDetailsPage user={user} />}
        {/* Placeholder for other views */}
        {activeView === "orders" && <p>Orders page coming soon.</p>}
        {activeView === "downloads" && <p>Downloads page coming soon.</p>}
        {activeView === "wishlist" && <p>Wishlist page coming soon.</p>}
      </main>
    </div>
  );
};

export default UserDashboard;
