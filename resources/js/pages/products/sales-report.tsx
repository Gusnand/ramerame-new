import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
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
};

export default function SalesReport({ username, omzets, date, month, year, productId, omzetId, product, eom }: SalesReportProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Sales Report',
      href: `/products/sales-report/${productId}`,
    },
  ];

  const [timeRange, setTimeRange] = React.useState('monthly');

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Sales Report" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <Card className="@container/card">
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
                onValueChange={setTimeRange}
                variant="outline"
                className="hidden *:data-[slot=toggle-group-item]:!px-4 @[767px]/card:flex"
              >
                <ToggleGroupItem value="monthly">Monthly Sales</ToggleGroupItem>
                <ToggleGroupItem value="daily">Daily Sales</ToggleGroupItem>
              </ToggleGroup>
              <Select value={timeRange} onValueChange={setTimeRange}>
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
            <Table>
              <TableHeader>
                <TableRow className="h-20 w-full">
                  <TableHead className="text-md w-[50px]">Period</TableHead>
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
                      <TableCell className="">{item.period_month}</TableCell>
                      <TableCell className="">{item.upload_date}</TableCell>
                      <TableCell className="">{item.process_date}</TableCell>
                      <TableCell className="">{item.amount}</TableCell>
                      <TableCell className="">{item.status}</TableCell>
                      <TableCell className="">{}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell>No Data Available</TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <Table>
              <TableHeader>
                <TableRow className="h-20 w-full">
                  <TableHead className="text-md w-[50px]">Date</TableHead>
                  <TableHead className="text-md w-[50px]">Total Sales</TableHead>
                  <TableHead className="text-md w-[50px]">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {omzets.map((omzet, index) => (
                  <TableRow key={index}>
                    <TableCell className="">{omzet.product_omzet_name}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <ChartAreaInteractive />
      </div>
    </AppLayout>
  );
}
