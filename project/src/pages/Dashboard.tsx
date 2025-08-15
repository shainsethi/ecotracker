import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { TrendingUp, Recycle, Leaf, Award, Calendar, Target } from 'lucide-react';
import { activityService } from '../services/activityService';

const COLORS = ['#059669', '#10B981', '#34D399', '#6EE7B7', '#A7F3D0'];

export default function Dashboard() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<any[]>([]);
  const [stats, setStats] = useState({
    totalItems: 0,
    co2Saved: 0,
    monthlyItems: 0,
    streak: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const userActivities = await activityService.getUserActivities(user?.id || '1');
      setActivities(userActivities);
      
      // Calculate stats
      const totalItems = userActivities.length;
      const co2Saved = userActivities.reduce((sum, activity) => sum + activity.co2Saved, 0);
      const currentMonth = new Date().getMonth();
      const monthlyItems = userActivities.filter(activity => 
        new Date(activity.date).getMonth() === currentMonth
      ).length;

      setStats({
        totalItems,
        co2Saved: Math.round(co2Saved * 100) / 100,
        monthlyItems,
        streak: 7 // Mock streak data
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const categoryData = activities.reduce((acc: any[], activity: any) => {
    const existing = acc.find(item => item.category === activity.category);
    if (existing) {
      existing.count += 1;
      existing.co2 += activity.co2Saved;
    } else {
      acc.push({
        category: activity.category,
        count: 1,
        co2: activity.co2Saved
      });
    }
    return acc;
  }, []);

  const monthlyData: { month: string; items: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const date = new Date();
    date.setMonth(date.getMonth() - i);
    const month = date.toLocaleDateString('en', { month: 'short' });
    const count = activities.filter(activity => {
      const activityDate = new Date(activity.date);
      return activityDate.getMonth() === date.getMonth() && 
             activityDate.getFullYear() === date.getFullYear();
    }).length;
    monthlyData.push({ month, items: count });
  }

  const impactData = [
    { name: 'CO₂ Saved (kg)', value: stats.co2Saved, icon: Leaf, color: 'text-green-600' },
    { name: 'Items Recycled', value: stats.totalItems, icon: Recycle, color: 'text-blue-600' },
    { name: 'This Month', value: stats.monthlyItems, icon: Calendar, color: 'text-purple-600' },
    { name: 'Day Streak', value: stats.streak, icon: Award, color: 'text-orange-600' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's your environmental impact overview
        </p>
      </div>

      {/* Impact Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {impactData.map((item, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{item.name}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{item.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-gray-100 ${item.color}`}>
                <item.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Monthly Activity Chart */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Monthly Activity</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="items" stroke="#059669" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Target className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold text-gray-800">Category Breakdown</h2>
          </div>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ category, count }) => `${category}: ${count}`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="count"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-64 text-gray-500">
              <div className="text-center">
                <Recycle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>No recycling activities yet</p>
                <p className="text-sm">Start logging your e-waste to see insights</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Recent Activities</h2>
        {activities.length > 0 ? (
          <div className="space-y-4">
            {activities.slice(0, 5).map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Recycle className="h-5 w-5 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{activity.item}</p>
                    <p className="text-sm text-gray-600">{activity.category}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-green-600">
                    +{activity.co2Saved.toFixed(2)} kg CO₂
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(activity.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <Recycle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <p className="text-gray-600">No activities logged yet</p>
            <p className="text-sm text-gray-500">Start by finding a recycling center and logging your first item!</p>
          </div>
        )}
      </div>
    </div>
  );
}