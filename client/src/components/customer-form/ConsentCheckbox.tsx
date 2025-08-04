
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Shield, ExternalLink } from "lucide-react";

interface ConsentCheckboxProps {
  consentGiven: boolean;
  onConsentChange: (checked: boolean) => void;
  businessName: string;
  privacyUrl: string;
}

const ConsentCheckbox = ({ consentGiven, onConsentChange, businessName, privacyUrl }: ConsentCheckboxProps) => {
  return (
    <div className="border-2 border-blue-100 rounded-xl p-6 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 hover:from-blue-50/70 hover:to-indigo-50/70 transition-all duration-300">
      <div className="flex items-start space-x-4">
        <Checkbox
          id="consent"
          checked={consentGiven}
          onCheckedChange={(checked) => onConsentChange(checked as boolean)}
          className="mt-1 transition-all duration-200 hover:scale-110 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
        />
        <div className="flex-1">
          <Label 
            htmlFor="consent" 
            className="text-sm font-semibold cursor-pointer"
          >
            <div className="flex items-center space-x-2 mb-3">
              <Shield className="w-5 h-5 text-blue-600" />
              <span className="text-gray-900">Data Usage Agreement *</span>
            </div>
          </Label>
          <div className="bg-white/60 rounded-lg p-3 border border-blue-100">
            <p className="text-sm text-gray-700 leading-relaxed">
              I agree to share my contact details with <strong className="text-gray-900">{businessName}</strong> for 
              follow-up communications including special offers, updates, and service improvements. 
              My data will not be sold or shared with external parties.
            </p>
            <a 
              href={privacyUrl} 
              className="inline-flex items-center text-blue-600 hover:text-blue-700 text-sm font-medium mt-2 transition-colors duration-200 hover:underline"
            >
              Read Privacy Policy
              <ExternalLink className="w-3 h-3 ml-1" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsentCheckbox;
