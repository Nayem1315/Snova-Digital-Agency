import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Bell, Users, DollarSign, ShoppingCart, Activity, Settings, Search, Loader2, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import { collection, collectionGroup, onSnapshot, query, orderBy, limit, getCountFromServer } from "firebase/firestore";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface Stats {
  totalUsers: number;
  revenue: number;
  newOrders: number;
  activeSessions: number;
  growthRate: string;
}

interface AdminDashboardProps {
  db: any; // Firestore instance
  userId: string;
  stats: Stats;
}

const AdminDashboard = ({ db, userId, stats: initialStats }: AdminDashboardProps) => {
  const [stats, setStats] = useState(initialStats);
  const [recentActivities, setRecentActivities] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [salesChartData, setSalesChartData] = useState<any[]>([]);

  useEffect(() => {
    const listeners: (() => void)[] = [];

    // KPI Listeners
    const usersRef = collection(db, "users");
    listeners.push(onSnapshot(usersRef, (snapshot) => setStats(s => ({ ...s, totalUsers: snapshot.size }))));

    const ordersRef = collectionGroup(db, "orders");
    listeners.push(onSnapshot(ordersRef, (snapshot) => {
      let totalRevenue = 0;
      snapshot.forEach(doc => {
        totalRevenue += doc.data().total_amount || 0;
      });
      setStats(s => ({ ...s, revenue: totalRevenue, newOrders: snapshot.size }));
    }));

    // Recent Activity Listener (last 5 orders)
    const activityQuery = query(collectionGroup(db, "orders"), orderBy("created_at", "desc"), limit(5));
    listeners.push(onSnapshot(activityQuery, (snapshot) => {
      const activities = snapshot.docs.map(doc => ({
        id: doc.id,
        user: doc.data().billing_name,
        action: "New Order",
        details: `#${doc.id.substring(0, 7).toUpperCase()}`,
        date: doc.data().created_at.toDate(),
      }));
      setRecentActivities(activities);
    }));

    // Top Products (Simulated for now, requires complex aggregation)
    const productsQuery = query(collectionGroup(db, "orders"), limit(20));
    listeners.push(onSnapshot(productsQuery, (snapshot) => {
      const productSales: { [key: string]: { name: string; sales: number; revenue: number } } = {};
      snapshot.docs.forEach(doc => {
        const orderItems = doc.data().order_items || [];
        orderItems.forEach((item: any) => {
          if (!productSales[item.product_id]) {
            productSales[item.product_id] = { name: item.product_title, sales: 0, revenue: 0 };
          }
          productSales[item.product_id].sales += item.quantity;
          productSales[item.product_id].revenue += item.product_price * item.quantity;
        });
      });
      const sortedProducts = Object.values(productSales).sort((a, b) => b.sales - a.sales).slice(0, 3);
      setTopProducts(sortedProducts);
      setLoading(false);
    }));

    // Sales Chart Data Listener
    const salesQuery = query(collectionGroup(db, 'orders'), orderBy('created_at', 'asc'));
    listeners.push(onSnapshot(salesQuery, (snapshot) => {
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
      const formattedData = Object.keys(monthlySales).map(key => {
        const [year, month] = key.split('-');
        return { name: `${monthNames[parseInt(month) - 1]} '${year.slice(2)}`, sales: monthlySales[key] };
      }).slice(-6); // Last 6 months data

      setSalesChartData(formattedData);
    }));

    return () => {
      listeners.forEach(unsubscribe => unsubscribe());
    };
  }, [db]);

  return (
    <div className="bg-muted/40 min-h-screen p-4 sm:p-6 md:p-8">
      <div className="max-w-screen-2xl mx-auto">
        {/* Header */}
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, Admin!</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-9" />
            </div>
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : stats.totalUsers.toLocaleString()}</div>
                  <p className="text-xs text-muted-foreground">+10.5% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `$${stats.revenue.toLocaleString()}`}</div>
                  <p className="text-xs text-muted-foreground">+20.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `+${stats.newOrders}`}</div>
                  <p className="text-xs text-muted-foreground">+180.1% from last month</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Active Now</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{loading ? <Loader2 className="h-6 w-6 animate-spin" /> : `+${stats.activeSessions}`}</div>
                  <p className="text-xs text-muted-foreground">+19% from last hour</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">Growth Rate</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold flex items-center gap-2">{stats.growthRate} <TrendingUp className="h-6 w-6 text-green-500" /></div>
                  <p className="text-xs text-muted-foreground">vs. last quarter</p>
                </CardContent>
              </Card>
            </div>

            {/* Chart Panels */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Traffic Over Time</CardTitle>
                </CardHeader>
                <CardContent className="h-72 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <p className="text-muted-foreground font-mono">CHART PLACEHOLDER</p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Sales Trends by Month</CardTitle>
                </CardHeader>
                <CardContent className="h-72 flex items-center justify-center border-2 border-dashed rounded-lg">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={salesChartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `$${value / 1000}k`} />
                      <Tooltip cursor={{ fill: 'hsl(var(--muted))' }} />
                      <Bar dataKey="sales" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Recent Activity / Product Management */}
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
                <CardDescription>Top selling products this month.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Sales</TableHead>
                      <TableHead>Revenue</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {topProducts.map((product) => (
                      <TableRow key={product.id}>
                        <TableCell className="font-medium">{product.name || 'Unknown Product'}</TableCell>
                        <TableCell>{product.sales}</TableCell>
                        <TableCell>${product.revenue.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Settings & Alerts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <label htmlFor="maintenance-mode" className="text-sm font-medium">Maintenance Mode</label>
                  <Switch id="maintenance-mode" />
                </div>
                <div className="flex items-center justify-between">
                  <label htmlFor="email-notifications" className="text-sm font-medium">Email Notifications</label>
                  <Switch id="email-notifications" checked />
                </div>
                <Button className="w-full">System Health Check</Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex items-start gap-3">
                    <div className="bg-primary/10 text-primary p-2 rounded-full"><Activity className="h-4 w-4" /></div>
                    <div>
                      <p className="text-sm font-medium">{activity.action} by {activity.user}</p>
                      <p className="text-xs text-muted-foreground">{new Date(activity.date).toLocaleTimeString()}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
};
export default AdminDashboard;