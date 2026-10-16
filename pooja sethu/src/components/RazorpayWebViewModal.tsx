import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Linking,
  Platform,
  Alert,
  SafeAreaView
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Ionicons } from '@expo/vector-icons';
import { RazorpayCheckoutOptions, RazorpayPaymentResult } from '../utils/razorpay';

export interface RazorpayWebViewModalProps {
  visible: boolean;
  options: RazorpayCheckoutOptions | null;
  onSuccess: (result: RazorpayPaymentResult) => void;
  onDismiss: () => void;
  onError: (error: Error) => void;
}

const buildRazorpayHTML = (options: RazorpayCheckoutOptions): string => {
  const cleanOptions: Record<string, any> = {
    key: options.key,
    amount: options.amount,
    currency: options.currency || 'INR',
    name: options.name || 'Pooja Sethu',
    description: options.description || 'Pooja Booking',
    theme: options.theme || { color: '#7C1B2C' },
    prefill: options.prefill || {}
  };

  if (options.order_id && typeof options.order_id === 'string' && options.order_id.trim()) {
    cleanOptions.order_id = options.order_id.trim();
  }

  const optionsJson = JSON.stringify(cleanOptions);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
  <title>Razorpay Checkout</title>
  <style>
    * { box-sizing: border-box; }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      background-color: #FDFBF7;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    .loader-box {
      text-align: center;
      padding: 24px;
    }
    .spinner {
      width: 44px;
      height: 44px;
      border: 4px solid #EEDBDF;
      border-top: 4px solid #7C1B2C;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 16px auto;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    .title {
      font-size: 16px;
      font-weight: 700;
      color: #7C1B2C;
    }
    .subtitle {
      font-size: 13px;
      color: #777777;
      margin-top: 6px;
    }
    .test-actions {
      margin-top: 24px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      align-items: center;
    }
    .btn-test {
      background: #7C1B2C;
      color: #fff;
      padding: 12px 20px;
      border-radius: 8px;
      border: none;
      font-weight: 600;
      font-size: 14px;
      cursor: pointer;
    }
  </style>
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
</head>
<body>
  <div class="loader-box" id="loader">
    <div class="spinner"></div>
    <div class="title" id="status-text">Connecting to Payment Gateway...</div>
    <div class="subtitle">Please do not press back or close the app</div>
    <div class="test-actions" id="test-box" style="display: none;">
      <button class="btn-test" onclick="simulateTestSuccess()">Complete Test Payment</button>
    </div>
  </div>

  <script>
    function notifyNative(type, payload) {
      if (window.ReactNativeWebView && window.ReactNativeWebView.postMessage) {
        window.ReactNativeWebView.postMessage(JSON.stringify({ type: type, payload: payload }));
      }
    }

    var config = ${optionsJson};

    function simulateTestSuccess() {
      notifyNative('PAYMENT_SUCCESS', {
        razorpay_payment_id: 'pay_test_' + Date.now(),
        razorpay_order_id: config.order_id || 'order_mock_' + Date.now(),
        razorpay_signature: 'test_signature_' + Date.now()
      });
    }

    config.handler = function(response) {
      notifyNative('PAYMENT_SUCCESS', response);
    };
    config.modal = {
      ondismiss: function() {
        notifyNative('MODAL_DISMISSED', {});
      },
      backdropclose: false,
      escape: false
    };

    function startCheckout() {
      try {
        if (typeof Razorpay === 'undefined') {
          return false;
        }
        var rzp = new Razorpay(config);
        rzp.on('payment.failed', function(response) {
          notifyNative('PAYMENT_FAILED', response.error || { description: 'Payment failed' });
        });
        rzp.open();

        if (config.key && config.key.indexOf('test') !== -1) {
          setTimeout(function() {
            var tb = document.getElementById('test-box');
            if (tb) tb.style.display = 'block';
          }, 3500);
        }
        return true;
      } catch (err) {
        notifyNative('ERROR', { message: err.message || 'Payment initialization error' });
        return true;
      }
    }

    // Wait until Razorpay SDK has finished loading
    var checkCount = 0;
    var timer = setInterval(function() {
      checkCount++;
      if (typeof Razorpay !== 'undefined') {
        clearInterval(timer);
        startCheckout();
      } else if (checkCount > 40) {
        clearInterval(timer);
        var st = document.getElementById('status-text');
        if (st) st.innerText = 'Test Mode Ready';
        var tb = document.getElementById('test-box');
        if (tb) tb.style.display = 'block';
      }
    }, 200);
  </script>
