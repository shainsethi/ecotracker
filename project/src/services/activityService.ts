export interface Activity {
  id: string;
  userId: string;
  item: string;
  category: string;
  quantity: number;
  date: string;
  centerId?: string;
  centerName?: string;
  co2Saved: number;
}

// CO2 savings per kg of different e-waste categories (in kg CO2)
const CO2_SAVINGS_PER_KG = {
  'Smartphones': 70,
  'Laptops': 85,
  'Tablets': 65,
  'Batteries': 12,
  'Cables': 8,
  'Printers': 45,
  'Monitors': 90,
  'TVs': 100,
  'Others': 30
};

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

class ActivityService {
  private activities: Activity[] = [
    {
      id: '1',
      userId: 'user-1',
      item: 'iPhone 12',
      category: 'Smartphones',
      quantity: 1,
      date: '2024-01-15',
      centerId: 'center-1',
      centerName: 'Green Tech Recycling',
      co2Saved: 1.4
    },
    {
      id: '2',
      userId: 'user-1',
      item: 'MacBook Pro',
      category: 'Laptops',
      quantity: 1,
      date: '2024-01-10',
      centerId: 'center-2',
      centerName: 'EcoTech Solutions',
      co2Saved: 2.1
    },
    {
      id: '3',
      userId: 'user-1',
      item: 'Old TV',
      category: 'TVs',
      quantity: 1,
      date: '2024-01-08',
      centerId: 'center-1',
      centerName: 'Green Tech Recycling',
      co2Saved: 3.2
    },
    {
      id: '4',
      userId: 'admin-1',
      item: 'Office Printer',
      category: 'Printers',
      quantity: 1,
      date: '2024-01-12',
      centerId: 'center-3',
      centerName: 'Sustainable Electronics',
      co2Saved: 1.8
    }
  ];

