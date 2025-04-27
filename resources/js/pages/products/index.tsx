import { Link } from '@/components/ui/link';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatHarga } from '@/lib/helper';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import axios from 'axios';
import { CalendarClock, Pencil } from 'lucide-react';
import { useEffect, useState } from 'react';

type Product = {
  id: number;
  product_name: string;
  status: string;
  expired_date: string;
  invest_month: number;
  invest_amount: number;
};

export default function Index() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Product Inquiries',
      href: '/products',
    },
  ];

  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    axios.get('/products/data').then((response) => {
      setProducts(response.data.data);
    });
  }, []);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Product Inquiries" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <h1>Daftar Produk</h1>
        <Table>
          <TableHeader>
            <TableRow className="h-20 w-full">
              <TableHead className="text-md w-[50px]">ID</TableHead>
              <TableHead className="text-md w-[300px]">Nama Produk</TableHead>
              <TableHead className="text-md w-[100px] text-left">Status</TableHead>
              <TableHead className="text-md w-[120px]">Jatuh Tempo</TableHead>
              <TableHead className="text-md w-[80px] text-left">
                Investasi
                <br />
                Bulanan
              </TableHead>
              <TableHead className="text-md w-[150px] text-left">Jumlah Investasi</TableHead>
              <TableHead className="text-md w-full text-center">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="">{product.id}</TableCell>
                <TableCell className="">{product.product_name}</TableCell>
                <TableCell className="text-left">{product.status}</TableCell>
                <TableCell className="">{product.expired_date}</TableCell>
                <TableCell className="text-left">{product.invest_month}</TableCell>
                <TableCell className="text-left">{formatHarga(product.invest_amount)}</TableCell>
                <TableCell className="w-full text-center">
                  <Link variant="outline" size="icon" className="cursor-pointer" href={`products/editproduct/${product.id}`}>
                    <Pencil />
                  </Link>
                  <Link variant="outline" size="icon" className="cursor-pointer" href={`products/sales-report/${product.id}`}>
                    <CalendarClock />
                  </Link>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </AppLayout>
  );
}
