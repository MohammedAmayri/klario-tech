
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";

interface BookingFormProps {
  language: 'en' | 'sv';
  onSubmit: (data: { date: string; time: string; timezone: string }) => void;
}

const BookingForm = ({ language, onSubmit }: BookingFormProps) => {
  const [bookingData, setBookingData] = useState({
    date: '',
    time: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
  });

  const texts = {
    en: {
      title: "Book your 15-minute NFC demo",
      date: "Preferred date",
      time: "Preferred time",
      timezone: "Timezone",
      submit: "Book demo call",
      times: [
        { value: '09:00', label: '9:00 AM' },
        { value: '10:00', label: '10:00 AM' },
        { value: '11:00', label: '11:00 AM' },
        { value: '14:00', label: '2:00 PM' },
        { value: '15:00', label: '3:00 PM' },
        { value: '16:00', label: '4:00 PM' }
      ]
    },
    sv: {
      title: "Boka ditt 15-minuters NFC-demo",
      date: "Föredragen datum",
      time: "Föredragen tid",
      timezone: "Tidszon",
      submit: "Boka demo-samtal",
      times: [
        { value: '09:00', label: '09:00' },
        { value: '10:00', label: '10:00' },
        { value: '11:00', label: '11:00' },
        { value: '14:00', label: '14:00' },
        { value: '15:00', label: '15:00' },
        { value: '16:00', label: '16:00' }
      ]
    }
  };

  const t = texts[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!bookingData.date || !bookingData.time) {
      return;
    }

    onSubmit(bookingData);
  };

  // Get next 14 days for date selection
  const getAvailableDates = () => {
    const dates = [];
    for (let i = 1; i <= 14; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString(language === 'sv' ? 'sv-SE' : 'en-US', { 
            weekday: 'short', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    return dates;
  };

  return (
    <div className="bg-white border border-purple-200 rounded-lg p-4 shadow-sm">
      <h4 className="font-semibold text-sm text-purple-800 mb-3 flex items-center">
        <Calendar className="w-4 h-4 mr-2" />
        {t.title}
      </h4>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <Label className="text-xs text-gray-600 mb-1 block">{t.date}</Label>
          <Select onValueChange={(value) => setBookingData(prev => ({ ...prev, date: value }))}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder={language === 'sv' ? 'Välj datum' : 'Select date'} />
            </SelectTrigger>
            <SelectContent>
              {getAvailableDates().map(date => (
                <SelectItem key={date.value} value={date.value}>
                  {date.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-xs text-gray-600 mb-1 block">{t.time}</Label>
          <Select onValueChange={(value) => setBookingData(prev => ({ ...prev, time: value }))}>
            <SelectTrigger className="h-8 text-sm">
              <SelectValue placeholder={language === 'sv' ? 'Välj tid' : 'Select time'} />
            </SelectTrigger>
            <SelectContent>
              {t.times.map(time => (
                <SelectItem key={time.value} value={time.value}>
                  {time.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div>
          <Label className="text-xs text-gray-600 mb-1 block">{t.timezone}</Label>
          <Input
            type="text"
            value={bookingData.timezone}
            readOnly
            className="h-8 text-sm bg-gray-50"
          />
        </div>
        
        <Button
          type="submit"
          size="sm"
          className="w-full bg-green-600 hover:bg-green-700 text-xs h-8"
          disabled={!bookingData.date || !bookingData.time}
        >
          <Clock className="w-3 h-3 mr-2" />
          {t.submit}
        </Button>
      </form>
    </div>
  );
};

export default BookingForm;
