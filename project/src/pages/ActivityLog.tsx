import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { activityService, Activity } from '../services/activityService';
import { centerService, RecyclingCenter } from '../services/centerService';
import { Plus, Calendar, Trash2, Recycle, Leaf, Package } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ActivityLog() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [formData, setFormData] = useState({
    item: '',
    category: '',
    quantity: 1,
    centerId: '',
    date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [userActivities, recyclingCenters] = await Promise.all([
        activityService.getUserActivities(user?.id || ''),
        centerService.getAllCenters()
      ]);
      setActivities(userActivities);
      setCenters(recyclingCenters);
    } catch (error) {
      console.error('Failed to load data:', error);
      toast.error('Failed to load activities.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.item || !formData.category) {
      toast.error('Please fill in all required fields.');
      return;
    }

    try {
      const selectedCenter = centers.find(c => c.id === formData.centerId);
      const newActivity = await activityService.addActivity({
        userId: user?.id || '',
        item: formData.item,
        category: formData.category,
        quantity: formData.quantity,
        date: formData.date,
        centerId: formData.centerId || undefined,
        centerName: selectedCenter?.name || undefined
      });

      setActivities([newActivity, ...activities]);
      setShowAddForm(false);
      setFormData({
        item: '',
        category: '',
        quantity: 1,
        centerId: '',
        date: new Date().toISOString().split('T')[0]
      });
      toast.success('Activity logged successfully!');
    } catch (error) {
      console.error('Failed to add activity:', error);
      toast.error('Failed to log activity.');
    }
  };

  const handleDeleteActivity = async (activityId: string) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) {
      return;
    }

    try {
      await activityService.deleteActivity(activityId, user?.id || '');
      setActivities(activities.filter(activity => activity.id !== activityId));
      toast.success('Activity deleted successfully!');
    } catch (error) {
      console.error('Failed to delete activity:', error);
      toast.error('Failed to delete activity.');
    }
  };

  const categories = activityService.getCategories();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Activity Log</h1>
          <p className="text-gray-600 mt-2">Track your e-waste recycling activities</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="h-5 w-5 mr-2" />
          Log Activity
        </button>
      </div>

      {/* Add Activity Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Log Recycling Activity</h2>
            
            <form onSubmit={handleAddActivity} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name *
                </label>
                <input
                  type="text"
                  name="item"
                  required
                  placeholder="e.g., iPhone 12, MacBook Pro"
                  value={formData.item}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category *
                </label>
                <select
                  name="category"
                  required
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  min="1"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recycling Center
                </label>
                <select
                  name="centerId"
                  value={formData.centerId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="">Select center (optional)</option>
                  {centers.map(center => (
                    <option key={center.id} value={center.id}>{center.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Log Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Activities List */}
      {activities.length > 0 ? (
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <Recycle className="h-6 w-6 text-green-600" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-gray-800">{activity.item}</h3>
                      <span className="px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded-full">
                        {activity.category}
                      </span>
                    </div>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2" />
                        <span>Quantity: {activity.quantity}</span>
                      </div>
                      
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span>{new Date(activity.date).toLocaleDateString()}</span>
                      </div>
                      
                      {activity.centerName && (
                        <div className="flex items-center">
                          <Recycle className="h-4 w-4 mr-2" />
                          <span>{activity.centerName}</span>
                        </div>
                      )}
                      
                      <div className="flex items-center text-green-600">
                        <Leaf className="h-4 w-4 mr-2" />
                        <span className="font-medium">+{activity.co2Saved.toFixed(2)} kg CO₂ saved</span>
                      </div>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDeleteActivity(activity.id)}
                  className="text-gray-400 hover:text-red-600 transition-colors p-2"
                  title="Delete activity"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Recycle className="h-16 w-16 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-800 mb-2">No activities logged yet</h3>
          <p className="text-gray-600 mb-4">Start tracking your e-waste recycling impact!</p>
          <button
            onClick={() => setShowAddForm(true)}
            className="inline-flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Log Your First Activity
          </button>
        </div>
      )}
    </div>
  );
}