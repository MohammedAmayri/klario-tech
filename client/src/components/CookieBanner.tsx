import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { Link } from 'wouter';
import { useTranslation } from '@/lib/i18n';

type CookiePreferences = {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
};

type ConsentLevel = 'all' | 'necessary' | 'custom' | null;

export default function CookieBanner() {
  const { t } = useTranslation();
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState<CookiePreferences>({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('klario-cookie-consent');
    if (!consent) {
      // Show banner after a brief delay to ensure page has loaded
      const timer = setTimeout(() => setShowBanner(true), 1000);
      return () => clearTimeout(timer);
    } else {
      // Load saved preferences
      try {
        const savedPreferences = JSON.parse(localStorage.getItem('klario-cookie-preferences') || '{}');
        setPreferences(prev => ({ ...prev, ...savedPreferences }));
      } catch (error) {
        console.error('Error loading cookie preferences:', error);
      }
    }
  }, []);

  const saveConsent = (level: ConsentLevel, customPreferences?: CookiePreferences) => {
    const timestamp = new Date().toISOString();
    
    let finalPreferences: CookiePreferences;
    
    if (level === 'all') {
      finalPreferences = {
        necessary: true,
        analytics: true,
        marketing: true,
        functional: true,
      };
    } else if (level === 'necessary') {
      finalPreferences = {
        necessary: true,
        analytics: false,
        marketing: false,
        functional: false,
      };
    } else if (level === 'custom' && customPreferences) {
      finalPreferences = { ...customPreferences, necessary: true }; // Necessary cookies always enabled
    } else {
      return; // Invalid state
    }

    // Save to localStorage
    localStorage.setItem('klario-cookie-consent', level);
    localStorage.setItem('klario-cookie-preferences', JSON.stringify(finalPreferences));
    localStorage.setItem('klario-cookie-consent-date', timestamp);

    // Apply cookie preferences
    applyCookiePreferences(finalPreferences);
    
    setPreferences(finalPreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const applyCookiePreferences = (prefs: CookiePreferences) => {
    // Remove existing optional cookies if they're not consented to
    if (!prefs.analytics) {
      // Remove analytics cookies (like Google Analytics)
      document.cookie.split(";").forEach(function(c) { 
        if (c.trim().startsWith('_ga') || c.trim().startsWith('_gid') || c.trim().startsWith('_gat')) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        }
      });
    }
    
    if (!prefs.marketing) {
      // Remove marketing cookies
      document.cookie.split(";").forEach(function(c) { 
        if (c.trim().startsWith('_fbp') || c.trim().startsWith('_fbc')) {
          document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        }
      });
    }

    // Set consent levels for third-party services
    if (typeof window !== 'undefined') {
      // Google Analytics consent
      if ((window as any).gtag) {
        (window as any).gtag('consent', 'update', {
          'analytics_storage': prefs.analytics ? 'granted' : 'denied',
          'ad_storage': prefs.marketing ? 'granted' : 'denied',
        });
      }
    }
  };

  const handleAcceptAll = () => {
    saveConsent('all');
  };

  const handleRejectOptional = () => {
    saveConsent('necessary');
  };

  const handleSaveCustom = () => {
    saveConsent('custom', preferences);
  };

  const updatePreference = (key: keyof CookiePreferences, value: boolean) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({ ...prev, [key]: value }));
  };

  if (!showBanner) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-2xl bg-white shadow-2xl border-2 border-blue-200">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Cookie className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-lg">Vi använder cookies</CardTitle>
                <p className="text-sm text-gray-600 mt-1">För att förbättra din upplevelse på Klario</p>
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowBanner(false)}
              className="h-8 w-8 p-0"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {!showSettings ? (
            <>
              <p className="text-sm text-gray-700 leading-relaxed">
                Vi använder cookies och liknande teknologier för att förbättra din upplevelse, 
                analysera webbplatsanvändning och hjälpa till med marknadsföring. Du kan välja 
                vilka cookies du vill acceptera.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  onClick={handleAcceptAll}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1"
                >
                  Acceptera alla cookies
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={handleRejectOptional}
                  className="flex-1"
                >
                  Endast nödvändiga
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Inställningar
                </Button>
              </div>
              
              <div className="text-xs text-gray-500 space-y-1">
                <p>
                  Läs mer i vår{' '}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    integritetspolicy
                  </Link>
                  {' '}och{' '}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    användarvillkor
                  </Link>
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                <h3 className="font-semibold text-gray-900">Anpassa cookie-inställningar</h3>
                
                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-start justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Shield className="w-4 h-4 text-green-600" />
                        <h4 className="font-medium text-gray-900">Nödvändiga cookies</h4>
                      </div>
                      <p className="text-sm text-gray-600">
                        Krävs för grundläggande funktionalitet som inloggning och säkerhet. 
                        Kan inte inaktiveras.
                      </p>
                    </div>
                    <Checkbox 
                      checked={true} 
                      disabled 
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Analytics Cookies */}
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Analyscookies</h4>
                      <p className="text-sm text-gray-600">
                        Hjälper oss förstå hur du använder webbplatsen för att förbättra prestanda.
                      </p>
                    </div>
                    <Checkbox 
                      checked={preferences.analytics}
                      onCheckedChange={(checked) => updatePreference('analytics', !!checked)}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Functional Cookies */}
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Funktionella cookies</h4>
                      <p className="text-sm text-gray-600">
                        Möjliggör förbättrade funktioner som språkval och personliga inställningar.
                      </p>
                    </div>
                    <Checkbox 
                      checked={preferences.functional}
                      onCheckedChange={(checked) => updatePreference('functional', !!checked)}
                      className="mt-1"
                    />
                  </div>
                  
                  {/* Marketing Cookies */}
                  <div className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">Marknadsföringscookies</h4>
                      <p className="text-sm text-gray-600">
                        Används för att visa relevanta annonser och spåra kampanjprestanda.
                      </p>
                    </div>
                    <Checkbox 
                      checked={preferences.marketing}
                      onCheckedChange={(checked) => updatePreference('marketing', !!checked)}
                      className="mt-1"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button 
                  onClick={handleSaveCustom}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 flex-1"
                >
                  Spara inställningar
                </Button>
                
                <Button 
                  variant="outline" 
                  onClick={() => setShowSettings(false)}
                  className="flex-1"
                >
                  Tillbaka
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// Helper function to check if specific cookie types are consented
export const isCookieConsented = (type: 'necessary' | 'analytics' | 'marketing' | 'functional'): boolean => {
  try {
    const preferences = localStorage.getItem('klario-cookie-preferences');
    if (!preferences) return type === 'necessary'; // Only necessary cookies by default
    
    const parsed = JSON.parse(preferences) as CookiePreferences;
    return parsed[type] || false;
  } catch {
    return type === 'necessary';
  }
};

// Helper function to get consent date
export const getCookieConsentDate = (): Date | null => {
  try {
    const date = localStorage.getItem('klario-cookie-consent-date');
    return date ? new Date(date) : null;
  } catch {
    return null;
  }
};