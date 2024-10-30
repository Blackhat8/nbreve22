import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  email: string;
  type: 'client' | 'messenger';
  vehicle?: 'moto' | 'carro';
  location?: {
    lat: number;
    lng: number;
  };
}

interface Delivery {
  id: string;
  clientId: string;
  messengerId?: string;
  pickup: {
    address: string;
    lat: number;
    lng: number;
  };
  dropoff: {
    address: string;
    lat: number;
    lng: number;
  };
  status: 'pending' | 'accepted' | 'pickup' | 'transit' | 'delivered';
  price: number;
  distance: number;
  createdAt: Date;
  rating?: number;
}

interface Notification {
  id: string;
  userId: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

interface Store {
  user: User | null;
  deliveries: Delivery[];
  notifications: Notification[];
  locationEnabled: boolean;
  locationDenied: boolean;
  setUser: (user: User | null) => void;
  addDelivery: (delivery: Delivery) => void;
  updateDelivery: (id: string, updates: Partial<Delivery>) => void;
  updateUserLocation: (location: { lat: number; lng: number }) => void;
  setLocationEnabled: (enabled: boolean) => void;
  setLocationDenied: (denied: boolean) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationAsRead: (id: string) => void;
  clearNotifications: () => void;
  logout: () => void;
}

export const useStore = create<Store>()(
  persist(
    (set) => ({
      user: null,
      deliveries: [],
      notifications: [],
      locationEnabled: false,
      locationDenied: false,
      setUser: (user) => set({ user }),
      addDelivery: (delivery) =>
        set((state) => ({ deliveries: [...state.deliveries, delivery] })),
      updateDelivery: (id, updates) =>
        set((state) => ({
          deliveries: state.deliveries.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        })),
      updateUserLocation: (location) =>
        set((state) => ({
          user: state.user ? { ...state.user, location } : null,
          locationEnabled: true,
        })),
      setLocationEnabled: (enabled) => set({ locationEnabled: enabled }),
      setLocationDenied: (denied) => set({ locationDenied: denied }),
      addNotification: (notification) =>
        set((state) => ({
          notifications: [
            {
              ...notification,
              id: crypto.randomUUID(),
              createdAt: new Date(),
              read: false,
            },
            ...state.notifications,
          ],
        })),
      markNotificationAsRead: (id) =>
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        })),
      clearNotifications: () => set({ notifications: [] }),
      logout: () => set({
        user: null,
        deliveries: [],
        notifications: [],
        locationEnabled: false,
        locationDenied: false,
      }),
    }),
    {
      name: 'nbreve-storage',
    }
  )
);