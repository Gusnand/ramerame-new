import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import * as React from 'react';

interface DatePickerProps {
  value?: Date;
  onChange?: (date: Date | undefined) => void;
  placeholder?: string;
  className?: string;
}

export function DatePicker({ value, onChange, placeholder = 'Pick a date', className }: DatePickerProps) {
  const [internalDate, setInternalDate] = React.useState<Date | undefined>(value);

  React.useEffect(() => {
    setInternalDate(value);
  }, [value]);

  const handleDateChange = (date: Date | undefined) => {
    setInternalDate(date);
    if (onChange) {
      onChange(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          data-empty={!internalDate}
          className={cn(
            'data-[empty=true]:text-muted-foreground dark:bg-sidebar w-full justify-start text-left font-normal',
            className, // Tambahkan className dari props
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {internalDate ? format(internalDate, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar mode="single" selected={internalDate} onSelect={handleDateChange} />
      </PopoverContent>
    </Popover>
  );
}
