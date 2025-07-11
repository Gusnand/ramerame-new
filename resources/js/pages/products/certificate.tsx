import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';

type Product = {
  id: number;
  product_name: string;
  // Tambahkan properti lain yang mungkin Anda butuhkan
};

type CertificatePageProps = {
  product: Product;
};

export default function Certificate({ product }: CertificatePageProps) {
  const breadcrumbs: BreadcrumbItem[] = [
    {
      title: 'Product Certificate',
      href: `/products/certificate/${product.id}`,
    },
  ];

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title={`Certificate for ${product.product_name}`} />
      <h1>Halaman Sertifikat untuk Produk: {product.product_name}</h1>
    </AppLayout>
  );
}
