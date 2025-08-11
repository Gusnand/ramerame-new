import { Input } from '@/components/ui/input';
import { Link } from '@/components/ui/link';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { formatHarga } from '@/lib/helper';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { CalendarClock, FileImage, Pencil } from 'lucide-react';
import React, { useEffect, useState } from 'react';

type Product = {
  id: number;
  product_name: string;
  status: string;
  expired_date: string;
  invest_month: number;
  invest_amount: number;
};

type PaginationLink = {
  url: string | null;
  label: string;
  active: boolean;
};

type PaginationData = {
  links: PaginationLink[];
  current_page: number;
  last_page: number;
};

export default function Index() {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Product Inquiries',
      href: '/products',
    },
  ];

  const [products, setProducts] = useState<Product[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(searchTerm);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page on new search
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`/products/data?page=${currentPage}&search=${debouncedSearchTerm}`);
        const data = await response.json();
        setProducts(data.data);
        setPagination(data);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      }
    };

    fetchProducts();
  }, [debouncedSearchTerm, currentPage]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Product Inquiries" />

      <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Daftar Produk</h1>
          <Input placeholder="Cari produk..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full max-w-sm" />
        </div>
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
            {products.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-gray-500">
                  No Product Found
                </TableCell>
              </TableRow>
            ) : (
              products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="">{product.id}</TableCell>
                  <TableCell className="">{product.product_name}</TableCell>
                  <TableCell className="text-left">{product.status}</TableCell>
                  <TableCell className="">{product.expired_date}</TableCell>
                  <TableCell className="text-left">{product.invest_month}</TableCell>
                  <TableCell className="text-left">{formatHarga(product.invest_amount)}</TableCell>
                  <TableCell className="w-full text-center">
                    <Tooltip>
                      <TooltipTrigger>
                        <Link variant="outline" size="icon" className="cursor-pointer" href={`products/editproduct/${product.id}`}>
                          <Pencil />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Edit Product</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link variant="outline" size="icon" className="cursor-pointer" href={`products/sales-report/${product.id}`}>
                          <CalendarClock />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Sales Report</p>
                      </TooltipContent>
                    </Tooltip>
                    <Tooltip>
                      <TooltipTrigger>
                        <Link variant="outline" size="icon" className="cursor-pointer" href={`products/certificate/${product.id}`}>
                          <FileImage />
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Certificate</p>
                      </TooltipContent>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {pagination && pagination.last_page > 1 && (
          <Pagination>
            <PaginationContent>
              {pagination.links.map((link, index) => {
                const pageNumber = new URLSearchParams(link.url?.split('?')[1]).get('page');
                return (
                  <React.Fragment key={index}>
                    {link.label.includes('Previous') ? (
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => link.url && setCurrentPage(pagination.current_page - 1)}
                          className={!link.url ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    ) : link.label.includes('Next') ? (
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => link.url && setCurrentPage(pagination.current_page + 1)}
                          className={!link.url ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    ) : link.label === '...' ? (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    ) : (
                      <PaginationItem>
                        <PaginationLink
                          onClick={() => pageNumber && setCurrentPage(Number(pageNumber))}
                          isActive={link.active}
                          className="cursor-pointer"
                        >
                          {link.label}
                        </PaginationLink>
                      </PaginationItem>
                    )}
                  </React.Fragment>
                );
              })}
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </AppLayout>
  );
}
