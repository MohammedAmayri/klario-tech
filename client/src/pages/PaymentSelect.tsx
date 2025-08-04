import { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CreditCard, Smartphone, ArrowLeft } from 'lucide-react';
import { Link } from 'wouter';

export default function PaymentSelect() {
  const [location] = useLocation();
  const [planInfo, setPlanInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Parse URL parameters
    const urlParams = new URLSearchParams(location.split('?')[1]);
    const plan = urlParams.get('plan');
    const amount = urlParams.get('amount');
    const name = urlParams.get('name');

    if (plan && amount && name) {
      setPlanInfo({
        plan,
        amount: parseInt(amount),
        name: decodeURIComponent(name)
      });
    }
  }, [location]);

  const handlePaymentMethod = async (method: 'klarna' | 'swish') => {
    if (!planInfo) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/payment/${method}/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: planInfo.amount,
          plan: planInfo.name,
          customerInfo: {
            email: 'customer@example.com', // This would come from a form
            firstName: 'Test',
            lastName: 'Customer'
          }
        })
      });

      const result = await response.json();
      
      if (result.success && result.redirectUrl) {
        window.location.href = result.redirectUrl;
      } else if (result.qrCode) {
        // For Swish, show QR code
        alert('Swish QR code generated. In a real implementation, this would open the Swish app.');
      } else {
        throw new Error(result.error || 'Payment creation failed');
      }
    } catch (error: any) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!planInfo) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Ogiltigt betalningspaket</h1>
          <Link href="/">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka till startsidan
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Tillbaka
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Välj betalningsmetod</h1>
          <p className="text-gray-600">Slutför ditt köp av {planInfo.name}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
          {/* Klarna */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePaymentMethod('klarna')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-pink-100 rounded-full flex items-center justify-center">
                <CreditCard className="w-8 h-8 text-pink-600" />
              </div>
              <CardTitle>Klarna</CardTitle>
              <CardDescription>Betala med Klarna - Köp nu, betala senare</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Flexibla betalningsalternativ</li>
                <li>• BankID-integration</li>
                <li>• Säker svenska betalningar</li>
              </ul>
              <Button 
                className="w-full bg-pink-600 hover:bg-pink-700" 
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentMethod('klarna');
                }}
              >
                {loading ? 'Bearbetar...' : `Betala ${planInfo.amount} SEK med Klarna`}
              </Button>
            </CardContent>
          </Card>

          {/* Swish */}
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => handlePaymentMethod('swish')}>
            <CardHeader className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <Smartphone className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>Swish</CardTitle>
              <CardDescription>Snabb mobilbetalning med Swish</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-gray-600 mb-4">
                <li>• Omedelbar betalning</li>
                <li>• QR-kod eller app-till-app</li>
                <li>• Sveriges populäraste mobilbetalning</li>
              </ul>
              <Button 
                className="w-full bg-blue-600 hover:bg-blue-700" 
                disabled={loading}
                onClick={(e) => {
                  e.stopPropagation();
                  handlePaymentMethod('swish');
                }}
              >
                {loading ? 'Bearbetar...' : `Betala ${planInfo.amount} SEK med Swish`}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="text-center mt-8">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <h3 className="font-semibold text-gray-800 mb-2">Din beställning:</h3>
            <div className="flex justify-between items-center">
              <span>{planInfo.name}</span>
              <Badge variant="secondary">{planInfo.amount} SEK/månad</Badge>
            </div>
            <p className="text-xs text-gray-500 mt-2">Inkl. 25% moms • Årsavtal krävs</p>
          </div>
        </div>
      </div>
    </div>
  );
}