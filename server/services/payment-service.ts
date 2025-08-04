// Use native fetch in Node 18+
import { 
  type PaymentTransaction,
  type KlarnaOrder,
  type SwishPayment,
  type InsertPaymentTransaction,
  type InsertKlarnaOrder,
  type InsertSwishPayment
} from '@shared/payment-schema';

export interface PaymentProvider {
  createPayment(amount: number, currency: string, metadata: any): Promise<PaymentResult>;
  capturePayment(paymentId: string): Promise<PaymentResult>;
  refundPayment(paymentId: string, amount?: number): Promise<PaymentResult>;
  getPaymentStatus(paymentId: string): Promise<PaymentResult>;
}

export interface PaymentResult {
  success: boolean;
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled' | 'refunded';
  redirectUrl?: string;
  qrCode?: string;
  error?: string;
  providerData?: any;
}

// Klarna Payment Provider
export class KlarnaPaymentProvider implements PaymentProvider {
  private baseUrl: string;
  private username: string;
  private password: string;

  constructor() {
    this.baseUrl = process.env.KLARNA_ENVIRONMENT === 'production' 
      ? 'https://api.klarna.com' 
      : 'https://api.playground.klarna.com';
    this.username = process.env.KLARNA_USERNAME || '';
    this.password = process.env.KLARNA_PASSWORD || '';
  }

  private getAuthHeader(): string {
    const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
    return `Basic ${credentials}`;
  }

  async createPayment(amount: number, currency: string = 'SEK', metadata: any): Promise<PaymentResult> {
    try {
      // Create Klarna payment session
      const sessionPayload = {
        purchase_country: 'SE',
        purchase_currency: currency,
        locale: 'sv-SE',
        order_amount: amount * 100, // Convert to minor units (öre)
        order_lines: [{
          type: 'digital',
          name: metadata.planName || 'Klario Subscription',
          quantity: 1,
          unit_price: amount * 100,
          total_amount: amount * 100,
          tax_rate: 2500, // 25% Swedish VAT
          total_tax_amount: Math.round(amount * 100 * 0.2) // 20% of total for tax calculation
        }],
        merchant_urls: {
          confirmation: `${process.env.BASE_URL}/payment/klarna/confirm`,
          notification: `${process.env.BASE_URL}/api/payment/klarna/webhook`
        },
        billing_address: {
          given_name: metadata.firstName || '',
          family_name: metadata.lastName || '',
          email: metadata.email || '',
          street_address: metadata.address || '',
          postal_code: metadata.postalCode || '',
          city: metadata.city || '',
          country: 'SE'
        }
      };

      const response = await fetch(`${this.baseUrl}/payments/v1/sessions`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sessionPayload)
      });

