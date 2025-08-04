import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import KlarioLogo from "@/components/KlarioLogo";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <KlarioLogo size="md" />
            <Link href="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Tillbaka till startsidan
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Kontakta Oss
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Vi hjälper dig gärna med dina frågor om NFC-kundengagemang och Klario-plattformen
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-blue-600" />
                  Kontaktinformation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">E-post</h3>
                    <p className="text-gray-600">support@klario.se</p>
                    <p className="text-gray-600">business@klario.se</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Telefon</h3>
                    <p className="text-gray-600">+46 8 123 456 78</p>
                    <p className="text-sm text-gray-500">Mån-Fre 9:00-17:00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Adress</h3>
                    <p className="text-gray-600">
                      Klario AB<br />
                      Storgatan 12<br />
                      111 22 Stockholm<br />
                      Sverige
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <Clock className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Öppettider</h3>
                    <p className="text-gray-600">
                      Måndag - Fredag: 9:00 - 17:00<br />
                      Lördag - Söndag: Stängt
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Support Information */}
            <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
              <CardHeader>
                <CardTitle className="text-blue-700">Teknisk Support</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 mb-4">
                  För tekniska frågor om NFC-taggar, kampanjinställningar eller integrationer, 
                  kontakta vårt tekniska supportteam.
                </p>
                <div className="space-y-2">
                  <p className="text-sm">
                    <strong>Support E-post:</strong> tech@klario.se
                  </p>
                  <p className="text-sm">
                    <strong>Responstid:</strong> Inom 24 timmar på vardagar
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Contact Form */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>Skicka oss ett meddelande</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Förnamn</Label>
                    <Input id="firstName" placeholder="Ditt förnamn" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Efternamn</Label>
                    <Input id="lastName" placeholder="Ditt efternamn" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">E-post</Label>
                  <Input id="email" type="email" placeholder="din@email.se" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">Företag (valfritt)</Label>
                  <Input id="company" placeholder="Ditt företagsnamn" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Ämne</Label>
                  <Input id="subject" placeholder="Vad gäller ditt meddelande?" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Meddelande</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Berätta för oss hur vi kan hjälpa dig..."
                    rows={6}
                  />
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Skicka meddelande
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Vanliga frågor
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Hur fungerar NFC-teknologin?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  NFC (Near Field Communication) låter kunder scanna en tagg med sin smartphone 
                  för att automatiskt registrera sig och ta emot exklusiva erbjudanden.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Vilka telefoner stöder NFC?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  De flesta moderna smartphones (iPhone 7+ och Android-enheter från 2016+) 
                  har inbyggt NFC-stöd och fungerar perfekt med Klario.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Hur snabbt kan jag komma igång?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Du kan skapa ditt konto och börja använda Klario inom 5 minuter. 
                  NFC-taggar kan beställas separat och levereras inom 1-2 arbetsdagar.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-white/60 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-lg">Finns det support på svenska?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Ja! All vår support finns tillgänglig på svenska. Vi hjälper dig gärna 
                  att komma igång och optimera dina NFC-kampanjer.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}