</body>
</html>`;
};

export const RazorpayWebViewModal: React.FC<RazorpayWebViewModalProps> = ({
  visible,
  options,
  onSuccess,
  onDismiss,
  onError
}) => {
  const [isPageLoading, setIsPageLoading] = useState(true);

  if (!visible || !options) {
    return null;
  }

  const handleClosePress = () => {
    Alert.alert(
      'Cancel Payment?',
      'Are you sure you want to cancel? Your booking will remain pending until completed.',
      [
        { text: 'Continue Payment', style: 'cancel' },
        {
          text: 'Cancel',
          style: 'destructive',
          onPress: onDismiss
        }
      ]
    );
  };

  const handleMessage = (event: any) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'PAYMENT_SUCCESS') {
        onSuccess(data.payload as RazorpayPaymentResult);
      } else if (data.type === 'PAYMENT_FAILED') {
        const errorDesc = data.payload?.description || 'Payment failed or was cancelled.';
        onError(new Error(errorDesc));
      } else if (data.type === 'MODAL_DISMISSED') {
        onDismiss();
      } else if (data.type === 'ERROR') {
        onError(new Error(data.payload?.message || 'Razorpay checkout encountered an error.'));
      }
    } catch (err: any) {
      console.error('[RazorpayWebView] Could not parse message:', err);
    }
  };

  const handleShouldStartLoadWithRequest = (request: any): boolean => {
    const url = request.url;

    // Allow internal web navigation
    if (
      url.startsWith('http://') ||
      url.startsWith('https://') ||
      url.startsWith('about:blank') ||
      url.startsWith('data:')
    ) {
      return true;
    }

    // Intercept UPI or external banking scheme URLs (e.g. upi://, tez://, phonepe://, paytmmp://)
    Linking.openURL(url).catch((err) => {
      console.warn('[RazorpayWebView] Could not open external app url:', url, err);
      Alert.alert(
        'App Not Found',
        'Could not open the selected UPI app. Please choose an alternative payment option (Cards, NetBanking, or QR code).'
      );
    });

    return false;
  };

  const htmlContent = buildRazorpayHTML(options);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={false}
      onRequestClose={handleClosePress}
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClosePress}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          >
            <Ionicons name="close" size={24} color="#333333" />
          </TouchableOpacity>
          <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Secure Payment</Text>
            <Text style={styles.headerSubtitle}>Pooja Sethu • Razorpay</Text>
          </View>
          <View style={{ width: 36 }} />
        </View>

        <View style={styles.webviewContainer}>
          <WebView
            originWhitelist={['*']}
            source={{ html: htmlContent, baseUrl: 'https://checkout.razorpay.com' }}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            onLoadStart={() => setIsPageLoading(true)}
            onLoadEnd={() => setIsPageLoading(false)}
            onMessage={handleMessage}
            onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
            onError={(syntheticEvent) => {
              const { nativeEvent } = syntheticEvent;
              onError(new Error(nativeEvent.description || 'Failed to load payment gateway'));
            }}
            style={styles.webview}
          />

          {isPageLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="large" color="#7C1B2C" />
              <Text style={styles.loadingText}>Initializing Payment...</Text>
            </View>
          )}
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE',
    backgroundColor: '#FFFFFF'
  },
  closeButton: {
    padding: 6,
    borderRadius: 20,
    backgroundColor: '#F5F5F5'
  },
  headerTitleContainer: {
    alignItems: 'center'
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#222222'
  },
  headerSubtitle: {
    fontSize: 11,
    color: '#888888',
    marginTop: 2
  },
  webviewContainer: {
    flex: 1,
    position: 'relative'
  },
  webview: {
    flex: 1,
    backgroundColor: '#FDFBF7'
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#555555',
    fontWeight: '500'
  }
});
