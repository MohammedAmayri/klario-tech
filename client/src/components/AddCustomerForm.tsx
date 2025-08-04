import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { User, Mail, Phone, UserPlus } from 'lucide-react';
import { useTranslation } from '@/lib/i18n';

const addCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  consentGiven: z.boolean().default(true),
});

type AddCustomerForm = z.infer<typeof addCustomerSchema>;

interface AddCustomerFormProps {
  onCustomerAdded: (customer: any) => void;
}

export default function AddCustomerForm({ onCustomerAdded }: AddCustomerFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { t } = useTranslation();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<AddCustomerForm>({
    resolver: zodResolver(addCustomerSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      consentGiven: true,
    },
  });

  const consentGiven = watch('consentGiven');

  const onSubmit = async (data: AddCustomerForm) => {
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          ...data,
          source: 'manual_entry',
          notes: 'Added manually via dashboard',
        }),
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: t('dashboard.customerAdded'),
          description: t('dashboard.customerAddedDescription').replace('{name}', data.name),
        });
        reset();
        onCustomerAdded(result.customer);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to add customer');
      }
    } catch (error: any) {
      console.error('Add customer error:', error);
      toast({
        title: t('common.error'),
        description: error.message || t('dashboard.failedToAddCustomer'),
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="text-lg font-bold text-gray-900">{t('dashboard.addCustomer')}</span>
            <p className="text-sm text-gray-600 font-normal mt-1">{t('dashboard.addCustomerDescription')}</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-sm font-medium">
              {t('dashboard.customerName')}
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="name"
                {...register('name')}
                placeholder="John Smith"
                className="pl-10"
              />
            </div>
            {errors.name && (
              <p className="text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              {t('dashboard.emailAddress')}
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="email"
                type="email"
                {...register('email')}
                placeholder="john@example.com"
                className="pl-10"
              />
            </div>
            {errors.email && (
              <p className="text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              {t('dashboard.phoneNumber')}
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                id="phone"
                {...register('phone')}
                placeholder="+46701234567"
                className="pl-10"
              />
            </div>
            {errors.phone && (
              <p className="text-sm text-red-600">{errors.phone.message}</p>
            )}
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="consent"
              checked={consentGiven}
              onCheckedChange={(checked) => setValue('consentGiven', checked as boolean)}
            />
            <Label htmlFor="consent" className="text-sm">
              {t('dashboard.marketingConsent')}
            </Label>
          </div>

          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                {t('dashboard.addingCustomer')}
              </div>
            ) : (
              t('dashboard.addCustomer')
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}