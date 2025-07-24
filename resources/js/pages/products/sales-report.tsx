import { Calendar } from '@/components/ui/calendar';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { formatHarga } from '@/lib/helper';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { FileDown } from 'lucide-react';
import React from 'react';

type SalesReportProps = {
  username: string;
  omzets: any[];
  date: string;
  month: string;
  year: string;
  productId: number;
  product: any;

  eom: any[];
  pagination: any[];
  dailys: any[];
  dailysPagination: any[];
};

export default function SalesReport({
  username,
  omzets,
  date,
  month,
  year,
  productId,
  product,
  eom,
  dailys,
  pagination,
  dailysPagination,
}: SalesReportProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Sales Report',
      href: `/products/sales-report/${productId}`,
    },
  ];

  const savedTimeRange = localStorage.getItem('timeRange') || 'monthly';
  const [timeRange, setTimeRange] = React.useState(savedTimeRange);

  const updateTimeRange = (newTimeRange: string) => {
    setTimeRange(newTimeRange);
    localStorage.setItem('timeRange', newTimeRange); // Simpan ke localStorage
  };

  // console.log('eom', eom);
  // console.log('omzets', omzets);
  console.log('dailys', dailys);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales Report" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card className="dark:bg-sidebar @container/card">
          <CardHeader>
            <CardTitle>{product.product_name}</CardTitle>
            <CardDescription>
              <span className="hidden @[540px]/card:block">Total for the last 3 months</span>
              <span className="@[540px]/card:hidden">Sales Report</span>
            </CardDescription>
            <CardAction>
              <ToggleGroup
                type="single"
                value={timeRange}
                onValueChange={updateTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
              >
                <ToggleGroupItem value="monthly">Monthly Sales</ToggleGroupItem>
                <ToggleGroupItem value="daily">Daily Sales</ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={updateTimeRange}>
                <SelectTrigger
                  className="flex w-40 **:data-[slot=select-value]:block **:data-[slot=select-value]:truncate @[767px]/card:hidden"
                  size="sm"
                  aria-label="Select a value"
                >
                  <SelectValue placeholder="Monthly Sales" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="monthly" className="rounded-lg">
                    Monthly Sales
                  </SelectItem>
                  <SelectItem value="daily" className="rounded-lg">
                    Daily Sales
                  </SelectItem>
                </SelectContent>
              </Select>
            </CardAction>
          </CardHeader>
          <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
            {timeRange === 'monthly' ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow className="h-20 w-full">
                      <TableHead className="text-md w-[25px]">Period</TableHead>
                      <TableHead className="text-md w-[50px]">Upload Date</TableHead>
                      <TableHead className="text-md w-[50px]">Process Date</TableHead>
                      <TableHead className="text-md w-[50px]">Amount</TableHead>
                      <TableHead className="text-md w-[50px]">Status</TableHead>
                      <TableHead className="text-md w-[50px]">Action</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {eom.length > 0 ? (
                      eom.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell className="py-4 break-words whitespace-normal">
                            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][item.period_month - 1]}
                            {'   '}
                            {item.period_year}
                          </TableCell>
                          <TableCell className="py-4 break-words whitespace-normal">{item.upload_date}</TableCell>
                          <TableCell className="py-4 break-words whitespace-normal">{item.process_date}</TableCell>
                          <TableCell className="py-4 break-words whitespace-normal">{formatHarga(item.amount)}</TableCell>
                          <TableCell className="">
                            {item.status === 'Approved' ? (
                              <span className="rounded-md px-3 py-2 text-sm dark:bg-green-700">Approved</span>
                            ) : (
                              <span className="rounded-md px-3 py-2 text-sm dark:bg-yellow-600">Draft</span>
                            )}
                          </TableCell>
                          <TableCell className="">
                            <FileDown className="cursor-pointer" />
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell>No Data Available</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                <Pagination>
                  <PaginationContent>
                    {pagination.map((link, index) => (
                      <React.Fragment key={index}>
                        {link.label === '&laquo; Previous' && (
                          <PaginationItem>
                            <PaginationPrevious href={link.url || '#'} />
                          </PaginationItem>
                        )}
                        {link.label.match(/^\d+$/) && (
                          <PaginationItem>
                            <PaginationLink href={link.url || '#'} isActive={link.active}>
                              {link.label}
                            </PaginationLink>
                          </PaginationItem>
                        )}
                        {link.label === '...' && (
                          <PaginationItem>
                            <PaginationEllipsis />
                          </PaginationItem>
                        )}
                        {link.label === 'Next &raquo;' && (
                          <PaginationItem>
                            <PaginationNext href={link.url || '#'} />
                          </PaginationItem>
                        )}
                      </React.Fragment>
                    ))}
                  </PaginationContent>
                </Pagination>
              </>
            ) : (
              <>
                <Calendar
                  events={dailys.map((daily, index) => ({
                    id: index.toString(),
                    date: daily.sales_date,
                    sales_amount: daily.sales_amount,
                    has_report: Boolean(daily.report_file),
                  }))}
                  onDownload={async (date) => {
                    try {
                      const response = await fetch(`/products/sales-report/${productId}/download/${date}`, {
                        method: 'GET',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });

                      if (!response.ok) throw new Error('Download failed');

                      const blob = await response.blob();
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = `sales-report-${date}.pdf`;
                      document.body.appendChild(a);
                      a.click();
                      window.URL.revokeObjectURL(url);
                      document.body.removeChild(a);
                    } catch (error) {
                      console.error('Error downloading report:', error);
                    }
                  }}
                  onUpload={async (date) => {
                    try {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = '.pdf,.xlsx,.csv';

                      input.onchange = async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (!file) return;

                        const formData = new FormData();
                        formData.append('report', file);
                        formData.append('date', date);

                        const response = await fetch(`/products/sales-report/${productId}/upload`, {
                          method: 'POST',
                          body: formData,
                        });

                        if (!response.ok) throw new Error('Upload failed');

                        window.location.reload();
                      };

                      input.click();
                    } catch (error) {
                      console.error('Error uploading report:', error);
                    }
                  }}
                  onDelete={async (date) => {
                    try {
                      const response = await fetch(`/products/sales-report/${productId}/delete/${date}`, {
                        method: 'DELETE',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                      });

                      if (!response.ok) throw new Error('Delete failed');

                      window.location.reload();
                    } catch (error) {
                      console.error('Error deleting report:', error);
                    }
                  }}
                />
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