      const sessionData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          paymentId: '',
          status: 'failed',
          error: sessionData.error_messages?.join(', ') || 'Failed to create Klarna session'
        };
      }

      // Generate authorization token for client
      const tokenResponse = await fetch(`${this.baseUrl}/payments/v1/sessions/${sessionData.session_id}/authorization-token`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        }
      });

      const tokenData = await tokenResponse.json();

      return {
        success: true,
        paymentId: sessionData.session_id,
        status: 'pending',
        providerData: {
          sessionId: sessionData.session_id,
          clientToken: tokenData.authorization_token,
          paymentMethodCategories: sessionData.payment_method_categories
        }
      };

    } catch (error) {
      console.error('Klarna payment creation error:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'Network error creating Klarna payment'
      };
    }
  }

  async capturePayment(authorizationToken: string): Promise<PaymentResult> {
    try {
      // Place order using authorization token
      const orderPayload = {
        purchase_country: 'SE',
        purchase_currency: 'SEK',
        locale: 'sv-SE'
      };

      const response = await fetch(`${this.baseUrl}/ordermanagement/v1/orders`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json',
          'Klarna-Idempotency-Key': `klario-${Date.now()}-${Math.random()}`
        },
        body: JSON.stringify({
          authorization_token: authorizationToken,
          ...orderPayload
        })
      });

      const orderData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          paymentId: authorizationToken,
          status: 'failed',
          error: orderData.error_messages?.join(', ') || 'Failed to capture Klarna payment'
        };
      }

      return {
        success: true,
        paymentId: orderData.order_id,
        status: 'completed',
        providerData: orderData
      };

    } catch (error) {
      console.error('Klarna payment capture error:', error);
      return {
        success: false,
        paymentId: authorizationToken,
        status: 'failed',
        error: 'Network error capturing Klarna payment'
      };
    }
  }

  async refundPayment(orderId: string, amount?: number): Promise<PaymentResult> {
    try {
      const refundPayload = amount ? { refunded_amount: amount * 100 } : {};

      const response = await fetch(`${this.baseUrl}/ordermanagement/v1/orders/${orderId}/refunds`, {
        method: 'POST',
        headers: {
          'Authorization': this.getAuthHeader(),
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundPayload)
      });

      const refundData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          paymentId: orderId,
          status: 'failed',
          error: 'Failed to refund Klarna payment'
        };
      }

      return {
        success: true,
        paymentId: orderId,
        status: 'refunded',
        providerData: refundData
      };

    } catch (error) {
      console.error('Klarna refund error:', error);
      return {
        success: false,
        paymentId: orderId,
        status: 'failed',
        error: 'Network error processing Klarna refund'
      };
    }
  }

  async getPaymentStatus(orderId: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`${this.baseUrl}/ordermanagement/v1/orders/${orderId}`, {
        method: 'GET',
        headers: {
          'Authorization': this.getAuthHeader()
        }
      });

      const orderData = await response.json();

      if (!response.ok) {
        return {
          success: false,
          paymentId: orderId,
          status: 'failed',
          error: 'Failed to get Klarna order status'
        };
      }

      // Map Klarna status to our status
      let status: PaymentResult['status'] = 'pending';
      switch (orderData.status) {
        case 'AUTHORIZED':
          status = 'pending';
          break;
        case 'CAPTURED':
          status = 'completed';
          break;
        case 'CANCELLED':
          status = 'cancelled';
          break;
        case 'EXPIRED':
          status = 'failed';
          break;
        default:
          status = 'pending';
      }

      return {
        success: true,
        paymentId: orderId,
        status,
        providerData: orderData
      };

    } catch (error) {
      console.error('Klarna status check error:', error);
      return {
        success: false,
        paymentId: orderId,
        status: 'failed',
        error: 'Network error checking Klarna status'
      };
    }
  }
}

// Swish Payment Provider
export class SwishPaymentProvider implements PaymentProvider {
  private baseUrl: string;
  private payeeAlias: string;
  private certificate: string;

  constructor() {
    this.baseUrl = process.env.SWISH_ENVIRONMENT === 'production' 
      ? 'https://cpc.getswish.net' 
      : 'https://mss.cpc.getswish.net';
    this.payeeAlias = process.env.SWISH_PAYEE_ALIAS || '';
    this.certificate = process.env.SWISH_CERTIFICATE || '';
  }