  async getUserActivities(userId: string): Promise<Activity[]> {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE_URL}/activities`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to fetch activities');
      const data = await res.json();
      type ApiActivity = {
        _id?: string;
        user?: { _id?: string } | string;
        item?: { name?: string; category?: string; quantity?: number } | string;
        disposal?: { date?: string };
        recyclingCenter?: { _id?: string; name?: string } | string;
        environmental?: { co2Saved?: number };
        date?: string;
        category?: string;
        quantity?: number;
        centerId?: string;
        centerName?: string;
        co2Saved?: number;
      };
      const items = (data.activities || []) as ApiActivity[];
      return items.map((a): Activity => {
        const id = (a as { _id?: string; id?: string })._id || (a as { id?: string }).id || String(Math.random());
        const userIdValue = typeof a.user === 'string' ? a.user : (a.user?._id || userId);
        const itemName = typeof a.item === 'string' ? a.item : (a.item?.name || '');
        const category = typeof a.item === 'string' ? (a.category || 'Others') : (a.item?.category || 'Others');
        const quantity = typeof a.item === 'string' ? (a.quantity ?? 1) : (a.item?.quantity ?? 1);
        const date = a.disposal?.date ? new Date(a.disposal.date).toISOString() : (a.date || new Date().toISOString());
        const centerId = typeof a.recyclingCenter === 'string' ? a.recyclingCenter : (a.recyclingCenter?._id || undefined);
        const centerName = typeof a.recyclingCenter === 'string' ? undefined : (a.recyclingCenter?.name || undefined);
        const co2Saved = a.environmental?.co2Saved ?? a.co2Saved ?? 0;
        return { id, userId: userIdValue as string, item: itemName, category, quantity, date, centerId, centerName, co2Saved };
      });
    } catch {
      // fallback to mock
      return this.activities.filter(activity => activity.userId === userId);
    }
  }

  async getAllActivities(): Promise<Activity[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.activities];
  }

  async addActivity(activity: Omit<Activity, 'id' | 'co2Saved'>): Promise<Activity> {
    // Calculate CO2 saved based on category and quantity
    const co2PerKg = CO2_SAVINGS_PER_KG[activity.category as keyof typeof CO2_SAVINGS_PER_KG] || CO2_SAVINGS_PER_KG.Others;
    
    // Estimate weight based on category (in kg)
    const estimatedWeights = {
      'Smartphones': 0.2,
      'Laptops': 2.5,
      'Tablets': 0.7,
      'Batteries': 0.05,
      'Cables': 0.1,
      'Printers': 4.0,
      'Monitors': 6.0,
      'TVs': 15.0,
      'Others': 1.0
    };

    const estimatedWeight = estimatedWeights[activity.category as keyof typeof estimatedWeights] || estimatedWeights.Others;
    const co2Saved = (co2PerKg * estimatedWeight * activity.quantity) / 1000; // Convert to kg CO2

    const newActivity: Activity = {
      ...activity,
      id: 'activity-' + Date.now(),
      co2Saved: Math.round(co2Saved * 100) / 100 // Round to 2 decimal places
    };

    try {
      const token = localStorage.getItem('auth_token');
      const payload: Record<string, unknown> = {
        item: {
          name: activity.item,
          category: activity.category,
          estimatedWeight: estimatedWeight,
          quantity: activity.quantity
        },
        disposal: {
          method: activity.centerId ? 'Recycling Center' : 'Other',
          date: activity.date
        },
        recyclingCenter: activity.centerId || undefined,
        environmental: { co2Saved }
      };
      const res = await fetch(`${API_BASE_URL}/activities`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to create activity');
      const data = await res.json();
      type ApiActivity = {
        _id: string;
        user?: { _id?: string } | string;
        item?: { name?: string; category?: string; quantity?: number };
        disposal?: { date?: string };
        recyclingCenter?: { _id?: string; name?: string } | string;
        environmental?: { co2Saved?: number };
        category?: string;
        quantity?: number;
      };
      const a = data.activity as ApiActivity;
      const id = a._id;
      const userIdValue = typeof a.user === 'string' ? a.user : (a.user?._id || activity.userId);
      const itemName = typeof a.item === 'string' ? a.item : (a.item?.name || activity.item);
      const category = typeof a.item === 'string' ? (a.category || activity.category) : (a.item?.category || activity.category);
      const quantity = typeof a.item === 'string' ? (a.quantity ?? activity.quantity) : (a.item?.quantity ?? activity.quantity);
      const date = a.disposal?.date ? new Date(a.disposal.date).toISOString() : activity.date;
      const centerId = typeof a.recyclingCenter === 'string' ? a.recyclingCenter : (a.recyclingCenter?._id || activity.centerId);
      const centerName = typeof a.recyclingCenter === 'string' ? activity.centerName : (a.recyclingCenter?.name || activity.centerName);
      const co2 = a.environmental?.co2Saved ?? co2Saved;
      return { id, userId: userIdValue as string, item: itemName, category, quantity, date, centerId, centerName, co2Saved: co2 };
    } catch {
      // Fallback to local mock append
      this.activities.unshift(newActivity);
      await new Promise(resolve => setTimeout(resolve, 300));
      return newActivity;
    }
  }

  async deleteActivity(activityId: string, userId: string): Promise<void> {
    try {
      const token = localStorage.getItem('auth_token');
      const res = await fetch(`${API_BASE_URL}/activities/${activityId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        }
      });
      if (!res.ok) throw new Error('Failed to delete');
    } catch {
      // best-effort local removal
      const index = this.activities.findIndex(
        activity => activity.id === activityId && activity.userId === userId
      );
      if (index !== -1) this.activities.splice(index, 1);
      await new Promise(resolve => setTimeout(resolve, 300));
    }
  }

  getCategories(): string[] {
    return Object.keys(CO2_SAVINGS_PER_KG);
  }
}

export const activityService = new ActivityService();