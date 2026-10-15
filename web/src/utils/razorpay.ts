export type RazorpayCheckoutOptions = {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description: string;
  order_id?: string;
  theme?: { color: string };
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
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
  if (typeof window === 'undefined') return Promise.resolve(false);

  if ((window as RazorpayWindow).Razorpay) {
    return Promise.resolve(true);
  }

  return new Promise((resolve) => {
    const existingScript = document.getElementById('razorpay-script') as HTMLScriptElement | null;
    if (existingScript) {
      if ((window as RazorpayWindow).Razorpay) return resolve(true);
      existingScript.onload = () => resolve(Boolean((window as RazorpayWindow).Razorpay));
      return;
    }

    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(Boolean((window as RazorpayWindow).Razorpay));
    script.onerror = () => {
      script.remove();
      resolve(false);
    };

    document.body.appendChild(script);
  });
};

/**
 * Opens official Razorpay checkout modal in Web environment.
 */
export const openRazorpayCheckout = async (
  options: RazorpayCheckoutOptions
): Promise<RazorpayPaymentResult> => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    throw new Error('Razorpay SDK failed to load. Please check your internet connection.');
  }

  const Razorpay = (window as RazorpayWindow).Razorpay;
  if (!Razorpay) {
    throw new Error('Razorpay Checkout is unavailable in this browser window.');
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
              reject(new Error('Payment was cancelled by devotee.'));
            }
          }
        }
      });

      checkout.on('payment.failed', (response) => {
        if (!isSettled) {
          isSettled = true;
          reject(new Error(response.error?.description || 'Payment failed on Razorpay gateway.'));
        }
      });

      checkout.open();
    } catch (error) {
      reject(error);
    }
  });
};
