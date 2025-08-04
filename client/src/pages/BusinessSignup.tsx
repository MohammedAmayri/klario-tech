
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Building2, Mail, Phone, MapPin, CreditCard, Shield, CheckCircle, Nfc } from "lucide-react";
import { Link } from "wouter";

const businessSignupSchema = z.object({
  // Business Information
  businessName: z.string().min(2, "Business name must be at least 2 characters"),
  businessType: z.string().min(1, "Please select a business type"),
  industry: z.string().min(1, "Please select an industry"),
  taxId: z.string().min(9, "Tax ID must be at least 9 characters"),
  website: z.string().url("Please enter a valid website URL").optional().or(z.literal("")),
  
  // Contact Information
  businessEmail: z.string().email("Please enter a valid email address"),
  businessPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  
  // Address
  streetAddress: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().min(5, "ZIP code must be at least 5 characters"),
  country: z.string().min(2, "Country is required"),
  
  // Owner Information
  ownerFirstName: z.string().min(2, "First name is required"),
  ownerLastName: z.string().min(2, "Last name is required"),
  ownerEmail: z.string().email("Please enter a valid email address"),
  ownerPhone: z.string().min(10, "Phone number must be at least 10 digits"),
  
  // Account Credentials
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
  
  // Agreements
  termsAccepted: z.boolean().refine(val => val === true, "You must accept the terms and conditions"),
  privacyAccepted: z.boolean().refine(val => val === true, "You must accept the privacy policy"),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type BusinessSignupForm = z.infer<typeof businessSignupSchema>;

const BusinessSignup = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch
  } = useForm<BusinessSignupForm>({
    resolver: zodResolver(businessSignupSchema),
    mode: "onChange"
  });

  const onSubmit = async (data: BusinessSignupForm) => {
    console.log("Business signup data:", data);
    // Here you would typically send the data to your backend
    alert("Business account created successfully! Please check your email for verification.");
  };

  const nextStep = async () => {
    const fieldsToValidate = getFieldsForStep(currentStep);
    const isValid = await trigger(fieldsToValidate as any);
    if (isValid && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getFieldsForStep = (step: number) => {
    switch (step) {
      case 1:
        return ['businessName', 'businessType', 'industry', 'taxId', 'website'];
      case 2:
        return ['businessEmail', 'businessPhone', 'streetAddress', 'city', 'state', 'zipCode', 'country'];
      case 3:
        return ['ownerFirstName', 'ownerLastName', 'ownerEmail', 'ownerPhone'];
      case 4:
        return ['password', 'confirmPassword', 'termsAccepted', 'privacyAccepted'];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Building2 className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Business Information</h3>
              <p className="text-gray-600">Tell us about your business</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  {...register("businessName")}
                  placeholder="Your Business Name"
                  className="h-12"
                />
                {errors.businessName && (
                  <p className="text-sm text-red-600">{errors.businessName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessType">Business Type *</Label>
                <select
                  id="businessType"
                  {...register("businessType")}
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Business Type</option>
                  <option value="llc">LLC</option>
                  <option value="corporation">Corporation</option>
                  <option value="partnership">Partnership</option>
                  <option value="sole-proprietorship">Sole Proprietorship</option>
                  <option value="non-profit">Non-Profit</option>
                </select>
                {errors.businessType && (
                  <p className="text-sm text-red-600">{errors.businessType.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="industry">Industry *</Label>
                <select
                  id="industry"
                  {...register("industry")}
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Industry</option>
                  <option value="retail">Retail</option>
                  <option value="restaurant">Restaurant & Food Service</option>
                  <option value="healthcare">Healthcare</option>
                  <option value="beauty">Beauty & Wellness</option>
                  <option value="professional-services">Professional Services</option>
                  <option value="fitness">Fitness & Recreation</option>
                  <option value="automotive">Automotive</option>
                  <option value="real-estate">Real Estate</option>
                  <option value="education">Education</option>
                  <option value="other">Other</option>
                </select>
                {errors.industry && (
                  <p className="text-sm text-red-600">{errors.industry.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="taxId">Tax ID / EIN *</Label>
                <Input
                  id="taxId"
                  {...register("taxId")}
                  placeholder="XX-XXXXXXX"
                  className="h-12"
                />
                {errors.taxId && (
                  <p className="text-sm text-red-600">{errors.taxId.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="website">Website (Optional)</Label>
                <Input
                  id="website"
                  {...register("website")}
                  placeholder="https://www.yourbusiness.com"
                  className="h-12"
                />
                {errors.website && (
                  <p className="text-sm text-red-600">{errors.website.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <MapPin className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Business Contact & Address</h3>
              <p className="text-gray-600">How can customers reach you?</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="businessEmail">Business Email *</Label>
                <Input
                  id="businessEmail"
                  type="email"
                  {...register("businessEmail")}
                  placeholder="contact@yourbusiness.com"
                  className="h-12"
                />
                {errors.businessEmail && (
                  <p className="text-sm text-red-600">{errors.businessEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessPhone">Business Phone *</Label>
                <Input
                  id="businessPhone"
                  {...register("businessPhone")}
                  placeholder="(555) 123-4567"
                  className="h-12"
                />
                {errors.businessPhone && (
                  <p className="text-sm text-red-600">{errors.businessPhone.message}</p>
                )}
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="streetAddress">Street Address *</Label>
                <Input
                  id="streetAddress"
                  {...register("streetAddress")}
                  placeholder="123 Main Street"
                  className="h-12"
                />
                {errors.streetAddress && (
                  <p className="text-sm text-red-600">{errors.streetAddress.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  {...register("city")}
                  placeholder="Your City"
                  className="h-12"
                />
                {errors.city && (
                  <p className="text-sm text-red-600">{errors.city.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  {...register("state")}
                  placeholder="CA"
                  className="h-12"
                />
                {errors.state && (
                  <p className="text-sm text-red-600">{errors.state.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code *</Label>
                <Input
                  id="zipCode"
                  {...register("zipCode")}
                  placeholder="12345"
                  className="h-12"
                />
                {errors.zipCode && (
                  <p className="text-sm text-red-600">{errors.zipCode.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <select
                  id="country"
                  {...register("country")}
                  className="flex h-12 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Select Country</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="UK">United Kingdom</option>
                  <option value="AU">Australia</option>
                  <option value="other">Other</option>
                </select>
                {errors.country && (
                  <p className="text-sm text-red-600">{errors.country.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Mail className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Business Owner Information</h3>
              <p className="text-gray-600">Primary contact and account owner details</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="ownerFirstName">First Name *</Label>
                <Input
                  id="ownerFirstName"
                  {...register("ownerFirstName")}
                  placeholder="John"
                  className="h-12"
                />
                {errors.ownerFirstName && (
                  <p className="text-sm text-red-600">{errors.ownerFirstName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerLastName">Last Name *</Label>
                <Input
                  id="ownerLastName"
                  {...register("ownerLastName")}
                  placeholder="Doe"
                  className="h-12"
                />
                {errors.ownerLastName && (
                  <p className="text-sm text-red-600">{errors.ownerLastName.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerEmail">Owner Email *</Label>
                <Input
                  id="ownerEmail"
                  type="email"
                  {...register("ownerEmail")}
                  placeholder="john@yourbusiness.com"
                  className="h-12"
                />
                {errors.ownerEmail && (
                  <p className="text-sm text-red-600">{errors.ownerEmail.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ownerPhone">Owner Phone *</Label>
                <Input
                  id="ownerPhone"
                  {...register("ownerPhone")}
                  placeholder="(555) 123-4567"
                  className="h-12"
                />
                {errors.ownerPhone && (
                  <p className="text-sm text-red-600">{errors.ownerPhone.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Shield className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Account Security</h3>
              <p className="text-gray-600">Set up your login credentials</p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Password *</Label>
                <Input
                  id="password"
                  type="password"
                  {...register("password")}
                  placeholder="Create a strong password"
                  className="h-12"
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  placeholder="Confirm your password"
                  className="h-12"
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              <Separator className="my-6" />

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="termsAccepted"
                    {...register("termsAccepted")}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="termsAccepted" className="text-sm text-gray-700">
                    I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms and Conditions</Link> *
                  </label>
                </div>
                {errors.termsAccepted && (
                  <p className="text-sm text-red-600">{errors.termsAccepted.message}</p>
                )}

                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    id="privacyAccepted"
                    {...register("privacyAccepted")}
                    className="mt-1 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="privacyAccepted" className="text-sm text-gray-700">
                    I agree to the <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link> *
                  </label>
                </div>
                {errors.privacyAccepted && (
                  <p className="text-sm text-red-600">{errors.privacyAccepted.message}</p>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link 
            to="/" 
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Home</span>
          </Link>
          

        </div>

        {/* Progress Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  step <= currentStep 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {step < currentStep ? <CheckCircle className="w-5 h-5" /> : step}
                </div>
                {step < 4 && (
                  <div className={`h-1 w-24 mx-2 ${
                    step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>Business Info</span>
            <span>Contact & Address</span>
            <span>Owner Details</span>
            <span>Account Setup</span>
          </div>
        </div>

        {/* Form Card */}
        <Card className="max-w-4xl mx-auto shadow-xl border-0">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold">Create Your Business Account</CardTitle>
            <CardDescription>
              Join thousands of businesses using Klario to grow their NFC customer engagement
            </CardDescription>
            <div className="flex justify-center space-x-2 mt-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <Shield className="w-3 h-3 mr-1" />
                GDPR Compliant
              </Badge>
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                <CreditCard className="w-3 h-3 mr-1" />
                Secure Processing
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {renderStepContent()}
              
              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={prevStep}
                    className="px-8"
                  >
                    Previous
                  </Button>
                )}
                
                {currentStep < totalSteps ? (
                  <Button 
                    type="button" 
                    onClick={nextStep}
                    className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                  >
                    Next Step
                  </Button>
                ) : (
                  <Button 
                    type="submit" 
                    disabled={isSubmitting}
                    className="ml-auto bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-8"
                  >
                    {isSubmitting ? "Creating Account..." : "Create Business Account"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Sign In Link */}
        <div className="text-center mt-8">
          <p className="text-gray-600">
            Already have a business account?{" "}
            <Link 
              to="/business/signin" 
              className="text-blue-600 hover:text-blue-700 font-medium hover:underline"
            >
              Sign In Here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default BusinessSignup;
