import React, { useState, useEffect } from 'react';
import type { PoojaItem } from '../types';
import { getPoojaIllustration } from '../components/Illustrations';
import { Edit2, Plus } from 'lucide-react';
import { openRazorpayCheckout, type RazorpayCheckoutOptions } from '../utils/razorpay';
import { apiRequest } from '../utils/apiClient';
import { showToast } from '../components/ToastNotification';

interface BookingPageProps {
  pooja: PoojaItem;
  initialMuhurtham?: string;
  initialTradition?: string;
  onNavigateHome: () => void;
  onNavigatePoojaDetail: () => void;
  onBookingComplete: (bookingDetails: any) => void;
  user?: any;
  onOpenAuth?: () => void;
}

interface SavedAddressItem {
  id: string;
  title: string;
  line: string;
  landmark?: string;
  pincode?: string;
}

interface PurohitItem {
  id: string;
  initials: string;
  name: string;
  verified: boolean;
  tradition: string;
  veda: string;
  experience: string;
  languages: string[];
  rating: number | string;
  reviewsCount: number;
  distance: string;
  dakshina: number;
}

export const BookingPage: React.FC<BookingPageProps> = ({
  pooja,
  initialMuhurtham = 'Sun, 25 Oct · 6:40 – 8:15 AM',
  initialTradition = 'Smartha',
  onNavigateHome,
  onNavigatePoojaDetail,
  onBookingComplete,
  user,
  onOpenAuth
}) => {
  // Wizard steps: 1 = When and where, 2 = Purohit, 3 = Package, 4 = Review and pay
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmittingBooking, setIsSubmittingBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // Step 1: When State
  const [whenMode, setWhenMode] = useState<'suggested' | 'custom'>('suggested');
  const [selectedSlot, setSelectedSlot] = useState(initialMuhurtham);
  const [customDate, setCustomDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [customTimeWindow, setCustomTimeWindow] = useState('Morning (6:00 – 9:00 AM)');
  const [customExactTime, setCustomExactTime] = useState('07:30');
  const [customAstrologyNotes, setCustomAstrologyNotes] = useState('');

  // Step 1: Where State
  const [locationType, setLocationType] = useState<'Home' | 'Temple' | 'Function hall'>('Home');
  const [selectedAddressId, setSelectedAddressId] = useState('Home');
  
  // Saved addresses list (matches uploaded reference screenshot)
  const [addresses, setAddresses] = useState<SavedAddressItem[]>([
    {
      id: 'Home',
      title: 'Home',
      line: '402, Sai Residency, Madhapur',
      landmark: 'Near Durgam Cheruvu Metro',
      pincode: '500081'
    },
    {
      id: "Parents' home",
      title: "Parents' home",
      line: '12-3, Brodipet, Guntur',
      landmark: 'Near Venkateswara Temple',
      pincode: '522002'
    }
  ]);

  // Inline address editing state
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editLine, setEditLine] = useState('');
  const [editLandmark, setEditLandmark] = useState('');
  const [editPincode, setEditPincode] = useState('');

  // Inline add new address state
  const [isAddingNewAddr, setIsAddingNewAddr] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newLine, setNewLine] = useState('');
  const [newLandmark, setNewLandmark] = useState('');
  const [newPincode, setNewPincode] = useState('500081');

  // Custom Temple Venue Form
  const [templeName, setTempleName] = useState('Sri Venkateswara Swamy Temple');
  const [templeDeity, setTempleDeity] = useState('Lord Balaji');
  const [templeAddress, setTempleAddress] = useState('Temple Road, Chikkadpally, Hyderabad');
  const [templePincode, setTemplePincode] = useState('500020');

  // Custom Function Hall Venue Form
  const [hallName, setHallName] = useState('Sri Krishna Kalyana Vedika');
  const [hallRoom, setHallRoom] = useState('Main AC Hall 1');
  const [hallAddress, setHallAddress] = useState('Beside Pillar 140, Mehdipatnam, Hyderabad');
  const [hallPincode, setHallPincode] = useState('500028');

  // Step 2: Purohits State
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedPurohitId, setSelectedPurohitId] = useState<string | null>(null);
  const [purohitsList, setPurohitsList] = useState<PurohitItem[]>([]);
  const [loadingPurohits, setLoadingPurohits] = useState(true);
  const [dbOfflinePurohits, setDbOfflinePurohits] = useState(false);

  // Step 3: Package State
  const [bookingType, setBookingType] = useState<'purohit' | 'complete'>('purohit');
  const [includeSamagri, setIncludeSamagri] = useState(true);
  const [includeBhojanalu, setIncludeBhojanalu] = useState(true);
  const [cateringType, setCateringType] = useState<'Traditional' | 'Festive'>('Traditional');
  const [guestCount, setGuestCount] = useState(25);
  const [cateringMenus, setCateringMenus] = useState<any[]>([]);
  const mealRate = cateringType === 'Festive' ? 500 : 350;

  // Step 4: Karta Details & Payment Options
  const [kartaName, setKartaName] = useState(user?.name || 'Bala Manikanta');
  const [spouseName, setSpouseName] = useState('Lakshmi');
  const [gotram, setGotram] = useState(user?.gotram || 'Kashyapa');
  const [nakshatram, setNakshatram] = useState('Rohini');
  const [phoneNumber, setPhoneNumber] = useState(user?.mobileNumber || user?.phone || '+91 98765 43210');

  // Payment Option for Purohit Only: 1 = Pay Now, 2 = Pay Later
  const [purohitPaymentOption, setPurohitPaymentOption] = useState<'pay_now' | 'pay_later'>('pay_now');

  // Pre-fill user details if logged in
  useEffect(() => {
    if (user?.name) setKartaName(user.name);
    if (user?.mobileNumber || user?.phone) setPhoneNumber(user.mobileNumber || user.phone);
    if (user?.gotram) setGotram(user.gotram);
  }, [user]);

  // Load live user addresses and purohits from backend on mount
  useEffect(() => {
    let isMounted = true;

    const loadInitialData = async () => {
      // 1. Fetch user saved addresses
      try {
        const addrRes = await apiRequest('/api/auth/addresses', { timeoutMs: 8000 });
        if (isMounted && addrRes.success) {
          const rawList = addrRes.raw?.addresses || addrRes.data?.addresses || (Array.isArray(addrRes.data) ? addrRes.data : []);
          if (Array.isArray(rawList) && rawList.length > 0) {
            const mapped: SavedAddressItem[] = rawList.map((a: any) => ({
              id: a.id || a.label,
              title: a.label || 'Home',
              line: [a.line1, a.line2].filter(Boolean).join(', '),
              landmark: a.landmark || '',
              pincode: a.pincode || ''
            }));
            setAddresses(mapped);
            setSelectedAddressId(mapped[0].id);
          }
        }
      } catch (err) {
        console.warn('Addresses fetch notice:', err);
      }

      // 2. Fetch live Purohits from backend
      try {
        const purohitRes = await apiRequest('/api/services/purohits', { timeoutMs: 8000 });
        if (!isMounted) return;

        const purohitList = Array.isArray(purohitRes.data) ? purohitRes.data : (purohitRes.raw?.data || []);
        if (purohitRes.success && Array.isArray(purohitList) && purohitList.length > 0) {
          const matchNums = String(pooja.price || '').replace(/,/g, '').match(/\d+/);
          const parsedPoojaPrice = matchNums ? parseInt(matchNums[0], 10) : 1800;
          const safeFallback = (parsedPoojaPrice > 0 && parsedPoojaPrice < 50000) ? parsedPoojaPrice : 1800;

          const livePurohits: PurohitItem[] = purohitList.map((p: any) => {
            const rawDaksh = Number(p.raw_dakshina);
            const validDakshina = (rawDaksh > 0 && rawDaksh < 50000) 
              ? rawDaksh 
              : safeFallback;

            return {
              id: p.id,
              initials: p.initials || p.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase(),
              name: p.name,
              verified: !!p.verified,
              tradition: p.sampradayam || 'Smartha',
              veda: p.desc?.split('·')[0]?.trim() || 'Krishna Yajur',
              experience: `${p.experience || 10} yrs`,
              languages: Array.isArray(p.languages) ? p.languages : ['Telugu', 'Hindi'],
              rating: typeof p.rating === 'number' ? p.rating : 4.8,
              reviewsCount: p.reviews || 88,
              distance: p.distance !== 'N/A' ? p.distance : '3.5 km',
              dakshina: validDakshina
            };
          });
          setPurohitsList(livePurohits);
          setDbOfflinePurohits(false);
        } else {
          setDbOfflinePurohits(true);
        }
      } catch (pErr) {
        if (isMounted) setDbOfflinePurohits(true);
      } finally {
        if (isMounted) setLoadingPurohits(false);
      }

      // 3. Fetch user profile for karta details
      try {
        const userRes = await apiRequest('/api/auth/me', { timeoutMs: 6000 });
        if (isMounted && userRes.success) {
          const u = userRes.raw?.user || userRes.data?.user || userRes.data;
          if (u) {
            if (u.name) setKartaName(u.name);
            if (u.gotram || u.gotra) setGotram(u.gotram || u.gotra);
            if (u.mobileNumber || u.phoneNumber) setPhoneNumber(u.mobileNumber || u.phoneNumber);
          }
        }
      } catch (uErr) {
        console.warn('Profile fetch notice:', uErr);
      }

      // 4. Fetch live catering menus from ps.caterer_menu & ps.food_item
      try {
        const menuRes = await apiRequest('/api/services/catering-menu', { timeoutMs: 6000 });
        if (isMounted && menuRes.success) {
          const mList = menuRes.data?.menus || menuRes.raw?.menus || (Array.isArray(menuRes.data) ? menuRes.data : []);
          if (Array.isArray(mList) && mList.length > 0) {
            setCateringMenus(mList);
          }
        }
      } catch (mErr) {
        console.warn('Catering menu notice:', mErr);
      }
    };

    loadInitialData();
    return () => {
      isMounted = false;
    };
  }, []);

  // Suggested Auspicious Muhurthams from database
  const [suggestedSlots, setSuggestedSlots] = useState<any[]>([
    {
      id: 's1',
      title: initialMuhurtham || 'Sun, 25 Oct · 6:40 – 8:15 AM',
      sub: 'Tula lagnam · Hasta Nakshatram · Shubha Muhurtham',
      badge: 'Best',
      color: 'green'
    }
  ]);

  useEffect(() => {
    let isMounted = true;
    const loadSlots = async () => {
      try {
        const res = await apiRequest(`/api/services/muhurthams?poojaId=${pooja.id || ''}`, { timeoutMs: 8000 });
        if (!isMounted) return;

        const list = Array.isArray(res.data) ? res.data : (res.raw?.data || []);
        if (res.success && Array.isArray(list) && list.length > 0) {
          const seen = new Set<string>();
          const mapped: any[] = [];
          for (const m of list) {
            const title = `${m.date} · ${m.time}`;
            const key = title.trim().toLowerCase();
            if (seen.has(key)) continue;
            seen.add(key);
            mapped.push({
              id: m.id,
              title: title,
              sub: `${m.lagnam ? m.lagnam + ' · ' : ''}${m.note || 'Shubha Muhurtham'}`,
              badge: m.tag || 'Good',
              color: m.tag === 'Best' ? 'green' : m.tag === 'Good' ? 'blue' : 'orange',
              starts_at: m.starts_at,
              ends_at: m.ends_at
            });
          }
          setSuggestedSlots(mapped.slice(0, 4));
          if (!selectedSlot && mapped[0]) {
            setSelectedSlot(mapped[0].title);
          }
        }
      } catch (err) {
        if (isMounted) console.warn('Muhurtham slots load notice:', err);
      }
    };

    loadSlots();
    return () => {
      isMounted = false;
    };
  }, [pooja.id]);

  // Active slot string
  const activeSlotDisplay = whenMode === 'suggested' 
    ? selectedSlot 
    : `${new Date(customDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })} · ${customTimeWindow}`;

  // Address Actions
  const handleStartEditAddr = (addr: SavedAddressItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingAddrId(addr.id);
    setEditTitle(addr.title);
    setEditLine(addr.line);
    setEditLandmark(addr.landmark || '');
    setEditPincode(addr.pincode || '500081');
  };

  const handleSaveEditedAddr = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!editLine.trim()) return;

    const updated = addresses.map(a => {
      if (a.id === editingAddrId) {
        return {
          ...a,
          title: editTitle.trim() || 'Home',
          line: editLine.trim(),
          landmark: editLandmark.trim(),
          pincode: editPincode.trim() || '500081'
        };
      }
      return a;
    });
    setAddresses(updated);
    setEditingAddrId(null);

    // Save to backend if logged in
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('pooja_sethu_token');
    if (token) {
      try {
        const res = await apiRequest('/api/auth/addresses', {
          method: 'POST',
          body: JSON.stringify({
            label: editTitle.trim(),
            line1: editLine.trim(),
            landmark: editLandmark.trim(),
            pincode: editPincode.trim(),
            is_default: false
          })
        });
        if (res.success) {
          showToast({ type: 'success', message: 'Address updated' });
        } else {
          showToast({ type: 'warning', message: res.error || 'Address saved locally' });
        }
      } catch (_) {}
    }
  };

  const handleSaveNewAddr = async () => {
    if (!newLine.trim()) return;
    const newId = `addr-${Date.now()}`;
    const newItem: SavedAddressItem = {
      id: newId,
      title: newTitle.trim() || 'Other address',
      line: newLine.trim(),
      landmark: newLandmark.trim(),
      pincode: newPincode.trim() || '500081'
    };

    setAddresses([...addresses, newItem]);
    setSelectedAddressId(newId);
    setIsAddingNewAddr(false);
    setNewTitle('');
    setNewLine('');
    setNewLandmark('');

    // Save to backend
    const token = localStorage.getItem('jwt_token') || localStorage.getItem('pooja_sethu_token');
    if (token) {
      try {
        const res = await apiRequest('/api/auth/addresses', {
          method: 'POST',
          body: JSON.stringify({
            label: newItem.title,
            line1: newItem.line,
            landmark: newItem.landmark,
            pincode: newItem.pincode,
            is_default: false
          })
        });
        if (res.success) {
          showToast({ type: 'success', message: 'New address saved' });
        } else {
          showToast({ type: 'warning', message: res.error || 'Address saved locally' });
        }
      } catch (_) {}
    }
  };

  // Purohit filtering
  const filteredPurohits = purohitsList.filter(p => {
    if (selectedLanguage === 'All') return true;
    return p.languages.includes(selectedLanguage);
  });

  const chosenPurohit = selectedPurohitId ? (purohitsList.find(p => p.id === selectedPurohitId) || null) : null;
  const matchNums = String(pooja.price || '').replace(/,/g, '').match(/\d+/);
  const parsedPoojaPrice = matchNums ? parseInt(matchNums[0], 10) : 1800;
  const safePoojaPrice = (parsedPoojaPrice > 0 && parsedPoojaPrice < 50000) ? parsedPoojaPrice : 1800;
  const dakshinaAmount = chosenPurohit ? chosenPurohit.dakshina : safePoojaPrice;
  const isPurohitOnly = bookingType === 'purohit';
  const samagriAmount = (!isPurohitOnly && includeSamagri) ? 1500 : 0;
  const bhojanaluAmount = (!isPurohitOnly && includeBhojanalu) ? guestCount * mealRate : 0;
  const coordinationFee = isPurohitOnly ? 0 : 499;
  const gst = isPurohitOnly ? 0 : 90;
  const totalAmount = isPurohitOnly ? dakshinaAmount : (dakshinaAmount + samagriAmount + bhojanaluAmount + coordinationFee + gst);
  const advanceAmount = !isPurohitOnly ? Math.round(totalAmount / 4) : totalAmount;
  const remainingAmount = !isPurohitOnly ? (totalAmount - advanceAmount) : 0;

  // Selected address summary
  const selectedAddrObj = addresses.find(a => a.id === selectedAddressId) || addresses[0];
  const finalAddressLine = locationType === 'Home' 
    ? (selectedAddrObj ? `${selectedAddrObj.title}: ${selectedAddrObj.line}` : '402, Sai Residency, Madhapur')
    : locationType === 'Temple'
      ? `${templeName}, ${templeAddress}`
      : `${hallName}, ${hallRoom}, ${hallAddress}`;

  const renderThumbArt = () => {
    return getPoojaIllustration(pooja.title, undefined, "w-full h-full");
  };

  const handleNext = async () => {
    setBookingError('');

    // Step 1 Validation: Ceremony Address is mandatory
    if (currentStep === 1) {
      if (locationType === 'Home' && (!selectedAddrObj || !selectedAddrObj.line?.trim() || !selectedAddrObj.pincode?.trim())) {
        setBookingError('Please add and select your ceremony venue address with a valid 6-digit pincode.');
        showToast({ type: 'warning', message: 'Ceremony address is required' });
        return;
      }
      setCurrentStep(2);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Step 2 Validation: Purohit is mandatory
    if (currentStep === 2) {
      if (!selectedPurohitId) {
        setBookingError('Please select a verified Vedic Purohit to continue.');
        showToast({ type: 'warning', message: 'Purohit selection is required' });
        return;
      }
      setCurrentStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 3) {
      setCurrentStep(4);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    if (currentStep === 4) {
      // Step 4 Mandatory Security Checks (matching mobile app)
      const token = localStorage.getItem('jwt_token') || localStorage.getItem('pooja_sethu_token');
      if (!token && !user) {
        setBookingError('Please sign in with your mobile number to complete your booking.');
        showToast({ type: 'warning', message: 'Sign in required to proceed with booking' });
        if (onOpenAuth) onOpenAuth();
        return;
      }

      if (!kartaName || !kartaName.trim()) {
        setBookingError('Karta (Main Devotee) full name is mandatory for Sankalpam.');
        showToast({ type: 'warning', message: 'Karta name is required' });
        return;
      }

      const cleanPhone = phoneNumber.replace(/[^\d]/g, '').slice(-10);
      if (!cleanPhone || cleanPhone.length !== 10) {
        setBookingError('Valid 10-digit mobile number is mandatory for WhatsApp ceremony updates.');
        showToast({ type: 'warning', message: 'Valid 10-digit phone number is required' });
        return;
      }

      if (!gotram || !gotram.trim()) {
        setBookingError('Family Gotram is mandatory for reciting the Vedic Sankalpam.');
        showToast({ type: 'warning', message: 'Gotram is required' });
        return;
      }

      if (locationType === 'Home' && (!selectedAddrObj || !selectedAddrObj.line?.trim() || !selectedAddrObj.pincode?.trim())) {
        setBookingError('Ceremony street address and pincode are mandatory.');
        showToast({ type: 'warning', message: 'Address and pincode are required' });
        return;
      }

      // Submit booking to backend API
      setIsSubmittingBooking(true);
      setBookingError('');
      
      let startsDate: Date;
      let endsDate: Date;

      if (whenMode === 'custom') {
        startsDate = new Date(`${customDate}T${customExactTime}:00`);
        endsDate = new Date(startsDate.getTime() + 3 * 3600 * 1000);
      } else {
        const matchingSlot = suggestedSlots.find(s => s.title === selectedSlot);
        if (matchingSlot?.starts_at && matchingSlot?.ends_at) {
          startsDate = new Date(matchingSlot.starts_at);
          endsDate = new Date(matchingSlot.ends_at);
        } else {
          startsDate = new Date('2026-10-25T06:40:00');
          endsDate = new Date(startsDate.getTime() + 3 * 3600 * 1000);
        }
      }

      const isPayLater = isPurohitOnly && purohitPaymentOption === 'pay_later';

      const bookingPayload = {
        pooja_id: pooja.id || 'ff33f14c-2cbd-48a4-b620-933afd600aad',
        sampradayam: initialTradition || 'Smartha',
        purohit_id: chosenPurohit?.id || null,
        starts_at: startsDate.toISOString(),
        ends_at: endsDate.toISOString(),
        venue_type: locationType === 'Home' ? 'home' : locationType === 'Temple' ? 'temple' : 'function_hall',
        addressFlat: locationType === 'Home' ? (selectedAddrObj?.line || '402, Sai Residency') : (locationType === 'Temple' ? templeName : hallName),
        addressArea: locationType === 'Home' ? (selectedAddrObj?.landmark || 'Madhapur, Hyderabad') : (locationType === 'Temple' ? templeAddress : hallAddress),
        pincode: locationType === 'Home' ? (selectedAddrObj?.pincode || '500081') : (locationType === 'Temple' ? templePincode : hallPincode),
        guests: (!isPurohitOnly && includeBhojanalu) ? guestCount : 0,
        mode: isPurohitOnly ? 'purohit_only' : 'package',
        payment_mode: isPayLater ? 'pay_later' : 'pay_now',
        dakshina_amount: dakshinaAmount,
        samagri_amount: samagriAmount,
        food_amount: bhojanaluAmount,
        addon_amount: 0,
        platform_fee: coordinationFee,
        tax_amount: gst,
        discount_amount: 0,
        total_payable: totalAmount,
        diet_preference: 'satvik',
        booked_for_name: kartaName,
        booked_for_phone: phoneNumber
      };

      try {
        // 1. Create booking in database
        const res = await apiRequest('/api/bookings', {
          method: 'POST',
          body: JSON.stringify(bookingPayload)
        });

        if (!res.success) {
          throw new Error(res.error || 'Failed to save booking to database.');
        }

        const data = res.raw || res.data;
        const createdBookingId = data?.booking?.id || data?.data?.id || data?.id;
        const createdBookingNo = data?.booking?.booking_no || data?.data?.booking_no || data?.booking_no || `PS-BK-${Math.floor(10000 + Math.random() * 90000)}`;

        // If Pay Later: confirm immediately without opening Razorpay
        if (isPayLater) {
          showToast({ type: 'success', message: 'Booking confirmed! (Pay Later at Venue)' });
          onBookingComplete({
            pooja,
            slot: activeSlotDisplay,
            address: finalAddressLine,
            purohit: chosenPurohit,
            guestCount: 0,
            total: totalAmount,
            karta: kartaName,
            phone: phoneNumber,
            bookingNo: createdBookingNo,
            bookingId: createdBookingId,
            paymentId: 'PAY_LATER',
            mode: 'Purohit only (Pay Later)',
            includeSamagri: !isPurohitOnly && includeSamagri,
            isPurohitOnly: true,
            bookingType: 'purohit'
          });
          return;
        }

        // Online Payment Flow (Purohit Only Pay Now OR Complete Package 1/4th Advance)
        let razorpayKey = 'rzp_test_TlpNdLGDOhtL2O';
        let razorpayOrderId: string | undefined = undefined;
        let amountInPaise = Math.round((!isPurohitOnly ? advanceAmount : totalAmount) * 100);

        // 2. Request Razorpay Order from backend
        if (createdBookingId) {
          try {
            const orderRes = await apiRequest('/api/payments/create-order', {
              method: 'POST',
              body: JSON.stringify({ bookingId: createdBookingId, isAdvance: !isPurohitOnly })
            });
            const orderData = orderRes.raw || orderRes.data;
            if (orderRes.success && orderData) {
              razorpayKey = orderData.key_id || razorpayKey;
              razorpayOrderId = orderData.order_id;
              if (orderData.amount) amountInPaise = orderData.amount;
            }
          } catch (orderErr) {
            console.warn('Razorpay order creation notice:', orderErr);
          }
        }

        // 3. Launch Razorpay Checkout Modal
        const checkoutOptions: RazorpayCheckoutOptions = {
          key: razorpayKey,
          amount: amountInPaise,
          currency: 'INR',
          name: 'Pooja Sethu',
          description: `${pooja.title} ${!isPurohitOnly ? 'Advance Payment (1/4)' : 'Ceremony Booking'}`,
          order_id: razorpayOrderId,
          theme: { color: '#7C1B2C' },
          prefill: {
            name: kartaName || 'Devotee',
            contact: phoneNumber.replace(/[^\d]/g, '').slice(-10) || '9876543210',
            email: 'devotee@poojasetu.com'
          }
        };

        const paymentResult = await openRazorpayCheckout(checkoutOptions);

        // 4. Verify Payment with Backend
        if (createdBookingId && paymentResult?.razorpay_payment_id) {
          try {
            await apiRequest('/api/payments/verify', {
              method: 'POST',
              body: JSON.stringify({
                razorpay_order_id: paymentResult.razorpay_order_id || razorpayOrderId,
                razorpay_payment_id: paymentResult.razorpay_payment_id,
                razorpay_signature: paymentResult.razorpay_signature,
                bookingId: createdBookingId
              })
            });
          } catch (vErr) {
            console.warn('Payment verification notice:', vErr);
          }
        }

        showToast({ type: 'success', message: !isPurohitOnly ? 'Advance payment received! Booking confirmed.' : 'Booking confirmed successfully!' });

        // 5. Complete Booking & Show Confirmation Modal
        onBookingComplete({
          pooja,
          slot: activeSlotDisplay,
          address: finalAddressLine,
          purohit: chosenPurohit,
          guestCount: (!isPurohitOnly && includeBhojanalu) ? guestCount : 0,
          total: totalAmount,
          advancePaid: !isPurohitOnly ? advanceAmount : totalAmount,
          remainingBalance: !isPurohitOnly ? remainingAmount : 0,
          karta: kartaName,
          phone: phoneNumber,
          bookingNo: createdBookingNo,
          bookingId: createdBookingId,
          paymentId: paymentResult.razorpay_payment_id,
          mode: isPurohitOnly ? 'Purohit only (Paid Online)' : 'Complete Package (1/4 Advance Paid)',
          includeSamagri: !isPurohitOnly && includeSamagri,
          isPurohitOnly: isPurohitOnly || !includeSamagri,
          bookingType: (isPurohitOnly || !includeSamagri) ? 'purohit' : 'complete'
        });
      } catch (err: any) {
        const msg = String(err?.message || '');
        if (msg.toLowerCase().includes('cancel') || msg.toLowerCase().includes('dismiss') || msg.toLowerCase().includes('closed')) {
          setBookingError('Payment window was closed or cancelled. Click to try again.');
          showToast({ type: 'warning', message: 'Payment cancelled by user' });
        } else {
          const userFriendly = err?.isDbOffline
            ? 'Database is currently offline. Cannot complete booking transaction.'
            : `Booking error: ${msg || 'Could not complete transaction'}. Please try again.`;
          setBookingError(userFriendly);
          showToast({ type: 'error', message: userFriendly });
        }
      } finally {
        setIsSubmittingBooking(false);
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      onNavigatePoojaDetail();
    }
  };

  return (
    <div className="booking-page-root">
      {/* Top Header with Back Button */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '14px' }}>
        <button 
          type="button"
          onClick={handleBack}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '8px 18px',
            background: '#FFFFFF',
            border: '1px solid #D9D2C9',
            borderRadius: '8px',
            color: '#7C1B2C',
            fontWeight: 700,
            fontSize: '0.92rem',
            cursor: 'pointer'
          }}
        >
          ← Back
        </button>
        <nav className="booking-breadcrumb" style={{ margin: 0 }}>
          <button className="breadcrumb-btn" onClick={onNavigateHome}>Home</button>
          <span className="breadcrumb-sep">›</span>
          <button className="breadcrumb-btn" onClick={onNavigatePoojaDetail}>{pooja.title}</button>
          <span className="breadcrumb-sep">›</span>
          <span className="breadcrumb-curr">Book</span>
        </nav>
      </div>

      {/* Page Title */}
      <h1 className="booking-title font-sans">Book {pooja.title}</h1>

      {/* 4-Step Wizard Progress Bar */}
      <div className="steps-progress-row">
        {[
          { num: 1, label: 'When and where' },
          { num: 2, label: 'Purohit' },
          { num: 3, label: 'Package' },
          { num: 4, label: 'Review and pay' }
        ].map((s) => {
          const isDone = currentStep > s.num;
          const isActive = currentStep === s.num;
          return (
            <div 
              key={s.num} 
              className={`step-pill ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
              onClick={() => {
                if (isDone) setCurrentStep(s.num);
              }}
            >
              <div className="step-circle">
                {isDone ? '✔' : s.num}
              </div>
              <span className="step-label">{s.label}</span>
            </div>
          );
        })}
      </div>

      {/* Layout: Wizard Content on Left + Persistent Summary on Right */}
      <div className="booking-layout-grid">
        {/* Left Wizard Steps */}
        <div className="wizard-main-column">
          {/* STEP 1: WHEN AND WHERE */}
          {currentStep === 1 && (
            <div className="step-card-content">
              
              {/* WHEN SUB-CARD */}
              <div className="step-box">
                <div className="box-title-row">
                  <h3 className="box-title">When</h3>
                  <div className="when-mode-pills">
                    <button 
                      type="button"
                      className={`when-mode-pill ${whenMode === 'suggested' ? 'active' : ''}`}
                      onClick={() => setWhenMode('suggested')}
                    >
                      Auspicious Muhurthams
                    </button>
                    <button 
                      type="button"
                      className={`when-mode-pill ${whenMode === 'custom' ? 'active' : ''}`}
                      onClick={() => setWhenMode('custom')}
                    >
                      📅 Choose custom date & time
                    </button>
                  </div>
                </div>

                {whenMode === 'suggested' ? (
                  <>
                    <p className="box-sub">
                      Verified Muhurthams according to Telugu Panchangam & Vedic astrological alignment.
                    </p>
                    <div className="slot-cards-list">
                      {suggestedSlots.map((s) => {
                        const isSelected = selectedSlot === s.title;
                        return (
                          <div 
                            key={s.id} 
                            className={`custom-radio-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedSlot(s.title)}
                          >
                            <div className={`ref-radio-dot ${isSelected ? 'selected' : ''}`}>
                              {isSelected && <div className="ref-radio-inner" />}
                            </div>
                            <div className="slot-info">
                              <span className="slot-datetime font-sans">{s.title}</span>
                              <span className="slot-sub">{s.sub}</span>
                            </div>
                            <span className={`slot-badge badge-${s.color}`}>{s.badge}</span>
                          </div>
                        );
                      })}
                    </div>
                  </>
                ) : (
                  <div className="custom-datetime-container">
                    <p className="box-sub">
                      Select your preferred family date and auspicious time window for {pooja.title}.
                    </p>
                    <div className="custom-datetime-grid">
                      <div className="form-field">
                        <label>Pooja Date *</label>
                        <input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]}
                          value={customDate}
                          onChange={(e) => setCustomDate(e.target.value)}
                          className="ref-input"
                        />
                      </div>
                      <div className="form-field">
                        <label>Time Window / Kala *</label>
                        <select 
                          value={customTimeWindow}
                          onChange={(e) => setCustomTimeWindow(e.target.value)}
                          className="ref-select"
                        >
                          <option value="Morning (6:00 – 9:00 AM)">Morning (6:00 – 9:00 AM) · Shubha Kalam</option>
                          <option value="Mid-Morning (9:00 AM – 12:00 PM)">Mid-Morning (9:00 AM – 12:00 PM) · Abhijit Kalam</option>
                          <option value="Afternoon (12:00 – 4:00 PM)">Afternoon (12:00 – 4:00 PM) · Subha Samayam</option>
                          <option value="Evening (5:00 – 8:00 PM)">Evening (5:00 – 8:00 PM) · Pradosha Kalam</option>
                          <option value="Custom Exact Time">Exact specific time (choose below)</option>
                        </select>
                      </div>
                    </div>

                    {customTimeWindow === 'Custom Exact Time' && (
                      <div className="form-field" style={{ marginTop: '14px' }}>
                        <label>Exact Starting Time *</label>
                        <input 
                          type="time" 
                          value={customExactTime}
                          onChange={(e) => setCustomExactTime(e.target.value)}
                          className="ref-input"
                          style={{ maxWidth: '240px' }}
                        />
                      </div>
                    )}

                    <div className="form-field" style={{ marginTop: '14px' }}>
                      <label>Astrological / Family Pandit Preferences (Optional)</label>
                      <input 
                        type="text" 
                        value={customAstrologyNotes}
                        onChange={(e) => setCustomAstrologyNotes(e.target.value)}
                        placeholder="e.g. As advised by family Jyotishyam; avoid Rahu Kalam"
                        className="ref-input"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* WHERE SUB-CARD (EXACT REPLICA OF USER UPLOADED DESIGN REFERENCE) */}
              <div className="step-box">
                <h3 className="box-title">Where</h3>
                
                {/* Location Type Pills: [ Home ] [ Temple ] [ Function hall ] */}
                <div className="location-types-row">
                  {(['Home', 'Temple', 'Function hall'] as const).map((type) => (
                    <button
                      key={type}
                      type="button"
                      className={`loc-type-btn ${locationType === type ? 'active' : ''}`}
                      onClick={() => setLocationType(type)}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* 1. When HOME is selected: Show Saved Address Radio Cards */}
                {locationType === 'Home' && (
                  <div className="address-section-wrapper">
                    <div className="address-cards-list">
                      {addresses.map((addr) => {
                        const isSelected = selectedAddressId === addr.id;
                        const isEditingThis = editingAddrId === addr.id;

                        if (isEditingThis) {
                          return (
                            <div key={addr.id} className="inline-edit-card">
                              <h4 className="edit-card-title">Edit Saved Address</h4>
                              <div className="edit-grid">
                                <div className="form-field">
                                  <label>Label</label>
                                  <input 
                                    type="text" 
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    placeholder="e.g. Home, Parents' home"
                                    className="ref-input"
                                  />
                                </div>
                                <div className="form-field">
                                  <label>Pincode</label>
                                  <input 
                                    type="text" 
                                    value={editPincode}
                                    onChange={(e) => setEditPincode(e.target.value)}
                                    placeholder="500081"
                                    className="ref-input"
                                  />
                                </div>
                                <div className="form-field full-col">
                                  <label>Address (Flat, Street, Locality)</label>
                                  <input 
                                    type="text" 
                                    value={editLine}
                                    onChange={(e) => setEditLine(e.target.value)}
                                    placeholder="e.g. 402, Sai Residency, Madhapur"
                                    className="ref-input"
                                  />
                                </div>
                                <div className="form-field full-col">
                                  <label>Landmark</label>
                                  <input 
                                    type="text" 
                                    value={editLandmark}
                                    onChange={(e) => setEditLandmark(e.target.value)}
                                    placeholder="e.g. Near Metro Station"
                                    className="ref-input"
                                  />
                                </div>
                              </div>
                              <div className="edit-actions-row">
                                <button type="button" className="btn-cancel-edit" onClick={() => setEditingAddrId(null)}>
                                  Cancel
                                </button>
                                <button type="button" className="btn-save-edit" onClick={handleSaveEditedAddr}>
                                  Save changes
                                </button>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <div 
                            key={addr.id} 
                            className={`custom-radio-card ${isSelected ? 'selected' : ''}`}
                            onClick={() => setSelectedAddressId(addr.id)}
                          >
                            {/* Visual Radio Dot */}
                            <div className={`ref-radio-dot ${isSelected ? 'selected' : ''}`}>
                              {isSelected && <div className="ref-radio-inner" />}
                            </div>

                            {/* Address details */}
                            <div className="addr-info">
                              <span className="addr-title font-sans">{addr.title}</span>
                              <span className="addr-line">{addr.line}</span>
                            </div>

                            {/* Edit access icon */}
                            <button 
                              type="button"
                              className="btn-addr-edit"
                              onClick={(e) => handleStartEditAddr(addr, e)}
                              title="Edit this address"
                            >
                              <Edit2 size={16} />
                              <span className="edit-text">Edit</span>
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Inline Add New Address Form / Trigger */}
                    {isAddingNewAddr ? (
                      <div className="inline-add-card">
                        <h4 className="edit-card-title">+ Add New Saved Address</h4>
                        <div className="edit-grid">
                          <div className="form-field">
                            <label>Label</label>
                            <input 
                              type="text" 
                              value={newTitle}
                              onChange={(e) => setNewTitle(e.target.value)}
                              placeholder="e.g. In-laws Home, Guest House"
                              className="ref-input"
                            />
                          </div>
                          <div className="form-field">
                            <label>Pincode</label>
                            <input 
                              type="text" 
                              value={newPincode}
                              onChange={(e) => setNewPincode(e.target.value)}
                              placeholder="500081"
                              className="ref-input"
                            />
                          </div>
                          <div className="form-field full-col">
                            <label>Street Address & Flat No *</label>
                            <input 
                              type="text" 
                              value={newLine}
                              onChange={(e) => setNewLine(e.target.value)}
                              placeholder="e.g. Flat 301, Sri Rama Residency, KPHB Phase 1"
                              className="ref-input"
                            />
                          </div>
                          <div className="form-field full-col">
                            <label>Landmark</label>
                            <input 
                              type="text" 
                              value={newLandmark}
                              onChange={(e) => setNewLandmark(e.target.value)}
                              placeholder="e.g. Near Forum Sujana Mall"
                              className="ref-input"
                            />
                          </div>
                        </div>
                        <div className="edit-actions-row">
                          <button type="button" className="btn-cancel-edit" onClick={() => setIsAddingNewAddr(false)}>
                            Cancel
                          </button>
                          <button type="button" className="btn-save-edit" onClick={handleSaveNewAddr}>
                            Save & Select
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        type="button" 
                        className="btn-add-address-trigger"
                        onClick={() => setIsAddingNewAddr(true)}
                      >
                        <Plus size={16} />
                        <span>Add custom ceremony address</span>
                      </button>
                    )}
                  </div>
                )}

                {/* 2. When TEMPLE is selected: Show Custom Temple Form */}
                {locationType === 'Temple' && (
                  <div className="custom-venue-box">
                    <p className="box-sub">
                      Enter the temple premises where you have arranged or requested the archana/pooja:
                    </p>
                    <div className="custom-datetime-grid">
                      <div className="form-field">
                        <label>Temple Name *</label>
                        <input 
                          type="text" 
                          value={templeName}
                          onChange={(e) => setTempleName(e.target.value)}
                          placeholder="e.g. Sri Venkateswara Swamy Temple"
                          className="ref-input"
                        />
                      </div>
                      <div className="form-field">
                        <label>Moola Virat / Deity</label>
                        <input 
                          type="text" 
                          value={templeDeity}
                          onChange={(e) => setTempleDeity(e.target.value)}
                          placeholder="e.g. Lord Balaji / Shiva"
                          className="ref-input"
                        />
                      </div>
                      <div className="form-field full-col">
                        <label>Temple Address & Locality *</label>
                        <input 
                          type="text" 
                          value={templeAddress}
                          onChange={(e) => setTempleAddress(e.target.value)}
                          placeholder="e.g. Temple Road, Chikkadpally, Hyderabad"
                          className="ref-input"
                        />
                      </div>
                      <div className="form-field">
                        <label>City & Pincode</label>
                        <input 
                          type="text" 
                          value={templePincode}
                          onChange={(e) => setTemplePincode(e.target.value)}
                          placeholder="500020"
                          className="ref-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* 3. When FUNCTION HALL is selected: Show Custom Mandapam Form */}
                {locationType === 'Function hall' && (
                  <div className="custom-venue-box">
                    <p className="box-sub">
                      Enter the Kalyana Mandapam or banquet hall details for the ceremony:
                    </p>
                    <div className="custom-datetime-grid">
                      <div className="form-field">
                        <label>Function Hall / Mandapam Name *</label>
                        <input 
                          type="text" 
                          value={hallName}
                          onChange={(e) => setHallName(e.target.value)}
                          placeholder="e.g. Sri Krishna Kalyana Vedika"
                          className="ref-input"
                        />
                      </div>
                      <div className="form-field">
                        <label>Room / Stage / Floor</label>
                        <input 
                          type="text" 
                          value={hallRoom}
                          onChange={(e) => setHallRoom(e.target.value)}
                          placeholder="e.g. Main AC Hall 1"
                          className="ref-input"
                        />
                      </div>
                      <div className="form-field full-col">
                        <label>Function Hall Address & Landmark *</label>
                        <input 
                          type="text" 
                          value={hallAddress}
                          onChange={(e) => setHallAddress(e.target.value)}
                          placeholder="e.g. Beside Pillar 140, Mehdipatnam, Hyderabad"
                          className="ref-input"
                        />
                      </div>
                      <div className="form-field">
                        <label>City & Pincode</label>
                        <input 
                          type="text" 
                          value={hallPincode}
                          onChange={(e) => setHallPincode(e.target.value)}
                          placeholder="500028"
                          className="ref-input"
                        />
                      </div>
                    </div>
                  </div>
                )}

              </div>

              {/* Step Navigation Buttons */}
              <div className="step-action-buttons">
                <button type="button" className="btn-back-outline" onClick={handleBack}>Back</button>
                <button type="button" className="btn-continue-solid" onClick={handleNext}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 2: PUROHIT */}
          {currentStep === 2 && (
            <div className="step-card-content">
              <p className="step-section-info">
                {filteredPurohits.length} verified Purohits follow <strong>{initialTradition} Vidhi</strong> and are free at this time.
              </p>

              {/* Language Filters */}
              <div className="purohit-lang-filter-row">
                {['All languages', 'Telugu', 'Kannada', 'Tamil', 'Hindi', 'English'].map((l) => {
                  const val = l.replace(' languages', '');
                  const isActive = selectedLanguage === val;
                  return (
                    <button
                      key={l}
                      type="button"
                      className={`lang-pill-btn ${isActive ? 'active' : ''}`}
                      onClick={() => setSelectedLanguage(val)}
                    >
                      {l}
                    </button>
                  );
                })}
              </div>

              {/* Purohits Grid or Offline Notice */}
              {loadingPurohits ? (
                <div style={{ textAlign: 'center', padding: '40px 20px', color: '#888' }}>
                  <p>Connecting to database & checking available verified Purohits...</p>
                </div>
              ) : dbOfflinePurohits && purohitsList.length === 0 ? (
                <div style={{
                  backgroundColor: '#FFF8F6',
                  border: '1px solid #F3C4B9',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  margin: '16px 0'
                }}>
                  <p style={{ color: '#7C1B2C', margin: '0', fontSize: '0.92rem', fontWeight: 500 }}>
                    Unable to load available Purohits right now.
                  </p>
                </div>
              ) : (
                <div className="purohit-cards-grid">
                  {filteredPurohits.map((p) => {
                    const isSelected = selectedPurohitId === p.id;
                    return (
                      <div key={p.id} className={`purohit-profile-card ${isSelected ? 'selected' : ''}`}>
                      <div className="purohit-card-top">
                        <div className="purohit-avatar-circle">{p.initials}</div>
                        <div className="purohit-details-col">
                          <h4 className="purohit-name">{p.name}</h4>
                          <div className="purohit-tags-row">
                            {p.verified && <span className="verified-pill">✔ Verified</span>}
                            <span className="tradition-pill">{p.tradition}</span>
                          </div>
                          <p className="purohit-lineage-text">
                            {p.veda} · {p.experience} · {p.languages.join(', ')}
                          </p>
                          <div className="purohit-rating-row">
                            <span className="rating-star">★ {p.rating}</span>
                            <span className="rating-count">({p.reviewsCount})</span>
                            <span className="rating-sep">·</span>
                            <span className="distance-text">{p.distance}</span>
                          </div>
                        </div>
                      </div>

                      <div className="purohit-card-bottom">
                        <div className="purohit-dakshina-box">
                          <span className="dakshina-sub">Dakshina</span>
                          <span className="dakshina-amount">₹{p.dakshina.toLocaleString('en-IN')}</span>
                        </div>
                        <button
                          type="button"
                          className={`btn-select-purohit ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedPurohitId(isSelected ? null : p.id)}
                        >
                          {isSelected ? 'Selected ✔' : 'Select'}
                        </button>
                      </div>
                    </div>
                  );
                  })}
                </div>
              )}

              {/* Step Navigation Buttons */}
              <div className="step-action-buttons">
                <button type="button" className="btn-back-outline" onClick={handleBack}>Back</button>
                <button 
                  type="button"
                  className="btn-continue-solid" 
                  onClick={handleNext}
                  disabled={!selectedPurohitId}
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: PACKAGE */}
          {currentStep === 3 && (
            <div className="step-card-content">
              {/* How Should We Book Section */}
              <div className="step-box" style={{ padding: '22px 24px' }}>
                <h3 className="box-title" style={{ fontSize: '1.25rem', marginBottom: '6px' }}>How should we book?</h3>
                <p className="box-sub" style={{ margin: 0 }}>
                  Choose whether you want only the Vedic Purohit service, or the complete arranged ceremony package with Samagri and catering.
                </p>

                {/* Option 1: Purohit only */}
                <div 
                  onClick={() => setBookingType('purohit')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '16px 20px',
                    marginTop: '16px',
                    borderRadius: '12px',
                    border: bookingType === 'purohit' ? '2px solid #7C1B2C' : '1px solid #E5E0D8',
                    backgroundColor: bookingType === 'purohit' ? '#FDF8F5' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: bookingType === 'purohit' ? '6px solid #7C1B2C' : '2px solid #C4B5A5',
                      backgroundColor: '#FFFFFF',
                      marginTop: '2px',
                      flexShrink: 0
                    }} />
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B1510' }}>Purohit only</span>
                        <span style={{ 
                          fontSize: '0.74rem', 
                          fontWeight: 700, 
                          color: '#7C1B2C', 
                          backgroundColor: '#F7E7E9', 
                          padding: '2px 8px', 
                          borderRadius: '12px' 
                        }}>
                          Recommended
                        </span>
                      </div>
                      <p style={{ fontSize: '0.86rem', color: '#6A6258', margin: '4px 0 0 0' }}>
                        Only Vedic Purohit service. Family prepares the items per Purohit's guidance.
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '16px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#7C1B2C' }}>
                      ₹{dakshinaAmount.toLocaleString('en-IN')}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#7A7267' }}>Dakshina only</div>
                  </div>
                </div>

                {/* Option 2: Complete Ceremony Package */}
                <div 
                  onClick={() => setBookingType('complete')}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    padding: '16px 20px',
                    marginTop: '12px',
                    borderRadius: '12px',
                    border: bookingType === 'complete' ? '2px solid #7C1B2C' : '1px solid #E5E0D8',
                    backgroundColor: bookingType === 'complete' ? '#FDF8F5' : '#FFFFFF',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                    <div style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: bookingType === 'complete' ? '6px solid #7C1B2C' : '2px solid #C4B5A5',
                      backgroundColor: '#FFFFFF',
                      marginTop: '2px',
                      flexShrink: 0
                    }} />
                    <div>
                      <span style={{ fontSize: '1.05rem', fontWeight: 700, color: '#1B1510' }}>Complete Ceremony Package</span>
                      <p style={{ fontSize: '0.86rem', color: '#6A6258', margin: '4px 0 0 0' }}>
                        Purohit + authentic lab-tested Samagri kit + optional Sattvic Bhojanalu catering.
                      </p>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0, paddingLeft: '16px' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#1B1510' }}>
                      From ₹{(dakshinaAmount + 1500).toLocaleString('en-IN')}
                    </span>
                    <div style={{ fontSize: '0.78rem', color: '#7A7267' }}>All-inclusive</div>
                  </div>
                </div>
              </div>

              {/* If Purohit Only Selected: Notice box */}
              {bookingType === 'purohit' && (
                <div className="step-box" style={{ background: '#FBF9F6', border: '1px dashed #D4C9BC' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span style={{ fontSize: '1.3rem' }}>🪔</span>
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.96rem', fontWeight: 700, color: '#4A3B32' }}>Purohit Only Vidhi Arrangement</h4>
                      <p style={{ margin: '4px 0 0 0', fontSize: '0.86rem', color: '#6A5D52' }}>
                        {chosenPurohit ? chosenPurohit.name : 'Vedic Purohit'} will conduct the full authentic ceremony. Our team will share the complete list of items for your family to arrange prior to the muhurtham. Platform & coordination fee is waived (₹0).
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* If Complete Package Selected: Samagri Kit and Bhojanalu options */}
              {bookingType === 'complete' && (
                <>
                  {/* Samagri Kit Option */}
                  <div className="step-box">
                    <div className="package-item-header">
                      <div>
                        <h3 className="box-title">Pooja Samagri Kit</h3>
                        <p className="box-sub">
                          100% pure, lab-tested natural ingredients: organic turmeric, pure cow ghee, 
                          sacred samidha wood, brass kalasham, fresh coconuts & mango leaves.
                        </p>
                      </div>
                      <span className="package-price-tag">₹1,500</span>
                    </div>
                    <label className="package-checkbox-row">
                      <input 
                        type="checkbox" 
                        checked={includeSamagri}
                        onChange={(e) => setIncludeSamagri(e.target.checked)}
                        className="custom-checkbox"
                      />
                      <span>Include complete, sanitized Pooja Samagri Kit</span>
                    </label>
                    <div style={{ marginTop: '10px', fontSize: '0.82rem', color: '#6A5D52', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span>📦</span>
                      <span><strong>Kit Delivery Window:</strong> Between 16:00 – 19:00 on the evening prior to the ceremony.</span>
                    </div>
                  </div>

                  {/* Bhojanalu Catering Option */}
                  <div className="step-box">
                    <div className="package-item-header">
                      <div>
                        <h3 className="box-title">Traditional Sattvic Bhojanalu (Catering)</h3>
                        <p className="box-sub">
                          Authentic Telugu Brahmin bhojanalu prepared fresh without onion & garlic. 
                          Served traditionally on natural banana leaves. Includes sweet, dal, 2 curries, sambar, rasam, curd & payasam.
                        </p>
                      </div>
                      <span className="package-price-tag">₹{mealRate} / meal</span>
                    </div>

                    <div className="catering-toggle-row">
                      <button 
                        type="button"
                        className={`catering-pill ${cateringType === 'Traditional' ? 'active' : ''}`}
                        onClick={() => setCateringType('Traditional')}
                      >
                        Traditional Bhojanalu (₹350/plate)
                      </button>
                      <button 
                        type="button"
                        className={`catering-pill ${cateringType === 'Festive' ? 'active' : ''}`}
                        onClick={() => setCateringType('Festive')}
                      >
                        Festive Kalyana Bhojanalu (₹500/plate)
                      </button>
                    </div>

                    <label className="package-checkbox-row" style={{ marginTop: '16px' }}>
                      <input 
                        type="checkbox" 
                        checked={includeBhojanalu}
                        onChange={(e) => setIncludeBhojanalu(e.target.checked)}
                        className="custom-checkbox"
                      />
                      <span>Include festive Bhojanalu catering</span>
                    </label>

                    {includeBhojanalu && (
                      <>
                        <div className="guest-counter-box">
                          <span className="guest-label">Number of meals (Guests):</span>
                          <div className="stepper-wrap">
                            <button 
                              type="button"
                              className="btn-stepper"
                              onClick={() => setGuestCount(Math.max(15, guestCount - 5))}
                            >-</button>
                            <span className="stepper-count">{guestCount}</span>
                            <button 
                              type="button"
                              className="btn-stepper"
                              onClick={() => setGuestCount(guestCount + 5)}
                            >+</button>
                          </div>
                          <span className="stepper-calc-sub">
                            = ₹{(guestCount * mealRate).toLocaleString('en-IN')}
                          </span>
                        </div>

                        {/* Sattvic Menu Dishes Preview from ps.caterer_menu & ps.food_item */}
                        <div style={{ marginTop: '14px', background: '#FFFDF9', border: '1px solid #F3DFB7', borderRadius: '10px', padding: '12px 16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#78350F' }}>
                              🍃 {cateringType} Sattvic Feast Menu (Pure Vegetarian, No Onion / Garlic):
                            </span>
                            <span style={{ fontSize: '0.78rem', color: '#888' }}>Fresh on banana leaf</span>
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                            {((cateringMenus.find(m => m.name === cateringType)?.dishes) || (
                              cateringType === 'Festive' 
                                ? ['Annam', 'Pulihora', 'Daddojanam', 'Mudda Pappu', 'Sambar (no onion)', 'Aratikaya Kura', 'Gummadikaya Kura', 'Garelu', 'Allam Pachadi', 'Semiya Payasam', 'Bobbatlu', 'Besan Laddu']
                                : ['Annam', 'Pulihora', 'Mudda Pappu', 'Sambar (no onion)', 'Gummadikaya Kura', 'Garelu', 'Appadam', 'Allam Pachadi', 'Semiya Payasam']
                            )).map((dish: string, dIdx: number) => (
                              <span key={dIdx} style={{ fontSize: '0.8rem', background: '#FDF4E5', color: '#7C1B2C', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                                {dish}
                              </span>
                            ))}
                          </div>
                          <div style={{ marginTop: '8px', fontSize: '0.76rem', color: '#8A7A6A' }}>
                            * Minimum 15 guests for authentic traditional banana leaf arrangement.
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}

              {/* Step Navigation Buttons */}
              <div className="step-action-buttons">
                <button type="button" className="btn-back-outline" onClick={handleBack}>Back</button>
                <button type="button" className="btn-continue-solid" onClick={handleNext}>Continue</button>
              </div>
            </div>
          )}

          {/* STEP 4: REVIEW AND PAY */}
          {currentStep === 4 && (
            <div className="step-card-content">
              {/* Sankalpam Details Form */}
              <div className="step-box">
                <h3 className="box-title">Family Sankalpam Details</h3>
                <p className="box-sub">Purohit will use these details to recite the sacred Sankalpam during the ritual.</p>

                <div className="sankalpam-form-grid">
                  <div className="form-field">
                    <label>Karta (Main Devotee) Full Name *</label>
                    <input 
                      type="text" 
                      value={kartaName}
                      onChange={(e) => setKartaName(e.target.value)}
                      placeholder="e.g. Bala Manikanta"
                      className="ref-input"
                    />
                  </div>

                  <div className="form-field">
                    <label>Spouse Name (if applicable)</label>
                    <input 
                      type="text" 
                      value={spouseName}
                      onChange={(e) => setSpouseName(e.target.value)}
                      placeholder="e.g. Lakshmi"
                      className="ref-input"
                    />
                  </div>

                  <div className="form-field">
                    <label>Gotram *</label>
                    <input 
                      type="text" 
                      value={gotram}
                      onChange={(e) => setGotram(e.target.value)}
                      placeholder="e.g. Kashyapa / Bharadwaja"
                      className="ref-input"
                    />
                  </div>

                  <div className="form-field">
                    <label>Janma Nakshatram</label>
                    <input 
                      type="text" 
                      value={nakshatram}
                      onChange={(e) => setNakshatram(e.target.value)}
                      placeholder="e.g. Rohini / Hasta"
                      className="ref-input"
                    />
                  </div>

                  <div className="form-field full-col">
                    <label>Mobile Number for WhatsApp Updates *</label>
                    <input 
                      type="tel" 
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="ref-input"
                    />
                  </div>
                </div>
              </div>

              {/* If Purohit Only: 2 Options (1. Pay Now, 2. Pay Later) */}
              {isPurohitOnly && (
                <div className="step-box" style={{ marginTop: '16px', border: '1px solid #E5E0D8' }}>
                  <h3 className="box-title" style={{ fontSize: '1.1rem', marginBottom: '6px' }}>Select Payment Option</h3>
                  <p className="box-sub" style={{ margin: 0 }}>Choose whether you prefer to pay online now or pay the Purohit directly at the ceremony.</p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px', marginTop: '14px' }}>
                    {/* Option 1: Pay Now */}
                    <div
                      onClick={() => setPurohitPaymentOption('pay_now')}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        border: purohitPaymentOption === 'pay_now' ? '2px solid #7C1B2C' : '1px solid #D9D2C9',
                        backgroundColor: purohitPaymentOption === 'pay_now' ? '#FDF8F5' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: purohitPaymentOption === 'pay_now' ? '5px solid #7C1B2C' : '2px solid #B0A79E',
                            backgroundColor: '#FFF'
                          }} />
                          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1B1510' }}>1. Pay Now</span>
                        </div>
                        <p style={{ margin: '4px 0 10px 28px', fontSize: '0.84rem', color: '#6A6258', lineHeight: 1.4 }}>
                          Pay online securely now via UPI (GPay/PhonePe), Credit/Debit Card, or NetBanking.
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 800, color: '#7C1B2C', fontSize: '1.15rem' }}>
                        ₹{totalAmount.toLocaleString('en-IN')}
                      </div>
                    </div>

                    {/* Option 2: Pay Later */}
                    <div
                      onClick={() => setPurohitPaymentOption('pay_later')}
                      style={{
                        padding: '16px',
                        borderRadius: '10px',
                        border: purohitPaymentOption === 'pay_later' ? '2px solid #7C1B2C' : '1px solid #D9D2C9',
                        backgroundColor: purohitPaymentOption === 'pay_later' ? '#FDF8F5' : '#FFFFFF',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                          <div style={{
                            width: '18px',
                            height: '18px',
                            borderRadius: '50%',
                            border: purohitPaymentOption === 'pay_later' ? '5px solid #7C1B2C' : '2px solid #B0A79E',
                            backgroundColor: '#FFF'
                          }} />
                          <span style={{ fontWeight: 700, fontSize: '1rem', color: '#1B1510' }}>2. Pay Later</span>
                        </div>
                        <p style={{ margin: '4px 0 10px 28px', fontSize: '0.84rem', color: '#6A6258', lineHeight: 1.4 }}>
                          Pay Dakshina directly to the Purohit at your home/venue after the ceremony is conducted.
                        </p>
                      </div>
                      <div style={{ textAlign: 'right', fontWeight: 700, color: '#15803D', fontSize: '0.98rem' }}>
                        Pay at Venue (Cash/UPI)
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* If Complete Package: 1/4th Advance Notice */}
              {!isPurohitOnly && (
                <div className="step-box" style={{ marginTop: '16px', background: '#FFFDF9', border: '1px solid #F5DEB3' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '1.25rem' }}>💳</span>
                      <h4 style={{ margin: 0, fontSize: '1.02rem', fontWeight: 700, color: '#7C1B2C' }}>
                        1/4 Advance Deposit Required
                      </h4>
                    </div>
                    <span style={{ fontSize: '0.8rem', fontWeight: 700, background: '#FBEBEF', color: '#7C1B2C', padding: '3px 10px', borderRadius: '12px' }}>
                      25% Advance
                    </span>
                  </div>
                  <p style={{ margin: '0 0 12px 0', fontSize: '0.88rem', color: '#6A5D52', lineHeight: 1.4 }}>
                    To confirm the complete arranged package with Samagri kit sourcing and catering slots, 1/4th of the total package amount is payable today. The remaining 3/4th balance is due on the ceremony day.
                  </p>
                  <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', paddingTop: '10px', borderTop: '1px dashed #E5D5C5' }}>
                    <div>
                      <span style={{ fontSize: '0.78rem', color: '#888', display: 'block' }}>Advance Due Today (1/4):</span>
                      <strong style={{ fontSize: '1.25rem', color: '#7C1B2C' }}>₹{advanceAmount.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ borderLeft: '1px solid #E5D5C5', paddingLeft: '20px' }}>
                      <span style={{ fontSize: '0.78rem', color: '#888', display: 'block' }}>Remaining Balance (3/4):</span>
                      <strong style={{ fontSize: '1.1rem', color: '#444' }}>₹{remainingAmount.toLocaleString('en-IN')}</strong>
                    </div>
                  </div>
                </div>
              )}

              {bookingError && (
                <div className="booking-error-banner" style={{ marginTop: '16px' }}>
                  {bookingError}
                </div>
              )}

              {/* Final Confirm Actions */}
              <div className="step-action-buttons">
                <button type="button" className="btn-back-outline" onClick={handleBack} disabled={isSubmittingBooking}>
                  Back
                </button>
                <button 
                  type="button" 
                  className="btn-continue-solid highlight-confirm" 
                  onClick={handleNext}
                  disabled={isSubmittingBooking}
                >
                  {isSubmittingBooking
                    ? 'Saving Booking to Database...'
                    : isPurohitOnly
                      ? (purohitPaymentOption === 'pay_now'
                          ? `Pay Now · ₹${totalAmount.toLocaleString('en-IN')}`
                          : 'Confirm Booking (Pay Later)')
                      : `Pay Advance (1/4) · ₹${advanceAmount.toLocaleString('en-IN')}`}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Sticky Summary Sidebar */}
        <div className="wizard-sidebar-column">
          <div className="summary-card-sticky">
            {/* Header: Pooja Artwork + Title */}
            <div className="summary-header-row">
              <div className="summary-thumb-box">
                {renderThumbArt()}
              </div>
              <div className="summary-pooja-title-box">
                <h3 className="summary-pooja-title font-sans">{pooja.title}</h3>
                <span className="summary-pooja-sub">{initialTradition} Vidhi · {pooja.duration}</span>
              </div>
            </div>

            {/* Key-Value Details */}
            <div className="summary-kv-section">
              <div className="summary-kv-row">
                <span className="kv-label">When</span>
                <span className="kv-val">{activeSlotDisplay}</span>
              </div>
              <div className="summary-kv-row">
                <span className="kv-label">Where</span>
                <span className="kv-val">{finalAddressLine}</span>
              </div>
              <div className="summary-kv-row">
                <span className="kv-label">Purohit</span>
                <span className={`kv-val ${chosenPurohit ? 'purohit-chosen' : 'purohit-not-chosen'}`} style={{ color: chosenPurohit ? '#15803D' : '#8C6B1C', fontWeight: chosenPurohit ? 700 : 500 }}>
                  {chosenPurohit ? chosenPurohit.name : 'Select in Step 2'}
                </span>
              </div>
              <div className="summary-kv-row">
                <span className="kv-label">Package</span>
                <span className="kv-val" style={{ fontWeight: 600, color: currentStep >= 3 ? '#7C1B2C' : '#777' }}>
                  {currentStep >= 3 ? (bookingType === 'purohit' ? 'Purohit only' : 'Complete Package') : 'Select in Step 3'}
                </span>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="summary-pricing-section">
              <div className="pricing-row">
                <span className="price-item-name">
                  Purohit Dakshina {chosenPurohit ? '' : '(Step 2)'}
                </span>
                <span className="price-item-val" style={{ color: chosenPurohit ? '#1a1a1a' : '#888' }}>
                  {chosenPurohit ? `₹${dakshinaAmount.toLocaleString('en-IN')}` : 'To be selected'}
                </span>
              </div>

              {currentStep >= 3 && bookingType === 'complete' && includeSamagri && (
                <div className="pricing-row">
                  <span className="price-item-name">Pooja Samagri kit</span>
                  <span className="price-item-val">₹{samagriAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {currentStep >= 3 && bookingType === 'complete' && includeBhojanalu && (
                <div className="pricing-row">
                  <span className="price-item-name">
                    Bhojanalu ({cateringType}) - {guestCount} × ₹{mealRate}
                  </span>
                  <span className="price-item-val">₹{bhojanaluAmount.toLocaleString('en-IN')}</span>
                </div>
              )}

              {currentStep >= 3 && bookingType === 'complete' ? (
                <>
                  <div className="pricing-row">
                    <span className="price-item-name">Coordination fee</span>
                    <span className="price-item-val">₹{coordinationFee.toLocaleString('en-IN')}</span>
                  </div>

                  <div className="pricing-row">
                    <span className="price-item-name">GST on fees (18%)</span>
                    <span className="price-item-val">₹{gst.toLocaleString('en-IN')}</span>
                  </div>
                </>
              ) : (
                <div className="pricing-row" style={{ color: '#2E7D32', fontSize: '0.86rem' }}>
                  <span className="price-item-name">Platform & Coordination fee</span>
                  <span className="price-item-val" style={{ fontWeight: 600 }}>₹0 (Waived)</span>
                </div>
              )}
            </div>

            {/* Total Row */}
            <div className="summary-total-row">
              <span className="total-label">{bookingType === 'purohit' ? 'Total Payable (Purohit only)' : 'Total Package Value'}</span>
              <span className="total-amount" style={{ color: chosenPurohit ? '#7C1B2C' : '#888', fontSize: chosenPurohit ? '1.5rem' : '1.15rem' }}>
                {chosenPurohit ? `₹${totalAmount.toLocaleString('en-IN')}` : 'Pending selection'}
              </span>
            </div>

            {/* Advance 1/4th row for Complete Package */}
            {currentStep >= 3 && bookingType === 'complete' && chosenPurohit && (
              <div style={{ marginTop: '10px', padding: '10px 12px', background: '#FFFDF9', border: '1px solid #F5DEB3', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 700, color: '#7C1B2C' }}>
                  <span>Advance Due Today (1/4):</span>
                  <span style={{ fontSize: '1.05rem' }}>₹{advanceAmount.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.84rem', color: '#666', marginTop: '4px' }}>
                  <span>Balance Due at Venue (3/4):</span>
                  <span>₹{remainingAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>
            )}

            {/* Safety Trust Note */}
            <p className="summary-trust-note">
              Held safely and released after you confirm the ceremony.
            </p>

            {/* Policy & Operational Guarantee Notice from ps.app_setting */}
            <div style={{ marginTop: '16px', background: '#F8FBF8', border: '1px solid #DCFCE7', borderRadius: '10px', padding: '12px 14px', fontSize: '0.82rem', color: '#166534', display: 'flex', alignItems: 'flex-start', gap: '8px', textAlign: 'left' }}>
              <span style={{ fontSize: '1.1rem' }}>🛡️</span>
              <div>
                <strong>Peace of Mind Guarantee:</strong> 100% full refund if cancelled up to 72 hours prior to muhurtham. Purohit direct call contact is unlocked 24 hours prior.
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .booking-page-root {
          padding-top: 16px;
          padding-bottom: 80px;
        }

        .booking-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.88rem;
          margin-bottom: 12px;
        }

        .breadcrumb-btn {
          color: var(--primary-maroon, #7C1B2C);
          font-weight: 600;
          background: transparent;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .breadcrumb-btn:hover {
          text-decoration: underline;
        }
        .breadcrumb-sep {
          color: var(--text-light, #999);
        }
        .breadcrumb-curr {
          color: var(--text-dark, #1a1a1a);
          font-weight: 600;
        }

        .booking-title {
          font-size: 2.2rem;
          font-weight: 800;
          color: var(--text-dark, #1a1a1a);
          letter-spacing: -0.5px;
          margin-bottom: 24px;
        }

        /* Steps Bar */
        .steps-progress-row {
          display: flex;
          gap: 12px;
          margin-bottom: 32px;
          overflow-x: auto;
          padding-bottom: 4px;
        }

        .step-pill {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 18px;
          background: #FFFFFF;
          border: 1px solid #E5E0D8;
          border-radius: 9999px;
          font-size: 0.92rem;
          font-weight: 600;
          color: #716964;
          cursor: pointer;
          transition: all 0.15s ease;
          flex-shrink: 0;
        }

        .step-pill.active {
          border-color: #8C2534;
          background: #FFFFFF;
          color: #8C2534;
          box-shadow: 0 0 0 1px #8C2534;
        }

        .step-pill.done {
          border-color: #15803D;
          color: #15803D;
        }

        .step-circle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #EDE6D8;
          color: #1a1a1a;
          font-size: 0.78rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .step-pill.active .step-circle {
          background: #8C2534;
          color: #FFFFFF;
        }

        .step-pill.done .step-circle {
          background: #15803D;
          color: #FFFFFF;
        }

        /* Layout Grid */
        .booking-layout-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 36px;
          align-items: start;
        }

        .wizard-main-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .step-card-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .step-box {
          background: #FFFFFF;
          border: 1px solid #EFEAE2;
          border-radius: 16px;
          padding: 24px 28px;
          box-shadow: 0 1px 4px rgba(0,0,0,0.02);
        }

        .box-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 8px;
        }

        .box-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          margin: 0;
        }

        .when-mode-pills {
          display: flex;
          gap: 8px;
        }

        .when-mode-pill {
          padding: 6px 14px;
          border-radius: 4px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid #D9D2C9;
          background: #FFFFFF;
          color: #333333;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .when-mode-pill.active {
          background: #801828;
          border-color: #801828;
          color: #FFFFFF;
        }

        .box-sub {
          font-size: 0.9rem;
          color: #666666;
          line-height: 1.5;
          margin-bottom: 16px;
        }

        /* EXACT REFERENCE STYLES FOR WHERE FILTER BUTTONS */
        .location-types-row {
          display: flex;
          gap: 12px;
          margin-top: 12px;
          margin-bottom: 18px;
        }

        .loc-type-btn {
          padding: 8px 24px;
          border-radius: 4px;
          border: 1px solid #D9D2C9;
          background: #FFFFFF;
          color: #333333;
          font-size: 0.96rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .loc-type-btn.active {
          background: #801828;
          border-color: #801828;
          color: #FFFFFF;
          font-weight: 700;
        }

        /* EXACT REFERENCE STYLES FOR RADIO CARDS */
        .slot-cards-list, .address-cards-list {
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .custom-radio-card {
          display: flex;
          align-items: center;
          padding: 16px 20px;
          border: 1px solid #EAE5DE;
          border-radius: 16px;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s ease;
          gap: 16px;
        }

        .custom-radio-card:hover {
          border-color: #8C2534;
        }

        .custom-radio-card.selected {
          border: 1.5px solid #8C2534;
          background: #FFFFFF;
        }

        /* Custom Radio Outer Ring & Inner Dot */
        .ref-radio-dot {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1.5px solid #888888;
          background: transparent;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: all 0.15s ease;
        }

        .ref-radio-dot.selected {
          border: 2px solid #8C2534;
          background: #FFFFFF;
        }

        .ref-radio-inner {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #8C2534;
        }

        .addr-info, .slot-info {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .addr-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .addr-line {
          font-size: 0.92rem;
          color: #666666;
          margin-top: 3px;
        }

        .slot-datetime {
          font-size: 1rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .slot-sub {
          font-size: 0.86rem;
          color: #666666;
          margin-top: 2px;
        }

        .btn-addr-edit {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 6px 12px;
          background: #F8F5F0;
          border: 1px solid #E5E0D8;
          border-radius: 6px;
          font-size: 0.82rem;
          font-weight: 600;
          color: #7C1B2C;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-addr-edit:hover {
          background: #7C1B2C;
          color: #FFFFFF;
          border-color: #7C1B2C;
        }

        .btn-add-address-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          background: #FFFFFF;
          border: 1px dashed #8C2534;
          border-radius: 8px;
          color: #8C2534;
          font-size: 0.92rem;
          font-weight: 600;
          cursor: pointer;
          margin-top: 14px;
          transition: all 0.15s ease;
          width: fit-content;
        }

        .btn-add-address-trigger:hover {
          background: #FFF5F6;
        }

        /* Inline Edit / Add Address Form */
        .inline-edit-card, .inline-add-card {
          padding: 18px 22px;
          border: 1.5px solid #8C2534;
          border-radius: 12px;
          background: #FFFDFD;
          display: flex;
          flex-direction: column;
          gap: 14px;
        }

        .edit-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: #8C2534;
          margin: 0;
        }

        .edit-grid, .custom-datetime-grid, .sankalpam-form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 14px;
        }

        .full-col {
          grid-column: span 2;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .form-field label {
          font-size: 0.82rem;
          font-weight: 700;
          color: #4A4441;
        }

        .ref-input, .ref-select, .form-field input {
          padding: 10px 14px;
          border: 1px solid #D9D2C9;
          border-radius: 6px;
          font-size: 0.92rem;
          color: #1a1a1a;
          outline: none;
          background: #FFFFFF;
          transition: border-color 0.15s ease;
        }

        .ref-input:focus, .ref-select:focus, .form-field input:focus {
          border-color: #8C2534;
        }

        .edit-actions-row {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 6px;
        }

        .btn-cancel-edit {
          padding: 7px 16px;
          background: #FFFFFF;
          border: 1px solid #D9D2C9;
          border-radius: 6px;
          font-size: 0.86rem;
          font-weight: 600;
          color: #555555;
          cursor: pointer;
        }

        .btn-save-edit {
          padding: 7px 18px;
          background: #8C2534;
          border: 1px solid #8C2534;
          border-radius: 6px;
          font-size: 0.86rem;
          font-weight: 600;
          color: #FFFFFF;
          cursor: pointer;
        }

        .custom-venue-box {
          margin-top: 14px;
        }

        /* Step 2: Purohits */
        .step-section-info {
          font-size: 0.95rem;
          color: #1a1a1a;
          margin-bottom: 14px;
        }

        .purohit-lang-filter-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          margin-bottom: 20px;
        }

        .lang-pill-btn {
          padding: 6px 14px;
          border: 1px solid #D9D2C9;
          border-radius: 9999px;
          background: #FFFFFF;
          font-size: 0.84rem;
          font-weight: 600;
          color: #333333;
          cursor: pointer;
        }

        .lang-pill-btn.active {
          background: #8C2534;
          border-color: #8C2534;
          color: #FFFFFF;
        }

        .purohit-cards-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }

        .purohit-profile-card {
          background: #FFFFFF;
          border: 1px solid #EFEAE2;
          border-radius: 12px;
          padding: 20px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          transition: all 0.15s ease;
        }

        .purohit-profile-card.selected {
          border-color: #8C2534;
          box-shadow: 0 0 0 1px #8C2534;
          background: #FFFAFA;
        }

        .purohit-card-top {
          display: flex;
          gap: 14px;
          margin-bottom: 16px;
        }

        .purohit-avatar-circle {
          width: 46px;
          height: 46px;
          border-radius: 50%;
          background: #F3DEBE;
          color: #6C2B1D;
          font-size: 1rem;
          font-weight: 800;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .purohit-details-col {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .purohit-name {
          font-size: 1.02rem;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .purohit-tags-row {
          display: flex;
          gap: 6px;
          margin: 2px 0;
        }

        .verified-pill {
          background: #E8F5E9;
          color: #2E7D32;
          font-size: 0.72rem;
          font-weight: 700;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .tradition-pill {
          background: #ECEFF1;
          color: #546E7A;
          font-size: 0.72rem;
          font-weight: 600;
          padding: 2px 7px;
          border-radius: 4px;
        }

        .purohit-lineage-text {
          font-size: 0.82rem;
          color: #666666;
        }

        .purohit-rating-row {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 0.82rem;
        }

        .rating-star {
          font-weight: 800;
          color: #B45309;
        }

        .rating-count, .distance-text {
          color: #666666;
        }

        .purohit-card-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-top: 1px solid #F4EFE6;
          padding-top: 14px;
        }

        .purohit-dakshina-box {
          display: flex;
          flex-direction: column;
        }

        .dakshina-sub {
          font-size: 0.72rem;
          color: #666666;
          font-weight: 600;
        }

        .dakshina-amount {
          font-size: 1.05rem;
          font-weight: 800;
          color: #1a1a1a;
        }

        .btn-select-purohit {
          padding: 8px 18px;
          border: 1px solid #8C2534;
          border-radius: 9999px;
          background: #FFFFFF;
          color: #8C2534;
          font-size: 0.86rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-select-purohit.selected {
          background: #8C2534;
          color: #FFFFFF;
        }

        /* Step 3: Package Options */
        .package-item-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }

        .package-price-tag {
          font-size: 1.1rem;
          font-weight: 800;
          color: #7C1B2C;
        }

        .catering-toggle-row {
          display: flex;
          gap: 10px;
          margin-bottom: 14px;
        }

        .catering-pill {
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 600;
          border: 1px solid #D9D2C9;
          background: #FFFFFF;
          color: #333333;
          cursor: pointer;
        }

        .catering-pill.active {
          background: #8C2534;
          border-color: #8C2534;
          color: #FFFFFF;
        }

        .package-checkbox-row {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          color: #1a1a1a;
          cursor: pointer;
        }

        .custom-checkbox {
          accent-color: #8C2534;
          width: 18px;
          height: 18px;
        }

        .guest-counter-box {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-top: 18px;
          padding-top: 16px;
          border-top: 1px dashed #E5E0D8;
        }

        .guest-label {
          font-size: 0.92rem;
          font-weight: 600;
          color: #4A4441;
        }

        .stepper-wrap {
          display: flex;
          align-items: center;
          border: 1px solid #D9D2C9;
          border-radius: 6px;
          overflow: hidden;
        }

        .btn-stepper {
          width: 34px;
          height: 34px;
          background: #F4EFE6;
          border: none;
          font-size: 1.1rem;
          font-weight: 700;
          color: #1a1a1a;
          cursor: pointer;
        }

        .stepper-count {
          padding: 0 16px;
          font-size: 0.95rem;
          font-weight: 700;
          color: #1a1a1a;
        }

        .stepper-calc-sub {
          font-size: 0.92rem;
          font-weight: 700;
          color: #8C2534;
        }

        /* Step 4: Review and Pay */
        .payment-modes-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
          margin-top: 14px;
        }

        .payment-mode-radio {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 18px;
          border: 1px solid #EAE5DE;
          border-radius: 12px;
          background: #FFFFFF;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .payment-mode-radio.active {
          border-color: #8C2534;
          background: #FFFBFB;
        }

        .pay-icon {
          font-size: 1.25rem;
        }

        .pay-label {
          font-size: 0.94rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .booking-error-banner {
          background: #FEE2E2;
          color: #991B1B;
          padding: 12px 16px;
          border-radius: 8px;
          font-size: 0.92rem;
          font-weight: 600;
        }

        .step-action-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 10px;
        }

        .btn-back-outline {
          padding: 12px 28px;
          border: 1px solid #D9D2C9;
          border-radius: 8px;
          background: #FFFFFF;
          color: #4A4441;
          font-size: 0.95rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-continue-solid {
          padding: 12px 32px;
          border: 1px solid #8C2534;
          border-radius: 8px;
          background: #8C2534;
          color: #FFFFFF;
          font-size: 0.98rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .btn-continue-solid:hover {
          background: #731B28;
        }

        .btn-continue-solid.highlight-confirm {
          background: #15803D;
          border-color: #15803D;
        }

        /* Right Sticky Summary Sidebar */
        .summary-card-sticky {
          position: sticky;
          top: 86px;
          background: #FFFFFF;
          border: 1px solid #EFEAE2;
          border-radius: 16px;
          padding: 24px;
          box-shadow: 0 4px 16px rgba(0,0,0,0.04);
        }

        .summary-header-row {
          display: flex;
          gap: 14px;
          align-items: center;
          padding-bottom: 16px;
          border-bottom: 1px solid #F4EFE6;
        }

        .summary-thumb-box {
          width: 54px;
          height: 54px;
          border-radius: 10px;
          background: #FFF5E6;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          flex-shrink: 0;
        }

        .summary-pooja-title-box {
          display: flex;
          flex-direction: column;
        }

        .summary-pooja-title {
          font-size: 1.15rem;
          font-weight: 800;
          color: #1a1a1a;
          line-height: 1.25;
        }

        .summary-pooja-sub {
          font-size: 0.8rem;
          color: #666666;
          margin-top: 2px;
        }

        .summary-kv-section {
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 1px solid #F4EFE6;
        }

        .summary-kv-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.86rem;
        }

        .kv-label {
          color: #666666;
          font-weight: 500;
        }

        .kv-val {
          color: #1a1a1a;
          font-weight: 700;
          text-align: right;
          max-width: 210px;
        }

        .purohit-chosen {
          color: #15803D;
        }

        .purohit-not-chosen {
          color: #B45309;
        }

        .summary-pricing-section {
          padding: 16px 0;
          display: flex;
          flex-direction: column;
          gap: 10px;
          border-bottom: 1px solid #F4EFE6;
        }

        .pricing-row {
          display: flex;
          justify-content: space-between;
          font-size: 0.88rem;
        }

        .price-item-name {
          color: #4A4441;
        }

        .price-item-val {
          font-weight: 700;
          color: #1a1a1a;
        }

        .summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 16px;
        }

        .total-label {
          font-size: 1rem;
          font-weight: 800;
          color: #1a1a1a;
        }

        .total-amount {
          font-size: 1.35rem;
          font-weight: 900;
          color: #7C1B2C;
        }

        .summary-trust-note {
          margin-top: 14px;
          font-size: 0.78rem;
          color: #716964;
          text-align: center;
          line-height: 1.4;
        }

        @media (max-width: 900px) {
          .booking-layout-grid {
            grid-template-columns: 1fr;
          }
          .purohit-cards-grid {
            grid-template-columns: 1fr;
          }
          .edit-grid, .custom-datetime-grid, .sankalpam-form-grid {
            grid-template-columns: 1fr;
          }
          .full-col {
            grid-column: span 1;
          }
        }
      `}</style>
    </div>
  );
};
