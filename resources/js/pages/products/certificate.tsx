import HeadingSmall from '@/components/heading-small';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import '@blocknote/core/fonts/inter.css';
import '@blocknote/shadcn/style.css';
import { Head, router, useForm } from '@inertiajs/react';
import React from 'react';

// Mendefinisikan tipe data untuk kejelasan dan keamanan kode
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

export default function Certificate({ certificate, product }: { certificate: CertificateData; product: Product }) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Certificate',
      href: route('certificates.edit', product.id), // Menggunakan product.id sesuai route
    },
  ];
  const { data, setData, post, processing, errors } = useForm({
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Menggunakan metode 'post' ke route 'certificates.update' yang baru
    post(route('certificates.update', certificate.id), {
      preserveScroll: true, // Agar halaman tidak scroll ke atas setelah update
    });
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
                />
                {errors.project_owner_name && <p className="text-red-500">{errors.project_owner_name}</p>}
              </div>
            </div>
          </div>

          <div className="flex flex-row justify-end gap-2 px-6">
            <Button type="submit" disabled={processing}>
              Save Changes
            </Button>
            <Button type="button" variant={'outline'} className="ml-2" onClick={returnPage}>
              Cancel
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}
