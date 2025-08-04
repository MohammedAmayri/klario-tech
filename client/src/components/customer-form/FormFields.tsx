
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle2, AlertCircle, User, Mail, Phone } from "lucide-react";

interface FormFieldsProps {
  formData: {
    name: string;
    email: string;
    phone: string;
  };
  errors: Record<string, string>;
  touched: Record<string, boolean>;
  onInputChange: (field: string, value: string) => void;
  onBlur: (field: string) => void;
}

const FormFields = ({ formData, errors, touched, onInputChange, onBlur }: FormFieldsProps) => {
  const getFieldStatus = (field: string) => {
    const hasError = errors[field] && touched[field];
    const isValid = !errors[field] && touched[field] && formData[field as keyof typeof formData];
    return { hasError, isValid };
  };

  return (
    <div className="space-y-6">
      {/* Name Field */}
      <div className="relative">
        <Label htmlFor="name" className="text-sm font-semibold text-gray-700 mb-2 block">
          Full Name *
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <User className="w-4 h-4" />
          </div>
          <Input
            id="name"
            type="text"
            value={formData.name}
            onChange={(e) => onInputChange('name', e.target.value)}
            onBlur={() => onBlur('name')}
            placeholder="Enter your full name"
            className={`pl-10 pr-10 py-3 text-base transition-all duration-200 border-2 rounded-xl ${
              getFieldStatus('name').hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/30' 
                : getFieldStatus('name').isValid 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50/30' 
                : 'border-gray-200 focus:border-blue-400 focus:ring-blue-200 hover:border-gray-300'
            } focus:ring-4`}
            required
          />
          {getFieldStatus('name').isValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 animate-scale-in" />
          )}
          {getFieldStatus('name').hasError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 animate-scale-in" />
          )}
        </div>
        {errors.name && touched.name && (
          <p className="text-red-500 text-sm mt-2 animate-fade-in flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.name}
          </p>
        )}
      </div>

      {/* Email Field */}
      <div className="relative">
        <Label htmlFor="email" className="text-sm font-semibold text-gray-700 mb-2 block">
          Email Address *
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Mail className="w-4 h-4" />
          </div>
          <Input
            id="email"
            type="email"
            inputMode="email"
            value={formData.email}
            onChange={(e) => onInputChange('email', e.target.value)}
            onBlur={() => onBlur('email')}
            placeholder="Enter your email address"
            className={`pl-10 pr-10 py-3 text-base transition-all duration-200 border-2 rounded-xl ${
              getFieldStatus('email').hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/30' 
                : getFieldStatus('email').isValid 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50/30' 
                : 'border-gray-200 focus:border-blue-400 focus:ring-blue-200 hover:border-gray-300'
            } focus:ring-4`}
            required
          />
          {getFieldStatus('email').isValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 animate-scale-in" />
          )}
          {getFieldStatus('email').hasError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 animate-scale-in" />
          )}
        </div>
        {errors.email && touched.email && (
          <p className="text-red-500 text-sm mt-2 animate-fade-in flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Field */}
      <div className="relative">
        <Label htmlFor="phone" className="text-sm font-semibold text-gray-700 mb-2 block">
          Phone Number (Optional)
        </Label>
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Phone className="w-4 h-4" />
          </div>
          <Input
            id="phone"
            type="tel"
            inputMode="tel"
            value={formData.phone}
            onChange={(e) => onInputChange('phone', e.target.value)}
            onBlur={() => onBlur('phone')}
            placeholder="Enter your phone number"
            className={`pl-10 pr-10 py-3 text-base transition-all duration-200 border-2 rounded-xl ${
              getFieldStatus('phone').hasError 
                ? 'border-red-300 focus:border-red-500 focus:ring-red-200 bg-red-50/30' 
                : getFieldStatus('phone').isValid 
                ? 'border-green-300 focus:border-green-500 focus:ring-green-200 bg-green-50/30' 
                : 'border-gray-200 focus:border-blue-400 focus:ring-blue-200 hover:border-gray-300'
            } focus:ring-4`}
          />
          {getFieldStatus('phone').isValid && (
            <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-500 animate-scale-in" />
          )}
          {getFieldStatus('phone').hasError && (
            <AlertCircle className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-red-500 animate-scale-in" />
          )}
        </div>
        {errors.phone && touched.phone && (
          <p className="text-red-500 text-sm mt-2 animate-fade-in flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {errors.phone}
          </p>
        )}
      </div>
    </div>
  );
};

export default FormFields;
