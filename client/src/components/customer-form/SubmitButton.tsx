
import { Button } from "@/components/ui/button";
import { Star, Sparkles } from "lucide-react";

interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
}

const SubmitButton = ({ isSubmitting, disabled = false }: SubmitButtonProps) => {
  return (
    <Button 
      type="submit" 
      className={`w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white text-lg py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform font-semibold ${
        isSubmitting ? 'scale-95 opacity-80' : 'hover:scale-105 active:scale-95'
      }`}
      disabled={isSubmitting || disabled}
    >
      {isSubmitting ? (
        <div className="flex items-center space-x-3">
          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Submitting your details...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center space-x-2">
          <Sparkles className="w-5 h-5" />
          <span>Submit & Leave Review</span>
          <Star className="w-5 h-5 fill-current" />
        </div>
      )}
    </Button>
  );
};

export default SubmitButton;
