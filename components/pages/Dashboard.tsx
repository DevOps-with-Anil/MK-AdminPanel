'use client';

import React from 'react';
import { useAdmin } from '@/contexts/AdminContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  TrendingUp, 
  Users, 
  Zap, 
  CheckCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar,
  MoreVertical,
  Download,
  Filter,
  CreditCard,
  Building2,
  ShieldCheck,
  Search,
  Plus,
  Ticket,
  LayoutDashboard
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';

const revenueData = [
  { name: 'Jan', value: 4000, active: 2400 },
  { name: 'Feb', value: 3000, active: 1398 },
  { name: 'Mar', value: 2000, active: 9800 },
  { name: 'Apr', value: 2780, active: 3908 },
  { name: 'May', value: 1890, active: 4800 },
  { name: 'Jun', value: 2390, active: 3800 },
  { name: 'Jul', value: 3490, active: 4300 },
];

const userData = [
  { name: 'Mon', active: 400, total: 2400 },
  { name: 'Tue', active: 300, total: 1398 },
  { name: 'Wed', active: 200, total: 9800 },
  { name: 'Thu', active: 278, total: 3908 },
  { name: 'Fri', active: 189, total: 4800 },
  { name: 'Sat', active: 239, total: 3800 },
  { name: 'Sun', active: 349, total: 4300 },
];

const planData = [
  { name: 'Free', value: 400, color: '#94a3b8' },
  { name: 'Pro', value: 300, color: '#6366f1' },
  { name: 'Enterprise', value: 200, color: '#10b981' },
];

const interactionData = [
  { name: 'Page A', uv: 4000, pv: 2400, amt: 2400 },
  { name: 'Page B', uv: 3000, pv: 1398, amt: 2210 },
  { name: 'Page C', uv: 2000, pv: 9800, amt: 2290 },
  { name: 'Page D', uv: 2780, pv: 3908, amt: 2000 },
  { name: 'Page E', uv: 1890, pv: 4800, amt: 2181 },
  { name: 'Page F', uv: 2390, pv: 3800, amt: 2500 },
  { name: 'Page G', uv: 3490, pv: 4300, amt: 2100 },
];

