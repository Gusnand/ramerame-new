import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { formatHarga } from '@/lib/helper';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, FileDown, Upload, X } from 'lucide-react';
import * as React from 'react';

interface CalendarProps {
  events: Array<{
    id: string;
    date: string;
    sales_amount: number;
    has_report: boolean;
  }>;
  onDownload: (date: string) => void;
  onUpload: (date: string) => void;
  onDelete: (date: string) => void;
  className?: string;
}

export function Calendar({ events, onDownload, onUpload, onDelete, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [isViewingRecent, setIsViewingRecent] = React.useState(true);

  // Find most recent date with data
  const mostRecentDate = React.useMemo(() => {
    if (events.length === 0) return new Date();
    return new Date(events.reduce((latest, event) => (event.date > latest ? event.date : latest), events[0].date));
  }, [events]);

  React.useEffect(() => {
    // Initialize to most recent date
    setCurrentDate(mostRecentDate);
  }, [mostRecentDate]);

  const daysInMonth = React.useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  }, [currentDate]);

  const startDay = React.useMemo(() => {
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  }, [currentDate]);

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1));
  };

  const handleTodayClick = () => {
    setIsViewingRecent(!isViewingRecent);
    setCurrentDate(isViewingRecent ? new Date() : mostRecentDate);
  };

  const getEventForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return events.find((event) => event.date === dateStr);
  };

  const weeks = React.useMemo(() => {
    const days = [];
    let day = 1;

    // Add empty cells for days before the first of the month
    for (let i = 0; i < startDay; i++) {
      days.push(null);
    }

    // Add days of the month
    while (day <= daysInMonth) {
      days.push(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
      day++;
    }

    // Split into weeks
    const weeks = [];
    while (days.length) {
      weeks.push(days.splice(0, 7));
    }

    return weeks;
  }, [currentDate, daysInMonth, startDay]);

  return (
    <div className={cn('w-full space-y-4', className)}>
      <div className="flex items-center justify-between">
        <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground" onClick={handleTodayClick}>
          {isViewingRecent ? 'Today' : 'Recent'}
        </Button>
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          <div className="space-x-1">
            <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" onClick={handlePrevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="outline" className="hover:bg-accent hover:text-accent-foreground h-8 w-8 p-0" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-card text-card-foreground rounded-lg border shadow-sm">
        <div className="grid grid-cols-7 gap-0 border-b">
          {dayNames.map((day) => (
            <div key={day} className="text-muted-foreground p-3 text-center text-sm font-medium">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-0 text-sm">
          {weeks.map((week, weekIndex) => (
            <React.Fragment key={weekIndex}>
              {week.map((date, dayIndex) => {
                if (!date) {
                  return <div key={`empty-${dayIndex}`} className="border-t p-3 text-center" />;
                }

                const event = getEventForDate(date);
                const isToday = date.toDateString() === new Date().toDateString();

                return (
                  <div
                    key={date.toString()}
                    className={cn(
                      'hover:bg-accent/50 relative border-t pt-8 pb-8 pl-3',
                      isToday && 'bg-accent/5 font-semibold',
                      event && 'bg-purple-500/10',
                    )}
                  >
                    <time dateTime={date.toISOString()} className="mb-2 block text-xs">
                      {date.getDate()}
                    </time>
                    {event && (
                      <div className="space-y-2">
                        <div className="inline-block rounded bg-white px-2 py-1 text-sm font-medium text-black">
                          {formatHarga(event.sales_amount)}
                        </div>{' '}
                        <div className="flex gap-1">
                          {event.has_report ? (
                            <>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        onDownload(event.date);
                                      }}
                                    >
                                      <FileDown className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Download Report</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="icon" className="text-destructive h-6 w-6" onClick={(e) => e.stopPropagation()}>
                                    <X className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Sales Report</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this sales report? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => onDelete(event.date)}
                                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </>
                          ) : (
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      onUpload(event.date);
                                    }}
                                  >
                                    <Upload className="h-4 w-4" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>Upload Report</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
