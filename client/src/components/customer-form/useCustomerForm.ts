
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { validateField } from "./validationSchema";

interface FormData {
  name: string;
  email: string;
  phone: string;
  consentGiven: boolean;
}

interface UseCustomerFormProps {
  merchantId: string;
  businessData: {
    name: string;
    reviewUrl: string;
  };
  onBack: () => void;
}

export const useCustomerForm = ({ merchantId, businessData, onBack }: UseCustomerFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    consentGiven: false
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field as keyof typeof formData] as string);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const handleConsentChange = (checked: boolean) => {
    setFormData(prev => ({ ...prev, consentGiven: checked }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    const newErrors: Record<string, string> = {};
    Object.keys(formData).forEach(field => {
      if (field !== 'consentGiven') {
        const error = validateField(field, formData[field as keyof typeof formData] as string);
        if (error) newErrors[field] = error;
      }
    });

    if (!formData.consentGiven) {
      toast({
        title: "Consent Required",
        description: "Please agree to the data usage terms to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.name || !formData.email) {
      toast({
        title: "Missing Information",
        description: "Please fill in your name and email address.",
        variant: "destructive",
      });
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        phone: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log("Submitting customer data:", {
        ...formData,
        merchantId,
        consentTimestamp: new Date().toISOString()
      });
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Thank you!",
        description: "Your information has been saved. Redirecting to leave a review...",
      });
      
      // Simulate redirect to Google reviews
      setTimeout(() => {
        window.open(businessData.reviewUrl, '_blank');
        onBack();
      }, 2000);
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    errors,
    touched,
    isSubmitting,
    handleInputChange,
    handleBlur,
    handleConsentChange,
    handleSubmit
  };
};
