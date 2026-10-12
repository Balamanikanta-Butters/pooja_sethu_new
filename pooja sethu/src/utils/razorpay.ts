import { Platform } from 'react-native';

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  theme?: { color: string };
};

export type RazorpayPaymentResult = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type WebCheckoutInstance = {
  open: () => void;
  on: (event: string, callback: (response: { error?: { description?: string } }) => void) => void;
};

type RazorpayWindow = Window & {
  Razorpay?: new (options: RazorpayCheckoutOptions & {
    handler: (response: RazorpayPaymentResult) => void;
  }) => WebCheckoutInstance;
};

export const loadRazorpayScript = (): Promise<boolean> => {
  if (Platform.OS !== 'web') {
    return Promise.resolve(true);
  }

  if ((window as RazorpayWindow).Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-script') as HTMLScriptElement | null;
    const script = existingScript || document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(Boolean((window as RazorpayWindow).Razorpay));
    script.onerror = () => {
      script.remove();
      resolve(false);
    };

    if (!existingScript) {
      document.body.appendChild(script);
    }
  });
};

export const openRazorpayCheckout = async (
  options: RazorpayCheckoutOptions
): Promise<RazorpayPaymentResult> => {
  if (Platform.OS !== 'web') {
    const RazorpayCheckout = require('react-native-razorpay').default as {
      open: (checkoutOptions: RazorpayCheckoutOptions) => Promise<RazorpayPaymentResult>;
    };
    return RazorpayCheckout.open(options);
  }

  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load. Are you online?');
  }

  const Razorpay = (window as RazorpayWindow).Razorpay;
  if (!Razorpay) {
    throw new Error('Razorpay Checkout is unavailable in this browser.');
  }

  return new Promise((resolve, reject) => {
    try {
      const checkout = new Razorpay({
        ...options,
        handler: resolve
      });

      checkout.on('payment.failed', (response) => {
        reject(new Error(response.error?.description || 'Payment failed'));
      });
      checkout.open();
    } catch (error) {
      reject(error);
    }
  });
};