  async createPayment(amount: number, currency: string = 'SEK', metadata: any): Promise<PaymentResult> {
    try {
      const paymentReference = `klario-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const paymentPayload = {
        payeePaymentReference: paymentReference,
        callbackUrl: `${process.env.BASE_URL}/api/payment/swish/webhook`,
        payeeAlias: this.payeeAlias,
        amount: amount.toString(),
        currency: currency,
        message: `Klario - ${metadata.planName || 'Subscription'}`
      };

      // Note: Swish requires client certificate authentication
      // This is a simplified version - production requires proper certificate setup
      const response = await fetch(`${this.baseUrl}/swish-cpcapi/api/v2/paymentrequests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paymentPayload),
        // TODO: Add certificate authentication for production
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          success: false,
          paymentId: '',
          status: 'failed',
          error: errorData.message || 'Failed to create Swish payment'
        };
      }

      const locationHeader = response.headers.get('location');
      const paymentId = locationHeader?.split('/').pop() || '';

      // Generate QR code for payment
      const qrResponse = await fetch(`${this.baseUrl}/swish-cpcapi/api/v1/paymentrequests/${paymentId}/qrcodes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          format: 'png',
          size: 300
        })
      });

      let qrCode = '';
      if (qrResponse.ok) {
        const qrData = await qrResponse.text();
        qrCode = qrData; // Base64 encoded QR code
      }

      return {
        success: true,
        paymentId: paymentId,
        status: 'pending',
        qrCode: qrCode,
        providerData: {
          paymentReference: paymentReference,
          payeeAlias: this.payeeAlias
        }
      };

    } catch (error) {
      console.error('Swish payment creation error:', error);
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: 'Network error creating Swish payment'
      };
    }
  }

  async capturePayment(paymentId: string): Promise<PaymentResult> {
    // Swish payments are automatically captured when completed
    return this.getPaymentStatus(paymentId);
  }

  async refundPayment(paymentId: string, amount?: number): Promise<PaymentResult> {
    try {
      const refundReference = `klario-refund-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      const refundPayload = {
        payerPaymentReference: refundReference,
        originalPaymentReference: paymentId,
        payerAlias: this.payeeAlias,
        amount: amount?.toString(),
        currency: 'SEK',
        message: 'Klario Refund'
      };

      const response = await fetch(`${this.baseUrl}/swish-cpcapi/api/v1/refunds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(refundPayload)
      });

      if (!response.ok) {
        return {
          success: false,
          paymentId: paymentId,
          status: 'failed',
          error: 'Failed to create Swish refund'
        };
      }

      const locationHeader = response.headers.get('location');
      const refundId = locationHeader?.split('/').pop() || '';

      return {
        success: true,
        paymentId: refundId,
        status: 'refunded',
        providerData: {
          refundReference: refundReference,
          originalPaymentReference: paymentId
        }
      };

    } catch (error) {
      console.error('Swish refund error:', error);
      return {
        success: false,
        paymentId: paymentId,
        status: 'failed',
        error: 'Network error processing Swish refund'
      };
    }
  }

  async getPaymentStatus(paymentId: string): Promise<PaymentResult> {
    try {
      const response = await fetch(`${this.baseUrl}/swish-cpcapi/api/v1/paymentrequests/${paymentId}`, {
        method: 'GET'
      });

      if (!response.ok) {
        return {
          success: false,
          paymentId: paymentId,
          status: 'failed',
          error: 'Failed to get Swish payment status'
        };
      }

      const paymentData = await response.json();

      // Map Swish status to our status
      let status: PaymentResult['status'] = 'pending';
      switch (paymentData.status) {
        case 'CREATED':
          status = 'pending';
          break;
        case 'PAID':
          status = 'completed';
          break;
        case 'DECLINED':
        case 'ERROR':
          status = 'failed';
          break;
        case 'CANCELLED':
          status = 'cancelled';
          break;
        default:
          status = 'pending';
      }

      return {
        success: true,
        paymentId: paymentId,
        status,
        providerData: paymentData
      };

    } catch (error) {
      console.error('Swish status check error:', error);
      return {
        success: false,
        paymentId: paymentId,
        status: 'failed',
        error: 'Network error checking Swish status'
      };
    }
  }
}

// Payment Service Factory
export class PaymentService {
  private providers: Map<string, PaymentProvider> = new Map();

  constructor() {
    this.providers.set('klarna', new KlarnaPaymentProvider());
    this.providers.set('swish', new SwishPaymentProvider());
  }

  getProvider(method: string): PaymentProvider | null {
    return this.providers.get(method) || null;
  }

  async createPayment(method: string, amount: number, currency: string, metadata: any): Promise<PaymentResult> {
    const provider = this.getProvider(method);
    if (!provider) {
      return {
        success: false,
        paymentId: '',
        status: 'failed',
        error: `Unsupported payment method: ${method}`
      };
    }

    return provider.createPayment(amount, currency, metadata);
  }

  async capturePayment(method: string, paymentId: string): Promise<PaymentResult> {
    const provider = this.getProvider(method);
    if (!provider) {
      return {
        success: false,
        paymentId: paymentId,
        status: 'failed',
        error: `Unsupported payment method: ${method}`
      };
    }

    return provider.capturePayment(paymentId);
  }

  async refundPayment(method: string, paymentId: string, amount?: number): Promise<PaymentResult> {
    const provider = this.getProvider(method);
    if (!provider) {
      return {
        success: false,
        paymentId: paymentId,
        status: 'failed',
        error: `Unsupported payment method: ${method}`
      };
    }

    return provider.refundPayment(paymentId, amount);
  }

  async getPaymentStatus(method: string, paymentId: string): Promise<PaymentResult> {
    const provider = this.getProvider(method);
    if (!provider) {
      return {
        success: false,
        paymentId: paymentId,
        status: 'failed',
        error: `Unsupported payment method: ${method}`
      };
    }

    return provider.getPaymentStatus(paymentId);
  }
}

export const paymentService = new PaymentService();