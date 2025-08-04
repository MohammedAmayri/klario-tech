import { Button } from "@/components/ui/button";
import { useLocalization, Language } from "@/hooks/useLocalization";
import { Globe } from "lucide-react";

const LanguageSwitcher = () => {
  const { language, switchLanguage } = useLocalization();

  return (
    <div className="flex items-center space-x-2">
      <Globe className="w-4 h-4 text-gray-600" />
      <Button
        variant={language === 'en' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('en')}
        className="h-8 px-2 text-xs"
      >
        EN
      </Button>
      <Button
        variant={language === 'sv' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => switchLanguage('sv')}
        className="h-8 px-2 text-xs"
      >
        SV
      </Button>
    </div>
  );
};

export default LanguageSwitcher;