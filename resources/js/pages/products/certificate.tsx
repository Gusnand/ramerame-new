import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import { BreadcrumbItem } from '@/types';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarSync, Download } from 'lucide-react';
import React, { useState } from 'react';

type Certifier = {
  id: number;
  name: string;
  email: string;
  certificate_no: string;
  total_slot: number;
};

type CertificateData = {
  id: number;
  product_id: number;
  product_name: string;
  cert_prefix: string;
  product_location: string;
  product_duration: number;
  cert_location: string;
  cert_date_string: string;
  project_owner_company: string;
  project_owner_name: string;
  project_owner_title: string;
  admin_company: string;
  admin_owner: string;
  admin_title: string;
  details: Certifier[]; // Daftar pemilik sertifikat
};

type Product = {
  id: number;
  product_name: string;
};

export default function Certificate({
  certificate,
  product,
  certifiers = { data: [], current_page: 1, last_page: 1, per_page: 10 },
}: {
  certificate: CertificateData;
  product: Product;
  certifiers?: any;
}) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Certificate',
      href: route('certificates.edit', product.id),
    },
  ];
  const { data, setData, post, processing, errors, reset } = useForm({
    product_name: certificate.product_name || '',
    cert_prefix: certificate.cert_prefix || '',
    product_location: certificate.product_location || '',
    product_duration: certificate.product_duration || 0,
    cert_location: certificate.cert_location || '',
    cert_date_string: certificate.cert_date_string || '',
    project_owner_company: certificate.project_owner_company || '',
    project_owner_name: certificate.project_owner_name || '',
    project_owner_title: certificate.project_owner_title || '',
    admin_company: certificate.admin_company || '',
    admin_owner: certificate.admin_owner || '',
    admin_title: certificate.admin_title || '',
  });

  // State for edit/view mode
  const [editMode, setEditMode] = useState(false);
  // Store original data for cancel
  const [originalData] = useState({ ...certificate });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post(route('certificates.update', certificate.id), {
      preserveScroll: true,
      onSuccess: () => setEditMode(false),
    });
  };

  const handleEdit = () => setEditMode(true);
  const handleCancel = () => {
    // Reset form data to original
    setData('product_name', originalData.product_name || '');
    setData('cert_prefix', originalData.cert_prefix || '');
    setData('product_location', originalData.product_location || '');
    setData('product_duration', originalData.product_duration || 0);
    setData('cert_location', originalData.cert_location || '');
    setData('cert_date_string', originalData.cert_date_string || '');
    setData('project_owner_company', originalData.project_owner_company || '');
    setData('project_owner_name', originalData.project_owner_name || '');
    setData('project_owner_title', originalData.project_owner_title || '');
    setData('admin_company', originalData.admin_company || '');
    setData('admin_owner', originalData.admin_owner || '');
    setData('admin_title', originalData.admin_title || '');
    setEditMode(false);
  };

  // Fungsi untuk memicu proses generate/sync data pemilik sertifikat
  const handleGenerate = () => {
    if (confirm('Anda yakin ingin generate/sinkronisasi data pemilik sertifikat?')) {
      router.post(
        route('certificates.generate', product.id),
        {},
        {
          preserveScroll: true,
        },
      );
    }
  };

  const returnPage = () => {
    router.get('/products');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Certificate for ${product.product_name}`} />

      <div className="flex h-full flex-col gap-6 rounded-xl p-4">
        <form onSubmit={handleSubmit} className="ml-4 flex flex-col gap-6">
          <div className="flex-1">
            <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
              <HeadingSmall title="Certificate Settings" description="Update the general information for this certificate." />

              {/* All input fields: disabled if not editMode */}
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="name">
                  Product Name
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="product_name"
                  placeholder="Input your product name"
                  value={data.product_name}
                  onChange={(e) => setData('product_name', e.target.value)}
                  disabled={!editMode}
                />
                {errors.product_name && <p className="text-sm text-red-500">{errors.product_name}</p>}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="cert_prefix">
                  Product Code
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="cert_prefix"
                  placeholder="Input your product code"
                  value={data.cert_prefix}
                  onChange={(e) => setData('cert_prefix', e.target.value)}
                  disabled={!editMode}
                />
                {errors.cert_prefix && <p className="text-sm text-red-500">{errors.cert_prefix}</p>}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="product_location">
                  Location
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="product_location"
                  placeholder="Input your product code"
                  value={data.product_location}
                  onChange={(e) => setData('product_location', e.target.value)}
                  disabled={!editMode}
                />
                {errors.product_location && <p className="text-red-500">{errors.product_location}</p>}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="product_duration">
                  Contract Time
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="product_duration"
                  placeholder="Input your product code"
                  value={data.product_duration}
                  onChange={(e) => setData('product_duration', Number(e.target.value))}
                  disabled={!editMode}
                />
                {errors.product_duration && <p className="text-red-500">{errors.product_duration}</p>}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="cert_location_date">
                  Date and Location
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="cert_location_date"
                  placeholder="e.g., Jakarta, 1 Januari 2025"
                  value={data.cert_date_string ? `${data.cert_location}, ${data.cert_date_string}` : data.cert_location}
                  onChange={(e) => {
                    const fullValue = e.target.value;
                    const commaIndex = fullValue.indexOf(',');
                    if (commaIndex > -1) {
                      setData('cert_location', fullValue.substring(0, commaIndex).trim());
                      setData('cert_date_string', fullValue.substring(commaIndex + 1).trim());
                    } else {
                      setData('cert_location', fullValue.trim());
                      setData('cert_date_string', '');
                    }
                  }}
                  disabled={!editMode}
                />
                {(errors.cert_location || errors.cert_date_string) && (
                  <p className="text-sm text-red-500">{errors.cert_location || errors.cert_date_string}</p>
                )}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="cert_date_string">
                  Certificate Date
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="cert_date_string"
                  placeholder="e.g., Jakarta, 1 Januari 2025"
                  value={data.cert_date_string}
                  onChange={(e) => setData('cert_date_string', e.target.value)}
                  disabled={!editMode}
                />
                {(errors.cert_location || errors.cert_date_string) && (
                  <p className="text-sm text-red-500">{errors.cert_location || errors.cert_date_string}</p>
                )}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="project_owner_company">
                  Project Company Name
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="project_owner_company"
                  placeholder="Input your product code"
                  value={data.project_owner_company}
                  onChange={(e) => setData('project_owner_company', e.target.value)}
                  disabled={!editMode}
                />
                {errors.project_owner_company && <p className="text-red-500">{errors.project_owner_company}</p>}
              </div>
              <div className="flex w-full flex-row items-center gap-2">
                <Label className="w-1/3" htmlFor="project_owner_name">
                  Project Owner
                </Label>
                <Input
                  className="mt-1 block w-full"
                  type="text"
                  id="project_owner_name"
                  placeholder="Input your product code"
                  value={data.project_owner_name}
                  onChange={(e) => setData('project_owner_name', e.target.value)}
                  disabled={!editMode}
                />
                {errors.project_owner_name && <p className="text-red-500">{errors.project_owner_name}</p>}
              </div>
              {/* Edit/Save/Cancel buttons */}
              <div className="flex flex-row justify-end gap-2 px-6">
                {!editMode ? (
                  <Button type="button" onClick={handleEdit}>
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button type="submit" disabled={processing}>
                      Save Changes
                    </Button>
                    <Button type="button" variant={'outline'} className="ml-2" onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        </form>

        <div className="flex h-full flex-col gap-6 rounded-xl p-4">
          <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
            <HeadingSmall title="Certifier's List" description="" />
            <Table>
              <TableHeader>
                <TableRow className="h-20 w-full">
                  <TableHead className="text-md w-[50px]">No.</TableHead>
                  <TableHead className="text-md w-[300px]">Name</TableHead>
                  <TableHead className="text-md w-[250px]">Email</TableHead>
                  <TableHead className="text-md w-[200px]">
                    Certificate <br /> Number
                  </TableHead>
                  <TableHead className="text-md w-[80px]">
                    Total <br /> Slot
                  </TableHead>
                  <TableHead className="text-md w-[150px]">Value</TableHead>
                  <TableHead className="text-md w-full text-center"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {certifiers && certifiers.data && certifiers.data.length > 0 ? (
                  certifiers.data.map((certifier: Certifier, index: number) => (
                    <TableRow key={certifier.id}>
                      <TableCell className="">{(certifiers.current_page - 1) * certifiers.per_page + index + 1}</TableCell>
                      <TableCell className="">{certifier.name}</TableCell>
                      <TableCell className="text-left">{certifier.email}</TableCell>
                      <TableCell className="">{certifier.certificate_no}</TableCell>
                      <TableCell className="text-left">{certifier.total_slot}</TableCell>
                      <TableCell className="text-left">
                        <Tooltip>
                          <TooltipTrigger>
                            <a
                              href={route('certificates.download', certifier.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center justify-center rounded border p-2 hover:bg-gray-100"
                              download
                            >
                              <CalendarSync />
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate Certificate</p>
                          </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger>
                            <Link variant="outline" size="icon" className="cursor-pointer" href={route('certificates.download', certifier.id)}>
                              <Download />
                            </Link>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Download Certificate</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center">
                      No data available
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            {/* Pagination Controls with shadcn UI */}
            {certifiers && certifiers.last_page > 1 && (
              <Pagination>
                <PaginationContent>
                  {certifiers.links.map((link: any, index: number) => {
                    // Extract page number from link.url
                    let pageNumber = null;
                    if (link.url) {
                      const params = new URLSearchParams(link.url.split('?')[1]);
                      pageNumber = params.get('page');
                    }
                    return (
                      <React.Fragment key={index}>
                        {link.label.includes('Previous') ? (
                          <PaginationItem>
                            <PaginationPrevious
                              onClick={
                                link.url
                                  ? () =>
                                      router.get(
                                        route('certificates.edit', product.id),
                                        { page: certifiers.current_page - 1 },
                                        { preserveScroll: true },
                                      )
                                  : undefined
                              }
                              className={!link.url ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                            />
                          </PaginationItem>
                        ) : link.label.includes('Next') ? (
                          <PaginationItem>
                            <PaginationNext
                              onClick={
                                link.url
                                  ? () =>
                                      router.get(
                                        route('certificates.edit', product.id),
                                        { page: certifiers.current_page + 1 },
                                        { preserveScroll: true },
                                      )
                                  : undefined
                              }
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
                              onClick={
                                pageNumber
                                  ? () => router.get(route('certificates.edit', product.id), { page: Number(pageNumber) }, { preserveScroll: true })
                                  : undefined
                              }
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
        </div>
      </div>
    </AppLayout>
  );
}
