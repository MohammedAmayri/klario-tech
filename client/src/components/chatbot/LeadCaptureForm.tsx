
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Mail, Phone, Shield } from "lucide-react";

interface LeadCaptureFormProps {
  language: 'en' | 'sv';
  onSubmit: (data: { name: string; email: string; phone?: string }) => void;
}

const LeadCaptureForm = ({ language, onSubmit }: LeadCaptureFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gdprConsent: false
  });

  const texts = {
    en: {
      title: "Get personalized information",
      name: "Your name",
      email: "Email address",
      phone: "Phone number (optional)",
      gdpr: "Yes, you may contact me about KLARIO Tech services. You can opt out anytime and view our privacy policy.",
      submit: "Get information",
      required: "Name and email are required"
    },
    sv: {
      title: "Få personlig information",
      name: "Ditt namn",
      email: "E-postadress",
      phone: "Telefonnummer (valfritt)",
      gdpr: "Ja, ni får kontakta mig om KLARIO Tech-tjänster. Jag kan avbryta när som helst och se er sekretesspolicy.",
      submit: "Få information",
      required: "Namn och e-post krävs"
    }
  };

  const t = texts[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.gdprConsent) {
      return;
    }

    onSubmit({
      name: formData.name.trim(),
      email: formData.email.trim(),
      phone: formData.phone.trim() || undefined
    });
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl p-5 shadow-lg animate-bounce-in">
      <h4 className="font-bold text-base text-blue-800 mb-4 flex items-center">
        <User className="w-5 h-5 mr-2 text-blue-600" />
        {t.title}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="lead-name" className="text-sm text-gray-700 font-medium">{t.name}</Label>
          <Input
            id="lead-name"
            type="text"
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            className="h-10 text-sm mt-1 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="lead-email" className="text-sm text-gray-700 font-medium">{t.email}</Label>
          <Input
            id="lead-email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            className="h-10 text-sm mt-1 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
            required
          />
        </div>
        
        <div>
          <Label htmlFor="lead-phone" className="text-sm text-gray-700 font-medium">{t.phone}</Label>
          <Input
            id="lead-phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
            className="h-10 text-sm mt-1 border-2 border-blue-200 focus:border-blue-400 rounded-xl"
          />
        </div>
        
        <div className="flex items-start space-x-3 p-3 bg-white/60 rounded-xl border border-blue-200">
          <Checkbox
            id="gdpr-consent"
            checked={formData.gdprConsent}
            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, gdprConsent: !!checked }))}
            className="mt-1 border-2 border-blue-300"
          />
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <Label htmlFor="gdpr-consent" className="text-sm text-gray-700 leading-tight cursor-pointer">
              {t.gdpr}
            </Label>
          </div>
        </div>
        
        <Button
          type="submit"
          size="sm"
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-sm h-11 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
          disabled={!formData.name.trim() || !formData.email.trim() || !formData.gdprConsent}
        >
          <Mail className="w-4 h-4 mr-2" />
          {t.submit}
        </Button>
      </form>
    </div>
  );
};

export default LeadCaptureForm;
