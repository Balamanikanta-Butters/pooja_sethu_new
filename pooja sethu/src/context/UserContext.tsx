import React, { createContext, useState, useContext, useEffect } from 'react';
import { apiFetch, getToken, clearToken } from '../utils/validation';
import { API_BASE_URL } from '../utils/apiBaseUrl';

export type FamilyDateItem = {
  id: string;
  title: string;
  subtitle: string;
  type: 'Birthday' | 'Pitru' | 'Family';
};

type ReviewItem = {
  id: number;
  booking: string;
  purohit: string;
  rating: string;
  review: string;
  flag: string;
  flagColor: string;
  status: string;
  statusColor: string;
};

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  gotram?: string;
  janma_nakshatram?: string;
  date_of_birth?: string;
  is_deceased?: boolean;
};

export type SavedAddress = {
  id: string;
  label: string;
  line1: string;
  line2?: string;
  landmark?: string;
  pincode: string;
  is_default?: boolean;
};

export type UserData = {
  mobileNumber: string;
  email?: string;
  name: string;
  familyMembers: FamilyMember[];
  sampradayam: string;
  gotra: string;
  address: string;
  addressLine2?: string;
  landmark?: string;
  addressLabel?: string;
  pincode: string;
  savedAddresses: SavedAddress[];
  familyDates: FamilyDateItem[];
  reviews: ReviewItem[];
};

type UserContextType = {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => Promise<void>;
  addReview: (review: Omit<ReviewItem, 'id'>) => void;
  updateSavedAddress: (address: SavedAddress) => Promise<void>;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>;
  deleteSavedAddress: (id: string) => Promise<void>;
  selectSavedAddress: (id: string) => Promise<void>;
};

const defaultUserData: UserData = {
  mobileNumber: '',
  email: '',
  name: '',
  familyMembers: [],
  sampradayam: '',
  gotra: '',
  address: '',
  addressLine2: '',
  landmark: '',
  addressLabel: '',
  pincode: '',
  savedAddresses: [],
  familyDates: [],
  reviews: [],
};

