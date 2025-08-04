import { Button } from '@/components/ui/button';
import { Languages } from 'lucide-react';
import { useTranslation, Language } from '@/lib/i18n';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();

  const toggleLanguage = () => {
    const newLang: Language = language === 'sv' ? 'en' : 'sv';
    setLanguage(newLang);
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 hover:bg-blue-50 border-blue-200"
      title={language === 'sv' ? 'Switch to English' : 'Växla till svenska'}
    >
      <Languages className="w-4 h-4" />
      <span className="font-medium">
        {language === 'sv' ? 'EN' : 'SV'}
      </span>
    </Button>
  );
}