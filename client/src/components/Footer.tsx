import { Heart, Nfc } from 'lucide-react';
import { Link } from 'wouter';

export default function Footer() {
  return (
    <footer className="bg-white/80 backdrop-blur-sm border-t border-gray-200/50 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Nfc className="h-4 w-4 text-blue-600" />
            <span className="font-medium text-gray-900">Klario</span>
            <span>- NFC Customer Engagement</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm text-gray-600">
            <span>© 2025 Klario - Connect. Register. Engage.</span>
          </div>
          
          <div className="flex items-center gap-4 text-sm">
            <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
              Integritet
            </Link>
            <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
              Villkor
            </Link>
            <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
              Kontakt
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}