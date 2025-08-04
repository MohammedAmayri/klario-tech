
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  showLeadForm?: boolean;
  showBookingForm?: boolean;
}

export interface UserContext {
  name?: string;
  email?: string;
  phone?: string;
  language: 'en' | 'sv';
  visitDuration: number;
  questionsAsked: number;
  showsInterest: boolean;
}

export interface LeadData {
  name: string;
  email: string;
  phone?: string;
}

export interface BookingData {
  date: string;
  time: string;
  timezone: string;
}
