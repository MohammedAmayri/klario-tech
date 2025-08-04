import { Customer, Campaign } from '@shared/schema';

export interface SMSProvider {
  sendSMS(to: string, message: string, businessName?: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendBulkSMS(messages: { to: string; message: string }[], businessName?: string): Promise<{ success: boolean; results: any[] }>;
}

// HelloSMS Service Implementation
export class HelloSMSService implements SMSProvider {
  private username: string;
  private password: string;
  private apiUrl: string;
  private sender: string;

  constructor() {
    this.username = process.env.HELLOSMS_USERNAME || '';
    this.password = process.env.HELLOSMS_PASSWORD || '';
    this.apiUrl = process.env.HELLOSMS_API_URL || 'https://api.hellosms.se/api/v1';
    this.sender = process.env.HELLOSMS_SENDER || 'Klario';
  }

  async sendSMS(to: string, message: string, businessName?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      if (!this.username || !this.password) {
        throw new Error('HelloSMS credentials not configured');
      }

      console.log(`📱 [HelloSMS] Sending SMS to: ${to}`);
      console.log(`📱 [HelloSMS] Message: ${message.substring(0, 50)}...`);

      // Clean phone number (remove spaces, dashes, etc.)
      const cleanPhone = to.replace(/[^\d+]/g, '');
      
      // Use business name as sender if provided, otherwise use default
      // HelloSMS sender name has max 11 characters limit
      let senderName = businessName || this.sender;
      if (senderName.length > 11) {
        senderName = senderName.substring(0, 11);
      }
      
      // Create Basic Auth header
      const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      
      const requestBody = {
        to: [cleanPhone],
        message: message,
        from: senderName, // Use business name as sender
      };
      
      console.log('📱 [HelloSMS] Request body:', JSON.stringify(requestBody, null, 2));
      
      const response = await fetch(`${this.apiUrl}/sms/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.log('📱 [HelloSMS] Error response:', response.status, errorText);
        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { message: errorText };
        }
        throw new Error(errorData.message || `HTTP ${response.status}: ${errorText}`);
      }

      const result = await response.json();
      
      return {
        success: result.status === 'success',
        messageId: result.messageIds?.[0]?.apiMessageId,
      };
    } catch (error) {
      console.error('HelloSMS Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  async sendBulkSMS(messages: { to: string; message: string }[], businessName?: string): Promise<{ success: boolean; results: any[] }> {
    try {
      if (!this.username || !this.password) {
        throw new Error('HelloSMS credentials not configured');
      }

      console.log(`📱 [HelloSMS] Sending bulk SMS to ${messages.length} recipients`);

      // HelloSMS supports up to 1500 recipients per request
      const recipients = messages.map(msg => msg.to.replace(/[^\d+]/g, ''));
      const credentials = Buffer.from(`${this.username}:${this.password}`).toString('base64');
      
      // For bulk, we send one message to multiple recipients
      const firstMessage = messages[0]?.message || '';
      const senderName = businessName || this.sender;
      
      const response = await fetch(`${this.apiUrl}/sms/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to: recipients,
          message: firstMessage,
          from: senderName, // Use business name as sender
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP ${response.status}`);
      }

      const result = await response.json();
      
      return {
        success: result.status === 'success',
        results: result.messageIds || [],
      };
    } catch (error) {
      console.error('HelloSMS Bulk Error:', error);
      
      // Fallback to individual sends if bulk fails
      const results = [];
      for (const msg of messages) {
        const result = await this.sendSMS(msg.to, msg.message, businessName);
        results.push({ to: msg.to, ...result });
        
        // Add delay between requests
        await new Promise(resolve => setTimeout(resolve, 200));
      }
      
      const successCount = results.filter(r => r.success).length;
      
      return {
        success: successCount === results.length,
        results,
      };
    }
  }
}

// Mock SMS Service for development/testing
export class MockSMSService implements SMSProvider {
  async sendSMS(to: string, message: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    console.log(`📱 [MOCK SMS] Sending to: ${to}`);
    console.log(`📱 [MOCK SMS] Message: ${message}`);
    
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    return {
      success: true,
      messageId: `mock-sms-${Date.now()}`,
    };
  }

  async sendBulkSMS(messages: { to: string; message: string }[]): Promise<{ success: boolean; results: any[] }> {
    console.log(`📱 [MOCK SMS] Sending bulk SMS to ${messages.length} recipients`);
    
    const results = [];
    for (const msg of messages) {
      const result = await this.sendSMS(msg.to, msg.message);
      results.push({ to: msg.to, ...result });
    }
    
    return {
      success: true,
      results,
    };
  }
}

export class SMSCampaignService {
  private smsProvider: SMSProvider;

  constructor(smsProvider: SMSProvider) {
    this.smsProvider = smsProvider;
  }

  async sendCampaignToCustomers(campaign: Campaign, customers: Customer[]): Promise<{
    success: boolean;
    totalSent: number;
    totalFailed: number;
    results: any[];
  }> {
    const messagesToSend = customers
      .filter(customer => customer.phone && customer.consentGiven)
      .map(customer => ({
        to: customer.phone!,
        message: this.personalizeMessage(campaign.message, customer),
      }));

    console.log(`📱 Sending SMS campaign "${campaign.name}" to ${messagesToSend.length} customers`);

    const result = await this.smsProvider.sendBulkSMS(messagesToSend);
    
    const totalSent = result.results.filter(r => r.success).length;
    const totalFailed = result.results.filter(r => !r.success).length;

    return {
      success: result.success,
      totalSent,
      totalFailed,
      results: result.results,
    };
  }

  private personalizeMessage(template: string, customer: Customer): string {
    let message = template
      .replace(/\{\{name\}\}/g, customer.name)
      .replace(/\{\{email\}\}/g, customer.email || '')
      .replace(/\{\{phone\}\}/g, customer.phone || '');

    // Ensure SMS is under 160 characters for standard SMS
    if (message.length > 160) {
      message = message.substring(0, 157) + '...';
    }

    return message;
  }

  async sendWelcomeSMS(customer: Customer, businessName: string): Promise<boolean> {
    if (!customer.phone || !customer.consentGiven) {
      return false;
    }

    const message = `Hi ${customer.name}! Welcome to ${businessName}. Thanks for connecting with us! Reply STOP to opt out.`;
    
    const result = await this.smsProvider.sendSMS(customer.phone, message);
    return result.success;
  }
}

// Service instances and exports
const helloSMSService = new HelloSMSService();
const mockSMSService = new MockSMSService();

// Check if HelloSMS credentials are available
const hasHelloSMSCredentials = process.env.HELLOSMS_USERNAME && process.env.HELLOSMS_PASSWORD;

// Use HelloSMS if credentials are available, otherwise use mock
export const smsService: SMSProvider = hasHelloSMSCredentials ? helloSMSService : mockSMSService;
export const smsCampaignService = new SMSCampaignService(smsService);

console.log(`📱 SMS Service initialized: ${hasHelloSMSCredentials ? 'HelloSMS (REAL)' : 'Mock (DEVELOPMENT)'}`);

// Test the SMS service initialization
if (hasHelloSMSCredentials) {
  console.log('📱 HelloSMS credentials found - ready to send real SMS messages');
} else {
  console.log('📱 HelloSMS credentials missing - using mock SMS service');
}