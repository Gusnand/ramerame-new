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
import { formatHarga } from '@/lib/helper';
import { createViewMonthGrid } from '@schedule-x/calendar';
import { ScheduleXCalendar, useCalendarApp } from '@schedule-x/react';
import { FileDown, Upload, X } from 'lucide-react';
import React from 'react';

type SalesReportEvent = {
  id: string;
  date: string;
  sales_amount: number;
  has_report: boolean;
};

interface EventCalendarProps {
  events: SalesReportEvent[];
  onDownload: (date: string) => void;
  onUpload: (date: string) => void;
  onDelete: (date: string) => void;
  recentUploadDate?: string;
}

export default function EventCalendar({ events, onDownload, onUpload, onDelete, recentUploadDate }: EventCalendarProps) {
  const [isToday, setIsToday] = React.useState(true);

  // Convert sales report events to calendar events
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: `${formatHarga(event.sales_amount)}`,
    start: event.date,
    end: event.date,
    customHtml: (
      <div className="flex flex-col gap-1 p-1">
        <div className="text-sm font-medium">{formatHarga(event.sales_amount)}</div>
        <div className="flex gap-1">
          {event.has_report ? (
            <>
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
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-destructive h-6 w-6" onClick={(e) => e.stopPropagation()}>
                    <X className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Sales Report</AlertDialogTitle>
                    <AlertDialogDescription>Are you sure you want to delete this sales report? This action cannot be undone.</AlertDialogDescription>
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
          )}
        </div>
      </div>
    ),
  }));

  const calendarApp = useCalendarApp({
    views: [createViewMonthGrid()],
    theme: 'dark',
    calendars: {
      sales: {
        label: 'Sales Report',
        colorName: 'sales',
        lightColors: {
          main: 'hsl(210 40% 93.1%)',
          container: '#000',
          onContainer: 'hsl(210 40% 93.1%)',
        },
        darkColors: {
          main: 'hsl(217.2 32.6% 17.5%)',
          container: 'hsl(210 40% 93.1%)',
          onContainer: 'hsl(217.2 32.6% 17.5%)',
        },
      },
    },
    selectedDate: isToday ? new Date().toISOString().split('T')[0] : recentUploadDate || new Date().toISOString().split('T')[0],
    events: calendarEvents,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => setIsToday(!isToday)}>
          {isToday ? 'Show Recent' : 'Show Today'}
        </Button>
      </div>
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
}
