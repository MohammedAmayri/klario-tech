
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Smartphone, Shield, Heart } from "lucide-react";
import FormFields from "./customer-form/FormFields";
import ConsentCheckbox from "./customer-form/ConsentCheckbox";
import SubmitButton from "./customer-form/SubmitButton";
import { useCustomerForm } from "./customer-form/useCustomerForm";

interface CustomerFormProps {
  merchantId: string;
  onBack: () => void;
}

const CustomerForm = ({ merchantId, onBack }: CustomerFormProps) => {
  // Mock business data
  const businessData = {
    name: "Demo Restaurant",
    reviewUrl: "https://g.page/r/your-google-review-url",
    privacyUrl: "#"
  };

  const {
    formData,
    errors,
    touched,
    isSubmitting,
    handleInputChange,
    handleBlur,
    handleConsentChange,
    handleSubmit
  } = useCustomerForm({ merchantId, businessData, onBack });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-indigo-400/20 to-blue-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-md mx-auto pt-8 relative z-10">
        {/* Enhanced Header */}
        <div className="flex items-center mb-8 animate-fade-in">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onBack} 
            className="mr-3 hover:bg-white/60 backdrop-blur-sm transition-all duration-200 hover:scale-105 border border-white/20"
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
              <Smartphone className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-800 text-lg">Klario</span>
          </div>
        </div>

        {/* Enhanced Business Info */}
        <div className="text-center mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
          <div className="w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-2xl mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold hover:scale-110 transition-transform duration-300 cursor-pointer shadow-xl">
            {businessData.name.charAt(0)}
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-3">{businessData.name}</h1>
          <p className="text-gray-600 text-lg flex items-center justify-center">
            <Heart className="w-4 h-4 mr-2 text-red-500" />
            We'd love to stay in touch!
          </p>
        </div>

        {/* Enhanced Form Card */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-md animate-fade-in hover:shadow-3xl transition-all duration-500 rounded-2xl" style={{ animationDelay: '0.2s' }}>
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Share Your Details</CardTitle>
            <CardDescription className="text-gray-600 text-base">
              Help us provide you with better service and exclusive offers
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 pb-8">
            <form onSubmit={handleSubmit} className="space-y-8">
              <FormFields 
                formData={formData}
                errors={errors}
                touched={touched}
                onInputChange={handleInputChange}
                onBlur={handleBlur}
              />

              <ConsentCheckbox 
                consentGiven={formData.consentGiven}
                onConsentChange={handleConsentChange}
                businessName={businessData.name}
                privacyUrl={businessData.privacyUrl}
              />

              <SubmitButton isSubmitting={isSubmitting} />
            </form>

            <div className="mt-8 text-center">
              <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
                <p className="text-sm text-blue-700 font-medium mb-1">
                  What happens next?
                </p>
                <p className="text-xs text-blue-600">
                  After submitting, you'll be redirected to leave a Google review to help our business grow
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Enhanced Trust Indicators */}
        <div className="mt-8 flex justify-center space-x-8 text-sm text-gray-600 animate-fade-in" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center space-x-2 hover:text-gray-800 transition-colors duration-200 cursor-pointer">
            <div className="w-4 h-4 bg-blue-600 rounded-full animate-pulse shadow-sm"></div>
            <span className="font-medium">GDPR Compliant</span>
          </div>
          <div className="flex items-center space-x-2 hover:text-gray-800 transition-colors duration-200 cursor-pointer">
            <Shield className="w-4 h-4 text-green-600 animate-pulse" />
            <span className="font-medium">Secure & Private</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerForm;
