import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, Lock, Eye, Database } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import KlarioLogo from "@/components/KlarioLogo";

export default function Privacy() {
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Page Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Shield className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Integritetspolicy
          </h1>
          <p className="text-lg text-gray-600">
            Senast uppdaterad: {new Date().toLocaleDateString('sv-SE')}
          </p>
        </div>

        <div className="space-y-8">
          {/* Introduction */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                1. Inledning
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Klario AB ("vi", "oss", "vårt") respekterar din integritet och är engagerade i att 
                skydda dina personuppgifter. Denna integritetspolicy förklarar hur vi samlar in, 
                använder, lagrar och skyddar din information när du använder vår NFC-kundengagemangsplattform.
              </p>
              <p className="text-gray-700">
                Denna policy följer Europaparlamentets och rådets förordning (EU) 2016/679 (GDPR) 
                och svensk dataskyddslagstiftning.
              </p>
            </CardContent>
          </Card>

          {/* Data Controller */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                2. Personuppgiftsansvarig
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Personuppgiftsansvarig för behandling av dina personuppgifter är:
              </p>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="font-semibold">Klario AB</p>
                <p>Organisationsnummer: 559123-4567</p>
                <p>Adress: Storgatan 12, 111 22 Stockholm</p>
                <p>E-post: privacy@klario.se</p>
                <p>Telefon: +46 8 123 456 78</p>
              </div>
            </CardContent>
          </Card>

          {/* Data Collection */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                3. Vilka personuppgifter samlar vi in?
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Företagskunder (Business-användare):</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Namn och kontaktuppgifter</li>
                    <li>E-postadress och telefonnummer</li>
                    <li>Företagsinformation och adress</li>
                    <li>Faktureringsuppgifter</li>
                    <li>Inloggningsuppgifter och användaraktivitet</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Slutkunder (via NFC-taggar):</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>Namn och kontaktuppgifter</li>
                    <li>E-postadress och telefonnummer</li>
                    <li>Preferenser och intressen</li>
                    <li>Interaktionshistorik med NFC-taggar</li>
                    <li>Geografisk plats (endast vid NFC-scanning)</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Tekniska data:</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                    <li>IP-adress och enhetsidentifierare</li>
                    <li>Webbläsarinformation och cookies</li>
                    <li>Användningsstatistik och prestanda</li>
                    <li>Felloggning för säkerhet och support</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Basis */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>4. Rättslig grund för behandling</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Vi behandlar personuppgifter baserat på följande rättsliga grunder:</p>
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Samtycke (Art. 6.1.a GDPR)</h4>
                  <p className="text-blue-800">
                    För marknadsföringskommunikation och valfria tjänster
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Avtalsuppfyllelse (Art. 6.1.b GDPR)</h4>
                  <p className="text-green-800">
                    För att tillhandahålla våra tjänster och hantera ditt konto
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-orange-900 mb-2">Berättigat intresse (Art. 6.1.f GDPR)</h4>
                  <p className="text-orange-800">
                    För säkerhet, analys och förbättring av våra tjänster
                  </p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Rättslig förpliktelse (Art. 6.1.c GDPR)</h4>
                  <p className="text-red-800">
                    För att följa lagar om bokföring, beskattning och andra krav
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Data Usage */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>5. Hur använder vi dina personuppgifter?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Vi använder dina personuppgifter för att:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Tillhandahålla och underhålla vår NFC-plattform</li>
                <li>Bearbeta och hantera ditt företagskonto</li>
                <li>Skicka kampanjmeddelanden för våra företagskunder</li>
                <li>Tillhandahålla kundsupport och teknisk hjälp</li>
                <li>Förbättra våra tjänster och utveckla nya funktioner</li>
                <li>Förebygga bedrägerier och säkerställa säkerhet</li>
                <li>Följa juridiska förpliktelser och regler</li>
                <li>Analysera användningsmönster för förbättringar</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Sharing */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>6. Delning av personuppgifter</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Vi delar aldrig dina personuppgifter med tredje parter utom:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Tjänsteleverantörer:</strong> Cloud-hosting, e-post- och SMS-tjänster</li>
                <li><strong>Betalningsleverantörer:</strong> För säker hantering av betalningar</li>
                <li><strong>Juridiska krav:</strong> När vi är skyldiga enligt lag</li>
                <li><strong>Företagsförvärv:</strong> Vid fusion eller försäljning (med meddelande)</li>
              </ul>
              <p className="text-gray-700">
                Alla tredje parter är avtalsligt bundna att skydda dina uppgifter enligt GDPR.
              </p>
            </CardContent>
          </Card>

          {/* Your Rights */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-yellow-600" />
                7. Dina rättigheter enligt GDPR
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Du har följande rättigheter gällande dina personuppgifter:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Tillgång (Art. 15)</h4>
                  <p className="text-gray-700 text-sm">Få information om vilka uppgifter vi behandlar</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Rättelse (Art. 16)</h4>
                  <p className="text-gray-700 text-sm">Korrigera felaktiga eller ofullständiga uppgifter</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Radering (Art. 17)</h4>
                  <p className="text-gray-700 text-sm">Begära att vi raderar dina personuppgifter</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Begränsning (Art. 18)</h4>
                  <p className="text-gray-700 text-sm">Begränsa behandlingen under vissa omständigheter</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Dataportabilitet (Art. 20)</h4>
                  <p className="text-gray-700 text-sm">Få dina uppgifter i strukturerat format</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Invändning (Art. 21)</h4>
                  <p className="text-gray-700 text-sm">Invända mot behandling för marknadsföring</p>
                </div>
              </div>
              <p className="text-gray-700">
                För att utöva dina rättigheter, kontakta oss på: <strong>privacy@klario.se</strong>
              </p>
            </CardContent>
          </Card>

          {/* Data Security */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>8. Datasäkerhet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Vi skyddar dina personuppgifter genom:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>SSL/TLS-kryptering för all dataöverföring</li>
                <li>Krypterad datalagring i säkra datacenter</li>
                <li>Regelbundna säkerhetsuppdateringar och övervakning</li>
                <li>Begränsad åtkomst endast för behörig personal</li>
                <li>Regelbundna säkerhetshörderingar och tester</li>
                <li>Incidenthanteringsrutiner för snabb respons</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data Retention */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>9. Lagringstid</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Vi lagrar dina personuppgifter endast så länge som nödvändigt:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Företagskunder:</strong> Under avtalsperioden + 7 år (bokföringskrav)</li>
                <li><strong>Slutkunder:</strong> Enligt företagskundens instruktioner eller tills samtycke återkallas</li>
                <li><strong>Marknadsföringsdata:</strong> Tills du avanmäler dig eller återkallar samtycke</li>
                <li><strong>Tekniska loggar:</strong> Maksimalt 12 månader för säkerhet och support</li>
              </ul>
            </CardContent>
          </Card>

          {/* Cookies */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>10. Cookies och spårning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Vi använder cookies för:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li><strong>Nödvändiga cookies:</strong> För inloggning och säkerhet</li>
                <li><strong>Funktionella cookies:</strong> För att komma ihåg dina preferenser</li>
                <li><strong>Analyscookies:</strong> För att förstå hur tjänsten används</li>
                <li><strong>Marknadsföringscookies:</strong> Endast med ditt samtycke</li>
              </ul>
              <p className="text-gray-700">
                Du kan hantera cookie-inställningar i din webbläsare eller via vår cookie-banner.
              </p>
            </CardContent>
          </Card>

          {/* Contact and Complaints */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
            <CardHeader>
              <CardTitle>11. Kontakt och klagomål</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Om du har frågor om denna integritetspolicy eller vill utöva dina rättigheter:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>E-post:</strong> privacy@klario.se</p>
                <p><strong>Post:</strong> Klario AB, Storgatan 12, 111 22 Stockholm</p>
                <p><strong>Telefon:</strong> +46 8 123 456 78</p>
              </div>
              <p className="text-gray-700">
                Du har också rätt att lämna klagomål till Integritetsskyddsmyndigheten (IMY) 
                om du anser att vi behandlar dina personuppgifter felaktigt.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}