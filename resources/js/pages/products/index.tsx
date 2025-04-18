import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import AppLayout from '@/layouts/app-layout';
import { formatHarga } from '@/lib/helper';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import axios from 'axios';
import { CalendarClock, Pencil, Trash } from 'lucide-react';
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

    const editProduct = (id: number) => {
        router.get(`/products/editproduct/${id}`);
    };

    const deleteProduct = () => {
        // hapus produk langsung ke db juga
    };

    const viewBenefit = () => {
        // masuk ke halaman benefit dari produknya
        // ini tampilannya halaman kalender yg isi jumlah keuntungan, bisa diswitch daily atau monthly
    };

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
                            <TableHead className="text-md w-[70px] text-center">Status</TableHead>
                            <TableHead className="text-md w-[120px]">Jatuh Tempo</TableHead>
                            <TableHead className="text-md w-[80px] text-center">
                                Investasi
                                <br />
                                Bulanan
                            </TableHead>
                            <TableHead className="text-md w-[150px] text-center">Jumlah Investasi</TableHead>
                            <TableHead className="text-md w-full text-center">Aksi</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="">{product.id}</TableCell>
                                <TableCell className="">{product.product_name}</TableCell>
                                <TableCell className="text-center">{product.status}</TableCell>
                                <TableCell className="">{product.expired_date}</TableCell>
                                <TableCell className="text-center">{product.invest_month}</TableCell>
                                <TableCell className="text-center">{formatHarga(product.invest_amount)}</TableCell>
                                <TableCell className="w-full text-center">
                                    <Button variant="ghost" className="" onClick={() => editProduct(product.id)}>
                                        <Pencil />
                                    </Button>
                                    <Button variant="ghost" className="text-red-400 hover:text-red-700" onClick={deleteProduct}>
                                        <Trash />
                                    </Button>
                                    <Button variant="ghost" className="" onClick={viewBenefit}>
                                        <CalendarClock />
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </AppLayout>
    );
}
