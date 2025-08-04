import { Customer, Campaign } from '@shared/schema';
import sgMail from '@sendgrid/mail';

export interface EmailProvider {
  sendEmail(to: string, subject: string, content: string, businessName?: string): Promise<{ success: boolean; messageId?: string; error?: string }>;
  sendBulkEmail(emails: { to: string; subject: string; content: string; businessName?: string }[]): Promise<{ success: boolean; results: any[] }>;
}

// SendGrid Email Service using @sendgrid/mail
export class SendGridEmailService implements EmailProvider {
  private fromEmail: string;

  constructor() {
    const apiKey = process.env.SENDGRID_API_KEY;
    
    if (!apiKey) {
      throw new Error('SENDGRID_API_KEY environment variable is required');
    }

    sgMail.setApiKey(apiKey);
    // Use a verified sender email - you need to verify this in SendGrid
    this.fromEmail = process.env.SENDGRID_FROM_EMAIL || process.env.SMTP_USER || 'test@example.com';
    
    console.log(`📧 SendGrid email service initialized`);
  }

  async sendEmail(to: string, subject: string, content: string, businessName?: string): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log(`📧 Sending email via SendGrid to: ${to}`);
      console.log(`📧 Subject: ${subject}`);
      
      const fromName = businessName || 'Klario';
      
      // Create dynamic email address: businessname@domain.com
      let fromEmail = this.fromEmail;
      if (businessName) {
        const domain = this.fromEmail.split('@')[1]; // Extract domain from verified email
        const sanitizedBusinessName = businessName.toLowerCase().replace(/[^a-z0-9]/g, ''); // Clean business name for email
        fromEmail = `${sanitizedBusinessName}@${domain}`;
        console.log(`📧 Dynamic sender: "${businessName}" → ${fromEmail}`);
      }
      
      const msg = {
        to: to,
        from: `${fromName} <${fromEmail}>`,
        subject: subject,
        html: content,
        text: content.replace(/<[^>]*>/g, ''), // Strip HTML for text version
      };

      const [response] = await sgMail.send(msg);
      
      console.log(`📧 Email sent successfully via SendGrid: ${response.headers['x-message-id']}`);
      
      return {
        success: true,
        messageId: response.headers['x-message-id'] as string,
      };
    } catch (error: any) {
      console.error('📧 SendGrid email sending failed:', error);
      
      let errorMessage = 'Unknown error';
      if (error.response) {
        errorMessage = error.response.body?.errors?.[0]?.message || error.message;
      } else {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  async sendBulkEmail(emails: { to: string; subject: string; content: string; businessName?: string }[]): Promise<{ success: boolean; results: any[] }> {
    const results = [];
    
    for (const email of emails) {
      const result = await this.sendEmail(email.to, email.subject, email.content, email.businessName);
      results.push({ to: email.to, ...result });
      
      // Add small delay between emails to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const successCount = results.filter(r => r.success).length;
    
    return {
      success: successCount === results.length,
      results,
    };
  }
}

export class EmailCampaignService {
  private emailProvider: EmailProvider;

  constructor(emailProvider: EmailProvider) {
    this.emailProvider = emailProvider;
  }

  async sendCampaignToCustomers(campaign: Campaign, customers: Customer[]): Promise<{
    success: boolean;
    totalSent: number;
    totalFailed: number;
    results: any[];
  }> {
    const emailsToSend = customers
      .filter(customer => customer.email && customer.consentGiven)
      .map(customer => ({
        to: customer.email!,
        subject: campaign.subject || `Message from ${campaign.name}`,
        content: this.personalizeMessage(campaign.message, customer),
      }));

    console.log(`📧 Sending campaign "${campaign.name}" to ${emailsToSend.length} customers`);

    const result = await this.emailProvider.sendBulkEmail(emailsToSend);
    
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
    return template
      .replace(/\{\{name\}\}/g, customer.name)
      .replace(/\{\{email\}\}/g, customer.email || '')
      .replace(/\{\{phone\}\}/g, customer.phone || '');
  }

  async sendWelcomeEmail(customer: Customer, businessName: string): Promise<boolean> {
    if (!customer.email || !customer.consentGiven) {
      return false;
    }

    const result = await this.emailProvider.sendEmail(
      customer.email,
      `Welcome to ${businessName}!`,
      `Hi ${customer.name},\n\nThank you for connecting with us! We're excited to keep you updated with our latest offers and news.\n\nBest regards,\n${businessName} Team`
    );

    return result.success;
  }
}

// Create and export service instances
let emailServiceInstance: SendGridEmailService;

export const getEmailService = (): SendGridEmailService => {
  if (!emailServiceInstance) {
    emailServiceInstance = new SendGridEmailService();
  }
  return emailServiceInstance;
};

export const emailService = getEmailService();
export const emailCampaignService = new EmailCampaignService(emailService);