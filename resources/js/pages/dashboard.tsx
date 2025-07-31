import { ChartAreaInteractive } from '@/components/chart-area-interactive';
import { SectionCards } from '@/components/section-cards';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

interface DashboardProps {
  dashboardData: {
    username: string;
    campaignActive: number;
    claimedHariIni: number;
    claimedBulanIni: number;
    usedHariIni: number;
    usedBulanIni: number;
    availableHariIni: number;
    availableBulanIni: number;
    thisDay: string;
    thisMonth: string;
  };
}

const breadcrumbs: BreadcrumbItem[] = [
  {
    title: 'Dashboard',
    href: '/dashboard',
  },
];

export default function Page({ dashboardData }: DashboardProps) {
  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Dashboard" />
      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="grid grid-cols-1 gap-4 px-6 py-4 md:grid-cols-2 md:gap-6 md:py-6 lg:grid-cols-3">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Welcome</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.username}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Campaign Active</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData.campaignActive}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-4 px-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Voucher Stats - {dashboardData.thisDay}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Voucher Claimed</span>
                      <span className="font-bold">{dashboardData.claimedHariIni}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voucher Available</span>
                      <span className="font-bold">{dashboardData.availableHariIni}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voucher Used</span>
                      <span className="font-bold">{dashboardData.usedHariIni}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Voucher Stats - {dashboardData.thisMonth}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Voucher Claimed</span>
                      <span className="font-bold">{dashboardData.claimedBulanIni}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voucher Available</span>
                      <span className="font-bold">{dashboardData.availableBulanIni}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voucher Used</span>
                      <span className="font-bold">{dashboardData.usedBulanIni}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              <SectionCards />
              <div className="px-4 lg:px-6">
                <ChartAreaInteractive />
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
