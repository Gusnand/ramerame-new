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
import { useEffect, useRef, useState } from 'react';

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
  const [isViewingRecent, setIsViewingRecent] = useState(true);
  const calendarRef = useRef<any>(null);

  const mostRecentDate =
    events.length > 0
      ? events.reduce((latest, event) => {
          return event.date > latest ? event.date : latest;
        }, events[0].date)
      : new Date().toISOString().split('T')[0];

  // Convert sales report events to calendar events
  const calendarEvents = events.map((event) => ({
    id: event.id,
    title: formatHarga(event.sales_amount),
    start: event.date,
    end: event.date,
    calendarId: 'sales',
    backgroundColor: 'rgba(147, 51, 234, 0.2)', // Purple background
    borderColor: 'rgb(147, 51, 234)', // Purple border
    textColor: 'rgb(147, 51, 234)', // Purple text
    customHtml: (
      <div className="flex flex-col gap-1 p-1">
        <div className="text-sm font-medium text-purple-600 dark:text-purple-400">{formatHarga(event.sales_amount)}</div>
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
        darkColors: {
          main: 'rgb(147, 51, 234)', // Purple
          container: 'rgb(147, 51, 234)',
          onContainer: 'rgb(147, 51, 234)',
        },
      },
    },
    selectedDate: mostRecentDate,
    events: calendarEvents,
    translations: {
      todayButton: {
        today: isViewingRecent ? 'Today' : 'Recent',
        goToToday: isViewingRecent ? 'Go to today' : 'Go to recent',
      },
    },
  });

  useEffect(() => {
    const calendar = document.querySelector('.sx-calendar');
    if (calendar) {
      calendarRef.current = calendar;
      const todayButton = calendar.querySelector('.sx-today-button');
      if (todayButton) {
        const originalClick = todayButton.getAttribute('onclick');
        todayButton.setAttribute('onclick', '');
        todayButton.addEventListener('click', () => {
          setIsViewingRecent(!isViewingRecent);
          const targetDate = isViewingRecent ? new Date() : new Date(mostRecentDate);
          // Force page refresh with new date
          const url = new URL(window.location.href);
          url.searchParams.set('date', targetDate.toISOString().split('T')[0]);
          window.location.href = url.toString();
        });
      }
    }
  }, [calendarApp, isViewingRecent, mostRecentDate]);

  return (
    <div className="dark [&_.sx-calendar]:dark [&_.sx-calendar]:bg-background [&_.sx-calendar]:text-foreground [&_.sx-calendar]:border-border [&_.sx-calendar_td]:!bg-background [&_.sx-calendar_th]:!bg-background [&_.sx-calendar_button]:!text-foreground [&_.sx-calendar_button:hover]:!bg-accent [&_.sx-calendar_button:hover]:!text-accent-foreground [&_.sx-calendar_td.sx-selected]:!bg-accent [&_.sx-calendar_td.sx-selected]:!text-accent-foreground [&_.sx-calendar_td:hover]:!bg-accent/50 [&_.sx-calendar]:rounded-lg [&_.sx-calendar_td.sx-today]:!border-purple-500">
      <style>{`
        .sx-calendar {
          --sx-color-primary: rgb(147, 51, 234) !important;
          --sx-color-primary-container: rgba(147, 51, 234, 0.2) !important;
          --sx-color-on-primary-container: rgb(147, 51, 234) !important;
          --sx-color-surface: rgb(2, 8, 23) !important;
          --sx-color-on-surface: rgb(226, 232, 240) !important;
          --sx-color-surface-container: rgb(30, 41, 59) !important;
          background-color: rgb(2, 8, 23) !important;
          color: rgb(226, 232, 240) !important;
        }
        .sx-calendar .sx-event {
          background-color: rgba(147, 51, 234, 0.2) !important;
          border-color: rgb(147, 51, 234) !important;
          color: rgb(147, 51, 234) !important;
        }
        .sx-calendar .sx-calendar-grid td {
          background-color: rgb(2, 8, 23) !important;
          color: rgb(226, 232, 240) !important;
        }
        .sx-calendar .sx-calendar-grid th {
          background-color: rgb(2, 8, 23) !important;
          color: rgb(226, 232, 240) !important;
        }
        .sx-calendar .sx-calendar-header {
          background-color: rgb(2, 8, 23) !important;
          color: rgb(226, 232, 240) !important;
        }
        .sx-calendar .sx-calendar-header button {
          color: rgb(226, 232, 240) !important;
        }
        .sx-calendar .sx-calendar-header button:hover {
          background-color: rgba(147, 51, 234, 0.2) !important;
        }
      `}</style>
      <ScheduleXCalendar calendarApp={calendarApp} />
    </div>
  );
}
