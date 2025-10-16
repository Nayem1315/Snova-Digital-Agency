
import React, { useState, useEffect, useCallback } from 'react';
// Using Lucide icons for the navigation and dashboard elements
import { Home, ShoppingBag, Download, User, Heart, LogOut, Edit, Menu, CheckCircle, Loader2, XCircle } from 'lucide-react';
import { getAuth, signOut, updatePassword, EmailAuthProvider, reauthenticateWithCredential, onAuthStateChanged, User as FirebaseAuthUser } from 'firebase/auth';
import { getFirestore, doc, collection, onSnapshot, updateDoc, setDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';
import { signInWithCustomToken, signInAnonymously } from 'firebase/auth';
import { toast } from 'sonner';

// Mock useNavigate for single-file environment compatibility
const useNavigate = () => {
    // Mock implementation for navigation
    return (path: string) => {
        console.log(`Navigation Mock: Attempting to navigate to ${path}`);
    };
};
// --- MOCK UI COMPONENTS (To prevent 'Element type is invalid' errors) ---

// Basic Card Mock
const Card = (props: any) => <div className={`rounded-xl border bg-card text-card-foreground shadow ${props.className || ''}`}>{props.children}</div>;
const Button = (props: any) => (
    <button 
        className={`inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 h-10 px-4 py-2 ${props.variant === 'outline' ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground' : 'bg-primary text-primary-foreground hover:bg-primary/90'} ${props.className || ''}`}
        onClick={props.onClick}
        disabled={props.disabled}
        type={props.type || 'button'}
    >
        {props.children}
    </button>
);
// Basic Input Mock
const Input = (props: any) => <input className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" {...props} />;
const Label = (props: any) => <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 block mb-1" {...props} />;
// Basic Switch Mock
const Switch = (props: any) => (
    <button 
        role="switch" 
        className={`inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${props.checked ? 'bg-primary' : 'bg-input'}`}
        onClick={() => props.onCheckedChange(!props.checked)}
    >
        <span className={`pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform ${props.checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </button>
);

// --- GLOBAL FIREBASE SETUP (Mandatory for Immersive Environment) ---
import { firebaseConfig, app, auth, db } from '../integrations/firebase/client';
// Use firebaseConfig, app, auth, db as imported from the firebase client module
const initialAuthToken = null; // Set to null or retrieve from a secure source
const appId = firebaseConfig.appId || 'default-app-id'; // Use appId from config or fallback

const NAV_ITEMS = [
  { name: 'Dashboard', icon: Home, key: 'dashboard' },
  { name: 'Orders', icon: ShoppingBag, key: 'orders' },
  { name: 'Downloads', icon: Download, key: 'downloads' },
  { name: 'Account Details', icon: User, key: 'account' },
  { name: 'Wishlist', icon: Heart, key: 'wishlist' },
];

interface UserProfile {
  name: string;
  email: string;
  uid: string;
}

interface Activity {
  id: string;
  date: string; // ISO string
  total_amount: number;
  payment_status: 'completed' | 'processing' | 'cancelled';
  order_items: any[];
}

// --- HELPER FUNCTIONS ---
const getStatusClasses = (status: string) => {
    switch (status) {
        case 'completed': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        case 'processing': return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
        default: return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
    }
};

// --- COMPONENTS ---

/**
 * Renders the primary navigation sidebar.
 */
const Sidebar = ({ activeKey, setActiveKey, isDarkMode, toggleDarkMode, toggleSidebar, isSidebarOpen, user }: { activeKey: string, setActiveKey: (key: string) => void, isDarkMode: boolean, toggleDarkMode: () => void, toggleSidebar: (force?: boolean) => void, isSidebarOpen: boolean, user: UserProfile }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    if (auth) {
        await signOut(auth);
        toast.success("Signed out successfully");
        navigate("/");
    }
  };

  return (
    <div className={`
      fixed inset-y-0 left-0 z-40
      transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      md:relative md:translate-x-0
      w-64 p-5
      bg-white dark:bg-gray-800 border-r dark:border-gray-700
      transition-transform duration-300 ease-in-out
    `}>
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Welcome, {user.name.split(' ')[0] || user.email}</p>
      </div>

      <nav className="space-y-2">
        {NAV_ITEMS.map(item => (
          <div
            key={item.key}
            onClick={() => { setActiveKey(item.key); toggleSidebar(false); }}
            className={`
              flex items-center p-3 rounded-xl cursor-pointer transition-colors
              ${activeKey === item.key
                ? 'bg-blue-600 text-white shadow-lg'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'
              }
            `}
          >
            <item.icon className="w-5 h-5 mr-3" />
            <span className="font-medium text-sm">{item.name}</span>
          </div>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="mt-8">
        <button
          onClick={handleSignOut}
          className="w-full py-3 bg-red-100 text-red-600 font-semibold rounded-xl hover:bg-red-200 transition-colors"
        >
          <LogOut className="inline w-5 h-5 mr-2" />
          Logout
        </button>
      </div>

      {/* Dark Mode Toggle */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-xl">
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">Dark Mode</span>
        <Switch checked={isDarkMode} onCheckedChange={toggleDarkMode} />
      </div>
    </div>
  );
};

/**
 * Renders a single statistic card.
 */
const StatCard = ({ title, value, accentClass, isDot = false }: { title: string, value: string | number, accentClass: string, isDot?: boolean }) => (
  <Card className="p-4 flex flex-col justify-between h-full bg-white dark:bg-gray-800">
    <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
    <div className="flex items-center mt-1">
      <span className="text-2xl font-bold">
        {value}
      </span>
      {isDot && <div className={`ml-2 w-2.5 h-2.5 rounded-full ${accentClass}`}></div>}
    </div>
  </Card>
);

/**
 * Renders a compact address card.
 */
const AddressCard = ({ title, name, address }: { title: string, name: string, address: string }) => (
    <Card className="p-4 bg-white dark:bg-gray-800">
      <h4 className="font-medium mb-2">{title}</h4>
      <p className="text-sm font-semibold">{name}</p>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">{address}</p>
      <Button variant="link" className="text-blue-600 p-0 h-auto flex items-center hover:underline">
        <Edit className="w-3 h-3 mr-1" />
        Edit
      </Button>
    </Card>
);


/**
 * Renders the main content area of the dashboard.
 */
const DashboardSummary = ({ user, activities }: { user: UserProfile, activities: Activity[] }) => {
  const totalOrders = activities.length;
  const totalSpent = activities.reduce((sum, act) => sum + act.total_amount, 0);

  // Sorting activities to get the latest first
  const sortedActivities = [...activities].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const statsData = [
    { title: 'Total Orders', value: totalOrders, accentClass: 'text-yellow-500', isDot: false },
    { title: 'Active Orders', value: activities.filter(a => a.payment_status === 'processing').length, accentClass: 'bg-yellow-500', isDot: true },
    { title: 'Total Spent', value: `$${totalSpent.toFixed(2)}`, accentClass: 'text-gray-500', isDot: false },
    { title: 'Last Order', value: totalOrders > 0 ? new Date(sortedActivities[0].date).toLocaleDateString() : 'N/A', accentClass: 'text-gray-500', isDot: false },
  ];

  return (
    <div className="space-y-8">
      
      {/* -------------------- HEADER / WELCOME -------------------- */}
      <Card className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between bg-white dark:bg-gray-800">
        <div className="flex items-center mb-4 sm:mb-0">
          <div className="w-10 h-10 rounded-full mr-4 bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
            {user.name.charAt(0)}
          </div>
          <div>
            <h2 className="text-xl font-semibold">Welcome back, {user.name.split(' ')[0] || user.email}!</h2>
            <p className='text-sm text-gray-500 dark:text-gray-400'>{user.email}</p>
          </div>
        </div>
        <div className="flex items-center text-sm font-medium text-green-600">
          <CheckCircle className="w-4 h-4 mr-1" />
          <span>Profile Loaded</span>
        </div>
      </Card>

      {/* -------------------- STATS GRID -------------------- */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsData.map((stat, index) => (
          <StatCard key={index} {...stat} />
        ))}
        <div className="col-span-2 lg:col-span-1 flex space-x-4 lg:space-x-0 lg:flex-col lg:space-y-4">
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                <ShoppingBag className="inline w-4 h-4 mr-1"/> View Orders
            </Button>
            <Button variant="outline" className="flex-1 border-gray-300 dark:border-gray-600">
                <Edit className="inline w-4 h-4 mr-1"/> Edit Account
            </Button>
        </div>
      </div>

      {/* -------------------- RECENT ORDERS -------------------- */}
      <Card className="p-6 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold mb-4">Recent Orders ({totalOrders})</h3>

        {totalOrders === 0 ? (
            <p className="text-gray-500 dark:text-gray-400 text-center py-8">No recent orders found.</p>
        ) : (
            <>
                <div className="mb-4 space-y-2">
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <span className="flex items-center mr-4"><div className="w-2 h-2 rounded-full bg-blue-500 mr-1"></div> Processing</span>
                        <span className="flex items-center mr-4"><div className="w-2 h-2 rounded-full bg-green-500 mr-1"></div> Completed</span>
                        <span className="flex items-center mr-4"><div className="w-2 h-2 rounded-full bg-red-500 mr-1"></div> Cancelled</span>
                    </div>
                </div>

                <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {sortedActivities.slice(0, 3).map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">#{order.id.substring(0, 7)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.payment_status)}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">${order.total_amount.toFixed(2)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {order.order_items.length} item(s)
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-blue-600 hover:underline">
                                            View Details
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </>
        )}
      </Card>

      {/* -------------------- WISHLIST & ADDRESS -------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AddressCard title="Billing Address (Mock)" name={user.name} address="123 Main St, Anytown, USA" />
        <AddressCard title="Shipping Address (Mock)" name={user.name} address="123 Main St, Anytown, USA" />
      </div>
    </div>
  );
};

const OrdersPage = ({ activities }: { activities: Activity[] }) => {
    const [filter, setFilter] = useState('All');
    const filteredOrders = activities.filter(order => filter === 'All' || order.payment_status === filter);
    const countOrders = (status: string) => status === 'All' ? activities.length : activities.filter(o => o.payment_status === status).length;

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold">Your Orders</h2>
            <Card className="p-4 bg-white dark:bg-gray-800">
                <div className="flex flex-wrap gap-3">
                    {['All', 'completed', 'processing', 'cancelled'].map((tab) => (
                        <Button key={tab} onClick={() => setFilter(tab as any)} variant={filter === tab ? 'default' : 'outline'}
                            className={filter === tab ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'border-gray-300 dark:border-gray-600'}
                        >
                            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({countOrders(tab)})
                        </Button>
                    ))}
                </div>
            </Card>
            <Card className="p-6 bg-white dark:bg-gray-800">
                <h3 className="text-lg font-semibold mb-4">{filter} Orders ({filteredOrders.length})</h3>
                <div className="overflow-x-auto rounded-lg border dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Order ID</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Total</th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Items</th>
                                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {filteredOrders.map((order) => (
                                <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">#{order.id.substring(0, 7)}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{new Date(order.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClasses(order.payment_status)}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">${order.total_amount.toFixed(2)}</td>
                                     <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                        {order.order_items.length} item(s)
                                    </td>
                                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <a href="#" className="text-blue-600 hover:underline">
                                            View Details
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {filteredOrders.length === 0 && (
                     <p className="text-gray-500 dark:text-gray-400 text-center py-8">No {filter.toLowerCase()} orders found.</p>
                )}
            </Card>
        </div>
    );
};

const AccountDetailsPage = ({ user }: { user: UserProfile }) => {
    const [details, setDetails] = useState({ ...user, phone: '555-123-4567', address: '123 Main St, Anytown, CA 90210' });
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handlePasswordChange = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            toast.error("New password must be at least 6 characters.");
            return;
        }
        setLoading(true);
        try {
            if (auth && auth.currentUser && auth.currentUser.email) {
                const credential = EmailAuthProvider.credential(auth.currentUser.email, currentPassword);
                await reauthenticateWithCredential(auth.currentUser, credential);
                await updatePassword(auth.currentUser, newPassword);
                toast.success("Password updated successfully!");
                setCurrentPassword('');
                setNewPassword('');
            }
        } catch (error: any) {
            toast.error(error.code === 'auth/wrong-password' ? 'Incorrect current password.' : 'Failed to update password.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold">Account Details</h2>
            <Card className="p-6 bg-white dark:bg-gray-800">
                <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
                    <h3 className="text-xl font-semibold">Profile Information</h3>
                    <Button onClick={() => setIsEditing(prev => !prev)} variant="outline" className="border-gray-300 dark:border-gray-600">
                        {isEditing ? 'Cancel' : <><Edit className="w-4 h-4 mr-1" /> Edit Profile</>}
                    </Button>
                </div>
                {/* Profile fields would go here */}
                <h3 className="text-xl font-semibold mt-8 mb-4 border-b pb-4 dark:border-gray-700">Password</h3>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                    <div>
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input id="currentPassword" type="password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} required />
                    </div>
                    <div>
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input id="newPassword" type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required />
                    </div>
                    <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                        {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </Card>
        </div>
    );
};

const MainContent = ({ activeKey, user, activities }: { activeKey: string } & { user: UserProfile, activities: Activity[] }) => {
    return (
        <div className="flex-1 p-4 md:p-8 min-h-screen">
            {activeKey === 'dashboard' && <DashboardSummary user={user} activities={activities} />}
            {activeKey === 'orders' && <OrdersPage activities={activities} />}
            {activeKey === 'account' && <AccountDetailsPage user={user} />}
            {/* Other pages can be added here */}
        </div>
    );
};


// --- MAIN FIREBASE WRAPPER COMPONENT ---

export const UserDashboard = () => { 
    // NOTE: useNavigate is now defined as a mock function outside the component
    const navigate = useNavigate(); 
    const [firebaseUser, setFirebaseUser] = useState<FirebaseAuthUser | null | undefined>(undefined);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [activeKey, setActiveKey] = useState('dashboard');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    // 1. Firebase Auth Setup and Listener
    useEffect(() => {
        if (!auth) {
            setFirebaseUser(null);
            return;
        }

        if (initialAuthToken) {
            signInWithCustomToken(auth, initialAuthToken).catch(e => {
                console.error("Custom token sign-in failed:", e);
                signInAnonymously(auth); // Fallback to anonymous
            });
        } else {
             signInAnonymously(auth);
        }

        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setFirebaseUser(user);
            } else {
                setFirebaseUser(null);
                toast.error("You must be logged in to access the dashboard.");
                navigate('/auth');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    // 2. Data Fetching (Orders) using onSnapshot
    useEffect(() => {
        if (!db || !firebaseUser) return;
        
        const ordersCollectionPath = `artifacts/${appId}/users/${firebaseUser.uid}/orders`;
        const q = collection(db, ordersCollectionPath); // No orderBy to avoid index errors

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const fetchedActivities: Activity[] = [];
            snapshot.forEach((doc) => {
                const data = doc.data();
                // Ensure data structure matches Activity interface
                const activity: Activity = {
                    id: doc.id,
                    date: data.created_at || new Date().toISOString(), 
                    total_amount: data.total_amount || 0,
                    payment_status: data.payment_status || 'processing',
                    order_items: data.order_items || [],
                };
                fetchedActivities.push(activity);
            });
            // Sort by date before setting state (newest first)
            fetchedActivities.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
            setActivities(fetchedActivities);
        }, (error) => {
            console.error("Error fetching orders:", error);
            toast.error("Failed to load your order history.");
        });

        return () => unsubscribe();
    }, [db, firebaseUser]);

    // 3. Dark Mode Setup
    useEffect(() => {
      const savedMode = localStorage.getItem('darkMode') === 'true';
      setIsDarkMode(savedMode);
      if (savedMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, []);
  
    const toggleDarkMode = () => {
      const newMode = !isDarkMode;
      setIsDarkMode(newMode);
      localStorage.setItem('darkMode', newMode.toString());
      if (newMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };
  
    const toggleSidebar = (force?: boolean) => {
      setIsSidebarOpen(prev => force !== undefined ? force : !prev);
    }
  
    // 4. Loading/Authentication State
    if (firebaseUser === undefined) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 font-[Inter]">
            <Loader2 className="mr-2 h-8 w-8 animate-spin text-blue-600" />
            <p className="ml-2 text-xl text-gray-700 dark:text-gray-300">Loading Dashboard...</p>
        </div>
      );
    }
    
    // If not logged in (and redirected), just show nothing to avoid flash of content
    if (!firebaseUser) {
        return null; 
    }

    // Default mock name/email if not available from Firebase Auth
    const userProfile: UserProfile = {
        name: firebaseUser.displayName || firebaseUser.email || 'Dashboard User',
        email: firebaseUser.email || 'No email provided',
        uid: firebaseUser.uid,
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 font-[Inter] flex flex-col md:flex-row relative">

            {/* Mobile Sidebar Toggle Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-blue-600 text-white rounded-full shadow-lg transition-transform hover:rotate-6"
                onClick={() => toggleSidebar()}
                aria-label="Toggle Sidebar"
            >
                <Menu className="w-6 h-6" />
            </button>

            {/* Sidebar (Wrapped in container for desktop sizing) */}
            <div className='md:w-64 flex-shrink-0'>
                <Sidebar
                    activeKey={activeKey}
                    setActiveKey={setActiveKey}
                    isDarkMode={isDarkMode}
                    toggleDarkMode={toggleDarkMode}
                    toggleSidebar={toggleSidebar}
                    isSidebarOpen={isSidebarOpen}
                    user={userProfile}
                />
            </div>

            {/* Overlay for mobile view when sidebar is open */}
            {isSidebarOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black opacity-50 z-30"
                    onClick={() => toggleSidebar(false)}
                />
            )}

            {/* Main Content Area */}
            <MainContent activeKey={activeKey} user={userProfile} activities={activities} />
        </div>
    );
};
export default UserDashboard;