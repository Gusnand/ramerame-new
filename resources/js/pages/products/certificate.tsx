import HeadingSmall from '@/components/heading-small';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { formatHarga } from '@/lib/helper';
import { BreadcrumbItem } from '@/types';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { Head, router, useForm } from '@inertiajs/react';
import { CalendarSync, CheckCircle2, Download, LoaderCircle, XCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'sonner';

type Certifier = {
  id: number;
  name: string;
  email: string;
  certificate_no: string;
  total_slot: number;
  slot_price: number;
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
  const { data, setData, put, processing, errors, reset } = useForm({
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

  // State untuk validasi sertifikat
  const [validationResult, setValidationResult] = useState<{
    error: boolean;
    message: string;
    data?: {
      name: string;
      email: string;
      address: string;
      certificate_no: string;
      generated_at: string;
      issuer: string;
    };
  } | null>(null);

  const [isValidating, setIsValidating] = useState(false);

  // Handler untuk validasi sertifikat
  const handleValidateCertificate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset file input value to allow resubmission of the same file
    e.target.value = '';

    setIsValidating(true);
    setValidationResult(null);

    const formData = new FormData();
    formData.append('certificate', file);

    toast.promise(
      // Your existing validation logic here
      new Promise(async (resolve, reject) => {
        try {
          const response = await fetch(route('certificates.validate'), {
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'X-XSRF-TOKEN': decodeURIComponent(
                document.cookie
                  .split('; ')
                  .find((row) => row.startsWith('XSRF-TOKEN='))
                  ?.split('=')[1] || '',
              ),
            },
            credentials: 'include',
            body: formData,
          });

          if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          setValidationResult(result);
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          setIsValidating(false);
        }
      }),
      {
        loading: 'Validating certificate...',
        success: 'Certificate validated successfully',
        error: (err) => `Validation failed: ${err.message}`,
      },
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    put(route('certificates.update', certificate.id), {
      preserveScroll: true,
      onSuccess: () => {
        toast.success('Certificate settings updated successfully');
        setEditMode(false);
      },
      onError: (errors) => {
        toast.error('Failed to update certificate settings');
        console.error(errors);
      },
    });
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(true);
  };
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

  const returnPage = () => {
    router.get('/products');
  };

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Certificate for ${product.product_name}`} />

      <div className="flex h-full flex-col gap-6 rounded-xl p-4">
        {/* Certificate Settings Form */}
        <form id="certificate-form" onSubmit={handleSubmit} className="ml-4 flex flex-col gap-6">
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
            </div>
          </div>
        </form>
        {/* Edit/Save/Cancel buttons */}
        <div className="flex flex-row justify-end gap-2 px-6">
          {!editMode ? (
            <Button type="button" onClick={handleEdit}>
              Edit
            </Button>
          ) : (
            <>
              <Button type="submit" form="certificate-form" disabled={processing}>
                Save Changes
              </Button>
              <Button type="button" variant={'outline'} className="ml-2" onClick={handleCancel}>
                Cancel
              </Button>
            </>
          )}
        </div>

        {/* Certifier's List Section */}
        <div className="flex h-full flex-col gap-6 rounded-xl p-4">
          <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
            <HeadingSmall title="Certifier's List" description="" />
            <Table>
              <TableHeader>
                <TableRow className="h-20 w-full">
                  <TableHead className="text-md w-[50px]">No.</TableHead>
                  <TableHead className="text-md w-[300px]">Name</TableHead>
                  <TableHead className="text-md w-[250px]">Email</TableHead>
                  <TableHead className="text-md w-[180px]">
                    Certificate <br /> Number
                  </TableHead>
                  <TableHead className="text-md w-[80px]">
                    Total <br /> Slot
                  </TableHead>
                  <TableHead className="text-md w-[120px]">Value</TableHead>
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
                      <TableCell className="text-left">{formatHarga(certifier.slot_price * certifier.total_slot)}</TableCell>
                      <TableCell className="text-left">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="cursor-pointer"
                              onClick={() => {
                                router.post(
                                  route('certificates.generate', product.id),
                                  {},
                                  {
                                    preserveScroll: true,
                                    onSuccess: () => {
                                      toast.success('Certificate generated successfully');
                                      router.reload();
                                    },
                                    onError: () => {
                                      toast.error('Failed to generate certificate');
                                    },
                                  },
                                );
                              }}
                            >
                              <CalendarSync className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Generate Certificate</p>
                          </TooltipContent>
                        </Tooltip>

                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Link
                              variant="outline"
                              size="icon"
                              className="ml-2 cursor-pointer"
                              href={route('certificates.download', certifier.id)}
                              onClick={() => {
                                toast.promise(fetch(route('certificates.download', certifier.id)), {
                                  loading: 'Downloading certificate...',
                                  success: 'Certificate downloaded successfully',
                                  error: 'Failed to download certificate',
                                });
                              }}
                            >
                              <Download className="h-4 w-4" />
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

        {/* Certificate Validation Section */}
        <div className="flex h-full flex-col gap-6 rounded-xl p-4">
          <div className="dark:bg-sidebar flex flex-col space-y-6 rounded-lg border-r px-6 py-6">
            <HeadingSmall title="Validate Certificate" description="Upload a certificate to verify its authenticity." />

            <div className="flex flex-col gap-4">
              <Card>
                <CardHeader>
                  <CardTitle>Certificate Validation</CardTitle>
                  <CardDescription>Upload your certificate file to verify if it's genuine and hasn't been modified.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-col gap-4">
                    <div className="flex items-center gap-4">
                      <Input type="file" accept=".png" onChange={handleValidateCertificate} disabled={isValidating} className="flex-1" />
                    </div>

                    {isValidating && (
                      <div className="text-muted-foreground flex items-center gap-2">
                        <LoaderCircle className="h-4 w-4 animate-spin" />
                        <span className="text-sm">Validating certificate...</span>
                      </div>
                    )}

                    {validationResult && (
                      <Alert variant={validationResult.error ? 'destructive' : 'default'}>
                        {validationResult.error ? (
                          <>
                            <XCircle className="h-4 w-4" />
                            <AlertTitle>Invalid Certificate</AlertTitle>
                            <AlertDescription>{validationResult.message}</AlertDescription>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="h-4 w-4" />
                            <AlertTitle>Valid Certificate</AlertTitle>
                            <AlertDescription>
                              <div className="mt-2">
                                <p>
                                  <strong>Name:</strong> {validationResult.data?.name}
                                </p>
                                <p>
                                  <strong>Certificate No:</strong> {validationResult.data?.certificate_no}
                                </p>
                                <p>
                                  <strong>Generated At:</strong> {new Date(validationResult.data?.generated_at || '').toLocaleString()}
                                </p>
                                <p>
                                  <strong>Issuer:</strong> {validationResult.data?.issuer}
                                </p>
                              </div>
                            </AlertDescription>
                          </>
                        )}
                      </Alert>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