const UserContext = createContext<UserContextType>({
  userData: defaultUserData,
  updateUserData: () => {},
  clearUserData: async () => {},
  addReview: () => {},
  updateSavedAddress: async () => {},
  addSavedAddress: async () => {},
  deleteSavedAddress: async () => {},
  selectSavedAddress: async () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const token = await getToken();
        if (token) {
          const data = await apiFetch(`${API_BASE_URL}/api/auth/me`);
          if (data && data.success && data.user) {
            const backendAddresses: SavedAddress[] = Array.isArray(data.user.addresses) && data.user.addresses.length > 0
              ? data.user.addresses.map((a: any, idx: number) => ({
                  id: a.id || `addr-${idx + 1}`,
                  label: a.label || (idx === 0 ? 'Home' : `Address ${idx + 1}`),
                  line1: a.line1 || a.address || '',
                  line2: a.line2 || '',
                  landmark: a.landmark || '',
                  pincode: a.pincode || '',
                  is_default: !!a.is_default || idx === 0,
                }))
              : [];

            setUserData(prev => {
              const mergedAddresses = backendAddresses.length > 0
                ? backendAddresses
                : (prev.savedAddresses || []);

              const defaultAddr = mergedAddresses.find(a => a.is_default) || mergedAddresses[0];

              return {
                ...prev,
                ...data.user,
                name: (data.user.name && data.user.name.trim()) || prev.name || '',
                address: defaultAddr?.line1 || data.user.address || prev.address || '',
                addressLine2: defaultAddr?.line2 || data.user.addressLine2 || prev.addressLine2 || '',
                landmark: defaultAddr?.landmark || data.user.landmark || prev.landmark || '',
                addressLabel: defaultAddr?.label || data.user.addressLabel || prev.addressLabel || '',
                pincode: defaultAddr?.pincode || data.user.pincode || prev.pincode || '',
                savedAddresses: mergedAddresses,
              };
            });
          }
        }
      } catch (err: any) {
        const isAuthOrNotFound =
          err?.statusCode === 401 ||
          err?.statusCode === 404 ||
          err?.message?.toLowerCase?.().includes('user not found') ||
          err?.message?.toLowerCase?.().includes('unauthorized') ||
          err?.message?.toLowerCase?.().includes('not found');

        if (isAuthOrNotFound) {
          console.warn("Session expired or user not found. Resetting session.");
          await clearToken();
          setUserData(defaultUserData);
        } else {
          console.warn("Failed to load user profile:", err?.message || err);
        }
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, []);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => {
      const updated = { ...prev, ...data };
      // If address fields were updated directly, also update the default savedAddress
      if (data.address !== undefined || data.pincode !== undefined || data.addressLabel !== undefined) {
        const list = [...(updated.savedAddresses || [])];
        const defaultIndex = list.findIndex(a => a.is_default) >= 0 ? list.findIndex(a => a.is_default) : 0;
        if (list[defaultIndex]) {
          list[defaultIndex] = {
            ...list[defaultIndex],
            line1: updated.address || list[defaultIndex].line1,
            line2: updated.addressLine2 !== undefined ? updated.addressLine2 : list[defaultIndex].line2,
            landmark: updated.landmark !== undefined ? updated.landmark : list[defaultIndex].landmark,
            label: updated.addressLabel || list[defaultIndex].label,
            pincode: updated.pincode || list[defaultIndex].pincode,
          };
          updated.savedAddresses = list;
        }
      }
      return updated;
    });
  };

  const updateSavedAddress = async (updatedAddr: SavedAddress) => {
    setUserData(prev => {
      const list = prev.savedAddresses && prev.savedAddresses.length > 0 ? prev.savedAddresses : [];
      const updatedList = list.map(item => item.id === updatedAddr.id ? updatedAddr : item);
      const isDefault = updatedAddr.is_default || (!list.find(item => item.is_default) && updatedList[0]?.id === updatedAddr.id);
      return {
        ...prev,
        savedAddresses: updatedList,
        ...(isDefault ? {
          address: updatedAddr.line1,
          addressLine2: updatedAddr.line2 || '',
          landmark: updatedAddr.landmark || '',
          addressLabel: updatedAddr.label,
          pincode: updatedAddr.pincode,
        } : {})
      };
    });

    try {
      const token = await getToken();
      if (token) {
        await apiFetch(`${API_BASE_URL}/api/auth/addresses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedAddr),
        });
      }
    } catch (e) {
      console.warn('Could not sync address to server:', e);
    }
  };

  const addSavedAddress = async (newAddr: Omit<SavedAddress, 'id'>) => {
    const id = 'addr-' + Date.now();
    const addrWithId: SavedAddress = { ...newAddr, id };
    setUserData(prev => {
      const list = prev.savedAddresses && prev.savedAddresses.length > 0 ? prev.savedAddresses : [];
      const updatedList = [...list, addrWithId];
      return {
        ...prev,
        savedAddresses: updatedList,
        ...(newAddr.is_default ? {
          address: newAddr.line1,
          addressLine2: newAddr.line2 || '',
          landmark: newAddr.landmark || '',
          addressLabel: newAddr.label,
          pincode: newAddr.pincode,
        } : {})
      };
    });

    try {
      const token = await getToken();
      if (token) {
        await apiFetch(`${API_BASE_URL}/api/auth/addresses`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(addrWithId),
        });
      }
    } catch (e) {
      console.warn('Could not sync added address to server:', e);
    }
  };

  const deleteSavedAddress = async (id: string) => {
    setUserData(prev => {
      const list = prev.savedAddresses && prev.savedAddresses.length > 0 ? prev.savedAddresses : [];
      const updatedList = list.filter(item => item.id !== id);
      return {
        ...prev,
        savedAddresses: updatedList,
      };
    });

    try {
      const token = await getToken();
      if (token) {
        await apiFetch(`${API_BASE_URL}/api/auth/addresses/${id}`, {
          method: 'DELETE',
        });
      }
    } catch (e) {
      console.warn('Could not delete address on server:', e);
    }
  };

  const selectSavedAddress = async (id: string) => {
    setUserData(prev => {
      const list = prev.savedAddresses && prev.savedAddresses.length > 0 ? prev.savedAddresses : [];
      const updatedList = list.map(item => ({
        ...item,
        is_default: item.id === id,
      }));
      const selected = list.find(item => item.id === id);
      return {
        ...prev,
        savedAddresses: updatedList,
        ...(selected ? {
          address: selected.line1,
          addressLine2: selected.line2 || '',
          landmark: selected.landmark || '',
          addressLabel: selected.label,
          pincode: selected.pincode,
        } : {})
      };
    });

    try {
      const token = await getToken();
      if (token) {
        await apiFetch(`${API_BASE_URL}/api/auth/addresses/${id}/default`, {
          method: 'PUT',
        });
      }
    } catch (e) {
      console.warn('Could not set default address on server:', e);
    }
  };

  const addReview = (review: Omit<ReviewItem, 'id'>) => {
    setUserData(prev => ({
      ...prev,
      reviews: [{ ...review, id: Date.now() }, ...prev.reviews]
    }));
  };

  const clearUserData = async () => {
    setUserData(defaultUserData);
    await clearToken();
  };

  return (
    <UserContext.Provider value={{
      userData,
      updateUserData,
      clearUserData,
      addReview,
      updateSavedAddress,
      addSavedAddress,
      deleteSavedAddress,
      selectSavedAddress
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
