import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Package, Users, DollarSign, TrendingUp, Loader2, MessageSquare } from "lucide-react";
import { products } from "@/lib/mockData";
import { toast } from "sonner";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, collection, onSnapshot, query, orderBy, limit, collectionGroup } from "firebase/firestore";
import { auth, db } from "@/integrations/firebase/client";

interface Stats {
  totalUsers: number;
  totalMessages: number;
  totalRevenue: number; // Mock data for now
}

const Admin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState<Stats>({ totalUsers: 0, totalMessages: 0, totalRevenue: 24560 });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // User is logged in, now check the role
        await checkAdminRole(user);
      } else {
        // User is not logged in
        toast.error("You must be logged in to access this page");
        navigate("/auth");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const checkAdminRole = async (user: User) => {
    try {
      // Checking user role from 'users' collection in Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists() && userDocSnap.data().role === "admin") {
        setIsAdmin(true);
      } else {
        toast.error("Access denied. Admin privileges required.");
        navigate("/");
      }
    } catch (error) {
      console.error("Error checking admin role:", error);
      toast.error("Failed to verify admin privileges.");
      navigate("/");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    // Listener to get user count in real-time
    const usersUnsubscribe = onSnapshot(collection(db, "users"), (snapshot) => {
      setStats(prevStats => ({ ...prevStats, totalUsers: snapshot.size }));
    }, (error) => {
      console.error("Error fetching users count:", error);
      toast.error("Could not fetch users count.");
    });

    // Listener to get contact message count in real-time
    const messagesUnsubscribe = onSnapshot(collection(db, "contact_messages"), (snapshot) => {
      setStats(prevStats => ({ ...prevStats, totalMessages: snapshot.size }));
    }, (error) => {
      console.error("Error fetching messages count:", error);
      toast.error("Could not fetch messages count.");
    });

    // Listener for the last 5 orders in real-time
    const ordersQuery = query(
      collectionGroup(db, 'orders'), 
      orderBy('created_at', 'desc'), 
      limit(5)
    );
    const ordersUnsubscribe = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentOrders(ordersData);
    }, (error) => {
      console.error("Error fetching recent orders:", error);
      toast.error("Could not fetch recent orders.");
    });

    // Listener for the last 5 users in real-time
    const usersQuery = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(5));
    const recentUsersUnsubscribe = onSnapshot(usersQuery, (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setRecentUsers(usersData);
    }, (error) => {
      console.error("Error fetching recent users:", error);
      toast.error("Could not fetch recent users.");
    });

    // Real-time data listener for the sales chart
    const salesQuery = query(collectionGroup(db, 'orders'), orderBy('created_at', 'asc'));
    const salesUnsubscribe = onSnapshot(salesQuery, (snapshot) => {
      const monthlySales: { [key: string]: number } = {};

      snapshot.docs.forEach(doc => {
        const order = doc.data();
        if (order.created_at && order.total_amount) {
          const date = order.created_at.toDate();
          const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
          
          if (!monthlySales[monthKey]) {
            monthlySales[monthKey] = 0;
          }
          monthlySales[monthKey] += order.total_amount;
        }
      });

      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const formattedSalesData = Object.keys(monthlySales).map(key => {
        const [year, month] = key.split('-');
        return {
          month: `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`,
          sales: monthlySales[key],
        };
      }).slice(-6); // Showing last 6 months data

      setSalesData(formattedSalesData);
    });

    // Unsubscribe from listeners when the component unmounts
    return () => {
      usersUnsubscribe();
      messagesUnsubscribe();
      ordersUnsubscribe();
      recentUsersUnsubscribe();
      salesUnsubscribe();
    };
  }, [isAdmin]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 text-center flex justify-center items-center h-screen">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-primary" />
        <p className="ml-2 text-lg">Verifying Admin Access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    // Return null to prevent rendering anything before redirecting
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <DollarSign className="h-10 w-10 text-primary" />
            <div>
              <p className="text-2xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
              <p className="text-muted-foreground">Total Revenue</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Users className="h-10 w-10 text-primary" />
            <div>
              <p className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalUsers}</p>
              <p className="text-muted-foreground">Total Users</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <MessageSquare className="h-10 w-10 text-primary" />
            <div>
              <p className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalMessages}</p>
              <p className="text-muted-foreground">Total Messages</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-4">
            <Package className="h-10 w-10 text-primary" />
            <div>
              <p className="text-2xl font-bold">+{products.length}</p>
              <p className="text-muted-foreground">Products</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Sales Chart */}
      <Card className="p-6 mb-12">
        <h2 className="text-2xl font-bold mb-6">Sales Analytics</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" fill="hsl(var(--primary))" />
          </BarChart>
        </ResponsiveContainer>
      </Card>

      {/* Recent Orders */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Recent Orders</h2>
          <Button variant="outline">View All Orders</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Customer</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.billing_name}</TableCell>
                <TableCell>${order.total_amount.toFixed(2)}</TableCell>
                <TableCell>{order.created_at.toDate().toLocaleDateString()}</TableCell>
                <TableCell><span className="bg-green-100 text-green-800 text-xs font-medium me-2 px-2.5 py-0.5 rounded dark:bg-green-900 dark:text-green-300">{order.payment_status}</span></TableCell>
                <TableCell>
                  <Button variant="outline" size="sm">View</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      {/* User Management */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Product Management</h2>
          <Button>Add Product</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Sales</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.slice(0, 5).map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.title}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>{product.reviews}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">Edit</Button>
                    <Button variant="outline" size="sm">Delete</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Admin;