export default function Dashboard() {
  const { currentUser, currentCountry, hasFeature } = useAdmin();

  const countryNames: Record<string, string> = {
    IN: 'India',
    AE: 'United Arab Emirates',
    US: 'United States',
  };

  const stats = [
    {
      title: 'Total Revenue',
      value: '$128,450',
      change: '+12.5%',
      icon: CreditCard,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-100',
      trend: 'up'
    },
    {
      title: 'Active Tenants',
      value: '1,248',
      change: '+5.2%',
      icon: Building2,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-100',
      trend: 'up'
    },
    {
      title: 'KYB Requests',
      value: '84',
      change: '-2.4%',
      icon: ShieldCheck,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      trend: 'down'
    },
    {
      title: 'Active Users',
      value: '42,892',
      change: '+8.1%',
      icon: Users,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      trend: 'up'
    },
    {
      title: 'New Subscriptions',
      value: '312',
      change: '+15%',
      icon: Plus,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      trend: 'up'
    },
    {
      title: 'Support Tickets',
      value: '27',
      change: '+3%',
      icon: Ticket,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      trend: 'up'
    },
    {
      title: 'Server Uptime',
      value: '99.98%',
      change: '+0.02%',
      icon: Zap,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      trend: 'up'
    },
    {
      title: 'Compliance Status',
      value: '100%',
      change: '0%',
      icon: CheckCircle,
      color: 'text-teal-600',
      bgColor: 'bg-teal-100',
      trend: 'up'
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Overview Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {currentUser.name}. Here's what's happening today.</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-background border border-border rounded-lg hover:bg-accent transition-colors">
            <Calendar size={16} />
            Jan 12, 2026 - Mar 12, 2026
          </button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Download size={16} />
            Export Report
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <Card key={idx} className="border-none shadow-sm bg-card hover:shadow-lg transition-all duration-300 ease-in-out transform hover:-translate-y-1">
              <CardContent className="p-5 flex items-center gap-5">
                <div className={`p-3 rounded-full ${stat.bgColor} ${stat.color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <h3 className="text-2xl font-bold text-foreground">{stat.value}</h3>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Chart Area */}
        <Card className="lg:col-span-8 border-none shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-7">
            <div>
              <CardTitle className="text-lg font-bold">Performance Analytics</CardTitle>
              <CardDescription>Visual representation of growth metrics</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-muted p-1 rounded-lg">
                <button className="px-3 py-1 text-xs font-medium rounded-md bg-background shadow-sm">Revenue</button>
                <button className="px-3 py-1 text-xs font-medium rounded-md hover:text-foreground transition-colors text-muted-foreground">Activity</button>
              </div>
              <button className="p-2 hover:bg-muted rounded-md transition-colors"><MoreVertical size={16} /></button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[380px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.5} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      borderColor: 'hsl(var(--border))',
                      borderRadius: '12px',
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      border: 'none'
                    }}
                    itemStyle={{ fontSize: '12px', fontWeight: '600' }}
                  />
                  <Bar 
                    dataKey="value" 
                    fill="#6366f1"
                    radius={[4, 4, 0, 0]}
                    animationDuration={1500}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Right Sidebar Area */}
        <div className="lg:col-span-4 flex flex-col">
          {/* Pie Chart Card */}
          <Card className="border-none shadow-sm overflow-hidden flex-1 flex flex-col">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-bold">Market Share</CardTitle>
              <CardDescription>Distribution by plan type</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col justify-center">
              <div className="h-[240px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={planData}
                      cx="50%"
                      cy="50%"
                      innerRadius={70}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                      stroke="none"
                    >
                      {planData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3 mt-4">
                {planData.map((entry, index) => (
                  <div key={index} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-default">
                    <div className="flex items-center gap-3">
                      <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                      <span className="text-sm font-medium text-foreground">{entry.name}</span>
                    </div>
                    <span className="text-sm font-bold">{Math.round((entry.value / 900) * 100)}%</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>


        </div>
      </div>

      {/* Bottom Row - Table and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Transactions Table */}
        <Card className="lg:col-span-8 border-none shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-4">
            <div>
              <CardTitle className="text-lg font-bold">Recent Activities</CardTitle>
              <CardDescription>Last 5 system updates</CardDescription>
            </div>
            <button className="text-sm font-medium text-primary hover:underline">View All</button>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {[
                { name: 'Root Admin', action: 'Modified Tenant Settings', time: '12 mins ago', status: 'completed' },
                { name: 'Affiliate X', action: 'New User Registration', time: '45 mins ago', status: 'pending' },
                { name: 'System', action: 'Database Optimization', time: '2 hours ago', status: 'completed' },
                { name: 'Admin Y', action: 'Updated CMS Articles', time: '5 hours ago', status: 'completed' },
                { name: 'Manager Z', action: 'Security Audit Performed', time: '1 day ago', status: 'failed' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-all duration-200 group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-sm text-muted-foreground group-hover:bg-background transition-colors">
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.action}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-medium text-foreground">{item.time}</p>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      item.status === 'completed' ? 'bg-emerald-50 text-emerald-600' : 
                      item.status === 'pending' ? 'bg-orange-50 text-orange-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Weekly Progress Card */}
        <Card className="lg:col-span-4 border-none shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg font-bold">Platform Status</CardTitle>
            <CardDescription>Live system performance</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {[
              { label: 'API Health', value: 98, color: 'bg-emerald-500' },
              { label: 'Server Load', value: 42, color: 'bg-indigo-500' },
              { label: 'Storage Usage', value: 65, color: 'bg-orange-500' },
            ].map((item, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-muted-foreground">{item.label}</span>
                  <span className="font-bold">{item.value}%</span>
                </div>
                <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${item.color} rounded-full transition-all duration-1000 ease-out`} 
                    style={{ width: `${item.value}%` }} 
                  />
                </div>
              </div>
            ))}
            <div className="pt-4 border-t border-border mt-4">
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">System Protected</p>
                  <p className="text-[10px] text-muted-foreground uppercase">Last scan: 5 mins ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
