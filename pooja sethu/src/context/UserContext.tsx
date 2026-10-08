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
};

type UserData = {
  mobileNumber: string;
  name: string;
  familyMembers: FamilyMember[];
  sampradayam: string;
  gotra: string;
  address: string;
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
  name: '',
  familyMembers: [],
  sampradayam: '',
  gotra: '',
  address: '',
  pincode: '',
  familyDates: [
    {
      id: '1',
      title: "Amma's Janma Nakshatram",
      subtitle: 'Rohini · next on Sat, 17 Oct',
      type: 'Birthday'
    },
    {
      id: '2',
      title: "Nanna garu's Abdikam",
      subtitle: 'Tithi-based · Ashwayuja Bahula Dashami',
      type: 'Pitru'
    },
    {
      id: '3',
      title: 'Wedding anniversary',
      subtitle: 'Sun, 6 Dec',
      type: 'Family'
    }
  ],
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
