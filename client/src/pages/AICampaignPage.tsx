import { AICampaignGenerator } from '@/components/AICampaignGenerator';

export default function AICampaignPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Campaign Assistant
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Generate and enhance marketing campaigns for email, SMS, and WhatsApp using advanced AI. 
            Create compelling content that drives engagement and conversions.
          </p>
        </div>
        <AICampaignGenerator />
      </div>
    </div>
  );
}