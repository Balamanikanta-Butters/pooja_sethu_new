import { Platform } from 'react-native';

export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id: string;
  theme?: { color: string };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
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
    modal?: {
      ondismiss?: () => void;
      backdropclose?: boolean;
      escape?: boolean;
    };
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

/**
 * Opens Razorpay checkout modal in Web environments.
 * For Mobile (iOS/Android), use `<RazorpayWebViewModal />` which supports Expo Go & APKs.
 */
export const openRazorpayCheckout = async (
  options: RazorpayCheckoutOptions
): Promise<RazorpayPaymentResult> => {
  if (Platform.OS !== 'web') {
    throw new Error('On mobile platforms, use RazorpayWebViewModal to open checkout.');
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
      let isSettled = false;
      const checkout = new Razorpay({
        ...options,
        handler: (response: RazorpayPaymentResult) => {
          if (!isSettled) {
            isSettled = true;
            resolve(response);
          }
        },
        modal: {
          ondismiss: () => {
            if (!isSettled) {
              isSettled = true;
              reject(new Error('Payment was cancelled by user.'));
            }
          }
        }
      });

      checkout.on('payment.failed', (response) => {
        if (!isSettled) {
          isSettled = true;
          reject(new Error(response.error?.description || 'Payment failed'));
        }
      });
      checkout.open();
    } catch (error) {
      reject(error);
    }
  });
};
