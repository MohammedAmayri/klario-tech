import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Shield, FileText } from "lucide-react";
import { Link } from "wouter";
import Footer from "@/components/Footer";
import KlarioLogo from "@/components/KlarioLogo";

export default function Terms() {
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
              <FileText className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Användarvillkor
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
                1. Allmänna villkor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Välkommen till Klario! Dessa användarvillkor ("Villkor") reglerar din användning av 
                Klarios NFC-kundengagemangsplattform och relaterade tjänster som tillhandahålls av 
                Klario AB ("vi", "oss", "vårt", "Klario").
              </p>
              <p className="text-gray-700">
                Genom att använda vår tjänst godkänner du dessa villkor i sin helhet. Om du inte 
                godkänner dessa villkor ska du inte använda vår tjänst.
              </p>
            </CardContent>
          </Card>

          {/* Service Description */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>2. Tjänstebeskrivning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Klario tillhandahåller en NFC-baserad kundengagemangsplattform som möjliggör för 
                företag att:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Samla in kundinformation via NFC-taggar</li>
                <li>Skapa och hantera marknadsföringskampanjer</li>
                <li>Skicka meddelanden via SMS, e-post och andra kanaler</li>
                <li>Analysera kampanjprestanda och kundengagemang</li>
                <li>Använda AI-driven innehållsgenerering för kampanjer</li>
              </ul>
            </CardContent>
          </Card>

          {/* User Responsibilities */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>3. Användaransvar</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Som användare av Klario förbinder du dig att:</p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Endast använda tjänsten för lagliga ändamål</li>
                <li>Respektera alla tillämpliga lagar och förordningar, inklusive GDPR</li>
                <li>Inhämta korrekt samtycke från kunder innan datainsamling</li>
                <li>Inte skicka spam eller oönskade meddelanden</li>
                <li>Hålla dina inloggningsuppgifter säkra och konfidentiella</li>
                <li>Inte försöka få obehörig åtkomst till systemet</li>
                <li>Rapportera eventuella säkerhetsproblem till oss omedelbart</li>
              </ul>
            </CardContent>
          </Card>

          {/* Data and Privacy */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>4. Data och integritet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Vi tar dataskydd på allvar och följer GDPR och andra tillämpliga dataskyddslagar. 
                Du som företag är ansvarig för:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Att informera kunder om datainsamling och användning</li>
                <li>Att inhämta korrekt samtycke innan databehandling</li>
                <li>Att respektera kunders rättigheter enligt GDPR</li>
                <li>Att endast samla in nödvändig data för ditt ändamål</li>
              </ul>
              <p className="text-gray-700">
                För mer information, se vår <Link href="/privacy" className="text-blue-600 hover:underline">integritetspolicy</Link>.
              </p>
            </CardContent>
          </Card>

          {/* Payment and Billing */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>5. Betalning och fakturering</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Klario erbjuder både gratis och betalda tjänster:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Gratis plan inkluderar grundläggande funktioner med begränsningar</li>
                <li>Betalda planer debiteras månadsvis i förskott</li>
                <li>Alla priser anges inklusive moms där tillämpligt</li>
                <li>Du kan säga upp din prenumeration när som helst</li>
                <li>Återbetalningar hanteras enligt svensk konsumentlagstiftning</li>
              </ul>
            </CardContent>
          </Card>

          {/* Service Availability */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>6. Tjänstetillgänglighet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Vi strävar efter 99.9% upptid men kan inte garantera att tjänsten alltid är 
                tillgänglig utan avbrott. Vi förbehåller oss rätten att:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Utföra schemalagt underhåll med förvarning</li>
                <li>Tillfälligt stänga av tjänsten för akuta säkerhetsuppdateringar</li>
                <li>Begränsa eller avbryta åtkomst vid misstänkt missbruk</li>
              </ul>
            </CardContent>
          </Card>

          {/* Intellectual Property */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>7. Immaterialrätt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Klario-plattformen och all relaterad programvara, design och innehåll ägs av 
                Klario AB. Du får inte:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Kopiera, modifiera eller distribuera vår programvara</li>
                <li>Använda våra varumärken utan skriftligt tillstånd</li>
                <li>Försöka dekompilera eller analysera vår källkod</li>
                <li>Skapa konkurrerande tjänster baserade på vår teknik</li>
              </ul>
            </CardContent>
          </Card>

          {/* Limitation of Liability */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>8. Ansvarsbegränsning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                I den utsträckning som tillåts enligt svensk lag begränsas vårt ansvar för:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Indirekta eller följdskador</li>
                <li>Förlorade intäkter eller vinster</li>
                <li>Dataverlust (utöver vad som krävs enligt GDPR)</li>
                <li>Avbrott i tjänsten utöver vår kontroll</li>
              </ul>
              <p className="text-gray-700">
                Vårt maximala ansvar begränsas till det belopp du betalat för tjänsten under 
                de senaste 12 månaderna.
              </p>
            </CardContent>
          </Card>

          {/* Termination */}
          <Card className="bg-white/60 backdrop-blur-sm border-gray-200/50 shadow-lg">
            <CardHeader>
              <CardTitle>9. Uppsägning</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Du kan säga upp ditt konto när som helst genom att kontakta vår support. 
                Vi kan säga upp ditt konto om:
              </p>
              <ul className="list-disc list-inside space-y-2 text-gray-700 ml-4">
                <li>Du bryter mot dessa villkor</li>
                <li>Du använder tjänsten för olagliga ändamål</li>
                <li>Du inte betalar för betalda tjänster</li>
                <li>Vi avslutar tjänsten helt (med 30 dagars varsel)</li>
              </ul>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/50">
            <CardHeader>
              <CardTitle>10. Kontaktinformation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Om du har frågor om dessa villkor, vänligen kontakta oss:
              </p>
              <div className="space-y-2 text-gray-700">
                <p><strong>Klario AB</strong></p>
                <p>E-post: legal@klario.se</p>
                <p>Telefon: +46 8 123 456 78</p>
                <p>Adress: Storgatan 12, 111 22 Stockholm, Sverige</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
}