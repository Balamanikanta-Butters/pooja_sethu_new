import React, { createContext, useState, useContext } from 'react';

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

type UserData = {
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
  familyDates: FamilyDateItem[];
  reviews: ReviewItem[];
};

type UserContextType = {
  userData: UserData;
  updateUserData: (data: Partial<UserData>) => void;
  clearUserData: () => void;
  addReview: (review: Omit<ReviewItem, 'id'>) => void;
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
  addressLabel: 'Home',
  pincode: '',
  familyDates: [],
  reviews: [],
};

const UserContext = createContext<UserContextType>({
  userData: defaultUserData,
  updateUserData: () => {},
  clearUserData: () => {},
  addReview: () => {},
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [userData, setUserData] = useState<UserData>(defaultUserData);

  const updateUserData = (data: Partial<UserData>) => {
    setUserData(prev => ({ ...prev, ...data }));
  };

  const addReview = (review: Omit<ReviewItem, 'id'>) => {
    setUserData(prev => ({
      ...prev,
      reviews: [{ ...review, id: Date.now() }, ...prev.reviews]
    }));
  };

  const clearUserData = () => {
    setUserData(defaultUserData);
  };

  return (
    <UserContext.Provider value={{ userData, updateUserData, clearUserData, addReview }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
